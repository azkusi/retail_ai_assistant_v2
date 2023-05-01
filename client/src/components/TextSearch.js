import '../App.css';
import {React, useEffect, useRef, useState} from "react";
import {Form, Container, Row, Col, Button, Spinner, Modal} from "react-bootstrap";
import axios from "axios";
import useWindowSize from "../hooks/useWindow";
import { useNavigate } from "react-router-dom";

function TextSearch(props){
    const [search_results, set_search_results] = useState(null)
    const [user_request, set_user_request] = useState(null)
    const [spinner, set_spinner] = useState(false)
    const inputRef = useRef(null)
    const [preview, set_preview] = useState(false)
    const [preview_item, set_preview_item] = useState(null)
    const navigate = useNavigate()

    const height = useWindowSize().height
    const width = useWindowSize().width

    const[chat_width, setChatWidth] = useState(width * 0.3)
    const[chat_height, setChatHeight] = useState(height * 0.3)
    
    useEffect(()=>{
        
        console.log("TextSearch component rendered")
    },[])

    

    return (
        // <div style={{"width": width}} className="App">
        //     <div style={{"opacity": spinner ? 0.2 : 1}}>
        //         {search_results ?
        //             <div style={{"width": "100%", "margin": "auto"}}>
        //                 <Button 
        //                     style={{"margin": "5px", "position": "fixed", "top": "2%", "left": "2%"}} 
        //                     onClick={()=>{
        //                         props.backCallback("Text")
        //                     }}
        //                 >
        //                     Back
        //                 </Button>
        //                 {search_results === "NO RESULTS FOR THIS SEARCH" ? 
        //                     <div>
        //                         <h1>Sorry, we couldn't find any results for your search</h1>
        //                     </div>
        //                 :
        //                     <Container style={{"width": 0.8*width, "margin": "auto"}}>
        //                         {/* <Row xl={1}lg={1} md={1} sm={1} xs={1}>
        //                             <Col>
        //                             <h5>Your request:</h5>
        //                                 <img alt={"user_request"} src={user_request} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
        //                             </Col>
        //                         </Row> */}
                
        //                         <Row xl={4}lg={4} md={3} sm={3} xs={2}>
        //                         {search_results.map((item, index)=>{
        //                             return( 
        //                             <Col key={index}>
        //                                 <Link 
        //                                     onClick={()=>{set_preview(true)
        //                                         set_preview_item(item.document)
        //                                     }} 
                                            
        //                                     to="#"
        //                                     // to={item.document.retailer_url}
        //                                 >
        //                                     <img alt={index} src={item.document.src} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
        //                                     {/* <label>{item.document.description}</label> */}
        //                                 </Link>
                                        

        //                             </Col>
        //                             )
        //                         })}
        //                         </Row>

        //                         {preview && <Modal>
        //                             <Modal.Header closeButton/>
        //                             <Modal.Body>
        //                                 {/* <img alt={preview_item.name} src={preview_item.src} style={{"maxHeight": 0.5*height, "maxWidth": 0.5*width, "padding": "10px"}}/> */}
        //                                 <img alt={preview_item.name} src={preview_item.src} style={{"maxHeight": 0.5*height, "maxWidth": 0.5*width, "padding": "10px"}}/>
        //                                 <label>{preview_item.description}</label>
        //                             </Modal.Body>
        //                             <Modal.Footer>
        //                                 {/* <Button variant="secondary" onClick={handleClose}>
        //                                     Add to Saved
        //                                 </Button> */}
        //                                 <Button variant="primary" onClick={()=>{set_preview(false)}}>
        //                                     View on Retailer's Site
        //                                     {/* View on {item.document.retailer_name} */}
        //                                 </Button>
        //                             </Modal.Footer>
        //                         </Modal>}
                                
        //                     </Container>
        //                 }
        //             </div>
        //             :
    
                    <div className="input-group mb-3"
                        style={{width: 0.8*width, margin: "0 auto", padding: "20px"}}
                    >
                        <input ref={inputRef} 
                            onKeyDown={
                                (e)=>{
                                    if(e.key === "Enter"){
                                        e.preventDefault()
                                        if(inputRef.current.value === ""){
                                            window.alert("Please enter a search term")
                                        }
                                        else{
                                            //collection should be all clothing
                                            navigate('/search-results/'+inputRef.current.value, {state: {collection: props.collection}})
                                            // sendUserRequest(inputRef.current.value)
                                        }
                                    }
                                    
                                }} 
                            type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
                        <button 
                            onClick={()=>{
                                if(inputRef.current.value === ""){
                                    window.alert("Please enter a search term")
                                }
                                else{
                                    //collection should be all clothing
                                    navigate('/search-results/'+inputRef.current.value)
                                    // sendUserRequest(inputRef.current.value)
                                }
                               
                                
                            }} 
                            className="btn btn-outline-secondary" type="button" id="button-addon2">
                            
                            Search
                        </button>
                    </div>

        //         }
        //     </div>
            
        //     {spinner && <Spinner animation="border"/>}
       

            
        // </div>
    )
}

export default TextSearch;