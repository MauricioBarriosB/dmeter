declare module "audiomotion-analyzer" {
    interface AudioMotionOptions {
        source?: HTMLMediaElement | AudioNode;
        mode?: number;
        gradient?: string;
        showBgColor?: boolean;
        bgAlpha?: number;
        overlay?: boolean;
        showPeaks?: boolean;
        showScaleX?: boolean;
        showScaleY?: boolean;
        smoothing?: number;
        volume?: number;
        fftSize?: number;
        minDecibels?: number;
        maxDecibels?: number;
        height?: number;
        width?: number;
        [key: string]: unknown;
    }

    export default class AudioMotionAnalyzer {
        constructor(container?: HTMLElement | null, options?: AudioMotionOptions);
        connectInput(source: AudioNode | HTMLMediaElement): AudioNode;
        disconnectInput(source?: AudioNode): void;
        toggleAnalyzer(value?: boolean): void;
        destroy(): void;
        setOptions(options: AudioMotionOptions): void;
        audioCtx: AudioContext;
        isOn: boolean;
        volume: number;
        [key: string]: unknown;
    }
}
