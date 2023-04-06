import {React, useEffect, useState, useRef} from "react";
import { Form, Button, Row, Col, Container, Modal, Spinner, Dropdown, DropdownButton, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useWindowSize from "../hooks/useWindow";
import { mens_style_categories } from "../data/men_style_categories";
import { womens_style_categories } from "../data/women_style_categories";
import { db } from "../config";

function RecommendationResults(props){
    const location = useLocation();

    const width = useWindowSize().width
    const height = useWindowSize().height
    const [recommendation_results, set_recommendation_results] = useState([])
    const [preview, set_preview] = useState(false)
    const [preview_item, set_preview_item] = useState(null)
    const [categories, set_categories] = useState(null)
    const [gender, set_gender] = useState(null)

    const [sign_in_prompt, set_sign_in_prompt] = useState(false)
    const [already_seen_doc_id, set_already_seen_doc_id] = useState(null)
    const [load_more_count, set_load_more_count] = useState(0)
    const [sign_up_prompt, set_sign_up_prompt] = useState(false)
    const [sign_up_complete, set_sign_up_complete] = useState(false)
    const inputRef = useRef(null)

    const [scrollPosition, setScrollPosition] = useState(0);
    const [loading, set_loading] = useState(false)

    

    
    const navigate = useNavigate()


    useEffect(()=>{
        if(location.state === undefined || location.state === null){
            navigate("/")
        }
        else{
            console.log("location state is: ", location.state)
            console.log("categories: ", location.state.categories)           
 
            set_recommendation_results(location.state.data)
            const categories_state = location.state.categories
            set_categories(categories_state)
            set_gender(location.state.gender)
            const already_seen_doc = location.state.already_seen_doc_id
            set_already_seen_doc_id(already_seen_doc)
            console.log("state data: ", location.state.data, "categories: ", categories)           
            // window.scrollTo(0, scrollPosition);
            // console.log("scrolled to: ", scrollPosition)

        }
        // if(user is logged in){
            //  get the already seen doc id
            // get the recommendations
        // }
        // else{
            // do something with props.location.state.data
            
        //}
        
    }, [])


    function getMoreRecommendations(){
        let clothing_gender;
        if(gender === "Women"){
            clothing_gender = "womens_clothing"
        }
        else{
            clothing_gender = "mens_clothing"
        }
        // set_recommendation_results(false)
        set_loading(true)
        console.log("already_seen_doc_id: ", already_seen_doc_id)
        console.log("categories: ", categories)
        console.log("clothing_gender: ", clothing_gender)
        axios.post("https://us-central1-retail-assistant-demo.cloudfunctions.net/getRecommendationsUsingImageWarmStartNotLoggedIn", {
            "categories": categories,
            "collection": clothing_gender,
            "already_seen_doc_id": already_seen_doc_id
        }).then((response)=>{
            const results = response.data
            console.log("results: ", results)
            let temp = recommendation_results

            let i = 0
            for(i=0; i<results.result.length; i++){
                temp.push(results.result[i])
                // set_recommendation_results([...recommendation_results, results.result[i]])
                if(i === results.result.length - 1){
                    set_recommendation_results(temp)
                    set_loading(false)
                }
            }
            window.scrollTo(0, window.scrollY + 1000);
            
            // do something with these results
            // take copy of the recommendations results and append then update
            // append to recommendation results set_recommendation_results(response.data)
            // make loading blur not cover the whole screen
        }).catch((error)=>{
            console.log(error)
            window.alert("Error retrieving recommendations, please try again later")
        })
    }
    

    return(
        <div>
            <h1>Recommendation Results</h1>
            
            {loading && 
                <div className='center'
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000

                    }}
                >
                    {console.log("got to spinner")}
                    <Spinner animation="border"/>
                    <br/>
                    <p>Loading Recommendations</p>
                </div>
            }

            <div style={{opacity: (loading ? 0.2 : 1)}}>
                <Button 
                    style={{"margin": "5px", "position": "fixed", "top": "5%", "left": "2%"}} 
                    onClick={()=>{
                        // navigate("/")
                        set_sign_in_prompt(true)
                    }}
                >
                    Back
                </Button>
                <br/>
                <br/>
                <Container style={{"width": 0.8*width, "margin": "auto"}}>
                    <Row xl={4}lg={4} md={3} sm={3} xs={2}>
                    {recommendation_results.map((item, index)=>{
                        return( 
                        <Col key={index}>
                            <Link 
                                onClick={()=>{set_preview(true)
                                    // retrieve the category it belongs to
                                    // update the categories array in the state
                                    let categories_update = categories
                                    let i  = 0;
                                    for (i = 0; i < categories.length; i++){
                                        if(categories[i].category === item.category){
                                            categories_update[i].image_url = item.recommendation.document["product_image_url"]
                                            set_categories(categories_update)
                                            console.log("image_url:", categories_update[i].image_url)
                                            break;
                                        }
                                    }
                                    // the category equal to this value/category,
                                    // should be updated to have this image as the 
                                    // new image_url
                                    set_preview_item(item.recommendation.document)
                                }} 
                                
                                to="#"
                                // to={item.document.retailer_url}
                            >
                                <img alt={index} src={item.recommendation.document["product_image_url"]} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                                <label>{item.recommendation.document["description"]}</label>
                                <label>£{item.recommendation.document["price"]}</label>
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
                            <br/>
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

                <Button
                    style={{"position": "fixed", "bottom": 0, "left": 0, "zIndex": 100}}
                    onClick={()=>{
                        navigate("/")
                    }}
                >
                    Reset Recommendations
                </Button>

                <Button
                    style={{"position": "fixed", "bottom": 0, "right": 0, "zIndex": 100}}
                    onClick={()=>{
                        if(load_more_count === 2){
                            // window.alert("You have reached the maximum number of recommendations for users without an account, please sign up to see more recommendations")
                            // return
                            set_sign_in_prompt(true)
                            set_sign_up_prompt(true)
                            console.log("sign_in_prompt: ", sign_in_prompt)
                        }else{
                            console.log("scroll position: ", window.pageYOffset.toString())
                            setScrollPosition(window.pageYOffset)
                            set_load_more_count(load_more_count + 1)
                            //send available products for picking
                            //and selected products to backend and retrieve results 
                            getMoreRecommendations()
                        }
                        
                    }}
                >
                    Load More
                </Button>

                {sign_in_prompt && 
                    <Modal show 
                        onHide={()=>{
                            set_sign_in_prompt(false)
                            set_sign_up_prompt(false)
                        }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Sign up</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{textAlign: "center"}}>
                            {!sign_up_prompt && <div>
                                <p> 
                                    If you go back now the model will not be able to learn from your preferences
                                    and show you results results tailored to you.
                                </p>
                                <p style={{fontWeight: "bold"}}>
                                    If you would like your preferences to be saved by the model, 
                                    for tailored recommendations the next time you visit this platform
                                    please sign in or create an account.
                                </p>
                            </div>}

                            {sign_up_prompt ? 
                                sign_up_complete ?
                                    <div>
                                        <Alert variant="success">
                                            <Alert.Heading>Sign up successful!</Alert.Heading>
                                            <p>
                                                You will be notified when user accounts for TailorAI are available
                                            </p>
                                        </Alert>
                                    </div>
                                :
                                    <div>
                                    <Form onSubmit={(e)=>{e.preventDefault()}}>
                                        <Form.Group controlId="formBasicEmail">
                                            <h4>Sign up here to be notified when user accounts for TailorAI are available</h4>
                                            {/* <Form.Label>Email address</Form.Label> */}
                                            <Form.Control ref={inputRef} type="email" placeholder="Enter email" />
                                        </Form.Group>
                                    </Form>
                                </div>
                                
                            :
                            <></>}
                            
                            
                        </Modal.Body>
                        <Modal.Footer>
                            {
                                !sign_up_complete &&
                                <div>
                                    <Button variant="primary" 
                                        onClick={()=>{
                                            if(sign_up_prompt){
                                                if(inputRef.current.value === ""){
                                                    window.alert("Please enter an email address")
                                                    return
                                                }
                                                else if(!inputRef.current.value.includes("@")){
                                                    window.alert("Please enter a valid email address")
                                                    return
                                                }
                                                else{
                                                    db.collection("users").add({
                                                        "email": inputRef.current.value
                                                    }).then((docRef) => { 
                                                        set_sign_up_complete(true)
                                                    })
                                                }
                                                
                                                
                                            }
                                            else{
                                                set_sign_up_prompt(true)
                                            }
                                        }}
                                        style={{marginRight: "10px"}}
                                        >
                                        Sign Up
                                    </Button>

                                

                                    <Button variant="secondary"
                                        onClick={()=>{
                                            if(sign_up_prompt){
                                                set_sign_up_prompt(false)
                                                set_sign_in_prompt(false)
                                            }else{
                                                set_sign_in_prompt(false)
                                                set_sign_up_prompt(false)
                                                navigate("/")
                                            }
                                            

                                        }}
                                        style={{position: "absolute", left: "10px"}}
                                    >
                                        {sign_up_prompt ? 'Cancel' : 'Go Back Anyway'}
                                    </Button>
                                </div>
                            }
                            {
                                sign_up_complete &&
                                <div style={{margin: "10px"}}>
                                    <Button variant="primary"
                                        onClick={()=>{
                                            // navigate("/")
                                            set_sign_in_prompt(false)
                                            set_sign_up_prompt(false)
                                            set_sign_up_complete(false)
                                            
                                        }
                                    }>
                                        Done
                                    </Button>
                                </div>
                            }
                        </Modal.Footer>
                    </Modal>}
            </div>
                
                    
            
            {/* Once gender selected choose categories */}
            {/* Once category selected take them to a non-loggedin recommender page to choose images */}
            {/* Once images selected show non-logged in recommendation component */}
            {/* Users should be able to reset their styles */}
            {/* User should be able to go back to home page */}
            {/* Users should be able to log in to save their styles etc */}
        </div>
        
    )
}

export default RecommendationResults