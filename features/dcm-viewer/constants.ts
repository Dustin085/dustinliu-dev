export type WindowPreset = {
    label: string,
    wl: number,
    ww: number,
}

export const DEFAULT_WINDOW_PRESETS = [
    { label: 'Brain (40/80)', wl: 40, ww: 80 },
    { label: 'Lung (-600/1500)', wl: -600, ww: 1500 },
    { label: 'Bone (300/2000)', wl: 300, ww: 2000 },
] satisfies WindowPreset[]