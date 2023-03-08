// import { Gallery } from "react-grid-gallery";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dictaphone from '../components/Dictaphone';
import useWindowSize from "../hooks/useWindow";
import '../App.css'




function Search(props) {
  const width = useWindowSize().width
  const height = useWindowSize().height

  const [show_ai_assistant_icon, set_show_ai_assistant_icon] = useState(true)
  const [show_ai_modal, set_show_ai_modal] = useState(false)
  const [file, set_file] = useState(null)
  
  
//   const [user_request, set_user_request] = useState(null)
//   const user_result = useGetResults(user_request)
  
  
  
  
  function sendUserRequest(dictaphone_data){
    console.log("Search callback, dictaphone data updated: ", dictaphone_data)

    if(dictaphone_data.type === "text"){
      //send user request to home component to send to firebase
      console.log("user request: ", dictaphone_data)
      props.HomeCallBack(dictaphone_data)
    }
    else if(dictaphone_data.type === "file"){
      props.HomeSecondCallBack(dictaphone_data)
    }
    
    set_show_ai_modal(false)
    set_show_ai_assistant_icon(true)
  }




  useEffect(()=>{
    
    // console.log("user_request is: ", user_request)
    // props.handleCallBack(user_result.products)
    // console.log("user_result is: ", user_result)
  },[])

  return (
    <div>
        <div style={{"width": width}} className="App">
            {/* <Gallery images={pr}
            //  maxRows={10} 
            /> */}
            
            {show_ai_assistant_icon && 
            <SmartToyIcon 
            style={{"position": "fixed", "bottom": 0, "right": 0, "height": 0.15*height, "width": 0.15*width}}
            onClick={()=>{
                set_show_ai_modal(true)
                set_show_ai_assistant_icon(false)
            }}
            />}

            <Modal show={show_ai_modal} 
                onHide={()=>{
                set_show_ai_modal(false) 
                set_show_ai_assistant_icon(true)
                }}
                backdrop={false}
            >
                <Modal.Header style={{"borderLeft": "solid", "borderRight": "solid", "borderTop": "solid"}} closeButton>
                <Modal.Title style={{"textAlign": "center"}}>Describe, or upload a T-SHIRT style you're looking for</Modal.Title>
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
                        // if(file){
                        //   sendUserRequest({"u_request": file, "type": "file"})
                        //   set_show_ai_modal(false) 
                        //   set_show_ai_assistant_icon(true)
                        // }else{
                        //   alert("Please upload an image")
                        //   set_show_ai_modal(false) 
                        //   set_show_ai_assistant_icon(true)
                        // } 
                        window.alert("This feature is still being built")
                        
                        }}>Upload</Button>
                    </Form.Group>
                </div>
                
                
                
                </Modal.Body>


            
            </Modal>

            
        </div>
        
        
          
    </div>
        
  );
}

export default Search;
