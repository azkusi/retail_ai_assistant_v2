import {React, useEffect} from "react";
import { useState } from "react";
import { mens_clothing } from "../data/mens_clothing";
import { mens_t_shirts } from "../data/mens_t_shirts";
import { mens_trousers } from "../data/mens_trousers";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useWindowSize from "../hooks/useWindow";
import { Container, Form, Modal, Row, Col, Button, Spinner } from 'react-bootstrap';
import { plt_womens_clothing } from "../data/PLT_1_240";

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

    const { id } = useParams()


    useEffect(()=>{
        
        productInitialiser()
        

    },[reset])


    
    function backCallback(){
        props.backCallback("Text")
    }



    function productInitialiser(){
        if(gender === "MENS"){
            console.log("mens_trousers")
            let i = 0
            let temp = []
            for(i; i < 20; i++){
                temp.push(mens_trousers[Math.floor(Math.random() * (mens_trousers.length - 1))])
                set_product_select_data(temp)
                set_loading_new_choices(false)
            }
        }else if(gender === "WOMENS"){ 
            console.log("womens_clothing")
            let i = 0
            let temp = []
            for(i; i < 20; i++){
                temp.push(plt_womens_clothing[0]["products"][Math.floor(Math.random() * (plt_womens_clothing[0]["products"].length - 1))])
                set_product_select_data(temp)
                set_loading_new_choices(false)
            }

        }
        
    }

    async function getFile(){
        const selection_query = product_select_data[selected_categories[0]]
        let url = selection_query["product_image_url"]
        return new Promise(async (resolve, reject)=>{

          try{
            let type_of_request;
            if(gender === "WOMENS"){
                type_of_request = "womens_clothing"
            }else{
                //MENS
                type_of_request = "mens_clothing"
            }
            const response = await axios.post("https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingImage-using-buffer", {
                    "url": url,
                    "collection": type_of_request
            })
            if(response.status === 200){
                console.log("search result: ", response.data)
                // resolve(1)
                // const blob_data = response.data
                // const file = new File([response.data], "test.jpg")
                // console.log("blob is", response.data)
                // console.log("file is ", file)
                resolve(response.data)
              
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
        // let type_of_request;
        // if(id === "mens_trousers"){
        //     type_of_request = "mens_trousers"
        // }else{
        //     type_of_request = "mens_t_shirts"
        // }
    
        console.log("Request received: ", selected_categories)
        
        // useEffect(()=>{
            
            if((selected_categories !== null) && (selected_categories !== undefined)){
                if(selected_categories.length !== 1){
                    window.alert(`Please select ONE image, you have selected: ${selected_categories.length.toString()}`)
                }
                else{
                    set_personalised_loading(true)
                    console.log("sending request from getPreferenceResults hook")
                    
                    getFile()
                    .then((search_result)=>{
                        //search for similar products
                        if(search_result !== "SERVER_ERROR"){
                            
                            set_show_personalised_results(true)
                            set_personalised_results(search_result.results[0].hits)
                            set_personalised_loading(false)
                            // set_your_choice(product_select_data[selected_products[0]])
                        }        
                    })
                       
                    //})
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
                        <button className={`btn btn-primary mx-2`} 
                            onClick={() => {
                                set_gender("WOMENS")
                                set_reset(reset + 1)
                            }}
                        >
                        View Womens Clothing
                        </button>

                        <button className={`btn btn-primary mx-2`} 
                            onClick={() => {
                                set_gender("MENS")
                                set_reset(reset + 1)
                            }}
                        >
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
                                        <img alt={index} src={item.document["product_image_url"]} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                                        <label>{item.document["description"]}</label>
                                        <label>£{item.document["price"]}</label>
                                    </Link>
                                    

                                </Col>
                                )
                            })}
                            </Row>

                            {preview && <Modal show onHide={()=>{set_preview(false)}}>
                                <Modal.Header closeButton/>
                                <Modal.Body style={{textAlign: "center"}}>
                                    <img alt={preview_item["description"]} src={preview_item["product_image_url"]} style={{"maxHeight": 0.5*height, "maxWidth": 0.5*width, "padding": "10px"}}/>
                                    <br/>
                                    <h5>{preview_item["description"]}</h5>
                                    <label>£{preview_item["price"]}</label>
                                </Modal.Body>
                                <Modal.Footer>
                                    {/* <Button variant="secondary" onClick={handleClose}>
                                        Add to Saved
                                    </Button> */}
                                    <Button variant="primary" 
                                        onClick={()=>{
                                            // set_preview(false)
                                            window.open(preview_item["product_url"], "_blank")
                                        }}>
                                        View on Retailer's Site
                                        {/* View on {item.document.retailer_name} */}
                                    </Button>
                                </Modal.Footer>
                            </Modal>}
                            
                        </Container>
                        </div>
                :

                    <div style={{"width": 0.8*width, "margin": "auto", "height": 0.7*height}}>
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
                                                        src={item["product_image_url"]} 
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