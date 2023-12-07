import { useEffect, useMemo, useRef, useState } from 'react';
import type { Harker } from 'hark';
import type { Encoder } from 'lamejs';
import type { Options, RecordRTCPromisesHandler } from 'recordrtc';
import { useModel } from '@umijs/max';
import { Mp3Encoder } from 'lamejs';
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import {
  UseWhisperConfig,
  UseWhisperTimeout,
  UseWhisperTranscript,
} from '@/types';
import { OpenAIWhisper } from '@/services/third';
import { OPENAI_API_KEY } from '@/env';

export const defaultStopTimeout = 5_000;
export const ffmpegCoreUrl =
  'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js';
export const silenceRemoveCommand =
  'silenceremove=start_periods=1:stop_periods=-1:start_threshold=-30dB:stop_threshold=-30dB:start_silence=2:stop_silence=2';
export const whisperApiEndpoint = 'https://api.openai.com/v1/audio/';

export default () => {
  const defaultConfig: UseWhisperConfig = {
    apiKey: OPENAI_API_KEY,
    autoStart: false,
    autoTranscribe: true,
    mode: 'transcriptions',
    nonStop: false,
    removeSilence: false,
    stopTimeout: defaultStopTimeout,
    streaming: false,
    timeSlice: 1_000,
    onDataAvailable: undefined,
    onTranscribe: undefined,
  };

  const defaultTimeout: UseWhisperTimeout = {
    stop: undefined,
  };

  const defaultTranscript: UseWhisperTranscript = {
    blob: undefined,
    text: undefined,
  };

  const {
    apiKey,
    autoStart,
    autoTranscribe,
    mode,
    nonStop,
    removeSilence,
    stopTimeout,
    streaming,
    timeSlice,
    whisperConfig,
    onDataAvailable: onDataAvailableCallback,
    onTranscribe: onTranscribeCallback,
  } = {
    ...defaultConfig,
  }

  if (!apiKey && !onTranscribeCallback) {
    throw new Error('apiKey is required if onTranscribe is not provided')
  }

  const { setIsRecording, setIsSpeaking } = useModel('useRecorder');

  const chunks = useRef<Blob[]>([]);
  const encoder = useRef<Encoder>();
  const listener = useRef<Harker>();
  const recorder = useRef<RecordRTCPromisesHandler>();
  const stream = useRef<MediaStream>();
  const timeout = useRef<UseWhisperTimeout>(defaultTimeout);

  const [transcribing, setTranscribing] = useState<boolean>(false);
  const [transcript, setTranscript] =
    useState<UseWhisperTranscript>(defaultTranscript);

  /**
 * start speech recording event
 * - first ask user for media stream
 * - create recordrtc instance and pass media stream to it
 * - create lamejs encoder instance
 * - check recorder state and start or resume recorder accordingly
 * - start timeout for stop timeout config
 * - update recording state to true
 */
  const onStartRecording = async () => {
    try {
      if (!stream.current) {
        await onStartStreaming()
      }
      if (stream.current) {
        if (!recorder.current) {
          const {
            default: { RecordRTCPromisesHandler, StereoAudioRecorder },
          } = await import('recordrtc')
          const recorderConfig: Options = {
            mimeType: 'audio/wav',
            numberOfAudioChannels: 1, // mono
            recorderType: StereoAudioRecorder,
            sampleRate: 44100, // Sample rate = 44.1khz
            timeSlice: streaming ? timeSlice : undefined,
            type: 'audio',
            ondataavailable:
              autoTranscribe && streaming ? onDataAvailable : undefined,
          }
          recorder.current = new RecordRTCPromisesHandler(
            stream.current,
            recorderConfig
          )
        }
        if (!encoder.current) {
          encoder.current = new (Mp3Encoder(1, 44100, 96) as any);
        }
        const recordState = await recorder.current.getState()
        if (recordState === 'inactive' || recordState === 'stopped') {
          await recorder.current.startRecording()
        }
        if (recordState === 'paused') {
          await recorder.current.resumeRecording()
        }
        if (nonStop) {
          onStartTimeout('stop')
        }
        setIsRecording(true)
      }
    } catch (err) {
      console.error(err)
    }
  };

  /**
 * get user media stream event
 * - try to stop all previous media streams
 * - ask user for media stream with a system popup
 * - register hark speaking detection listeners
 */
  const onStartStreaming = async () => {
    try {
      if (stream.current) {
        stream.current.getTracks().forEach((track) => track.stop())
      }
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      if (!listener.current) {
        const { default: hark } = await import('hark')
        listener.current = hark(stream.current, {
          interval: 100,
          play: false,
        })
        listener.current.on('speaking', onStartSpeaking)
        listener.current.on('stopped_speaking', onStopSpeaking)
      }
    } catch (err) {
      console.error(err)
    }
  };

  const onStartTimeout = (type: keyof UseWhisperTimeout) => {
    if (!timeout.current[type]) {
      timeout.current[type] = setTimeout(onStopRecording, stopTimeout)
    }
  };

  /**
 * user start speaking event
 * - set speaking state to true
 * - clear stop timeout
 */
  const onStartSpeaking = () => {
    console.log('start speaking')
    setIsSpeaking(true)
    onStopTimeout('stop')
  };

  /**
 * user stop speaking event
 * - set speaking state to false
 * - start stop timeout back
 */
  const onStopSpeaking = () => {
    console.log('stop speaking')
    setIsSpeaking(false)
    if (nonStop) {
      onStartTimeout('stop')
    }
  };

  /**
 * pause speech recording event
 * - if recorder state is recording, pause the recorder
 * - clear stop timeout
 * - set recoriding state to false
 */
  const onPauseRecording = async () => {
    try {
      if (recorder.current) {
        const recordState = await recorder.current.getState()
        if (recordState === 'recording') {
          await recorder.current.pauseRecording()
        }
        onStopTimeout('stop')
        setIsRecording(false)
      }
    } catch (err) {
      console.error(err)
    }
  };

  /**
 * stop speech recording event
 * - flush out lamejs encoder and set it to undefined
 * - if recorder state is recording or paused, stop the recorder
 * - stop user media stream
 * - clear stop timeout
 * - set recording state to false
 * - start Whisper transcription event
 * - destroy recordrtc instance and clear it from ref
 */
  const onStopRecording = async () => {
    try {
      if (recorder.current) {
        const recordState = await recorder.current.getState()
        if (recordState === 'recording' || recordState === 'paused') {
          await recorder.current.stopRecording()
        }
        onStopStreaming()
        onStopTimeout('stop')
        setIsRecording(false)
        if (autoTranscribe) {
          await onTranscribing()
        } else {
          const blob = await recorder.current.getBlob()
          setTranscript({
            blob,
          })
        }
        await recorder.current.destroy()
        chunks.current = []
        if (encoder.current) {
          encoder.current.flush()
          encoder.current = undefined
        }
        recorder.current = undefined
      }
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * stop media stream event
   * - remove hark speaking detection listeners
   * - stop all media stream tracks
   * - clear media stream from ref
   */
  const onStopStreaming = () => {
    if (listener.current) {
      // @ts-ignore
      listener.current.off('speaking', onStartSpeaking)
      // @ts-ignore
      listener.current.off('stopped_speaking', onStopSpeaking)
      listener.current = undefined
    }
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop())
      stream.current = undefined
    }
  }

  /**
   * stop timeout event
   * - clear stop timeout and remove it from ref
   */
  const onStopTimeout = (type: keyof UseWhisperTimeout) => {
    if (timeout.current[type]) {
      clearTimeout(timeout.current[type])
      timeout.current[type] = undefined
    }
  }

  /**
   * start Whisper transcrition event
   * - make sure recorder state is stopped
   * - set transcribing state to true
   * - get audio blob from recordrtc
   * - if config.removeSilence is true, load ffmpeg-wasp and try to remove silence from speec
   * - if config.customServer is true, send audio data to custom server in base64 string
   * - if config.customServer is false, send audio data to Whisper api in multipart/form-data
   * - set transcript object with audio blob and transcription result from Whisper
   * - set transcribing state to false
   */
  const onTranscribing = async () => {
    console.log('transcribing speech')
    try {
      if (encoder.current && recorder.current) {
        const recordState = await recorder.current.getState()
        if (recordState === 'stopped') {
          setTranscribing(true)
          let blob = await recorder.current.getBlob()
          if (removeSilence) {
            const ffmpeg = createFFmpeg({
              mainName: 'main',
              corePath: ffmpegCoreUrl,
              log: true,
            })
            if (!ffmpeg.isLoaded()) {
              await ffmpeg.load()
            }
            const buffer = await blob.arrayBuffer()
            console.log({ in: buffer.byteLength })
            ffmpeg.FS('writeFile', 'in.wav', new Uint8Array(buffer))
            await ffmpeg.run(
              '-i', // Input
              'in.wav',
              '-acodec', // Audio codec
              'libmp3lame',
              '-b:a', // Audio bitrate
              '96k',
              '-ar', // Audio sample rate
              '44100',
              '-af', // Audio filter = remove silence from start to end with 2 seconds in between
              silenceRemoveCommand,
              'out.mp3' // Output
            )
            const out = ffmpeg.FS('readFile', 'out.mp3')
            console.log({ out: out.buffer.byteLength })
            // 225 seems to be empty mp3 file
            if (out.length <= 225) {
              ffmpeg.exit()
              setTranscript({
                blob,
              })
              setTranscribing(false)
              return
            }
            blob = new Blob([out.buffer], { type: 'audio/mpeg' })
            ffmpeg.exit()
          } else {
            const buffer = await blob.arrayBuffer()
            console.log({ wav: buffer.byteLength })
            const mp3 = encoder.current.encodeBuffer(new Int16Array(buffer))
            blob = new Blob([mp3], { type: 'audio/mpeg' })
            console.log({ blob, mp3: mp3.byteLength })
          }
          if (typeof onTranscribeCallback === 'function') {
            const transcribed = await onTranscribeCallback(blob)
            console.log('onTranscribe', transcribed)
            setTranscript(transcribed)
          } else {
            const file = new File([blob], 'speech.mp3', { type: 'audio/mpeg' })
            const text = await onWhispered(file)
            console.log('onTranscribing', { text })
            setTranscript({
              blob,
              text,
            })
          }
          setTranscribing(false)
        }
      }
    } catch (err) {
      console.info(err)
      setTranscribing(false)
    }
  }

  /**
   * Get audio data in chunk based on timeSlice
   * - while recording send audio chunk to Whisper
   * - chunks are concatenated in succession
   * - set transcript text with interim result
   */
  const onDataAvailable = async (data: Blob) => {
    console.log('onDataAvailable', data)
    try {
      if (streaming && recorder.current) {
        onDataAvailableCallback?.(data)
        if (encoder.current) {
          const buffer = await data.arrayBuffer()
          const mp3chunk = encoder.current.encodeBuffer(new Int16Array(buffer))
          const mp3blob = new Blob([mp3chunk], { type: 'audio/mpeg' })
          chunks.current.push(mp3blob)
        }
        const recorderState = await recorder.current.getState()
        if (recorderState === 'recording') {
          const blob = new Blob(chunks.current, {
            type: 'audio/mpeg',
          })
          const file = new File([blob], 'speech.mp3', {
            type: 'audio/mpeg',
          })
          const text = await onWhispered(file)
          console.log('onInterim', { text })
          if (text) {
            setTranscript((prev) => ({ ...prev, text }))
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Send audio file to Whisper to be transcribed
   * - create formdata and append file, model, and language
   * - append more Whisper config if whisperConfig is provided
   * - add OpenAPI Token to header Authorization Bearer
   * - post with axios to OpenAI Whisper transcript endpoint
   * - return transcribed text result
   */
  const onWhispered = useMemo(
    () => async (file: File) => {
      // Whisper only accept multipart/form-data currently
      const { response, data } = await OpenAIWhisper(file, whisperConfig, mode);
      console.log('onWhispered', { response, data })
      return data?.text
    },
    [apiKey, mode, whisperConfig]
  )

  const startRecording = async () => {
    await onStartRecording();
  };

  const pauseRecording = async () => {
    await onPauseRecording()
  };

  const stopRecording = async () => {
    await onStopRecording()
  };

  useEffect(() => {
    return () => {
      if (chunks.current) {
        chunks.current = []
      }
      if (encoder.current) {
        encoder.current.flush()
        encoder.current = undefined
      }
      if (recorder.current) {
        recorder.current.destroy()
        recorder.current = undefined
      }
      onStopTimeout('stop')
      if (listener.current) {
        // @ts-ignore
        listener.current.off('speaking', onStartSpeaking)
        // @ts-ignore
        listener.current.off('stopped_speaking', onStopSpeaking)
      }
      if (stream.current) {
        stream.current.getTracks().forEach((track) => track.stop())
        stream.current = undefined
      }
    }
  }, []);

  useEffect(() => {
    ; (async () => {
      if (autoStart) {
        await onStartRecording()
      }
    })();
  }, [autoStart]);

  return {
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  }
};