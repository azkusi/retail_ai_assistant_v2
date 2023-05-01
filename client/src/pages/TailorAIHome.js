import {React ,useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../config';
import { Spinner, Row, Container, Col, Button, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { womens_style_categories } from '../data/women_style_categories';
import useWindowSize from '../hooks/useWindow';
import { number_six_style } from "../data/number_six";

import { auth } from '../config';
import TextSearch from '../components/TextSearch';
import Header from '../components/Header';



function TailorAI(props){

    const {height, width} = useWindowSize()

    const [loading, set_loading] = useState(false)
    const [selected_categories, set_selected_categories] = useState(null)
    const [selected_retailers, set_selected_retailers] = useState(null)
    const [already_seen, set_already_seen] = useState(null)
    const [last_seen_index, set_last_seen_index] = useState(15)

    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()

    const [retailer_recommendations, set_retailer_recommendations] = useState(null)
    const [category_recommendations, set_category_recommendations] = useState(null)

    const [preview, set_preview] = useState(false)
    const [preview_item, set_preview_item] = useState(null)
    const [view_retailer_hovered, set_view_retailer_hovered] = useState(false)

    const [click_right_count, set_click_right_count] = useState(0)
    const [load_more_count, set_load_more_count] = useState(1)

    const [user, set_user] = useState(null)



    const scrollRef = useRef(null)

    const refs = useRef({})
    




    const handleScroll = (div, scrollOffset) => {
        // refs.current[div].scrollIntoView({ behavior: 'smooth' });
        refs.current[div].scrollLeft += scrollOffset;

        // scrollRef.current.scrollLeft += scrollOffset;
    };

    

    const images = womens_style_categories

    function updateAlreadySeen(){
        db.collection("new_users").doc(user).get().then((doc)=>{
            const already_seen = doc.data().already_seen
            set_already_seen(already_seen)
        })
    }

    function retrieveRetailerRecommendations(selected_categories, selected_retailers, already_seen){
        //send to python server where will loop through
        //3 retailers and 3 categories and return 9 recommendations


        axios.post("https://us-central1-retail-assistant-demo.cloudfunctions.net/getRetailerRecommendations", {
            "categories": selected_categories,
            "retailers": selected_retailers,
            "already_seen": already_seen
        }).then((response)=>{
            console.log("retrieved cold start recommendations:", response.data)

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


    function retrieveCategoryRecommendations(selected_categories, selected_retailers, already_seen){
        //send to python server where will loop through
        //3 retailers and 3 categories and return 9 recommendations


        axios.post("https://us-central1-retail-assistant-demo.cloudfunctions.net/getCategoryRecommendations", {
            "categories": selected_categories,
            "retailers": selected_retailers,
            "already_seen": already_seen
        }).then((response)=>{
            console.log("retrieved cold start recommendations:", response.data)
            
            const category_recommendation_sets = response.data.result
            console.log("Category Recommendations sets: ", category_recommendation_sets)

            if(category_recommendation_sets === null){
                let i = 0;
                let categories_array = []
                for(i = 0; i < category_recommendation_sets.length; i++){
                    let category_object = {}
                    category_object["category"] = category_recommendation_sets[i].category
                    category_object["recommendations"] = category_recommendation_sets[i].recommendations
                    categories_array.push(category_object)
                }
                    
                if(i >= category_recommendation_sets.length){
                    set_category_recommendations(categories_array)
                }


            
                set_loading(false)
                set_category_recommendations(category_recommendation_sets)
            }
            else{
                let i = 0;
                let categories_array = category_recommendations

                for(i = 0; i < categories_array.length; i++){
                    let category_object = categories_array[i]
                    let category_recommendation_hits_array = categories_array[i].recommendations
                    let j = 0;
                    for(j = 0; j < category_recommendation_sets.length; j++){
                        if(categories_array[i].category === category_recommendation_sets[j].category){
                            category_recommendation_hits_array = [...category_recommendation_hits_array, ...category_recommendation_sets[j].recommendations]
                            category_object["recommendations"] = category_recommendation_hits_array 
                            categories_array[i] = category_object
                        }
                    }
                    // if(j >= category_recommendation_sets.length){
                    //     categories_array.push(category_object)
                    // }
                }
                    
                if(i >= categories_array.length){
                    set_category_recommendations(categories_array)
                }

            }
           
        }).catch((error)=>{
            set_loading(false)
            console.log(error)
            window.alert("No more recommendations to show")
        })
 
    }


    


    useEffect(()=>{
        //check for logged in user
        
        if (performance.getEntriesByType("navigation")[0].type === "reload") {
            console.log(performance.getEntriesByType("navigation")[0].type)
            if(id.split("-")[0] === "a"){
                db.collection("anonymous_users").doc(id.split("-")[1]).update(
                    {
                        "already_seen": []
                    }
                )
                set_already_seen([]);
            }
            else{
                db.collection("users").doc(id.split("-")[1]).get().then((doc) => {
                    
                    const docID = doc.id
                    const already_seen = doc.data().already_seen

                    if(already_seen.length > 25){
                        const new_already_seen = already_seen.slice(0, 25)
                        db.collection("users").doc(docID).update({
                            "already_seen": new_already_seen
                        }).then(() => {
                            console.log("updated already_seen")
                            set_already_seen(new_already_seen);
                        })
                    }
                    
                })
                // set_already_seen([]);
            }
            
            
        }
          
        
        auth.onAuthStateChanged((user)=>{
            console.log("User: ", user)
            set_user(user)
            try{
                if(user){
                
                    if(location.state){
    
                        console.log("User")
                        console.log("location state: ", location.state)
                        set_selected_categories(location.state.categories)
                        set_selected_retailers(location.state.retailers)
                        set_already_seen(location.state.already_seen)
                        retrieveRetailerRecommendations(location.state.categories, location.state.retailers, location.state.already_seen)
                        // retrieveCategoryRecommendations(location.state.categories, location.state.retailers, location.state.already_seen)
                    }
                    else{
    
                        db.collection("users").doc(id.split("-")[1]).get()
                        .then((doc)=>{
                            if(!doc.exists){
                                console.log("No such document")
                                navigate("/")
                            }
                            else{
                                const categories = doc.data().categories
                                const retailers = doc.data().retailers
                                const already_seen = doc.data().already_seen
                                console.log("updated user")
                                retrieveRetailerRecommendations(categories, retailers, already_seen)
                                // retrieveCategoryRecommendations(location.state.categories, location.state.retailers, location.state.already_seen)

                            }
                            
                        }).catch((error)=>{
                            console.log(error)
                            window.alert("There was an issue retrieving your recommendations, please try again later")
                            navigate("/")
                        })
                    }
                }
                //if no logged in user check for state or params in url
                else{
                    if(id.split("-")[0] === "b"){
                        navigate("/")
                    }
                    //check for state
                    if(location.state !== undefined && location.state !== null){
                        console.log("state")
                        set_selected_categories(location.state.categories)
                        set_selected_retailers(location.state.retailers)
                        set_already_seen(location.state.already_seen)
                        retrieveRetailerRecommendations(location.state.categories, location.state.retailers, location.state.already_seen)
                        // retrieveCategoryRecommendations(location.state.categories, location.state.retailers, location.state.already_seen)
                        console.log("location state: ", location.state)
                    }
                    //check for params
                    else{
                        console.log("no state")
                        if(id){
                            console.log("id: ", id)
                            console.log("id split: ", id.split("-"))
                            const params = id.split("-")
                            if(params.length === 2){
                                if(params[0] === "a"){
                                    db.collection("anonymous_users").doc(params[1]).get().then((doc)=>{
                                        console.log("doc: ", doc.data())
                                        const data = doc.data()
                                        set_selected_categories(data.categories)
                                        set_selected_retailers(data.retailers)
                                        set_already_seen(data.already_seen)
                                        retrieveRetailerRecommendations(data.categories, data.retailers, data.already_seen)
                                        // retrieveCategoryRecommendations(data.categories, data.retailers, data.already_seen)
                                    })
                                }
                                 
                                else{
                                    navigate("/")
                                }
                            }
                            else{
                                console.log("params !== 2")
                                navigate("/")
                            }
                        }
                        else{
                            console.log("no id")
                            navigate("/")
                        }
                    }
                }   
            }
            catch(error){
                console.log(error)
                window.alert("There was an issue retrieving your recommendations, please try again later")
                navigate("/")
            }
            
        })
        
    }, [])




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
                    <div>

                        <h1 style={{fontWeight: 'bold'}}>TailorAI</h1>
                        <p style={{}}>Personalised Fashion Search Engine</p>


                        
                    </div>
                    
                    <div>
                        <TextSearch/>
                    </div>
                    <br/>
                    <br/>
                        
                    {retailer_recommendations.map((retailer_object, retailer_object_index) => (
                        // container
                        ((typeof(retailer_object.recommendations) !== "string") ? 
                            retailer_object.recommendations.length > 0
                                ? 
                            <div key={retailer_object_index}>
                                <Container className="mx-auto my-3"
                                    style={{
                                        
                                        // "height": 0.6*height,
                                            // border: "1px solid rgba(0, 0, 0, 0.1)",
                                            // borderColor: "rgba(0, 0, 0, 0.1)",
                                            margin: "auto", 
                                            padding: "5px",
                                            width: 0.85*width,
                                    }}
                                >
                                    <div key={retailer_object_index}>
                                        
                                        {/* <h3>{retailer_object.retailer}</h3> */}

                                        <Row xl={4} lg={4} md={4} sm={4} xs={4}>
                                            <Col >
                                                <h3 style={{fontWeight: 'bolder'}}>{retailer_object.retailer}</h3>
                                            </Col>
                                        </Row>


                                        {/* row */}
                                        <Row>
                                            <Col xs={1} 
                                                style={{ alignItems: 'center', zIndex: 100 }}
                                            >
                                                <div className="d-flex align-items-center h-100">
                                                    {width > 600 && <Button variant="outline-secondary"
                                                        // onClick={() => handleScroll(-(width*0.8))}
                                                        onClick={() => {
                                                            handleScroll(retailer_object.retailer, -(width*0.8))
                                                        }}
                                                    >
                                                        {"<"}
                                                    </Button>}
                                                </div>
                                                
                                            </Col>
                                            <Col xs={10}>
                                                <Row>
                                                    <div
                                                        // onScroll={() => {
                                                        //     const div = refs.current[retailer_object.retailer]
                                                        //     if (div) {
                                                        //         const halfwayPoint = div.scrollWidth / 2;
                                                        //         if (div.scrollLeft >= halfwayPoint) {
                                                        //             retrieveRetailerRecommendations(selected_categories, [retailer_object.retailer], already_seen)
                                                        //         } 
                                                        //     }
                                                        // }}
                                                        style={{ display: 'flex', overflowX: 'scroll', scrollBehavior: 'smooth' }}
                                                        ref={(el) => (refs.current[retailer_object.retailer] = el)}
                                                    >
                                                        {retailer_object.recommendations.map((recommendation, recommendation_index_number) => {
                                                            return(
                                                                // retailer_recommendation_object.recommendations.results[0].hits.map((recommendation, recommendation_index_number) => (
                                                                    (recommendation.document.product_image_url && 
                                                                    <Link
                                                                        to="#"
                                                                        style={{"textDecoration": "none"}}
                                                                        onClick={()=>{
                                                                            set_preview(true)
                                                                            set_preview_item(recommendation.document)
                                                                        }}
                                                                        key={recommendation_index_number}
                                                                    >
                                                                        <div>
                                                                            <img 
                                                                            style={{
                                                                                "maxHeight": 0.3*height, 
                                                                                "maxWidth": 0.8*width, 
                                                                                "margin": "10px"
                                                                            }}
                                                                                key={recommendation_index_number} src={recommendation.document.product_image_url} alt={`${recommendation_index_number}`} 
                                                                            />
                                                                            {("brand" in recommendation.document) && <h5>{recommendation.document.brand}</h5>}
                                                                            <p>{recommendation.document.description}</p>
                                                                            <label>£{recommendation.document.price}</label>
                                                                            <div>
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                    )
                                                                // ))
                                                            )
                                                        })}
                                                    </div>

                                                </Row>
                                            </Col>

                                            <Col xs={1} 
                                                style={{ alignItems: 'center', zIndex: 100 }}
                                            >
                                                <div className="d-flex align-items-center h-100">
                                                    {/* <OverlayTrigger
                                                    key="bottom"
                                                    placement="bottom"
                                                    overlay={
                                                      <Tooltip id={`tooltip-${"bottom"}`}>
                                                        Click to load more
                                                      </Tooltip>
                                                    }
                                          
                                                    > */}
                                                        {(width > 600) && <Button variant="outline-secondary"
                                                            // onClick={() => handleScroll((width*0.65))}>{">"}
                                                            onClick={() => {

                                                                // set_click_right_count(click_right_count+1)
                                                                handleScroll(retailer_object.retailer, (width*0.8))

                                                                
                                                                
                                                                let i = 0;
                                                                let temp_already_seen = already_seen
                                                                for(i; i < retailer_recommendations[retailer_object_index].recommendations.length; i++){
                                                                    if(! (temp_already_seen.includes(retailer_recommendations[retailer_object_index].recommendations[i].document.description))){
                                                                        temp_already_seen.push(retailer_recommendations[retailer_object_index].recommendations[i].document.description)
                                                                    }
                                                                }
                                                                if(i >= 15){
                                                                    console.log("i is greater than 15", temp_already_seen)
                                                                    
                                                                    set_already_seen(temp_already_seen)
                                                                    if(!user){
                                                                        db.collection("anonymous_users").doc(id.split("-")[1]).update({
                                                                            already_seen: temp_already_seen
                                                                        })
                                                                    }
                                                                    else{
                                                                        db.collection("users").doc(id.split("-")[1]).update({
                                                                            already_seen: temp_already_seen
                                                                        })
                                                                    }

                                                                    // set_loading(true)
                                                                    retrieveRetailerRecommendations(selected_categories, [retailer_object.retailer], temp_already_seen)
                                                                }
                                                                

                                                            }}
                                                        >
                                                            {">"}
                                                            
                                                        </Button>}
                                                        {width < 600 && <Link
                                                            to="#"
                                                            style={{"textDecoration": "none"}}
                                                            onClick={()=>{
                                                                let i = 0;
                                                                let temp_already_seen = already_seen
                                                                for(i; i < retailer_recommendations[retailer_object_index].recommendations.length; i++){
                                                                    if(! (temp_already_seen.includes(retailer_recommendations[retailer_object_index].recommendations[i].document.description))){
                                                                        temp_already_seen.push(retailer_recommendations[retailer_object_index].recommendations[i].document.description)
                                                                    }
                                                                }
                                                                if(i >= 15){
                                                                    console.log("i is greater than 15", temp_already_seen)
                                                                    
                                                                    set_already_seen(temp_already_seen)
                                                                    if(!user){
                                                                        db.collection("anonymous_users").doc(id.split("-")[1]).update({
                                                                            already_seen: temp_already_seen
                                                                        })
                                                                    }
                                                                    else{
                                                                        db.collection("users").doc(id.split("-")[1]).update({
                                                                            already_seen: temp_already_seen
                                                                        })
                                                                    }

                                                                    set_loading(true)
                                                                    retrieveRetailerRecommendations(selected_categories, [retailer_object.retailer], temp_already_seen)
                                                                }
                                                                
                                                            }}
                                                        >
                                                            Click to Load More
                                                        </Link>}
                                                        
                                                    {/* </OverlayTrigger> */}
                                                    
                                                    
                                                </div>
                                                
                                            </Col>
                                        </Row>
                                        
                                    </div>
                                </Container>
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

                    {/* {category_recommendations.map((category_object, category_object_index) => (
                        // container
                        ((typeof(category_object.recommendations) !== "string") ? 
                        category_object.recommendations.length > 0
                                ? 
                            <div key={category_object_index}>
                                <Container className="mx-auto my-3"
                                    style={{
                                        
                                        // "height": 0.6*height,
                                            // border: "1px solid rgba(0, 0, 0, 0.1)",
                                            // borderColor: "rgba(0, 0, 0, 0.1)",
                                            margin: "auto", 
                                            padding: "5px",
                                            width: 0.85*width,
                                    }}
                                >
                                    <div key={category_object_index}>
                                        
                                        <h3>{category_object.retailer}</h3>


                                        
                                        <Row>
                                            <Col xs={1} 
                                                style={{ alignItems: 'center', zIndex: 100 }}
                                            >
                                                <div className="d-flex align-items-center h-100">
                                                    {width > 600 && <Button variant="outline-secondary"
                                                        // onClick={() => handleScroll(-(width*0.8))}
                                                        onClick={() => {
                                                            handleScroll(category_object.retailer, -(width*0.8))
                                                        }}
                                                    >
                                                        {"<"}
                                                    </Button>}
                                                </div>
                                                
                                            </Col>
                                            <Col xs={10}>
                                                <Row>
                                                    <div
                                                        // onScroll={() => {
                                                        //     const div = refs.current[retailer_object.retailer]
                                                        //     if (div) {
                                                        //         const halfwayPoint = div.scrollWidth / 2;
                                                        //         if (div.scrollLeft >= halfwayPoint) {
                                                        //             retrieveRetailerRecommendations(selected_categories, [retailer_object.retailer], already_seen)
                                                        //         } 
                                                        //     }
                                                        // }}
                                                        style={{ display: 'flex', overflowX: 'scroll', scrollBehavior: 'smooth' }}
                                                        ref={(el) => (refs.current[category_object.retailer] = el)}
                                                    >
                                                        {category_object.recommendations.map((recommendation, recommendation_index_number) => {
                                                            return(
                                                                // retailer_recommendation_object.recommendations.results[0].hits.map((recommendation, recommendation_index_number) => (
                                                                    (recommendation.document.product_image_url && 
                                                                    <Link
                                                                        to="#"
                                                                        style={{"textDecoration": "none"}}
                                                                        onClick={()=>{
                                                                            set_preview(true)
                                                                            set_preview_item(recommendation.document)
                                                                        }}
                                                                        key={recommendation_index_number}
                                                                    >
                                                                        <div>
                                                                            <img 
                                                                            style={{
                                                                                "maxHeight": 0.3*height, 
                                                                                "maxWidth": 0.8*width, 
                                                                                "margin": "10px"
                                                                            }}
                                                                                key={recommendation_index_number} src={recommendation.document.product_image_url} alt={`${recommendation_index_number}`} 
                                                                            />
                                                                            <p>{recommendation.document.description}</p>
                                                                            <label>£{recommendation.document.price}</label>
                                                                        </div>
                                                                    </Link>
                                                                    )
                                                                // ))
                                                            )
                                                        })}
                                                    </div>

                                                </Row>
                                            </Col>

                                            <Col xs={1} 
                                                style={{ alignItems: 'center', zIndex: 100 }}
                                            >
                                                <div className="d-flex align-items-center h-100">
                                                    
                                                        {(width > 600) && <Button variant="outline-secondary"
                                                            // onClick={() => handleScroll((width*0.65))}>{">"}
                                                            onClick={() => {

                                                                set_click_right_count(click_right_count+1)
                                                                handleScroll(category_object.retailer, (width*0.8))

                                                                
                                                                
                                                                let i = 0;
                                                                let temp_already_seen = already_seen

                                                                for(i; i < retailer_recommendations[category_object_index].recommendations.length; i++){
                                                                    if(! (temp_already_seen.includes(retailer_recommendations[category_object_index].recommendations[i].document.description))){
                                                                        temp_already_seen.push(retailer_recommendations[category_object_index].recommendations[i].document.description)
                                                                    }                        
                                                                }

                                                                if(load_more_count === 0){
                                                                    set_load_more_count(1)
                                                                    retrieveRetailerRecommendations(selected_categories, [category_object.retailer], temp_already_seen)
                                                                }

                                                                // if(load_more_count >= 8){
                                                                //     console.log("No more recommendations")
                                                                // }
                                                                
                                                                if(i >= retailer_recommendations[category_object_index].recommendations.length){
                    
                                                                    if(click_right_count >= (3)){
                                                                        set_load_more_count(load_more_count+1)
                                                                        retrieveRetailerRecommendations(selected_categories, [category_object.retailer], temp_already_seen)
                                                                        set_click_right_count(0)

                                                                        set_already_seen(temp_already_seen)
                                                                        if(!user){
                                                                            db.collection("anonymous_users").doc(id.split("-")[1]).update({
                                                                                already_seen: temp_already_seen
                                                                            })
                                                                        }
                                                                    }
                                                                }
                                                                
                                                                

                                                            }}
                                                        >
                                                            {">"}
                                                            
                                                        </Button>}
                                                        {width < 600 && <Link
                                                            to="#"
                                                            style={{"textDecoration": "none"}}
                                                            onClick={()=>{
                                                                let i = 0;
                                                                let temp_already_seen = already_seen
                                                                for(i; i < retailer_recommendations[category_object_index].recommendations.length; i++){
                                                                    if(! (temp_already_seen.includes(retailer_recommendations[category_object_index].recommendations[i].document.description))){
                                                                        temp_already_seen.push(retailer_recommendations[category_object_index].recommendations[i].document.description)
                                                                    }
                                                                }
                                                                if(i >= 15){
                                                                    console.log("i is greater than 15", temp_already_seen)
                                                                    
                                                                    set_already_seen(temp_already_seen)
                                                                    if(!user){
                                                                        db.collection("anonymous_users").doc(id.split("-")[1]).update({
                                                                            already_seen: temp_already_seen
                                                                        })
                                                                    }
                                                                    // else{
                                                                    //     db.collection("users").doc(user.uid).update({
                                                                    //         already_seen: temp_already_seen
                                                                    //     })
                                                                    // }

                                                                    set_loading(true)
                                                                    retrieveRetailerRecommendations(selected_categories, [category_object.retailer], temp_already_seen)
                                                                }
                                                                
                                                            }}
                                                        >
                                                            Click to Load More
                                                        </Link>}
                                                        
                                                    
                                                    
                                                </div>
                                                
                                            </Col>
                                        </Row>
                                        
                                    </div>
                                </Container>
                                <br/>
                            </div>
                            :
                            <div key={category_object_index}>
                                <h1>{category_object.retailer}</h1>
                                <h4>More recommendations coming soon</h4>
                                <br/>
                                <br/>
                            </div>
                            :
                            <div key={category_object_index}>
                                <h1>{category_object.retailer}</h1>
                                <h4>More recommendations coming soon</h4>
                                <br/>
                                <br/>
                            </div>
                        )

                                    
                    ))} */}


                    {preview && <Modal show onHide={()=>{set_preview(false)}}>
                        <Modal.Header closeButton/>
                        <Modal.Body style={{textAlign: "center"}}>
                            <img alt={preview_item["description"]} src={preview_item["product_image_url"]} style={{"maxHeight": 0.5*height, "maxWidth": 0.5*width, "padding": "10px"}}/>
                            <br/>
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
export default TailorAI

