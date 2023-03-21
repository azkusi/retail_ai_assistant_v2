import {React, useState, useRef } from "react";
import { Typography } from '@mui/material';
import {Spinner} from "react-bootstrap"
import Button from '@mui/material/Button';

function AudioRecorder(props){
    const mimeType = "audio/webm";

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
           if (typeof event.data === "undefined") return;
           if (event.data.size === 0) return;
           localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
      };
      


    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                //err.message
                alert("Please ensure in your device settings that you allow this browser to access the microphone");
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };


    const stopRecording = () => {
        

        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
          //creates a blob file from the audiochunks data
           const audioBlob = new Blob(audioChunks, { type: mimeType });
          //creates a playable URL from the blob file.
           const audioUrl = URL.createObjectURL(audioBlob);
           setAudio(audioUrl);
           setAudioChunks([]);
           props.AudioSearchCallback(audioBlob)
        };
      };

      

    return (
        <div>
            <Button style={{"position": "absolute", "top": 0, "left": 0, "margin": "10px"}} variant="secondary" 
                onClick={()=>{
                    if(recordingStatus === "recording"){
                        mediaRecorder.current.stop();
                        mediaRecorder.current.onstop = () => {
                            setAudioChunks([]);
                        };
                    }
                    
                    props.GoBack()
                }}

            >
                Back
            </Button>

            <Typography style={{"fontWeight": "bold", "margin": "30px"}} variant="h5" component="h1">
                Tell me what you're looking for
            </Typography>
            <main>
                {(recordingStatus === "recording") && <div>
                    <Spinner animation="grow" variant="danger" />
                    <p>I'm listening</p>

                </div>}
                <br/>
                <div className="audio-controls">
                    {!permission ? (
                    <Button onClick={getMicrophonePermission} type="button">
                        Allow Microphone Access
                    </Button>
                    ) : null}
                    {permission && recordingStatus === "inactive" ? (
                    <Button onClick={startRecording} type="button">
                        Click to record speech request
                    </Button>
                    ) : null}
                    {recordingStatus === "recording" ? (
                        <div>
                            <Button onClick={stopRecording}>
                                End Recording & Perform Search
                            </Button>
                            <br/>
                            <br/>
                            <Button variant="secondary" 
                                onClick={()=>{
                                    mediaRecorder.current.stop();
                                    mediaRecorder.current.onstop = () => {
                                        setAudioChunks([]);
                                    };
                                    props.GoBack()
                                }}

                                >
                                Cancel
                            </Button>
                        </div>
                    
                    ) : null}
                </div>
                {/* {audio ? (
                <div className="audio-container">
                    <audio src={audio} controls></audio>
                    <a download href={audio}>
                        Download Recording
                    </a>
                </div>
                ) : null} */}


                
                
            </main>
        </div>
    );
};
export default AudioRecorder;
