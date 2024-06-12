import React, { useState } from "react"
import { MdScreenshotMonitor, MdOutlineVideocam, MdOutlineVideocamOff } from "react-icons/md";
import { FaStop } from "react-icons/fa";
import { VscDebugContinue } from "react-icons/vsc";
import { IoMdMic, IoMdMicOff, IoIosPause } from "react-icons/io";


type Controls = {
    statusRec: boolean;
    statusPlayRecording: boolean;
    statusMic: boolean;
    statusCam: boolean;
};

type ControlKeys = keyof Controls;

export const Home = () => {
    const [controls, setControls] = useState<Controls>({
        statusRec: false,
        statusPlayRecording: false,
        statusMic: false,
        statusCam: false
    })


    const handleClick = (status: ControlKeys) => {
        setControls(prev => ({
            ...prev, 
            [status]: !prev[status]
        }))
    }


    return (
        <main className="bg-slate-600 h-screen w-screen text-white">
            <section>
                <video src=""></video>
            </section>
            <aside>
                <button onClick={() => handleClick('statusMic')}>
                    {controls.statusMic ? <IoMdMic size={35} /> : <IoMdMicOff size={35} />}
                </button>
                <div>
                    {controls.statusRec ?
                        (
                            <>
                                {controls.statusPlayRecording ?
                                    <button onClick={() => handleClick('statusPlayRecording')}>
                                        <IoIosPause size={35}/>
                                    </button>
                                    : <button onClick={() => handleClick('statusPlayRecording')}>
                                        <VscDebugContinue size={35}/>
                                    </button>
                                }
                                <button onClick={() => handleClick('statusRec')}>
                                    <FaStop size={35}/>
                                </button>
                            </>
                        ) :
                        <button onClick={() => handleClick('statusRec')}>
                            <MdScreenshotMonitor size={35}/>
                        </button>
                    }
                </div>
                <button  onClick={() => handleClick('statusCam')}>
                    {controls.statusCam ? <MdOutlineVideocam size={35}/> : <MdOutlineVideocamOff size={35}/>}
                </button>
            </aside>
        </main>
    )
}

