import React, { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom"
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import useWindowSize from "../hooks/useWindow";
import { product_data } from "../data/products";
import '../App.css'
import PersonalisedResults from "./PersonalisedResults";
import axios from "axios";
import { mens_t_shirts } from "../data/mens_t_shirts";
import { mens_trousers } from "../data/mens_trousers";
const Typesense = require('typesense')



function PreferenceSelection(){
    const { id } = useParams()
    const width = useWindowSize().width
    const height = useWindowSize().height
    const [product_select_data, set_product_select_data] = useState(null)
    const [selected_products, set_selected_products] = useState([])
    const [personalised_results, set_personalised_results] = useState(null)
    const [show_personalised_results, set_show_personalised_results] = useState(false)
    const [reset, set_reset] = useState(0)
    const [personalised_loading, set_personalised_loading] = useState(false)
    const [your_choice, set_your_choice] = useState(null)
    const [loading_new_choices, set_loading_new_choices] = useState(false)
    const navigate = useNavigate()


    function productInitialiser(){
        if(id === "mens_trousers"){
            console.log("mens_trousers")
            let i = 0
            let temp = []
            for(i; i < 20; i++){
                temp.push(mens_trousers[Math.floor(Math.random() * (mens_trousers.length - 1))])
                set_product_select_data(temp)
                set_loading_new_choices(false)
            }
        }else if(id === "mens_t_shirts"){
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

    async function getFile(){
        const selection_query = product_select_data[selected_products[0]]
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
        if(id === "mens_trousers"){
            type_of_request = "mens_trousers"
        }else{
            type_of_request = "mens_t_shirts"
        }
    
        console.log("Request received: ", selected_products)
        
        // useEffect(()=>{
            
            if((selected_products !== null) && (selected_products !== undefined)){
                if(selected_products.length !== 1){
                    window.alert(`Please select ONE image, you have selected: ${selected_products.length.toString()}`)
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



    useEffect(()=>{
        
        productInitialiser()
        

    },[reset])

    return(
        <div>
            <Button 
                style={{"margin": "5px", "position": "fixed", "top": "2%", "left": "2%"}} 
                onClick={()=>{navigate('/#search')}}
            >
                Back
            </Button>
            <br/>
            <br/>
            

            {
                !show_personalised_results && 
                <div>
                    
                    <div style={{"width": 0.8*width, "margin": "auto", "height": 0.7*height, "opacity": personalised_loading ? 0.2 : 1}}>
                        <br/>
                        <h1>Show the AI stylist your style</h1>
                        <p>Select <span style={{"fontWeight": "bold"}}>ONE</span> image for the type of style you like or are looking for and we'll find similar results for you</p>                        

                        <Container style={{"width": 0.85*width, "margin": "auto", "height": 0.7*height, "overflowY": "scroll"}}>
                            <Row xl={4}lg={4} md={3} sm={2} xs={2}>
                            {(product_select_data && !loading_new_choices) ? product_select_data.map((item, index)=>{
                                return(
                                <Col key={index}>
                                    
                                    <img 
                                        onClick={()=>{
                                            console.log(selected_products)
                                            if(selected_products.includes(index)){
                                                set_selected_products(selected_products.filter((filterItem, filterIndex) =>
                                                    filterItem !== index
                                                ))
                                            }else{
                                                set_selected_products([...selected_products, index])
                                            }
                                        }} 
                                        alt={index}
                                        src={item.src} 
                                        style={{"maxHeight": 0.3*height, 
                                            "maxWidth": 0.8*width, 
                                            "margin": "10px", 
                                            "borderStyle": selected_products.length === 0 ? null : (selected_products.includes(index) ? 'solid' : "none"),
                                            "borderColor": selected_products.length === 0 ? null : (selected_products.includes(index) ? 'blue' : null),
                                            "opacity": selected_products.length === 0 ? null : (selected_products.includes(index) ? 0.2 : 1)
                                        }}
                                    />                                    
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

                        {(selected_products.length > 0) && <Button
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
                                <h2 style={{"fontWeight": "bold"}}>Sit back whilst we create a personalised shopping experience for you </h2>
                                <br/>
                                <p>Note - your initial request may take a while to load, because the machine learning model is being loaded from memory, subsequent responses will load quickly. We will soon cache the model on our server for fast & instantaneous responses at all times</p>
                            </div>
                        }
                    </div>
                </div>
            }

            {show_personalised_results && 
            <div>
                <PersonalisedResults results={personalised_results} your_choice={product_select_data[selected_products[0]]}/>
            </div>}

        </div>
    )
}

export default PreferenceSelection