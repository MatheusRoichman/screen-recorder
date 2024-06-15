import { Dispatch, SetStateAction, useCallback, useState } from "react";

export enum RecordingStatusEnum {
  IDLE = "IDLE",
  RECORDING = "RECORDING",
  PAUSED = "PAUSED",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

interface ScreenRecorderOptions {
  audio: boolean;
  camera: boolean;
}

interface ScreenRecorderState {
  status: RecordingStatusEnum;
  options: ScreenRecorderOptions;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  setOptions: Dispatch<SetStateAction<ScreenRecorderOptions>>;
  recordingBlob: Blob | null;
}

export const useScreenRecorder = (): ScreenRecorderState => {
  const [status, setStatus] = useState<RecordingStatusEnum>(
    RecordingStatusEnum.IDLE
  );
  const [options, setOptions] = useState<ScreenRecorderOptions>({
    audio: false,
    camera: false,
  });
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = useCallback(async () => {
    setStatus(RecordingStatusEnum.RECORDING);

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: options.audio,
        video: { displaySurface: "window" },
      });

      setStream(stream);

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/mp4",
      });

      recorder.ondataavailable = (event) => {
        setChunks((prev) => [...prev, event.data]);
      };

      recorder.onstop = () => {
        if (!chunks.length) return;

        const completeBlob = new Blob(chunks, {
          type: chunks[0].type,
        });

        setRecordingBlob(completeBlob);
      };

      setRecorder(recorder);

      recorder.start();
    } catch (error) {
      console.error({ error });

      setStatus(RecordingStatusEnum.UNKNOWN_ERROR);
    }
  }, [chunks, options.audio]);

  const pauseRecording = useCallback(() => {
    try {
      recorder?.pause();

      setStatus(RecordingStatusEnum.PAUSED);
    } catch (error) {
      setStatus(RecordingStatusEnum.UNKNOWN_ERROR);
    }
  }, [recorder]);

  const stopRecording = useCallback(() => {
    try {
      recorder?.stop();
      stream?.getTracks().forEach((track) => track.stop());

      setStatus(RecordingStatusEnum.IDLE);
    } catch (error) {
      setStatus(RecordingStatusEnum.UNKNOWN_ERROR);
    }
  }, [recorder, stream]);

  return {
    status,
    options,
    recordingBlob,
    startRecording,
    pauseRecording,
    stopRecording,
    setOptions,
  };
};
