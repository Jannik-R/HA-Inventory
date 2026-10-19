"""Dev only, Windows: raw TCP (port 9100) -> a Windows printer queue as a RAW job.

The dev HA runs in Docker Desktop, whose WSL kernel has no USB printer driver, so a USB receipt
printer on this PC cannot be passed into the container. This bridge lets the dev HA print to it as a
network printer: set the receipt printer to `host.docker.internal:9100` in the dev HA.

    python scripts/receipt_bridge.py "TPG A799"           # printer name as in Get-Printer
    python scripts/receipt_bridge.py file:dev/config/receipt.bin   # no printing: append to a file

Listens on 127.0.0.1 only (Docker Desktop forwards host.docker.internal there). Stdlib only.
"""

from __future__ import annotations

import argparse
import socketserver
import sys
from pathlib import Path


def print_raw(printer: str, data: bytes) -> None:
    """One RAW job: the bytes go to the printer unchanged (ESC/POS), no driver rendering."""
    import ctypes
    from ctypes import wintypes

    class DocInfo1(ctypes.Structure):
        _fields_ = [
            ("pDocName", wintypes.LPWSTR),
            ("pOutputFile", wintypes.LPWSTR),
            ("pDatatype", wintypes.LPWSTR),
        ]

    ws = ctypes.WinDLL("winspool.drv", use_last_error=True)
    ws.OpenPrinterW.argtypes = [wintypes.LPWSTR, ctypes.POINTER(wintypes.HANDLE), ctypes.c_void_p]
    ws.StartDocPrinterW.argtypes = [wintypes.HANDLE, wintypes.DWORD, ctypes.POINTER(DocInfo1)]
    ws.WritePrinter.argtypes = [
        wintypes.HANDLE, ctypes.c_char_p, wintypes.DWORD, ctypes.POINTER(wintypes.DWORD),
    ]  # fmt: skip
    for name in ("StartPagePrinter", "EndPagePrinter", "EndDocPrinter", "ClosePrinter"):
        getattr(ws, name).argtypes = [wintypes.HANDLE]

    def check(ok) -> None:
        if not ok:
            raise ctypes.WinError(ctypes.get_last_error())

    handle = wintypes.HANDLE()
    check(ws.OpenPrinterW(printer, ctypes.byref(handle), None))
    try:
        check(ws.StartDocPrinterW(handle, 1, ctypes.byref(DocInfo1("Home Inventory", None, "RAW"))))
        try:
            check(ws.StartPagePrinter(handle))
            written = wintypes.DWORD()
            check(ws.WritePrinter(handle, data, len(data), ctypes.byref(written)))
            check(written.value == len(data))
            ws.EndPagePrinter(handle)
        finally:
            ws.EndDocPrinter(handle)
    finally:
        ws.ClosePrinter(handle)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    ap.add_argument("printer", help='Windows printer name, or "file:<path>" to append instead')
    ap.add_argument("--port", type=int, default=9100)
    args = ap.parse_args()

    def deliver(data: bytes) -> None:
        if args.printer.startswith("file:"):
            with Path(args.printer[5:]).open("ab") as f:
                f.write(data)
        else:
            print_raw(args.printer, data)

    class Job(socketserver.StreamRequestHandler):
        def handle(self) -> None:
            data = (
                self.rfile.read()
            )  # one connection = one job (Home Inventory closes after sending)
            if not data:
                return
            try:
                deliver(data)
                print(f"job: {len(data)} bytes -> {args.printer}", flush=True)
            except OSError as err:
                print(f"job failed: {err}", file=sys.stderr, flush=True)

    with socketserver.TCPServer(("127.0.0.1", args.port), Job) as server:
        print(f"listening on 127.0.0.1:{args.port} -> {args.printer} (Ctrl+C stops)", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
