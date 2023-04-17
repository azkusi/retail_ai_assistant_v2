import '../App.css';
import logo from '../data/logo.png';
import { useEffect, useState, useRef } from 'react';
import useWindowSize from '../hooks/useWindow';
import { Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Search from '../components/Search';
import ImageSearch from '../components/ImageSearch';
import StyleSearch from '../components/StyleSearch';
import Recommender from '../components/Recommender';
import { number_six_style } from "../data/number_six";
import {Tabs, Tab} from 'react-bootstrap';
import SearchResults from '../components/SearchResults';
import ActualShopping from './ActualShopping';
import WindowShopping from './WindowShopping';



function ShoppingHome() {

    const [search_results, set_search_results] = useState(false)
    
    const [recommendations_loaded, set_recommendations_loaded] = useState(false)


    const location = useLocation();

    const width = useWindowSize().width
    const height = useWindowSize().height
    const [recommendation_results, set_recommendation_results] = useState([])
    
    const [categories, set_categories] = useState(null)
    const [gender, set_gender] = useState(null)

    // const [sign_in_prompt, set_sign_in_prompt] = useState(false)
    const [already_seen_doc_id, set_already_seen_doc_id] = useState(null)
    
    const inputRef = useRef(null)
    const [data, set_data] = useState(null)

    
    const navigate = useNavigate()

    const [hostname, set_hostname] = useState("tailorai")

    const [number_six_demo_modal, set_numbersix_demo_modal] = useState(false)
    const [view_numsix_hovered, set_view_numsix_hovered] = useState(false)
    const [close_numsix_hovered, set_close_numsix_hovered] = useState(false)


    useEffect(()=>{
        if(location.state === undefined || location.state === null){
            navigate("/")
        }
        else{
            set_data(location.state)
            set_search_results(null)
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
        let hostname = window.location.hostname
        let retailer = hostname.split('.')[0]
        if(retailer === "numbersixlondon"){
            set_hostname("numbersixlondon")
        }
        if(retailer === "demo"){
            set_numbersix_demo_modal(true)
        }
        
    }, [])


    function setLoadingFalse(){
        set_recommendations_loaded(true)
    }
    
  return(
    <div 
        style={{
            color: number_six_style[0].color, 
            fontFamily: number_six_style[0].fontFamily, 
            backgroundColor: number_six_style[0].backgroundColor
        }}
    >

        {number_six_demo_modal && <Modal show onHide={()=>{set_numbersix_demo_modal(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>Demo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>This is a demo of how TailorAI works.</p>
                <br/>
                <p>
                    To see a live example visit https://numbersixlondon.com click on the AI assistant icon on the bottom right corner of their website to see how numbersixlondon is using TailorAI to increase customer sales.
                </p>
                <p>
                    Alternatively, click the button below and we'll take you straight to the platform we created for them.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={()=>{set_numbersix_demo_modal(false)}}
                    style={{
                        border: 'none',
                        backgroundColor: view_numsix_hovered ? '#1a3c6c' : 'white',
                        color: view_numsix_hovered ? 'white' : '#1a3c6c',
                        padding: '10px 20px',
                        borderRadius: '0',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={() => set_view_numsix_hovered(true)}
                    onMouseLeave={() => set_view_numsix_hovered(false)}
                >
                    Close
                </button>
                <button className="btn btn-primary" onClick={()=>{window.location.href = "https://numbersixlondon.tailorai.co.uk"}}
                    style={{
                        border: 'none',
                        backgroundColor: close_numsix_hovered ? 'white' : '#1a3c6c',
                        color: close_numsix_hovered ? '#1a3c6c' : 'white',
                        padding: '10px 20px',
                        borderRadius: '0',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={() => set_close_numsix_hovered(true)}
                    onMouseLeave={() => set_close_numsix_hovered(false)}
                >
                    Visit Number Six London
                </button>
            </Modal.Footer>
        </Modal>}

        

        <Tabs
            defaultActiveKey="actual_shopping"
            id="ShoppingHomeTabs"
            className="mb-3"
            fill
        >
            <Tab eventKey="actual_shopping" title="Actual Shopping">
                <div style={{ 
                        color: number_six_style[0].color, 
                        fontFamily: number_six_style[0].fontFamily, 
                        backgroundColor: number_six_style[0].backgroundColor,
                }}>
                    {hostname ==="numbersixlondon" ? 
                        <h1 style={{fontWeight: "bold", letterSpacing: number_six_style[0].letterSpacing, color: number_six_style[0].color, fontFamily: number_six_style[0].fontFamily}}>number six</h1>
                        :
                        <h2> Actual Shopping</h2>
                    }
                    {data && <Search/>}
                    {search_results && <SearchResults/>}
                    {data && <ActualShopping data={data} setLoadingFalse={setLoadingFalse}/>}
                </div>
                
            
            </Tab>

            <Tab eventKey="window_shopping" title="Window Shopping">
                <div>
                    {hostname ==="numbersixlondon" ? 
                        <h1 style={{fontWeight: "bold", letterSpacing: number_six_style[0].letterSpacing, color: number_six_style[0].color, fontFamily: number_six_style[0].fontFamily}}>number six</h1>
                        :
                        <h2> Window Shopping</h2>
                    }
                    <br/>
                    {data && <WindowShopping data={data} setLoadingFalse={setLoadingFalse}/>}
                </div>
                
            </Tab>
        
        </Tabs>

        
        
    </div>



  )
}

export default ShoppingHome;
