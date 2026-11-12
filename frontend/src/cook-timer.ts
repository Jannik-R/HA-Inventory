import { lang } from "./format";
import type { Hass } from "./api";

export interface Timer {
  key: string;
  label: string;
  step: number;
  end: number;
}

type DurationFormat = new (
  locale?: string,
  o?: { style: "digital"; hoursDisplay: "auto" },
) => { format: (d: { hours: number; minutes: number; seconds: number }) => string };

export const clock = (hass: Hass | undefined, ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const DF = (Intl as unknown as { DurationFormat?: DurationFormat }).DurationFormat;
  if (DF)
    return new DF(lang(hass), { style: "digital", hoursDisplay: "auto" }).format({
      hours: h,
      minutes: m,
      seconds: s % 60,
    });
  const mm = String(m).padStart(h ? 2 : 1, "0"); // browsers without Intl.DurationFormat
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

/** Three short beeps and a vibration when a timer runs out. */
export const alarm = () => {
  navigator.vibrate?.([300, 200, 300, 200, 300]);
  try {
    const ctx = new AudioContext();
    for (let k = 0; k < 3; k++) {
      const osc = ctx.createOscillator();
      osc.frequency.value = 880;
      osc.connect(ctx.destination);
      osc.start(ctx.currentTime + k * 0.4);
      osc.stop(ctx.currentTime + k * 0.4 + 0.25);
    }
  } catch {
    // no audio (e.g. not allowed yet): the vibration and the red timer remain
  }
};
