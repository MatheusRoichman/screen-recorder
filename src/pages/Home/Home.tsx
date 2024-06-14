import React, { useEffect, useRef, useState } from "react"
import { MdScreenshotMonitor, MdOutlineVideocam, MdOutlineVideocamOff } from "react-icons/md";
import { FaStop } from "react-icons/fa";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { useReactMediaRecorder } from "react-media-recorder";

type Controls = {
    statusRec: boolean;
    isAudioMuted: boolean;
    statusCam: boolean;
}

type ControlKeys = keyof Controls

export const Home = () => {
    const [controls, setControls] = useState<Controls>({
        statusRec: false,
        isAudioMuted: true,
        statusCam: false
    })

    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({ video: controls.statusCam, screen: true, audio: controls.isAudioMuted })


    const handleClick = (action: ControlKeys) => {
        if(status !== "recording" || action === "statusRec"){
            setControls(prev => ({
                ...prev,
                [action]: !prev[action]
            }))
        }
        
    }

    useEffect(() => {
        controls.statusRec ? startRecording() : stopRecording()

    }, [controls])




    return (
        <main className="bg-slate-600 h-screen w-screen text-white">
            <h1>{status}</h1>
            <section>
                <video src={mediaBlobUrl} controls autoPlay loop></video>
            </section>
            <aside>
                <button onClick={() => handleClick('isAudioMuted')}>
                    {controls.isAudioMuted && status !== "recording" ? <IoMdMicOff size={35} /> :  <IoMdMic size={35} />}
                </button>
                <div>
                    {controls.statusRec && status === "recording" ?

                        <button onClick={() => handleClick('statusRec')}>
                            <FaStop size={35} />
                        </button>
                        :
                        <button onClick={() => handleClick('statusRec')}>
                            <MdScreenshotMonitor size={35} />
                        </button>
                    }
                </div>
                <button onClick={() => handleClick('statusCam')}>
                    {controls.statusCam && status == "recording" ? <MdOutlineVideocam size={35} /> : <MdOutlineVideocamOff size={35} />}
                </button>
            </aside>
        </main>
    )
}

