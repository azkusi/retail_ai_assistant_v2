import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import axios from 'axios'
import Header from "../components/Header";
import { Modal, Spinner, Container, Row, Col, Button } from "react-bootstrap";
import { number_six_style } from "../data/number_six";
import useWindowSize from "../hooks/useWindow";
import { db } from "../config";
import { auth } from "../config";




function RetailerSeeMoreRecommendations(){
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()
    const [loading, set_loading] = useState(false)
    const [recommendation_results, set_recommendation_results] = useState(null)
    const [already_seen, set_already_seen] = useState([])
    const [retailer_recommendations, set_retailer_recommendations] = useState(null)
    const [preview, set_preview] = useState(false)
    const [preview_item, set_preview_item] = useState(false)
    const [user, set_user] = useState(null)
    const [view_retailer_hovered, set_view_retailer_hovered] = useState(false)
    const {width, height} = useWindowSize()

    const [retailer, set_retailer] = useState(null)
    const [categories, set_categories] = useState(null)

    const [load_hovered, set_load_hovered] = useState(false)
    const [reset_hovered, set_reset_hovered] = useState(false)

    const [load_more_count, set_load_more_count] = useState(0)
    const[scrollPosition, setScrollPosition] = useState()

    const [more, set_more] = useState(false)
    const refs = useRef({}) 

    


    useEffect(()=>{
        if(id && location.state){
            retrieveRetailerRecommendations(location.state.categories, location.state.retailer, already_seen)
            console.log("location state: ", location.state)
        }
        else{
            
            navigate("/")
        }
            
    },[])


    const handleScroll = (div, scrollOffset) => {
        // refs.current[div].scrollIntoView({ behavior: 'smooth' });
        refs.current[div].scrollLeft += scrollOffset;

        // scrollRef.current.scrollLeft += scrollOffset;
    };

    function retrieveRetailerRecommendations(selected_categories, selected_retailers, already_seen){
        //send to python server where will loop through
        //3 retailers and 3 categories and return 9 recommendations
        set_retailer(location.state.retailer)
        set_categories(location.state.categories)

        axios.post("https://us-central1-retail-assistant-demo.cloudfunctions.net/getMoreRetailerRecommendations", {
            "categories": selected_categories,
            "retailers": selected_retailers,
            "already_seen": already_seen
        }).then((response)=>{
            console.log("retrieved more retailer recommendations:", response.data)

            if(Object.keys(response.data.result).length === 0){
                console.log("no recommendations")
                set_loading(false)
                return null
            }
            
            const recommendation_sets = response.data.result.map((retailer_array_of_recommendation_objects)=>{
                console.log("recommendation object: ", retailer_array_of_recommendation_objects)
                return (
                    retailer_array_of_recommendation_objects.map((retailer_recommendation_object)=>{
                        return (
                            {retailer: retailer_recommendation_object["retailer"], category: retailer_recommendation_object["category"], recommendations: retailer_recommendation_object.recommendations.filter((recommendation, index)=>{
                                const firstIndex = retailer_recommendation_object.recommendations.findIndex(item => item.document.description === recommendation.document.description);
                                return firstIndex === index;
                            })}
                        )
                        

                    })

                )
            })
            // const temp_recommendation_sets = recommendation_sets
            console.log("Retailer Recommendations sets: ", recommendation_sets)   
            if(retailer_recommendations === null){

            
                let i = 0;
                let all_retailers_recommendations_array = []

                for(i = 0; i < recommendation_sets.length; i++){
                    console.log("i:", i)
                    let retailer_recommendations_array = []
                    let retailer_recommendations_object = {}    
                    let j = 0;

                    retailer_recommendations_object["retailer"] = recommendation_sets[i][j].retailer
                    
                    for(j = 0; j < recommendation_sets[i].length; j++){
                        retailer_recommendations_array = [...retailer_recommendations_array, ...recommendation_sets[i][j].recommendations.filter((item)=>{
                            return !(already_seen.includes(item.document.description))
                        })]
                        retailer_recommendations_object["recommendations"] = retailer_recommendations_array
                    }
                    if(j >= recommendation_sets[i].length){
                        console.log("HELLO")
                        all_retailers_recommendations_array.push(retailer_recommendations_object)
                    }
                }
                console.log("i at end:" , i)
                if(i >= recommendation_sets.length){
                    console.log("HI")
                    set_loading(false)
                    set_retailer_recommendations(all_retailers_recommendations_array)
                    console.log("all retailers array: ", all_retailers_recommendations_array)
                }
            }
            else{
                let i = 0;
                let all_retailers_recommendations_array = retailer_recommendations

                for(i = 0; i < all_retailers_recommendations_array.length; i++){
                    let j = 0;
                    let retailer_recommendations_array = all_retailers_recommendations_array[i].recommendations
                    let retailer_recommendations_object = all_retailers_recommendations_array[i]
                    
                    for(j = 0; j < recommendation_sets.length; j++){
                        if(recommendation_sets[j][0].retailer === all_retailers_recommendations_array[i].retailer){
                            let k = 0;
                            for(k; k < recommendation_sets[j].length; k++){
                                retailer_recommendations_array = [...retailer_recommendations_array, ...recommendation_sets[j][k].recommendations.filter((item)=>{
                                    return !(already_seen.includes(item.document.description))
                                })]
                                retailer_recommendations_object["recommendations"] = retailer_recommendations_array
                                all_retailers_recommendations_array[i] = retailer_recommendations_object
                            }
                            // if(k >= recommendation_sets[j].length){
                            //     all_retailers_recommendations_array.push(retailer_recommendations_object)
                            // }
                        }
                    }
                }
                console.log("i at end:" , i)
                if(i >= recommendation_sets.length){
                    console.log("HI")
                    set_loading(false)
                    set_retailer_recommendations(all_retailers_recommendations_array)
                    console.log("all retailers array: ", all_retailers_recommendations_array)
                }
            }
            
            
        }).catch((error)=>{
            set_loading(false)
            console.log(error)
            window.alert("There was an issue retrieving your recommendations, please try again later")
        })
 
    }



    function getMoreRecommendations(){

        axios.post("https://us-central1-retail-assistant-demo.cloudfunctions.net/getMoreRetailerRecommendations", {
            "categories": categories,
            "retailers": retailer,
            "already_seen": already_seen
        }).then((response)=>{
            console.log("retrieved more retailer recommendations:", response.data)

            if(Object.keys(response.data.result).length === 0){
                console.log("no recommendations")
                set_loading(false)
                return null
            }
            
            const recommendation_sets = response.data.result.map((retailer_array_of_recommendation_objects)=>{
                console.log("recommendation object: ", retailer_array_of_recommendation_objects)
                return (
                    retailer_array_of_recommendation_objects.map((retailer_recommendation_object)=>{
                        return (
                            {retailer: retailer_recommendation_object["retailer"], category: retailer_recommendation_object["category"], recommendations: retailer_recommendation_object.recommendations.filter((recommendation, index)=>{
                                const firstIndex = retailer_recommendation_object.recommendations.findIndex(item => item.document.description === recommendation.document.description);
                                return firstIndex === index;
                            })}
                        )
                        

                    })

                )
            })
            // const temp_recommendation_sets = recommendation_sets
            console.log("Retailer Recommendations sets: ", recommendation_sets)   
            if(retailer_recommendations === null){

            
                let i = 0;
                let all_retailers_recommendations_array = []

                for(i = 0; i < recommendation_sets.length; i++){
                    console.log("i:", i)
                    let retailer_recommendations_array = []
                    let retailer_recommendations_object = {}    
                    let j = 0;

                    retailer_recommendations_object["retailer"] = recommendation_sets[i][j].retailer
                    
                    for(j = 0; j < recommendation_sets[i].length; j++){
                        retailer_recommendations_array = [...retailer_recommendations_array, ...recommendation_sets[i][j].recommendations.filter((item)=>{
                            return !(already_seen.includes(item.document.description))
                        })]
                        retailer_recommendations_object["recommendations"] = retailer_recommendations_array
                    }
                    if(j >= recommendation_sets[i].length){
                        console.log("HELLO")
                        all_retailers_recommendations_array.push(retailer_recommendations_object)
                    }
                }
                console.log("i at end:" , i)
                if(i >= recommendation_sets.length){
                    console.log("HI")
                    set_loading(false)
                    set_retailer_recommendations(all_retailers_recommendations_array)
                    // setScrollPosition(scrollPosition + 200)
                    window.scrollBy(0, 200);
                    set_more(true)
                    console.log("all retailers array: ", all_retailers_recommendations_array)
                }
            }
            else{
                let i = 0;
                let all_retailers_recommendations_array = retailer_recommendations

                for(i = 0; i < all_retailers_recommendations_array.length; i++){
                    let j = 0;
                    let retailer_recommendations_array = all_retailers_recommendations_array[i].recommendations
                    let retailer_recommendations_object = all_retailers_recommendations_array[i]
                    
                    for(j = 0; j < recommendation_sets.length; j++){
                        if(recommendation_sets[j][0].retailer === all_retailers_recommendations_array[i].retailer){
                            let k = 0;
                            for(k; k < recommendation_sets[j].length; k++){
                                retailer_recommendations_array = [...retailer_recommendations_array, ...recommendation_sets[j][k].recommendations.filter((item)=>{
                                    return !(already_seen.includes(item.document.description))
                                })]
                                retailer_recommendations_object["recommendations"] = retailer_recommendations_array
                                all_retailers_recommendations_array[i] = retailer_recommendations_object
                            }
                            // if(k >= recommendation_sets[j].length){
                            //     all_retailers_recommendations_array.push(retailer_recommendations_object)
                            // }
                        }
                    }
                }
                console.log("i at end:" , i)
                if(i >= recommendation_sets.length){
                    console.log("HI")
                    set_loading(false)
                    set_retailer_recommendations(all_retailers_recommendations_array)
                    console.log("all retailers array: ", all_retailers_recommendations_array)
                    // setScrollPosition(scrollPosition + 200)
                    window.scrollBy(0, 200);
                    set_more(true)
                }
            }
            
            
        }).catch((error)=>{
            set_loading(false)
            console.log(error)
            window.alert("There was an issue retrieving your recommendations, please try again later")
        })
 
    }

    


    return(
        <div style={{paddingTop: "100px", backgroundColor: number_six_style[0].backgroundColor, 
        fontFamily: number_six_style[0].fontFamily, color: number_six_style[0].color, fontSize: number_six_style[0].fontSize,
        fontWeight: number_six_style[0].fontWeight,
        fontStyle: number_six_style[0].fontStyle,
        letterSpacing: number_six_style[0].letterSpacing,
        height: "100%",
    
        }}>
            <Header/>
            {(loading) ?
                <div style={{
                    position: 'fixed', display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: number_six_style[0].backgroundColor,
                    height:"100%",
                    width: "100%"

                }}>
                    <Spinner animation="border"/>
                    <h5>Loading more recommendations</h5>
                </div>
                :
                (!retailer_recommendations) ?
                    <div style={{
                    position: 'fixed', display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: number_six_style[0].backgroundColor,
                    width: "100%",
                    height:"100%"
                    }}>
                        <Spinner animation="border"/>
                        <h5>Loading your recommendations</h5>
                    </div>
                    :
                    <></>

            }
            
            {retailer_recommendations && <div style={{opacity: loading ? 0.2 : 1}}>
                
            
                    <div style={{backgroundColor: number_six_style[0].backgroundColor}}>

                            
                        {retailer_recommendations.map((retailer_object, retailer_object_index) => (


                            // container
                            ((typeof(retailer_object.recommendations) !== "string") ? 
                                retailer_object.recommendations.length > 0
                                    ? 
                                <div key={retailer_object_index}>
                                    
                                    <h1>{retailer_object.retailer}</h1>


                                    <Container style={{"width": 0.8*width, "margin": "auto"}}>

                                        <Row gutter={[30, 16]} xl={4}lg={4} md={3} sm={3} xs={2}>
                                        {retailer_object.recommendations.map((item, index)=>{
                                            return( 
                                            <Col key={index}
                                                style={{ marginBottom: "40px" }}
                                            >
                                                <Link 
                                                    onClick={()=>{set_preview(true)
                                                        set_preview_item(item.document)
                                                    }} 
                                                    
                                                    to="#"
                                                    style={{"textDecoration": "none"}}
                                                >
                                                    <img alt={index} src={item.document["product_image_url"]} style={{"maxHeight": 0.3*height, "maxWidth": 0.3*width, "padding": "10px"}}/>
                                                    <p style={{
                                                                fontWeight: "bold", 
                                                                color: number_six_style[0].color,
                                                                fontSize: "13.5px",
                                                            }}
                                                    >
                                                        {item.document["description"]}
                                                    </p>
                                                    <label style={{color: number_six_style[0].color}}>£{item.document["price"]}</label>
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
                                                set_loading(true)
                                                console.log("scroll position: ", window.scrollY.toString())
                                                setScrollPosition(window.scrollY)
                                                set_load_more_count(load_more_count + 1)
                                                let i = 0;
                                                let temp_already_seen = already_seen
                                                for(i; i < retailer_recommendations[retailer_object_index].recommendations.length; i++){
                                                    if(! (temp_already_seen.includes(retailer_recommendations[retailer_object_index].recommendations[i].document.description))){
                                                        temp_already_seen.push(retailer_recommendations[retailer_object_index].recommendations[i].document.description)
                                                    }
                                                }
                                                //send available products for picking
                                                //and selected products to backend and retrieve results 
                                                getMoreRecommendations()
                                            }
                                            
                                        }}
                                    >
                                        Load More
                                    </button>
                                    <br/>
                                </div>
                                :
                                <div key={retailer_object_index}>
                                    <h1>{retailer_object.retailer}</h1>
                                    <h4>More recommendations coming soon</h4>
                                    <br/>
                                    <br/>
                                </div>
                                :
                                <div key={retailer_object_index}>
                                    <h1>{retailer_object.retailer}</h1>
                                    <h4>More recommendations coming soon</h4>
                                    <br/>
                                    <br/>
                                </div>
                            )

                                        
                        ))}
                        <br/>



                        {preview && <Modal show onHide={()=>{set_preview(false)}}>
                            <Modal.Header closeButton/>
                            <Modal.Body style={{textAlign: "center"}}>
                                <img alt={preview_item["description"]} src={preview_item["product_image_url"]} style={{"maxHeight": 0.5*height, "maxWidth": 0.5*width, "padding": "10px"}}/>
                                <br/>
                                <h5>{preview_item["retailer"]}</h5>
                                {("brand" in preview_item) && <h5>{preview["brand"]}</h5>}
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
                        </Modal>
                        }
                                    
                        
                    </div>
        
            </div>}
        </div>
    )
}



export default RetailerSeeMoreRecommendations;