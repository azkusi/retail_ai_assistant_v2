import React, { useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const appId = 'd883a89b-2106-4f2f-976b-2dd41157bcfe';
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const Dictaphone = (props) => {
  const [speaking, set_speaking] = useState(false)
  const [read_type, set_read_type] = useState(true)
  const [plain_text, set_plain_text] = useState(true)
  const [hold_to_talk, set_hold_to_talk] = useState(true)
  const [search, set_search] = useState(false)
  const [edit, set_edit] = useState(false)
  const [user_request, set_user_request] = useState(null)
  
  

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
  

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      {hold_to_talk && <button
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
      >Hold to talk</button>}
      <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control ref={inputRef} type="text" plaintext={plain_text} readOnly={read_type} defaultValue={transcript}/>
          { edit && <Button 
            onClick={()=>{
              set_plain_text(false)
              set_read_type(false)
              set_hold_to_talk(false)
              set_edit(false)
            }}>
            Edit
          </Button>}
          {search && <Button onClick={()=>{
            console.log(inputRef.current.value)
            props.SearchCallBack(inputRef ? inputRef.current.value : '')
            
            }}>Go</Button>}
      </Form.Group>
      </Form>

      <div>
        {}
      </div>
    </div>
  );
};
export default Dictaphone;