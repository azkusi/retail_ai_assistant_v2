// import { Gallery } from "react-grid-gallery";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Modal, Form, CloseButton, Overlay, OverlayTrigger, Spinner } from 'react-bootstrap';
import Button from '@mui/material/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import useWindowSize from "../hooks/useWindow";
import Tooltip from 'react-bootstrap/Tooltip';
import { Typography } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



import '../App.css'
import AudioRecorder from '../components/AudioRecorder';




function Search(props) {
  const width = useWindowSize().width
  const height = useWindowSize().height

  const [show_ai_assistant_icon, set_show_ai_assistant_icon] = useState(true)
  const [show_ai_modal, set_show_ai_modal] = useState(false)
  const [file, set_file] = useState(null)
  const [chatWidth, setChatWidth] = useState()
  const [chatHeight, setChatHeight] = useState()
  // const [target, set_target] = useRef(null)
  const [search_results, set_search_results] = useState(null)
  const [voice_search, set_voice_search] = useState(false)
  const [text_search, set_text_search] = useState(false)
  const [image_search, set_image_search] = useState(false)
  const [options, set_options] = useState(true)
  const [plain_text, set_plain_text] = useState(true)
  const inputRef = useRef(null);
  const [loading_results, set_loading_results] = useState(null)

  const location = useLocation();
  const id = useParams()

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click AI icon to search
    </Tooltip>
  );

  
  
//   const [user_request, set_user_request] = useState(null)
//   const user_result = useGetResults(user_request)
  
  
  useEffect(()=>{
    if(width < 500){
      if(text_search || voice_search || image_search){
        setChatWidth(width * 0.85)
        setChatHeight(height * 0.5)
      }
      else{
        setChatWidth(width * 0.85)
        setChatHeight(height * 0.7)
      }
      
    }
    if(width > 500 && width < 800){
      if(text_search || voice_search || image_search){
        setChatWidth(width * 0.5)
        setChatHeight(height * 0.4)
      }
      else{
        setChatWidth(width * 0.5)
        setChatHeight(height * 0.7)
      }
    }
    if(width > 800){
      if(text_search || voice_search || image_search){
        setChatWidth(width * 0.3)
        setChatHeight(height * 0.3)
      }
      else{
        setChatWidth(width * 0.3)
        setChatHeight(height * 0.7)
      }
    }
    if(props.results){
      set_search_results(props.results)
      set_loading_results(false)
      set_text_search(false)
      set_image_search(false)
      set_voice_search(false)
    }
    

  }, [width, height, props.results])


  
  function sendUserRequest(dictaphone_data){
    console.log("Search callback, dictaphone data updated: ", dictaphone_data)

    console.log("user request: ", dictaphone_data)
    props.HomeCallBack(dictaphone_data)
    
    set_show_ai_modal(false)
    set_show_ai_assistant_icon(true)
  }

  function sendAudioRequest(file){
    props.AudioRequestCallback(file)
    set_show_ai_modal(false)
    set_show_ai_assistant_icon(true)
  }


  function cancelAudio(){
    set_voice_search(false)
    set_options(true)
  }


  return (
    <div>
        <div style={{"width": width}} className="App">
            
            {show_ai_assistant_icon && 
              <OverlayTrigger
                placement="left"
                // delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                show={true}
                defaultShow={true}
          
              >
                <SmartToyIcon 
                  style={{"position": "fixed", "bottom": 0, "right": 0, 
                  "height": 0.15*height, "width": 0.15*width
                }}
                  onClick={()=>{
                    console.log("location: ", location, "params: ", id)
                    set_show_ai_modal(true)
                    set_show_ai_assistant_icon(false)
                  }}
                />
              </OverlayTrigger>
            }

            {/* <Modal show={show_ai_modal} 
                onHide={()=>{
                set_show_ai_modal(false) 
                set_show_ai_assistant_icon(true)
                }}
                backdrop={false}
            >
                <Modal.Header style={{"borderLeft": "solid", "borderRight": "solid", "borderTop": "solid"}} closeButton>
                <Modal.Title style={{"textAlign": "center"}}>Describe, or upload the item style you're looking for</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{"border": "solid"}}>

                <div style={{"borderBottom": "solid", "color": "grey"}}>
                    <br/>
                    <Dictaphone SearchCallBack={sendUserRequest} style={{"marginBottom": "20px"}} variant="secondary"/>
                </div>

                <br/>
                <div>
                    <Form.Group>
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control onChange={(e)=>{
                        set_file(e.target.files[0])
                        console.log(e.target.files)
                        console.log(e.target.files[0])
                        }} type='file'>
                    </Form.Control>
                    <Button onClick={()=>{
                        if(file){
                          sendUserRequest({"u_request": file, "type": "file"})
                          set_show_ai_modal(false) 
                          set_show_ai_assistant_icon(true)
                        }else{
                          alert("Please upload an image")
                          set_show_ai_modal(false) 
                          set_show_ai_assistant_icon(true)
                        } 
                        // window.alert("This search feature is still being built")
                        
                        }}>Upload</Button>
                    </Form.Group>
                </div>
                
                
                
                </Modal.Body>


            
            </Modal> */}
            {show_ai_modal && 
            <div style={{"boxShadow":"0 6px 30px 0 rgba(0, 0, 0, 0.2), 0 6px 40px 0 rgba(0, 0, 0, 0.19)",  "position": "fixed",
             "bottom": "0", "right": "0", "borderRadius": "10px",
             "width": chatWidth, "height": chatHeight,
              "backgroundColor": "#ECECEC", "marginRight": "15px", "marginBottom": "15px"
             }}
            >
              <div style={{"position": "absolute", "top": "5px", "right": "5px"}} onClick={()=>{
                set_show_ai_assistant_icon(true)
                set_show_ai_modal(false)
                set_text_search(false)
                set_image_search(false)
                set_voice_search(false)
                set_options(true)
              }}> 
                <CloseButton/>
              </div>
              <br/>

              

              {options && 
              <div>
                <Typography style={{"fontWeight": "bold"}} variant="h5" component="h1">
                  TailorAI Retail Assistant
                </Typography>
                {/* <h3 style={{"margin": "10px"}}>TailorAI Retail Assistant</h3> */}
                <hr/>
                <Typography style={{"margin": "10px"}} variant="h5" component="h1">
                  How would you like to describe what you're looking for?
                </Typography>
                {/* <h5 style={{"margin": "10px"}}>How would you like describe what you're looking for</h5> */}

                <br/>

                <Button color='info' style={{"margin": "2px"}} onClick={()=>{
                  window.alert("Please note this feature only works on desktop devices at the moment. We are currently builiding the smartphone browser speech recognition functionality")
                  set_options(false)
                  set_voice_search(true)
                }}
                >
                  Speech
                </Button>

                <Button style={{"margin": "2px"}} onClick={()=>{
                  set_text_search(true)
                  set_options(false)
                }}
                >
                  Text
                </Button>


                <Button style={{"margin": "2px"}} onClick={()=>{
                  set_image_search(true)
                  set_options(false)
                }}
                >
                  Upload Image
                </Button>
              </div>
              }
              
              {
                voice_search &&
                <div>
                  <AudioRecorder AudioSearchCallback={sendAudioRequest} GoBack={cancelAudio}/>
                </div>
              }

              {
                text_search &&
                <div style={{"padding": "10px"}}>

                  <Form style={{"margin": "30px"}} onSubmit={(e)=>{e.preventDefault()}}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Typography variant="h5" component="h5">
                      <Form.Label style={{"color": "black"}}>Type what you're looking for below:</Form.Label>

                    </Typography>
                      <br/>
                      <br/>
                      <Form.Control ref={inputRef} placeholder="Type here" type="text"/>
                      <br/>
                      <Form.Text style={{"position": "absolute", "left": "10px"}} className="text-muted">Examples:</Form.Text>
                      <br/>
                      <Form.Text style={{"position": "absolute", "left": "10px"}}>I'm looking for a blue striped t-shirt</Form.Text>
                      <br/>
                      <Form.Text style={{"position": "absolute", "left": "10px"}} className="text-muted">I'm looking for something warm for winter</Form.Text>
                      <br/>

                      <Button style={{"position": "absolute", "top": 0, "left": 0, "margin": "10px"}} variant="secondary" onClick={()=>{
                        set_text_search(false)
                        set_options(true)   
                      }}>Back</Button>

                      <Button style={{"margin": "20px"}} onClick={()=>{
                        console.log(inputRef.current.value)
                        sendUserRequest(inputRef ? {"u_request": inputRef.current.value, "type": "text"} 
                          : {"u_request": "", "type": "text"}
                        )
                      }}>Find It</Button>
                    </Form.Group>
                    </Form>
                </div>
              }

              {
                image_search &&
                <div style={{"padding": "10px"}}>
                  <Button style={{"position": "absolute", "top": 0, "left": 0, "margin": "10px"}} variant="secondary" onClick={()=>{
                        set_image_search(false)
                        set_options(true)   
                      }}>Back</Button>
                  <br/>
                  <Form onSubmit={(e)=>{e.preventDefault()}}>
                    <Form.Group>
                      <Form.Label>Upload Image</Form.Label>
                      <Form.Control onChange={(e)=>{
                          set_file(e.target.files[0])
                          console.log(e.target.files)
                          console.log(e.target.files[0])
                          }} type='file'
                      >
                      </Form.Control>
                      <Button style={{"position": "fixed", "right": "10px", "marginRight": "10px"}} onClick={()=>{
                          if(file){
                            sendUserRequest({"u_request": file, "type": "file"})
                          }else{
                            alert("Please upload an image")
                            set_show_ai_modal(false) 
                            set_show_ai_assistant_icon(true)
                          } 
                          // window.alert("This search feature is still being built")
                          
                          }}>Find It
                        </Button>
                    </Form.Group>
                  </Form>
                  
                </div>
              }
              
              {/* {search_results && 
              (loading_results ?
                <div>
                  <SearchResults Results={props.SearchResults} Width={chatWidth} Height={chatHeight}/>
                  <Button style={{"position": "fixed", "bottom": 0, "right": 0}} variant="secondary" onClick={()=>{
                      set_image_search(false)
                      set_options(true)
                      set_search_results(false)
                        
                    }}>Back</Button>
                </div>
              :
              <Spinner style={{"opacity": 0.5}} border="animation"/>
              )
              } */}
            </div>
          }

            
        </div>
        
        
          
    </div>
        
  );
}

export default Search;
