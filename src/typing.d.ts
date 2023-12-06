declare module "react-telegram-login";
declare module '@ffmpeg/ffmpeg';
declare module 'lamejs' {
  type Encoder = {
    encodeBuffer: (left: Int16Array, right?: Int16Array) => Int8Array
    flush: () => Int8Array
  }
  function Mp3Encoder(channels: 1 | 2, samplerate: number, kbps: number): void
}