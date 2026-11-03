declare module 'gifenc' {
  export interface GIFEncoderOptions {
    auto?: boolean;
    initialCapacity?: number;
  }

  export interface WriteFrameOptions {
    palette?: number[][];
    first?: boolean;
    transparent?: boolean;
    transparentIndex?: number;
    delay?: number;
    repeat?: number;
    dispose?: number;
  }

  export interface GIFEncoderInstance {
    writeFrame: (
      index: Uint8Array | number[],
      width: number,
      height: number,
      opts?: WriteFrameOptions
    ) => void;
    finish: () => void;
    bytes: () => Uint8Array;
    bytesView: () => Uint8Array;
    reset: () => void;
    buffer: ArrayBuffer;
    stream: {
      writeByte: (byte: number) => void;
      writeBytes: (bytes: ArrayLike<number>, offset?: number, length?: number) => void;
    };
  }

  export function GIFEncoder(opts?: GIFEncoderOptions): GIFEncoderInstance;

  export interface QuantizeOptions {
    format?: 'rgb565' | 'rgb444' | 'rgba4444';
    oneBitAlpha?: boolean | number;
    clearAlpha?: boolean;
    clearAlphaThreshold?: number;
    clearAlphaColor?: number;
  }

  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray | number[],
    maxColors: number,
    options?: QuantizeOptions
  ): number[][];

  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray | number[],
    palette: number[][],
    format?: 'rgb565' | 'rgb444' | 'rgba4444'
  ): Uint8Array;

  export function nearestColorIndex(palette: number[][], pixel: number[]): number;
}
