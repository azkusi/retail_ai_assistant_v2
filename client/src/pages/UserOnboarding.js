import {React, useEffect, useState} from "react";
import {  Row, Col, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useWindowSize from "../hooks/useWindow";
import { womens_style_categories } from "../data/women_style_categories";
import { retailers_array, retailers_dictionary } from "../data/retailers";
import { number_six_style } from "../data/number_six";
import './../App.css';
import { auth, db } from "../config";
import Header from "../components/Header";

function UserOnboarding(props){

    const [user, set_user] = useState(null)

    const [gender_categories, set_gender_categories]= useState(womens_style_categories)

    const width = useWindowSize().width
    const height = useWindowSize().height
    const [selected_categories, set_selected_categories] = useState([])
    const [selected_retailers, set_selected_retailers] = useState([])
    const [step, set_step] = useState(1)
    const retailers = retailers_dictionary

    const [loading, set_loading] = useState(false)
    const location = useLocation();
    const [done_hovered, set_done_hovered] = useState(false)

    
    const navigate = useNavigate()

    useEffect(()=>{
        //if url is numbersixlondon, then set gender categories to mens categories
        //else set to womens categories
        auth.onAuthStateChanged((user)=>{
            if(user){
                const email = auth.currentUser.email
                console.log("location.state: ", location.state)
                if(location.state !== null){
                    if("retailers" in location.state && "categories" in location.state && "already_seen" in location.state){
                        if(location.state.retailers && location.state.categories && location.state.already_seen){
                            const user = location.state.user
                            const categories = location.state.categories
                            const already_seen = location.state.already_seen
                            const retailers = location.state.retailers
                            navigate(`/home/b-${user}`, {state: {user: user, user_type: "logged_in_users", categories: categories, already_seen: already_seen, retailers: retailers}})
                        }
                        else{
                            db.collection("users").where("email", "==", email).get()
                            .then((querySnapshot)=>{
                                querySnapshot.forEach((doc)=>{
                                    const docID = doc.id
                                    set_user(docID)      
                                })
                            })
                        }
                    }
                    else{
                        db.collection("users").where("email", "==", email).get()
                        .then((querySnapshot)=>{
                            querySnapshot.forEach((doc)=>{
                                const docID = doc.id
                                set_user(docID)      
                            })
                        })
                    }
                    
                }
                else{
                    db.collection("users").where("email", "==", email).get()
                    .then((querySnapshot)=>{
                        querySnapshot.forEach((doc)=>{
                            const docID = doc.id
   
                            if( "categories" in  doc.data() && "already_seen" in doc.data() && "retailers" in doc.data()){
                                const categories = doc.data().categories
                                const already_seen = doc.data().already_seen
                                const retailers = doc.data().retailers

                                if(categories && already_seen && retailers){
                                    navigate(`/home/b-${docID}`, {state: {user: docID, user_type: "logged_in_users", categories: categories, already_seen: already_seen, retailers: retailers}})
                                }
                                else{
                                    set_user(docID)   
                                }
                            }
                            else{
                                set_user(docID)   
                            }    
                        })
                    })
                }
                

                
            }
            else{
                set_user(null)
            }
        
        }
        )
        
        
    },[])

    function retrieveRecommendations(){
        set_loading(true)
        let clothing_gender;
        
        try{
            if(user){
                db.collection("users").doc(user).update({
                    "categories": selected_categories,
                    "retailers": selected_retailers,
                    "already_seen": []
                }).then(()=>{
                    navigate(`/home/b-${user}`, {state: {user: user, user_type: "logged_in_users", categories: selected_categories, retailers: selected_retailers, already_seen: []}})
                }).catch((error)=>{
                    db.collection("anonymous_users").add({
                        "categories": selected_categories,
                        "retailers": selected_retailers,
                        "already_seen": []
                    }).then((docRef)=>{
                        navigate(`/home/a-${docRef.id}`, {state: {user: docRef.id, user_type: "anonymous_users", categories: selected_categories, retailers: selected_retailers, already_seen: []}})
                    }).catch((error)=>{
                        set_loading(false)
                        console.log(error)
                        window.alert("Error retrieving recommendations, please try again later")
                    })                
                })
            }
            else{
                db.collection("anonymous_users").add({
                    "categories": selected_categories,
                    "retailers": selected_retailers,
                    "already_seen": []
                }).then((docRef)=>{
                    navigate(`/home/a-${docRef.id}`, {state: {user: docRef.id, user_type: "anonymous_users", categories: selected_categories, retailers: selected_retailers, already_seen: []}})
                }).catch((error)=>{
                    set_loading(false)
                    console.log(error)
                    window.alert("Error retrieving recommendations, please try again later")
                })
            }
        }
        catch(error){
            set_loading(false)
            console.log(error)
        }
    }

    if(width < 750){
        return(
            <div style={{paddingTop: "40px", backgroundColor: number_six_style[0].backgroundColor, 
                fontFamily: number_six_style[0].fontFamily, color: number_six_style[0].color, fontSize: number_six_style[0].fontSize,
                fontWeight: number_six_style[0].fontWeight,
                fontStyle: number_six_style[0].fontStyle,
                letterSpacing: number_six_style[0].letterSpacing,
                height: "100vh"
            }}>
                <Header/>
                <Container style={{marginTop: "20px"}}>
                    <h1 style={{textAlign: "left", fontWeight: "bold"}}>TailorAI</h1>
                    <p style={{textAlign: "left"}}>Personalised Fashion Search Engine</p>
                    
                    <hr></hr>
                    <Row style={{marginTop: "20px"}}>
                        <Col>
                        
                            {step === 1 ?
                                <div className={step === 1 ? 'fade-in-right show' : 'fade-out-left'}>
                                    <h5>Step 1 of 2</h5>
                                    <h3 style={{fontWeight: "bold"}}>Select 3 style categories you wear for the most</h3>
                                </div>
                                :
                                <div className={step === 2 ? 'fade-in-right show' : 'fade-out-left'}>
                                    <h5>Step 2 of 2</h5>
                                    <h3 style={{fontWeight: "bold"}}>Select your 3 favourite retailers</h3>
                                </div>
                            }
                        </Col>

                        <Col>
                        
                            <Container 
                                style={{
                                // "width": 0.85*width, "margin": "auto", 
                                "height": 0.7*height, "overflowY": "scroll",
                                    boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.1)", 
                                    padding: "5px"}}
                            >
                                <Row xl={1}lg={1} md={1} sm={1} xs={1}>
                                    {
                                        step === 1 ?
                                            <div>
                                            {
                                                gender_categories.map((item, index)=>{
                                                    return( 
                                                        <Col key={index}>
                                                            <h4 style={{textAlign: "center"}}>
                                                                {item["category"]}
                                                            </h4>

                                                            <img alt={index} 
                                                                src={item["image_url"]} 
                                                                style={{
                                                                    "maxHeight": 0.3*height, 
                                                                    "maxWidth": 0.8*width, 
                                                                    "marginBottom": "50px", 
                                                                    "borderStyle": selected_categories.length === 0 ? null : (selected_categories.includes(item.category) ? 'solid' : "none"),
                                                                    "borderColor": selected_categories.length === 0 ? null : (selected_categories.includes(item.category) ? 'blue' : null),
                                                                    "opacity": selected_categories.length === 0 ? null : (selected_categories.includes(item.category) ? 0.2 : 1)
                                                                }}
                                                                onClick={()=>{
                                                                    console.log("category: ", item.category)
                                                                    if(selected_categories.includes(item.category)){
                                                                        set_selected_categories(selected_categories.filter((category)=>{return category !== item.category}))
                                                                    }
                                                                    else{
                                                                        set_selected_categories([...selected_categories, item.category])
                                                                        console.log("Selected categories length: ", selected_categories)
                                                                    }
                                                                }} 
                                                            />
                                                        </Col>
                                                    )
                                                })
                                            }
                                        

                                            
                                            </div>
                                            
                                    
                                        :
                                        <div>
                                            {retailers.map((item, index)=>{
                                                return( 
                                                    <Col key={index}>
                                                        {/* <h4 style={{textAlign: "center"}}>{item["retailer"]}</h4> */}
                                                        <img alt={index} 
                                                            src={item["image_url"]} 
                                                            style={{
                                                                "maxHeight": 0.3*height, 
                                                                "maxWidth": 0.4*width, 
                                                                "marginBottom": "50px", 
                                                                "borderStyle": selected_retailers.length === 0 ? null : (selected_retailers.includes(item.retailer) ? 'solid' : "none"),
                                                                "borderColor": selected_retailers.length === 0 ? null : (selected_retailers.includes(item.retailer) ? 'blue' : null),
                                                                "opacity": selected_retailers.length === 0 ? null : (selected_retailers.includes(item.retailer) ? 0.2 : 1)
                                                            }}
                                                            onClick={()=>{
                                                                console.log("retailer: ", item.retailer)
                                                                if(selected_retailers.includes(item.retailer)){
                                                                    set_selected_retailers(selected_retailers.filter((retailer)=>{return retailer !== item.retailer}))
                                                                }
                                                                else{
                                                                    set_selected_retailers([...selected_retailers, item.retailer])
                                                                    console.log("Selected retailers length: ", selected_retailers)
                                                                }
                                                            }} 
                                                        />
                                                    </Col>
                                                )
                                            })}
                                        </div>

                                    }
                                
                                </Row>
                                
                            </Container>
                            {
                                ((step === 1 && selected_categories.length === 3) || (step === 2 && selected_retailers.length === 3)) && 
                                <button
                                style={{
                                    // "position": "fixed", "bottom": 0, "right": 0, 
                                    // "zIndex": 100,
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
                                        if(step === 2){
                                            retrieveRecommendations()
                                        }
                                        else{
                                            // props.unselectStylesInstructionCallback()
                                            // retrieveRecommendations()
                                            set_step(step+1)
                                            set_done_hovered(false)
                                        }
                                        
                                    }}
                                >
                                    Done
                                </button>
                            }
                        </Col>
                    </Row>
                    
                </Container>

            </div>
        )
    
    }
    else{
        return(
            <div style={{paddingTop: "50px", backgroundColor: number_six_style[0].backgroundColor, 
                fontFamily: number_six_style[0].fontFamily, color: number_six_style[0].color, fontSize: number_six_style[0].fontSize,
                fontWeight: number_six_style[0].fontWeight,
                fontStyle: number_six_style[0].fontStyle,
                letterSpacing: number_six_style[0].letterSpacing,
                height: "100vh"
            }}>
                <Header/>
                <Container style={{marginTop: "20px", backgroundColor: number_six_style[0].backgroundColor}}>
                    <h1 style={{textAlign: "left", fontWeight: "bold"}}>TailorAI</h1>
                    <p style={{textAlign: "left"}}>Personalised Fashion Search Engine</p>

                    <hr></hr>
                    <Row style={{marginTop: "20px"}}>
                        <Col>
                        
                            {step === 1 ?
                                <div>
                                    <h5>Step 1 of 2</h5>
                                    <h3 style={{fontWeight: "bold"}}>Select 3 style categories you wear for the most</h3>
                                </div>
                                :
                                <div>
                                    <h5>Step 2 of 2</h5>
                                    <h3 style={{fontWeight: "bold"}}>Select your 3 favourite retailers</h3>
                                </div>
                            }
                        </Col>

                        <Col>
                        
                            <Container 
                                style={{
                                // "width": 0.85*width, "margin": "auto", 
                                "height": 0.7*height, "overflowY": "scroll",
                                    boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.1)", 
                                    padding: "5px"}}
                            >
                                <Row xl={1}lg={1} md={1} sm={1} xs={1}>
                                    {
                                        step === 1 ?
                                            <div>
                                                {
                                                    gender_categories.map((item, index)=>{
                                                        return( 
                                                            <Col key={index}>
                                                                <Row>
                                                                    <Col>
                                                                        {item["category"]}
                                                                        <img alt={index} 
                                                                            src={item["image_url"]} 
                                                                            style={{
                                                                                "maxHeight": 0.3*height, 
                                                                                "maxWidth": 0.8*width, 
                                                                                "margin": "10px", 
                                                                                "borderStyle": selected_categories.length === 0 ? null : (selected_categories.includes(item.category) ? 'solid' : "none"),
                                                                                "borderColor": selected_categories.length === 0 ? null : (selected_categories.includes(item.category) ? 'blue' : null),
                                                                                "opacity": selected_categories.length === 0 ? null : (selected_categories.includes(item.category) ? 0.2 : 1)
                                                                            }}
                                                                            onClick={()=>{
                                                                                console.log("category: ", item.category)
                                                                                if(selected_categories.includes(item.category)){
                                                                                    set_selected_categories(selected_categories.filter((category)=>{return category !== item.category}))
                                                                                }
                                                                                else{
                                                                                    set_selected_categories([...selected_categories, item.category])
                                                                                    console.log("Selected categories length: ", selected_categories)
                                                                                }
                                                                            }} 
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                                <br/>
                                                                <br/>
                                                            </Col>
                                                        )
                                                    })
                                                }
                                            </div>
                                            
                                    
                                        :
                                        <div>
                                            {retailers.map((item, index)=>{
                                                return( 
                                                <Col key={index}>
                                                    <h4>{item["retailer"]}</h4>
                                                    <img alt={index} 
                                                        src={item["image_url"]} 
                                                        style={{
                                                            "maxHeight": 0.3*height, 
                                                            "maxWidth": 0.3*width, 
                                                            "margin": "10px", 
                                                            "borderStyle": selected_retailers.length === 0 ? null : (selected_retailers.includes(item.retailer) ? 'solid' : "none"),
                                                            "borderColor": selected_retailers.length === 0 ? null : (selected_retailers.includes(item.retailer) ? 'blue' : null),
                                                            "opacity": selected_retailers.length === 0 ? null : (selected_retailers.includes(item.retailer) ? 0.2 : 1)
                                                        }}
                                                        onClick={()=>{
                                                            console.log("retailer: ", item.retailer)
                                                            if(selected_retailers.includes(item.retailer)){
                                                                set_selected_retailers(selected_retailers.filter((retailer)=>{return retailer !== item.retailer}))
                                                            }
                                                            else{
                                                                set_selected_retailers([...selected_retailers, item.retailer])
                                                                console.log("Selected retailers length: ", selected_retailers)
                                                            }
                                                        }} 
                                                    />
                                                </Col>
                                                )
                                            })}

                                            
                                        </div>
                                    }
                                
                                </Row>
                                
                            </Container>
                            {
                                ((step === 1 && selected_categories.length === 3) || (step === 2 && selected_retailers.length === 3)) && 
                                <button
                                style={{
                                    // "position": "fixed", "bottom": 0, "right": 0, 
                                    // "zIndex": 100,
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
                                        if(step === 2){
                                            retrieveRecommendations()
                                        }
                                        else{
                                            // props.unselectStylesInstructionCallback()
                                            // retrieveRecommendations()
                                            set_step(step+1)
                                            set_done_hovered(false)
                                        }
                                        
                                
                                        
                                    }}
                                >
                                    Done
                                </button>
                            }
                        </Col>
                    </Row>
                    
                </Container>
            
            </div>
        )
    }

}

export default UserOnboarding