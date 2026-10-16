/** True when a click on a modal `<dialog>` hit its backdrop (the click targets the dialog itself). */
export const clickedBackdrop = (e: MouseEvent) => {
  const dlg = e.target as HTMLDialogElement;
  if (dlg.tagName !== "DIALOG") return false;
  const r = dlg.getBoundingClientRect();
  return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
};
