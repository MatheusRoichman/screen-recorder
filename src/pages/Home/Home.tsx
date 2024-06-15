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
    <main className="bg-slate-600 h-screen w-screen text-white">
      <h1>{status}</h1>
      {mediaBlobUrl ? (
        <section>
          <video src={mediaBlobUrl} controls autoPlay loop></video>
        </section>
      ) : null}
      <aside>
        <button onClick={() => handleClick("isAudioMuted")}>
          {controls.isAudioMuted && isRecording ? (
            <IoMdMicOff size={35} />
          ) : (
            <IoMdMic size={35} />
          )}
        </button>
        <div>
          {controls.statusRec && isRecording ? (
            <button onClick={() => handleClick("statusRec")}>
              <FaStop size={35} />
            </button>
          ) : (
            <button onClick={() => handleClick("statusRec")}>
              <MdScreenshotMonitor size={35} />
            </button>
          )}
        </div>
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
