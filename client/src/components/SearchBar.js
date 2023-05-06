import '../App.css';
import {React, useEffect, useRef} from "react";
import useWindowSize from "../hooks/useWindow";
import { useNavigate } from "react-router-dom";

function SearchBar(props){
    
    const inputRef = useRef(null)

    const navigate = useNavigate()

    const height = useWindowSize().height
    const width = useWindowSize().width

    
    useEffect(()=>{
        
        console.log("TextSearch component rendered")
    },[])

    

    return (
        
    
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

    )
}

export default SearchBar;