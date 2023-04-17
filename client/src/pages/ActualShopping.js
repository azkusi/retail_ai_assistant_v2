import {React, useEffect, useState, useRef} from "react";
import { Form, Button, Row, Col, Container, Modal, Spinner, Dropdown, DropdownButton, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useWindowSize from "../hooks/useWindow";
import { mens_style_categories } from "../data/men_style_categories";
import { womens_style_categories } from "../data/women_style_categories";
import { db } from "../config";
import { number_six_style } from "../data/number_six";

function ActualShopping(props){
    const location = useLocation();

    const width = useWindowSize().width
    const height = useWindowSize().height
    const [recommendation_results, set_recommendation_results] = useState(props.data.data)
    const [preview, set_preview] = useState(false)
    const [preview_item, set_preview_item] = useState(null)
    const [categories, set_categories] = useState(props.data.categories)
    const [gender, set_gender] = useState(props.data.gender)

    // const [sign_in_prompt, set_sign_in_prompt] = useState(false)
    const [already_seen_doc_id, set_already_seen_doc_id] = useState(props.data.already_seen_doc_id)
    const [load_more_count, set_load_more_count] = useState(0)
    const [feedback_prompt, set_feedback_prompt] = useState(false)
    const [feedback_complete, set_feedback_complete] = useState(false)
    const inputRef = useRef(null)

    const [scrollPosition, setScrollPosition] = useState(0);
    const [loading, set_loading] = useState(false)

    const [reset_hovered, set_reset_hovered] = useState(false)
    const [load_hovered, set_load_hovered] = useState(false)
    const [view_retailer_hovered, set_view_retailer_hovered] = useState(false)
    const [signup_hovered, set_signup_hovered] = useState(false)
    const [cancel_signup_hovered, set_cancel_signup_hovered] = useState(false)
    const [done_signup_hovered, set_done_signup_hovered] = useState(false)


    const navigate = useNavigate()

    // const [hostname, set_hostname] = useState("tailorai")

    const [answer1, setAnswer1] = useState(null);
    const [answer2, setAnswer2] = useState(null);
    const [answer3, setAnswer3] = useState(null);
    const [email, setEmail] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }


    const handleAnswer1 = (e) => {
        setAnswer1(e.target.value);
    };

    const handleAnswer2 = (e) => {
        setAnswer2(e.target.value);
    };

    const handleAnswer3 = (e) => {
        setAnswer3(e.target.value);
    };

    function handleSubmit(e){
        e.preventDefault();
        console.log(`Answer 1: ${answer1}`);
        console.log(`Answer 2: ${answer2}`);
        console.log(`Answer 3: ${answer3}`);

        if(answer3 === "yes"){
            if(email === null){
                window.alert("Please enter your email address")
            }
            else if( (email.replace(" ", "") === "") || (!email.includes("@")) ){
                window.alert("Please enter your email address")

            }
        } 
        db.collection("feedback").add({
            "answer1": answer1,
            "answer2": answer2,
            "answer3": answer3,
            "email": email,
            "timestamp": new Date()
        }).then((docRef)=>{
            console.log("docRef: ", docRef)
            set_feedback_complete(true)
        }
        ).catch((error)=>{
            console.log("error: ", error)
        })
    };



    useEffect(()=>{
        
        setTimeout(()=>{
            set_feedback_prompt(true)
        }, 60000)
        
    }, [])

    function getMoreRecommendations(){
        let clothing_gender;
        if(gender === "Women"){
            clothing_gender = "womens_clothing"
        }
        else{
            clothing_gender = "number_six_london"
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
            window.alert("Maximum recommendations reached, please try again later")
            set_loading(false)
        })
    }
    

    return(
        <div style={{ 
                        color: number_six_style[0].color, 
                        fontFamily: number_six_style[0].fontFamily, 
                        backgroundColor: number_six_style[0].backgroundColor,
                        height: height,
            }}
        >
            {/* {hostname === "numbersixlondon" ? <h1 style={{fontWeight: "bold", letterSpacing: number_six_style[0].letterSpacing}}>number six</h1> : <h1>Recommendation Results</h1>} */}
            
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
                        zIndex: 1000,
                        

                    }}
                >
                    {console.log("got to spinner")}
                    <Spinner animation="border"/>
                    <br/>
                    <p>Loading Recommendations</p>
                </div>
            }

            {recommendation_results && <div style={{opacity: (loading ? 0.2 : 1)}}>
                {/* <button 
                    className="btn btn-outline-secondary"
                    style={{
                        "margin": "5px", "position": "fixed", "top": "5%", "left": "0%",
                        backgroundColor: "transparent", 
                        border: "none", 
                        color: "grey", 
                        padding: "0.5rem 1rem"
                    }} 
                    onClick={()=>{
                        if(feedback_complete){
                            navigate("/")
                        }
                        else{
                            set_feedback_prompt(true)
                        }
                        
                    }}
                >
                    Back
                </button>
                <br/>
                <br/> */}
                <Container style={{"width": 0.8*width, "margin": "auto"}}>
                    <Row gutter={[30, 16]} xl={4}lg={4} md={3} sm={3} xs={2}>
                    {recommendation_results.map((item, index)=>{
                        return( 
                        <Col key={index}
                            style={{ marginBottom: "40px" }}
                        >
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
                                style={{"textDecoration": "none"}}
                            >
                                <img alt={index} src={item.recommendation.document["product_image_url"]} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                                <p style={{
                                            fontWeight: "bold", 
                                            color: number_six_style[0].color,
                                            fontSize: "13.5px",
                                        }}
                                >
                                    {item.recommendation.document["description"]}
                                </p>
                                <label style={{color: number_six_style[0].color}}>£{item.recommendation.document["price"]}</label>
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
                            <p 
                                style={{
                                        fontWeight: "bold", 
                                        color: number_six_style[0].color,
                                        fontSize: "13.5px",
                                    }}
                            >
                                    {preview_item["description"]}
                            </p>
                            {/* <br/> */}
                            <label style={{color: number_six_style[0].color}}>£{preview_item["price"]}</label>
                        </Modal.Body>
                        <Modal.Footer>
                            {/* <Button variant="secondary" onClick={handleClose}>
                                Add to Saved
                            </Button> */}
                            <button 
                                style={{
                                    border: 'none',
                                    backgroundColor: view_retailer_hovered ? 'white' : '#1a3c6c',
                                    color: view_retailer_hovered ? '#1a3c6c' : 'white',
                                    padding: '10px 20px',
                                    borderRadius: '0',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={() => set_view_retailer_hovered(true)}
                                onMouseLeave={() => set_view_retailer_hovered(false)}
                             
                                onClick={()=>{
                                    // set_preview(false)
                                    window.open(preview_item["product_url"], "_blank")
                                }}>
                                View on Retailer's Site
                                {/* View on {item.document.retailer_name} */}
                            </button>
                        </Modal.Footer>
                    </Modal>}
                    

                    
                    
                </Container>

                
                <button
                    
                    onMouseEnter={() => set_reset_hovered(true)}
                    onMouseLeave={() => set_reset_hovered(false)}
                    style={{
                        "position": "fixed", "bottom": 0, "left": 0, "zIndex": 100,
                        border: 'none',
                        backgroundColor: reset_hovered ? 'white' : '#1a3c6c',
                        color: reset_hovered ? '#1a3c6c' : 'white',
                        padding: '10px 20px',
                        borderRadius: '0',
                        cursor: 'pointer',
                }}
                    onClick={()=>{
                        navigate("/")
                    }}
                >
                    Reset Recommendations
                </button>

                <button
                    onMouseEnter={() => set_load_hovered(true)}
                    onMouseLeave={() => set_load_hovered(false)}
                    style={{"position": "fixed", "bottom": 0, "right": 0, "zIndex": 100,
                        border: 'none',
                        backgroundColor: load_hovered ? 'white' : '#1a3c6c',
                        color: load_hovered ? '#1a3c6c' : 'white',
                        padding: '10px 20px',
                        borderRadius: '0',
                        cursor: 'pointer',
                    }}
                    onClick={()=>{
                        if(load_more_count === 8){
                            window.alert("You have reached the maximum number of recommendations")
                            return
                            // set_sign_in_prompt(true)
                            // set_sign_up_prompt(true)
                            // console.log("sign_in_prompt: ", sign_in_prompt)
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
                </button>

                {feedback_prompt && 
                    <Modal show 
                        onHide={()=>{
                            set_feedback_prompt(false)
                        }}
                        style={{borderRadius: '0.25rem',
                        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
                      }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Give Your Feedback</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                            {!feedback_complete ? 
                                <Form onSubmit={(e)=>{handleSubmit(e)}}>
                                    
                                        <Form.Group>
                                        <Form.Label>Were you shown the type/styles of products you like?</Form.Label>
                                            <Form.Check className="align-items-left"
                                            type="radio"
                                            label="Yes"
                                            name="question1"
                                            id="question1Yes"
                                            value="yes"
                                            onChange={handleAnswer1}
                                            />
                                            <Form.Check
                                            type="radio"
                                            label="No"
                                            name="question1"
                                            id="question1No"
                                            value="no"
                                            onChange={handleAnswer1}
                                            />
                                        </Form.Group>

                                        <br/>

                                        <Form.Group className="align-items-left">
                                        <Form.Label>Did you find a particular item you'd like to buy?</Form.Label>
                                            <Form.Check 
                                            type="radio"
                                            label="Yes"
                                            name="question2"
                                            id="question2Yes"
                                            value="yes"
                                            onChange={handleAnswer2}
                                            />
                                            <Form.Check
                                            type="radio"
                                            label="No"
                                            name="question2"
                                            id="question2No"
                                            value="no"
                                            onChange={handleAnswer2}
                                            />
                                        </Form.Group>

                                        <br/>

                                        <Form.Group className="align-items-left">
                                        <Form.Label>Would you like to sign up to receive outfit recommendations from <span style={{fontWeight: "bold"}}>numbersix</span> & other retailers you may like?</Form.Label>
                                            <Form.Check 
                                            type="radio"
                                            label="Yes"
                                            name="question3"
                                            id="question3Yes"
                                            value="yes"
                                            onChange={handleAnswer3}
                                            />
                                            <Form.Check
                                            type="radio"
                                            label="No"
                                            name="question3"
                                            id="question3No"
                                            value="no"
                                            onChange={handleAnswer3}
                                            />
                                            {answer3 === "yes" && 
                                                <div>
                                                    <label htmlFor="emailInput">Email address:</label>
                                                    <input
                                                        id="emailInput"
                                                        type="email"
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                    />
                                                </div>
                                            }
                                        </Form.Group>
                                    {/* <Button type="submit">Submit</Button> */}
                                    </Form>
                            :
 
                                <div>
                                    <Alert variant="success">
                                        <Alert.Heading>Thanks for your feedback!</Alert.Heading>
                                        {/* <p>
                                            You will be notified when user accounts for TailorAI are available
                                        </p> */}
                                    </Alert>
                                </div>
                            }
                            
                            
                        </Modal.Body>
                        <Modal.Footer>
                            {
                                !feedback_complete &&
                                <div>
                                    <button  
                                        onMouseEnter={() => set_signup_hovered(true)}
                                        onMouseLeave={() => set_signup_hovered(false)}
                                        style={{marginRight: "10px",
                                            border: 'none',
                                            backgroundColor: signup_hovered ? 'white' : '#1a3c6c',
                                            color: signup_hovered ? '#1a3c6c' : 'white',
                                            padding: '10px 20px',
                                            borderRadius: '0',
                                            cursor: 'pointer',
                                        }}
                                        onClick={()=>{
                                            
                                            if(answer1 && answer2){
                                                db.collection("feedback").add({
                                                    "answer1": answer1,
                                                    "answer2": answer2
                                                }).then((docRef) => {
                                                    set_feedback_complete(true)
                                                })
                                            }
                                            else{
                                                window.alert("Please answer both questions before submitting")
                                            }
                                                
                                                
                                            
                                            
                                        }}
                                        >
                                        Submit
                                    </button>

                                

                                    <button 
                                        onMouseEnter={() => set_cancel_signup_hovered(true)}
                                        onMouseLeave={() => set_cancel_signup_hovered(false)}
                                        style={{position: "absolute", left: "10px",
                                            border: 'none',
                                            backgroundColor: cancel_signup_hovered ? '#1a3c6c' : 'white',
                                            color: cancel_signup_hovered ? 'white' : '#1a3c6c',
                                            padding: '10px 20px',
                                            borderRadius: '0',
                                            cursor: 'pointer',
                                        }}
                                        onClick={()=>{
                                            
                                            set_feedback_prompt(false)
                                            // navigate("/styleinitialiser")
                                            
                                            

                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            }
                            {
                                feedback_complete &&
                                <div style={{margin: "10px"}}>
                                    <button 
                                        onMouseEnter={() => set_done_signup_hovered(true)}
                                        onMouseLeave={() => set_done_signup_hovered(false)}
                                        style={{
                                            border: 'none',
                                            backgroundColor: done_signup_hovered ? 'white' : '#1a3c6c',
                                            color: done_signup_hovered ? '#1a3c6c' : 'white',
                                            padding: '10px 20px',
                                            borderRadius: '0',
                                            cursor: 'pointer',
                                        }}
                                        onClick={()=>{
                                            // navigate("/styleinitialiser")
                                            set_feedback_prompt(false)
                                            // set_feedback_complete(true)
                                            
                                        }
                                    }>
                                        Done
                                    </button>
                                </div>
                            }
                        </Modal.Footer>
                    </Modal>}
            </div>}
                
                    
            
            {/* Once gender selected choose categories */}
            {/* Once category selected take them to a non-loggedin recommender page to choose images */}
            {/* Once images selected show non-logged in recommendation component */}
            {/* Users should be able to reset their styles */}
            {/* User should be able to go back to home page */}
            {/* Users should be able to log in to save their styles etc */}
        </div>
        
    )
}

export default ActualShopping