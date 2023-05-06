import '../App.css';
import {React, useEffect, useRef, useState} from "react";
import {Form, Container, Row, Col, Button, Spinner, Modal} from "react-bootstrap";
import axios from "axios";
import useWindowSize from "../hooks/useWindow";
import { useNavigate } from "react-router-dom";

function Search(props){
    const [search_results, set_search_results] = useState(null)
    const [user_request, set_user_request] = useState(null)
    const [spinner, set_spinner] = useState(false)
    const inputRef = useRef(null)
    const [preview, set_preview] = useState(false)
    const [preview_item, set_preview_item] = useState(null)
    const navigate = useNavigate()

    const height = useWindowSize().height
    const width = useWindowSize().width
    
    useEffect(()=>{
        console.log("Search component rendered")
    },[])

    

    return (  
        <div className="input-group mb-3" style={{width: 0.8*width, margin: "0 auto", padding: "20px"}}>
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
                                navigate('/search-results/'+inputRef.current.value)
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

    )
}

export default Search;