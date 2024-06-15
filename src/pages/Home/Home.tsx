import { useCallback, useState } from "react";
import { FaStop } from "react-icons/fa";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import {
  MdOutlineVideocam,
  MdOutlineVideocamOff,
  MdScreenshotMonitor,
} from "react-icons/md";
import {
  RecordingStatusEnum,
  useScreenRecorder,
} from "../../hooks/use-screen-recorder";

type Controls = {
  statusRec: boolean;
  isAudioMuted: boolean;
  statusCam: boolean;
};

type ControlKeys = keyof Controls;

const statusLabels: Record<RecordingStatusEnum, string> = {
  [RecordingStatusEnum.IDLE]: "Idle",
  [RecordingStatusEnum.RECORDING]: "Recording",
  [RecordingStatusEnum.PAUSED]: "Paused",
  [RecordingStatusEnum.PERMISSION_DENIED]:
    "Permission denied. Please grant permission to record screen.",
  [RecordingStatusEnum.UNKNOWN_ERROR]: "Unknown error. Please try again.",
};

export const Home = () => {
  const [controls, setControls] = useState<Controls>({
    statusRec: false,
    isAudioMuted: true,
    statusCam: false,
  });

  const { status, startRecording, stopRecording, recordingBlob } =
    useScreenRecorder();
  const isRecording = status === RecordingStatusEnum.RECORDING;
  const mediaBlobUrl = recordingBlob && URL.createObjectURL(recordingBlob);

  const handleClick = useCallback(
    (action: ControlKeys) => {
      if (isRecording && action !== "statusRec") {
        return;
      }

      setControls((prev) => {
        const newValue = !prev[action];

        if (action === "statusRec") {
          newValue ? startRecording() : stopRecording();
        }

        return { ...prev, [action]: !prev[action] };
      });
    },
    [isRecording, startRecording, stopRecording]
  );

  return (
    <main className="bg-slate-600 h-screen w-screen text-white flex flex-col justify-center items-center gap-4">
      <h1>Status: {statusLabels[status]}</h1>
      <section className="px-4  w-full">
        {mediaBlobUrl ? (
          <video
            className="w-full mx-auto max-w-2xl bg-gray-300 aspect-video border-2 border-white"
            src={mediaBlobUrl}
            controls
            autoPlay
            loop
          />
        ) : null}
      </section>
      <aside className="flex gap-4 items-center">
        <button onClick={() => handleClick("isAudioMuted")}>
          {controls.isAudioMuted && isRecording ? (
            <IoMdMicOff size={35} />
          ) : (
            <IoMdMic size={35} />
          )}
        </button>
        {controls.statusRec && isRecording ? (
          <button onClick={() => handleClick("statusRec")}>
            <FaStop size={35} />
          </button>
        ) : (
          <button onClick={() => handleClick("statusRec")}>
            <MdScreenshotMonitor size={35} />
          </button>
        )}
        <button onClick={() => handleClick("statusCam")}>
          {controls.statusCam && isRecording ? (
            <MdOutlineVideocam size={35} />
          ) : (
            <MdOutlineVideocamOff size={35} />
          )}
        </button>
      </aside>
    </main>
  );
};
