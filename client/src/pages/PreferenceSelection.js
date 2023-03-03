import React, { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom"
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import useWindowSize from "../hooks/useWindow";
import { product_data } from "../data/products";
import '../App.css'
import PersonalisedResults from "./PersonalisedResults";
import axios from "axios";


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
    const navigate = useNavigate()

    function productInitialiser(){
        console.log(typeof(selected_products))
        let i = 0
        let temp = []
        for(i; i < 20; i++){
            temp.push(product_data[Math.floor(Math.random() * (product_data.length - 1))])
            set_product_select_data(temp)
        }
    }


    function getPreferenceResults(){
        // const [result_to_send, set_result_to_send] = useState(product_data)
        // const [status, set_status] = useState("NO_CHANGE")
    
        console.log("Request received: ", selected_products)
        
        // useEffect(()=>{
            
            if((selected_products !== null) && (selected_products !== undefined)){
                if(selected_products.length !== 1){
                    window.alert(`Please select ONE image, you have selected: ${selected_products.length.toString()}`)
                }
                else{
                    set_personalised_loading(true)
                    console.log("sending request from getPreferenceResults hook")
                    axios.post('https://us-central1-retail-assistant-demo.cloudfunctions.net/getPersonalisedProducts',
                    {
                        "available_products": product_select_data,
                        "selected_products": selected_products
                    }, 
                    {
                        headers: {
                            "Access-Control-Allow-Origin": "*"
        
                        }
                    }
                    ).then((result)=>{
                        console.log("get results hooked received a result: ", result.data.result)
                        set_personalised_results(result.data.result)
                        set_your_choice(result.data.received)
                        set_show_personalised_results(true)
                        set_personalised_loading(false)
                        return {
                        "personalised_products": result.data.result,
                        "status": "CHANGED"
                        }
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
                    
                    <div style={{"width": 0.8*width, "margin": "auto", "height": 0.7*height}}>
                        <br/>
                        <h2>Select <span style={{"fontWeight": "bold"}}>ONE</span> image for the type of style you like or are looking for</h2>                        

                        <Container style={{"width": 0.85*width, "margin": "auto", "height": 0.7*height, "overflowY": "scroll"}}>
                            <Row xl={4}lg={4} md={3} sm={2} xs={2}>
                            {product_select_data ? product_select_data.map((item, index)=>{
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
                            style={{"margin": "5px"}}
                            onClick={()=>{
                                set_reset(reset + 1)
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
                                <h3>Sit back whilst we create a personalised shopping experience for you </h3>
                                <h5>Note - this service does not <span style={{"fontWeight": "bold"}}>yet</span> use a vector database, hence the vector search may take up to 60 secs </h5>
                            </div>
                        }
                    </div>
                </div>
            }

            {show_personalised_results && 
            <div>
                <PersonalisedResults results={personalised_results} your_choice={your_choice}/>
            </div>}

        </div>
    )
}

export default PreferenceSelection