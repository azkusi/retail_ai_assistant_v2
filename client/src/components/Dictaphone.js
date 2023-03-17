import React, { useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios'
import { db } from '../config';


import { firebaseApp } from '../config';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage"



const appId = 'd883a89b-2106-4f2f-976b-2dd41157bcfe';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const Dictaphone = (props) => {
  const [speaking, set_speaking] = useState(false)
  const [read_type, set_read_type] = useState(true)
  const [plain_text, set_plain_text] = useState(true)
  const [hold_to_talk, set_hold_to_talk] = useState(true)
  const [search, set_search] = useState(true)
  const [edit, set_edit] = useState(false)
  
  

  const inputRef = useRef(null);

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true })
    set_plain_text(true)
    set_read_type(true)
    set_search(false)
    
  };

  // const client = new speech.SpeechClient()
  // const storage = new Storage();


  let projectStorage;
  let projectFirestore;
  if (!firebase.apps.length) {
    firebaseApp()
    db = firebase.firestore()
    projectStorage = firebase.storage();
    projectFirestore = firebase.firestore();
  }else {
  let db = firebase.app().firestore() // if already initialized, use this one
    projectStorage = firebase.app().storage();
    projectFirestore = firebase.app().firestore();

  }

  // async function quickstart(url) {
  //   // The path to the remote LINEAR16 file
  //   //'gs://cloud-samples-data/speech/brooklyn_bridge.raw';
  //   const gcsUri = url
  
  //   // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  //   const audio = {
  //     uri: gcsUri,
  //   };
  //   const config = {
  //     encoding: 'LINEAR16',
  //     sampleRateHertz: 16000,
  //     languageCode: 'en-US',
  //   };
  //   const request = {
  //     audio: audio,
  //     config: config,
  //   };
  
  //   // Detects speech in the audio file
  //   const [response] = await client.recognize(request);
  //   const transcription = response.results
  //     .map(result => result.alternatives[0].transcript)
  //     .join('\n');
  //   console.log(`Transcription: ${transcription}`);
  // }

  // async function uploadFile(file_to_upload) {
  //   const options = {
  //     // destination: mediaBlobUrl.toString() 
  //   };
  
  //   await storage.bucket("speech-files-u-request").upload(file_to_upload, options).then((result)=>{
  //     console.log(`file uploaded ${result}`);
  //     // quickstart(result)
  //   })
    
  // }
    
  





  

  if (!browserSupportsSpeechRecognition) {
    return(
      <div>
        <p>Your browser doesn't support speech recognition, please type instead.</p>
        <Form onSubmit={(e)=>{e.preventDefault()}}>
        <Form.Group className="mb-3" controlId="formText">
          <Form.Control ref={inputRef} as="textarea" rows={1}/>
            
            <Button onClick={(e)=>{
                console.log(inputRef.current.value)
                props.SearchCallBack(inputRef ? {"u_request": inputRef.current.value, "type": "text"} 
                : {"u_request": "", "type": "text"})
              
              
              }}
            >
              Go
            </Button>
        </Form.Group>
        </Form>
      </div> 
    )
  }else{
    return (
      <div>
        {/* <p>Microphone: {listening ? 'on' : 'off'}</p> */}
        {/* {hold_to_talk && <button
          // onClick={()=>{
          //   if(speaking){
          //     SpeechRecognition.stopListening()
          //     set_speaking(false)
          //   }
          //   else{
          //     startListening()
          //     set_speaking(true)
          //   }
            
          // }}
          onTouchStart={startListening}
          onMouseDown={startListening}
          onTouchEnd={SpeechRecognition.stopListening}
          onMouseUp={()=>{
            set_search(true)
            set_edit(true)
            SpeechRecognition.stopListening()
          }}
        >Hold to talk</button>} */}
        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control ref={inputRef} placeholder="Type search" type="text" plaintext={plain_text} defaultValue={transcript}/>
            {/* { edit && <Button 
              onClick={()=>{
                set_plain_text(false)
                set_read_type(false)
                set_hold_to_talk(false)
                set_edit(false)
              }}>
              Edit
            </Button>} */}
            {search && <Button onClick={()=>{
              console.log(inputRef.current.value)
              props.SearchCallBack(inputRef ? {"u_request": inputRef.current.value, "type": "text"} 
                : {"u_request": "", "type": "text"})
              
              }}>Go</Button>}
        </Form.Group>
        </Form>
  
      </div>
    );
  }

  
};
export default Dictaphone;
