import {React, useState, useEffect, useRef} from "react";
import { number_six_style } from "../data/number_six";
import useWindowSize from "../hooks/useWindow";
import axios from "axios";
import LikeButton from "../components/LikeButton";
import { Container, Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from "react-router-dom";

function WindowShopping(props){
    const width = useWindowSize().width
    const height = useWindowSize().height

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    
    const [recommendation_results, set_recommendation_results] = useState(props.data.data)
    const [preview, set_preview] = useState(false)
    const [preview_item, set_preview_item] = useState(null)
    const [categories, set_categories] = useState(props.data.categories)
    const [gender, set_gender] = useState(null)

    // const [sign_in_prompt, set_sign_in_prompt] = useState(false)
    const [already_seen_doc_id, set_already_seen_doc_id] = useState(props.data.already_seen_doc_id)
    const [load_more_count, set_load_more_count] = useState(0)
    const [signup_prompt, set_signup_prompt] = useState(false)
    const [signup_complete, set_signup_complete] = useState(false)
    
    const inputRef = useRef(null)

    const [scrollPosition, setScrollPosition] = useState(0);
    const [loading, set_loading] = useState(false)

    const [reset_hovered, set_reset_hovered] = useState(false)
    const [load_hovered, set_load_hovered] = useState(false)
    
    const [signup_hovered, set_signup_hovered] = useState(false)
    const [cancel_signup_hovered, set_cancel_signup_hovered] = useState(false)
    const [done_signup_hovered, set_done_signup_hovered] = useState(false)
    const [liked_items, set_liked_items] = useState([])
    const [saved_items, set_saved_items] = useState([])
    const navigate = useNavigate()

    function handleLike() {
        setLiked(!liked);
    }


    useEffect(()=>{
        
        
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

    return (
        <div style={{color: number_six_style[0].color, 
            fontFamily: number_six_style[0].fontFamily, 
            backgroundColor: number_six_style[0].backgroundColor,
            // height: height,
        }}>

            {recommendation_results && 
            <div style={{opacity: (loading ? 0.2 : 1)}}>
                <Container style={{"width": 0.8*width, "margin": "auto"}}>
                    <Row gutter={[30, 16]} xl={1}lg={1} md={1} sm={1} xs={1}>
                    {recommendation_results.map((item, index)=>{
                        return( 
                        <Col key={index}
                            style={{ marginBottom: "40px" }}
                        >
                            <Link
                                
                                onDoubleClick={()=>{
                                    console.log("double clicked")
                                    // retrieve the category it belongs to
                                    // update the categories array in the state
                                    if(liked_items.includes(item.recommendation.document["description"])){
                                        set_liked_items(liked_items.filter((selection)=>{return selection !== item.recommendation.document["description"]}))
                                    }
                                    else{
                                        set_liked_items([...liked_items, item.recommendation.document["description"]])
                                    }
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
                                }} 
                                to="#"
                                
                                style={{"textDecoration": "none"}}
                            >
                                <img alt={index} src={item.recommendation.document["product_image_url"]} style={{"maxHeight": 0.7*height, "maxWidth": 0.8*width, boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.1)", 
                                    padding: "5px"}}/>

                                <div className="button-container" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                
                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", maxWidth: 0.3*width}}>
                                        {liked_items.includes(item.recommendation.document["description"]) ? 
                                            <div>
                                                <FavoriteIcon style={{marginRight: 0.1*width}} 
                                                    onClick={() => {
                                                        if(liked_items.includes(item.recommendation.document["description"])){
                                                            set_liked_items(liked_items.filter((selection)=>{return selection !== item.recommendation.document["description"]}))
                                                        }
                                                        else{
                                                            set_liked_items([...liked_items, item.recommendation.document["description"]])
                                                        }  

                                                        
                                                        console.log("fav icon clicked")                                      
                                                    }}
                                                />
                                            </div>
                                            :
                                            <div>
                                                <FavoriteBorderIcon style={{marginRight: 0.1*width}} 
                                                    onClick={() => {
                                                        if(liked_items.includes(item.recommendation.document["description"])){
                                                            set_liked_items(liked_items.filter((selection)=>{return selection !== item.recommendation.document["description"]}))
                                                        }
                                                        else{
                                                            set_liked_items([...liked_items, item.recommendation.document["description"]])
                                                        }  
                                                        
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
                                                    }}
                                                    
                                                />
                                            </div>
                                        }
                                        <div style={{flex: 1}}>

                                        </div>

                                        {saved_items.includes(item.recommendation.document["description"]) ? 

                                            <div style={{display: "flex", alignItems: "center"} }>
                                                <BookmarkIcon style={{marginLeft: 0.1*width}} 
                                                    onClick={() => {
                                                        if(saved_items.includes(item.recommendation.document["description"])){
                                                            set_saved_items(saved_items.filter((selection)=>{return selection !== item.recommendation.document["description"]}))
                                                        }
                                                        else{
                                                            set_saved_items([...saved_items, item.recommendation.document["description"]])
                                                        }
                                                        console.log("bookmark icon clicked")  
                                                    }
                                                    }
                                                />
                                                <p>Saved</p>
                                                    
                                            </div>
                                            :
                                            <div>
                                                <BookmarkBorderIcon style={{marginLeft: 0.1*width}}
                                                    onClick={() => {
                                                        // window.alert("You must be signed in to save items")
                                                        if(saved_items.includes(item.recommendation.document["description"])){
                                                            set_saved_items(saved_items.filter((selection)=>{return selection !== item.recommendation.document["description"]}))
                                                        }
                                                        else{
                                                            set_saved_items([...saved_items, item.recommendation.document["description"]])
                                                        }
                                                        console.log("bookmark icon clicked")
                                                    }}
                                                    
                                                />
                                            </div>
                                        }

                                    </div>
                            
                                </div>
                            </Link>
                            

                        </Col>
                        )
                    })}
                    </Row>
                </Container>

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
            </div>
            }

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
            

        </div>
    )
}

export default WindowShopping