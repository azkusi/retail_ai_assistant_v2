import {React, useEffect} from "react";
import { useState } from "react";
import { mens_clothing } from "../data/mens_clothing";
import { mens_t_shirts } from "../data/mens_t_shirts";
import { mens_trousers } from "../data/mens_trousers";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useWindowSize from "../hooks/useWindow";
import PersonalisedResults from "../pages/PersonalisedResults";
import { Container, Form, Modal, Row, Col, Button, Spinner } from 'react-bootstrap';

function StyleSearch(props){
    const [selected_categories, set_selected_categories] = useState([])
    const width = useWindowSize().width
    const height = useWindowSize().height
    const [gender, set_gender] = useState(null)

    const [product_select_data, set_product_select_data] = useState(null)
    const [personalised_results, set_personalised_results] = useState(null)
    const [show_personalised_results, set_show_personalised_results] = useState(false)
    const [reset, set_reset] = useState(0)
    const [personalised_loading, set_personalised_loading] = useState(false)
    const [loading_new_choices, set_loading_new_choices] = useState(false)
    const [preview, set_preview] = useState(false)
    const [preview_item, set_preview_item] = useState(null)

    useEffect(()=>{
        
        productInitialiser()
        

    },[reset])


    
    function backCallback(){
        props.backCallback("Text")
    }



    function productInitialiser(){
        if(props.gender === "MENS"){
            console.log("mens_trousers")
            let i = 0
            let temp = []
            for(i; i < 20; i++){
                temp.push(mens_trousers[Math.floor(Math.random() * (mens_trousers.length - 1))])
                set_product_select_data(temp)
                set_loading_new_choices(false)
            }
        }else{
            console.log("mens_t_shirts")
            let i = 0
            let temp = []
            for(i; i < 20; i++){
                temp.push(mens_t_shirts[Math.floor(Math.random() * (mens_t_shirts.length - 1))])
                set_product_select_data(temp)
                set_loading_new_choices(false)
            }
        }
        
    }



    // function getPreferenceResults(){
    //     let chosen_categories = []
    //     if(props.gender === "MENS"){
    //         // mens_clothing
    //         let i = 0;
    //         for(i; i < 50; i++){
    //             if(!selected_categories.includes(mens_clothing[i])){
    //                 set_selected_categories([...selected_categories, mens_clothing[i]])
    //             }
    //         }
    //     }
    //     else{
    //         // womens_clothing
    //         let i = 0;
    //         for(i; i < 50; i++){
    //             if(!selected_categories.includes(mens_clothing[i])){
    //                 chosen_categories.push(mens_clothing[i])
    //             }
    //         }
    //     }
    
    //     let type_of_request;
    //     if(props.gender === "mens"){
    //         // type_of_request = "mens_clothing"
    //         type_of_request = "mens_trousers"
    //     }else{
    //         // type_of_request = "womens_clothing"
    //         type_of_request = "mens_t_shirts"
    //     }
    
    //     console.log("Request received: ", selected_categories)
        
    //     // useEffect(()=>{
            
    //     if((chosen_categories !== null) && (chosen_categories !== undefined)){
    
    //         set_personalised_loading(true)
    //         console.log("sending request from getPreferenceResults hook")
            
            
    //         //search for similar products
    //         let url;
    //         let data_to_send;
    //         let content_type;
    //         url = "https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingImage"
    //         data_to_send = {"categories": selected_categories, "collection": "mens_clothing"}
    //         content_type = "application/json"
            
    //         return new Promise(async (resolve, reject)=>{
    //             if(selected_categories.length > 0){
    //                 try{
    //                     console.log(data_to_send, content_type)
    //                     axios.post(url, data_to_send, {
    //                         headers: {
    //                             'Content-Type': content_type
    //                         }
    //                     }).then((result)=>{
    //                         console.log("search results: ", result)
    //                         const product_results = result.data.results[0].hits
    //                         console.log("search results are: ", JSON.stringify(product_results))
    //                         resolve(product_results)
    //                         }, (err)=>{
    //                         console.log("second_error was:", err)
    //                         resolve("SERVER_ERROR")
    //                     })
    //                 }
    //                 catch(error){
    //                     console.log("second_error was:", error)
    //                     resolve("SERVER_ERROR")
    //                 }
                    
    //             }
    //             else{
    //                 window.alert("Please make sure you select an item")
    //                 //navigate('/')
    //             }
    //         }).then((search_result)=>{
    //                 //search for similar products
    //                 if(search_result !== "SERVER_ERROR"){
                        
    //                     set_show_personalised_results(true)
    //                     set_personalised_results(search_result)
    //                     set_personalised_loading(false)
    //                 } 
    //                 else{
    //                     set_show_personalised_results(true)
    //                     set_personalised_results("SEARCH_ERROR")
    //                     set_personalised_loading(false)
    //                 }       
    //             })
                
           
            
            
    //     }
    //     else{
    //         window.alert("Please choose a style you'd like to search for")
    //     }
            
    // }

    async function getFile(){
        const selection_query = product_select_data[selected_categories[0]]
        let url = selection_query["src"]
        return new Promise(async (resolve, reject)=>{
          url = url + "?not-from-cache-please";
          try{
            const response = await axios.get(url, {
              responseType: 'blob'
            })
            if(response.status === 200){
                console.log("image response: ", response)
                // resolve(1)
                // const blob_data = response.data
                const file = new File([response.data], "test.jpg")
                console.log("blob is", response.data)
                console.log("file is ", file)
                resolve(file)
              
            }
            if(response.status === 404){
              console.log("error image does not exist:")
              resolve(0)
            }
          }
          catch(error){
            console.log("second_error was:", error)
            resolve(0)
          }
        })
        
      
          
      }

    function getPreferenceResults(){
        // const [result_to_send, set_result_to_send] = useState(product_data)
        // const [status, set_status] = useState("NO_CHANGE")
        let type_of_request;
        if(props.gender === "MENS"){
            type_of_request = "mens_trousers"
        }else{
            type_of_request = "mens_t_shirts"
        }
    
        console.log("Request received: ", selected_categories)
        
        // useEffect(()=>{
            
            if((selected_categories !== null) && (selected_categories !== undefined)){
                if(selected_categories.length !== 1){
                    window.alert(`Please select ONE image, you have selected: ${selected_categories.length.toString()}`)
                }
                else{
                    set_personalised_loading(true)
                    console.log("sending request from getPreferenceResults hook")
                    
                    getFile().then((file_to_upload)=>{
                        //search for similar products
                        let url;
                        let data_to_send;
                        let content_type;
                        url = "https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingImage"
                        var formData = new FormData();
                        formData.append("image", file_to_upload);
                        // formData.append("collection", "mens_t_shirts");
                        data_to_send = formData
                        // data_to_send = {"image": request.u_request}
                        content_type = "multipart/form-data"
                        return new Promise(async (resolve, reject)=>{
                            if(file_to_upload !== 0){
                                try{
                                    console.log(data_to_send, content_type)
                                    axios.post(url, data_to_send, {
                                        headers: {
                                            'Content-Type': content_type
                                        }
                                    }).then((result)=>{
                                        console.log("search results: ", result)
                                        const product_results = result.data.results[0].hits
                                        console.log("search results are: ", JSON.stringify(product_results))
                                        resolve(product_results)
                                        }, (err)=>{
                                        console.log("second_error was:", err)
                                        resolve("SERVER_ERROR")
                                    })
                                }
                                catch(error){
                                    console.log("second_error was:", error)
                                    resolve("SERVER_ERROR")
                                }
                                
                            }
                            else{
                                window.alert("There was an issue with your search")
                                //navigate('/')
                            }
                        }).then((search_result)=>{
                                //search for similar products
                                if(search_result !== "SERVER_ERROR"){
                                    
                                    set_show_personalised_results(true)
                                    set_personalised_results(search_result)
                                    set_personalised_loading(false)
                                    // set_your_choice(product_select_data[selected_products[0]])
                                }        
                            })
                       
                    })
                }
                
                
            }
            else{
                window.alert("Please choose a style you'd like to search for")
            }
            
    }



    return (
    <div>
            {((gender === null) ? true : false) &&
            <div>

                <Button 
                  style={{"margin": "5px", "position": "fixed", "top": "2%", "left": "2%"}} 
                  onClick={()=>{props.backCallback("Text")}}
                >
                    Back
                </Button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                    <div>
                        <button className={`btn btn-primary mx-2`} onClick={() => set_gender("WOMENS")}>
                        View Womens Clothing
                        </button>

                        <button className={`btn btn-primary mx-2`} onClick={() => set_gender("MENS")}>
                        View Mens Clothing
                        </button>
                    </div>
                </div>
                
            </div>
            }

            {gender && <div >
                
                {show_personalised_results === true ? 
                    personalised_results === "SEARCH_ERROR" ?
                        <div>
                            <Button 
                                style={{"margin": "5px", "position": "fixed", "top": "2%", "left": "2%"}} 
                                onClick={()=>{props.backCallback("Text")}}
                            >
                                Back
                            </Button>
                            

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

                                    <h1 style={{margin: "10px"}}>Sorry, we couldn't find any results for your search</h1>
                                    <p>Please try again</p>
                                    <Button onClick={() => set_show_personalised_results(false)}>
                                        Try again
                                    </Button>
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <Button 
                                style={{"margin": "5px", "position": "fixed", "top": "2%", "left": "2%"}} 
                                onClick={()=>{props.backCallback("Text")}}
                            >
                                Back
                            </Button>
                            <br/>
                            <br/>
                        <Container style={{"width": 0.8*width, "margin": "auto"}}>
                            <Row xl={4}lg={4} md={3} sm={3} xs={2}>
                            {personalised_results.map((item, index)=>{
                                return( 
                                <Col key={index}>
                                    <Link 
                                        onClick={()=>{set_preview(true)
                                            set_preview_item(item.document)
                                        }} 
                                        
                                        to="#"
                                        // to={item.document.retailer_url}
                                    >
                                        <img alt={index} src={item.document.src} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                                        <label>{item.document.name}</label>
                                    </Link>
                                    

                                </Col>
                                )
                            })}
                            </Row>

                            {preview && <Modal show onHide={()=>{set_preview(false)}}>
                                <Modal.Header closeButton/>
                                <Modal.Body style={{textAlign: "center"}}>
                                    <img alt={preview_item.name} src={preview_item.src} style={{"maxHeight": 0.5*height, "maxWidth": 0.5*width, "padding": "10px"}}/>
                                    <br/>
                                    <h5>{preview_item.name}</h5>
                                </Modal.Body>
                                <Modal.Footer>
                                    {/* <Button variant="secondary" onClick={handleClose}>
                                        Add to Saved
                                    </Button> */}
                                    <Button variant="primary" onClick={()=>{set_preview(false)}}>
                                        View on Retailer's Site
                                        {/* View on {item.document.retailer_name} */}
                                    </Button>
                                </Modal.Footer>
                            </Modal>}
                            
                        </Container>
                        </div>
                :

                    <div style={{"width": 0.8*width, "margin": "auto", "height": 0.7*height}} show={!show_personalised_results}>
                        {
                            <div>
                                <Button 
                                    style={{"margin": "5px", "position": "fixed", "top": "2%", "left": "2%", "opacity": personalised_loading ? 0.2 : 1}} 
                                    onClick={()=>{props.backCallback("Text")}}
                                >
                                    Back
                                </Button>
                                <br/>
                                <br/>
                                
                                
                                <div style={{"opacity": personalised_loading ? 0.2 : 1}}>
                                    <br/>
                                    <h1>Show the AI stylist your style</h1>
                                    <p>Select images of the type of style you are looking for and we'll find similar results for you</p>                        

                                    <Container style={{"width": 0.85*width, "margin": "auto", "height": 0.7*height, "overflowY": "scroll"}}>
                                        <Row xl={4}lg={4} md={3} sm={2} xs={2}>
                                        {(product_select_data && !loading_new_choices) ? product_select_data.map((item, index)=>{
                                            return(
                                            <Col key={index}>
                                                {/* <a href={item.document.retailer_url}> */}
                                                    <img 
                                                        onClick={()=>{
                                                            console.log(selected_categories)
                                                            if(selected_categories.includes(index)){
                                                                set_selected_categories(selected_categories.filter((filterItem, filterIndex) =>
                                                                    filterItem !== index
                                                                ))
                                                            }else{
                                                                set_selected_categories([...selected_categories, index])
                                                            }
                                                        }} 
                                                        alt={index}
                                                        src={item.src} 
                                                        style={{"maxHeight": 0.3*height, 
                                                            "maxWidth": 0.8*width, 
                                                            "margin": "10px", 
                                                            "borderStyle": selected_categories.length === 0 ? null : (selected_categories.includes(index) ? 'solid' : "none"),
                                                            "borderColor": selected_categories.length === 0 ? null : (selected_categories.includes(index) ? 'blue' : null),
                                                            "opacity": selected_categories.length === 0 ? null : (selected_categories.includes(index) ? 0.2 : 1)
                                                        }}
                                                    />                                            {/* <label>{item.document.description}</label> */}
                                                {/* </a> */}                                    
                                            </Col>
                                            )
                                        })
                                        :
                                        <Spinner animation="border"/>
                                        }
                                        </Row>

                                    </Container>

                                    <Button
                                        style={{"position": "fixed", "bottom": 0, "left": 0, "zIndex": 100}}
                                        onClick={()=>{
                                            set_reset(reset + 1)
                                            set_loading_new_choices(true)
                                        }}
                                    >
                                        Refresh to get new styles
                                    </Button>

                                    {(selected_categories.length > 0) && <Button
                                        style={{"position": "fixed", "bottom": 0, "right": 0, "zIndex": 100}}
                                        onClick={()=>{
                                            //send available products for picking
                                            //and selected products to backend and retrieve results 
                                            getPreferenceResults()
                                        }}
                                    >
                                        Done
                                    </Button>}
                                </div>

                                <div className='center'>
                                    {personalised_loading && 
                                        <div>
                                            <Spinner animation="border"/>
                                            <h5 style={{"fontWeight": "bold"}}>Loading your results</h5>
                                        </div>
                                    }
                                </div>
                            </div>
                        }

                    </div>
                    
                }
            </div>}
    </div>
    )
}


export default StyleSearch