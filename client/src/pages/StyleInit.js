import {React, useEffect, useState} from "react";
import { Form, Button, Row, Col, Container, Modal, Spinner, Dropdown, DropdownButton } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useWindowSize from "../hooks/useWindow";
import { mens_style_categories } from "../data/men_style_categories";
import { womens_style_categories } from "../data/women_style_categories";
import { number_six_style } from "../data/number_six";
import logo from "../data/logo.png";

function StyleInit(props){

    const [user, set_user] = useState(null)
    const [gender_categories, set_gender_categories]= useState(null)
    const [gender, set_gender] = useState(null)
    const width = useWindowSize().width
    const height = useWindowSize().height
    const [selected_categories, set_selected_categories] = useState([])
    const [loading, set_loading] = useState(false)
    const location = useLocation();
    const [done_hovered, set_done_hovered] = useState(false)
    const [hostname, set_hostname] = useState("tailorai")
    
    const navigate = useNavigate()

    useEffect(()=>{
        //if url is numbersixlondon, then set gender categories to mens categories
        //else set to womens categories
        let hostname = window.location.hostname
        let retailer = hostname.split('.')[0]
        if(retailer === "numbersixlondon"){
            set_gender_categories(mens_style_categories)
            set_hostname("numbersixlondon")
            // props.showHomeCallback()
            // props.selectStylesInstructionCallback()
            // window.scrollTo(0, 100);
        }
        
    },[])

    function retrieveRecommendations(){
        set_loading(true)
        let clothing_gender;
        if(gender === "Women"){
            clothing_gender = "womens_clothing"
        }
        else{
            clothing_gender = "number_six_london"
        }
        try{
            axios.post("https://us-central1-retail-assistant-demo.cloudfunctions.net/getRecommendationsUsingTextFromColdStartNotLoggedIn", {
                "categories": selected_categories,
                "collection": clothing_gender
            }).then((response)=>{
                console.log("retrieved cold start recommendations:", response.data)
                const already_seen_doc_id = response.data.already_seen_doc_id
                
                const recommendation_sets = response.data.result

                let i=0
                

                let temp = [];
                console.log("Recommendations sets: ", recommendation_sets)
                
                navigate("/shopping-home", {state: {data: recommendation_sets, gender: gender, categories: selected_categories, already_seen_doc_id: already_seen_doc_id}})
                

            }).catch((error)=>{
                set_loading(false)
                console.log(error)
                window.alert("Error retrieving recommendations, please try again later")
            })
        }
        catch(error){
            set_loading(false)
            console.log(error)
        }
    }

    return(
        <div>
            <div style={{opacity: loading ? 0.2 : 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: "100vh", marginTop: "5vh"}}>
                {hostname !== "numbersixlondon" ?
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <img src={logo} alt="TailorAI Logo" style={{height: "50px", width: "50px"}} />
                            
                            <h1 style={{marginRight: "10px", color: number_six_style[0].color}}>ailorAI</h1>
                        </div>

                    : 
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <h1 style={{fontWeight: "bold", letterSpacing: number_six_style[0].letterSpacing, color: number_six_style[0].color, fontFamily: number_six_style[0].fontFamily}}>number six</h1>
                        </div>

                        
                }
                {
                    hostname !== "numbersixlondon" ?
                        <p style={{textAlign: "center", marginBottom: "40px", color: number_six_style[0].color}}>
                            Retail Search and Recommendation Engine
                        </p>
                    : 
                        <p style={{textAlign: "center", marginBottom: "40px", color: 'grey', fontSize: "13.5px"}}>
                            AI Search & Recommendations powered by <span style={{fontWeight: "bold"}}> <a href='https://tailorai.co.uk' target='_blank' rel="noreferrer">TailorAI</a></span>
                        </p>
                }
                

                {!user && 
                    <div>
                        {/* <h4>Login if you already have an account</h4>
                        <h4>Sign Up</h4> */}
                    </div>
                }
                {!gender_categories && 
                    <div style={{
                        position: "absolute",
                        top: "45%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        
                    }}>
                    <Dropdown>
                        <Dropdown.Toggle style={{backgroundColor: "#1a3c6c", borderColor: "#1a3c6c"}} id="dropdown-basic">
                            Select clothing gender
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item 
                                onClick={()=>{
                                    set_gender_categories(womens_style_categories)
                                    set_gender("Women")
                                    // props.selectStylesInstructionCallback()
                                    // props.showHomeCallback()
                                }}
                            >
                                Women's Clothing
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={()=>{
                                    set_gender_categories(mens_style_categories)
                                    set_gender("Men")
                                    // props.selectStylesInstructionCallback()
                                    // props.showHomeCallback()
                                }}
                            >
                                Men's Clothing
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    </div>
                } 
                {
                    gender_categories && 
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "30px",
                            flexDirection: "column"

                          }}>
                            <h4>Scroll & choose two styles</h4>
                            <br/>
                            <Container style={{
                                "width": 0.85*width, "margin": "auto", "height": 0.7*height, "overflowY": "scroll",
                                    boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.1)", 
                                    padding: "5px"}}>
                                <Row xl={4}lg={4} md={3} sm={3} xs={2}>
                                {gender_categories.map((item, index)=>{
                                    return( 
                                    <Col key={index}>
                                        
                                            <img alt={index} 
                                                src={item["image_url"]} 
                                                style={{
                                                    "maxHeight": 0.3*height, 
                                                    "maxWidth": 0.8*width, 
                                                    "margin": "10px", 
                                                    "borderStyle": selected_categories.length === 0 ? null : (selected_categories.includes(item) ? 'solid' : "none"),
                                                    "borderColor": selected_categories.length === 0 ? null : (selected_categories.includes(item) ? 'blue' : null),
                                                    "opacity": selected_categories.length === 0 ? null : (selected_categories.includes(item) ? 0.2 : 1)
                                                }}
                                                onClick={()=>{
                                                    console.log("category: ", item.category)
                                                    if(selected_categories.includes(item)){
                                                        set_selected_categories(selected_categories.filter((category)=>{return category !== item}))
                                                    }
                                                    else{
                                                        set_selected_categories([...selected_categories, item])
                                                        console.log("Selected categories length: ", selected_categories)
                                                    }
                                                }} 
                                            />
                                            <h4>{item["category"]}</h4>
                                        
                                        

                                    </Col>
                                    )
                                })}
                                </Row>
                                
                            </Container>
                            {(selected_categories.length > 0) && 
                                <button
                                style={{"position": "fixed", "bottom": 0, "right": 0, "zIndex": 100,
                                    border: 'none',
                                    backgroundColor: done_hovered ? 'white' : '#1a3c6c',
                                    color: done_hovered ? '#1a3c6c' : 'white',
                                    padding: '10px 20px',
                                    borderRadius: '0',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={() => set_done_hovered(true)}
                                onMouseLeave={() => set_done_hovered(false)}
                                    onClick={()=>{
                                        //send available products for picking
                                        //and selected products to backend and retrieve results 
                                        if((selected_categories !== null) && (selected_categories !== undefined)){
                                            if(selected_categories.length !== 2){
                                                window.alert(`Please choose TWO styles, you have selected: ${selected_categories.length.toString()}`)
                                            }
                                            else{
                                                // props.unselectStylesInstructionCallback()
                                                retrieveRecommendations()
                                            }
                                        }
                                        else{
                                            window.alert("Please choose at least TWO styles")

                                        }
                                        
                                    }}
                                >
                                    Done
                                </button>
                            }
                        </div>
                }
                
            </div>
            {loading && 
                <div className='center'>
                    <Spinner animation="border"/>
                    <p>Loading Recommendations</p>
                </div>
            }
            
            {/* Once gender selected choose categories */}
            {/* Once category selected take them to a non-loggedin recommender page to choose images */}
            {/* Once images selected show non-logged in recommendation component */}
            {/* Users should be able to reset their styles */}
            {/* User should be able to go back to home page */}
            {/* Users should be able to log in to save their styles etc */}
        </div>
        
    )
}

export default StyleInit