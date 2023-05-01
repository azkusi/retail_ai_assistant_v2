import '../App.css';
import logo from '../data/logo.png';
import { useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindow';
import { Modal, Dropdown, DropdownButton, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TextSearch from '../components/TextSearch';
import ImageSearch from '../components/ImageSearch';
import StyleSearch from '../components/StyleSearch';
import Recommender from '../components/Recommender';
import { number_six_style } from "../data/number_six";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {retailers} from '../data/retailers';




function Home() {

    const [mode, setMode] = useState("Search")
    const [selectedButton, setSelectedButton] = useState("Search");
    const [show_home_items, set_show_home_items] = useState(true)
    const user = null
    const [styleinstructions, set_styleinstructions] = useState(false)
    const [hostname, set_hostname] = useState("tailorai")
    
    const navigate = useNavigate()
    
    const [gender, set_gender] = useState("womens_clothing")
    const [number_six_demo_modal, set_numbersix_demo_modal] = useState(false)
    const [view_numsix_hovered, set_view_numsix_hovered] = useState(false)
    const [close_numsix_hovered, set_close_numsix_hovered] = useState(false)
    

    const [mens_selected, set_mens_selected] = useState(false)
    const [womens_selected, set_womens_selected] = useState(true)


    const width = useWindowSize().width
    const height = useWindowSize().height
  

  const handleButtonClick = (button) => {
    set_show_home_items(true)
    setSelectedButton(button);
    setMode(button)
  };


//   function checkMode(mode){
    
//         if(mode === "Style"){
//             setMode("Style")
//         }
//         else if(mode === "Text"){
//             setMode("Text")
//         }else{
//             setMode("Image")
//         }
//     }


    function removeHomeItems(){
        set_show_home_items(false)
    }

    function selectStylesInstruction(){
        set_styleinstructions(true)
    }

    function removeSelectStylesInstruction(){
        set_styleinstructions(false)
    }

    useEffect(()=>{
        // window.scrollTo(0, 0);
        // let hostname = window.location.hostname
        // let retailer = hostname.split('.')[0]
        // if(retailer === "numbersixlondon"){
        //     set_hostname("numbersixlondon")
        // }
        // if(retailer === "demo"){
        //     set_numbersix_demo_modal(true)
        // }

    }, [])


  return(
    <div style={{backgroundColor: number_six_style[0].backgroundColor, paddingTop: "10px"}}>
        {/* <h4>Sign Up</h4>
        <h4>Login</h4> */}
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
        <div style={{marginLeft: "20px", marginTop: "10px"}}>

            <div style={{marginBottom: "10px", display: "flex", alignItems: "flex-start", justifyContent: "flex-start"}}>
                <h4 style={{textAlign: "center", fontWeight: "bold", letterSpacing: number_six_style[0].letterSpacing, color: number_six_style[0].color, fontFamily: number_six_style[0].fontFamily}}>Engine Mode:</h4>
            </div>

            
            <div style={{display: "flex", alignItems: "flex-start", justifyContent: "flex-start"}}>
                                    
                <div style={{display: "flex", justifyContent: "center"}}>
                    <button className={`btn btn-outline-secondary ${mode === "Search" ? "active" : ""}`} 
                        onClick={()=>{
                            // handleButtonClick("Text")
                            setMode("Search")
                            set_show_home_items(true)
                            set_styleinstructions(false)
                        }}
                    >
                        Search
                    </button>

                    <div style={{width: "10px"}}></div>

                    <button className={`btn btn-outline-secondary ${mode === "Recommend" ? "active" : ""}`} 
                        onClick={()=>{
                            // handleButtonClick("Style")

                            // If user is logged in take them to logged in recommender page instead of showing them recommender
                            // if(user){
                            //     navigate('/recommendation-results', {state: {user: user}})
                            // }
                            // else{
                            //     setMode("Recommend")
                                
                            // }
                            window.alert("This feature is coming soon, sign up to be notified when it arrives!")
                        }}
                    >
                        Recommend
                    </button>
                </div>
            </div>

            {(mode === "Recommend") && 
                                <div>
                                    <br/>
                                    <br/>
                                    {styleinstructions && <h4>Scroll & choose two styles</h4>}
                                    
                                    <Recommender 
                                        showHomeCallback={removeHomeItems} 
                                        backCallback={handleButtonClick} 
                                        selectStylesInstructionCallback={selectStylesInstruction} 
                                        unselectStylesInstructionCallback={removeSelectStylesInstruction}
                                    />
                                    
                                </div>
                            }
        </div>
        {(mode !== "Style") && 
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: "100vh", marginTop: "10vh"}}>
                {show_home_items ? 
                    (hostname !== "numbersixlondon") ?
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            {/* <img src={logo} alt="TailorAI Logo" style={{height: "50px", width: "50px"}} /> */}
                            {/* <h1 style={{marginRight: "10px"}}>ailorAI</h1> */}
                            <h1 style={{fontWeight: "bold", letterSpacing: "0.1em", color: number_six_style[0].color, fontFamily: number_six_style[0].fontFamily}}>TailorAI</h1>
                        </div>
                    
                    :
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <h1 style={{fontWeight: "bold", letterSpacing: number_six_style[0].letterSpacing, color: number_six_style[0].color, fontFamily: number_six_style[0].fontFamily}}>number six</h1>
                        </div>
                         
                        
                        
                    :
                <></>
                }

                {show_home_items ?
                    hostname !== "numbersixlondon" ?
                    <p style={{textAlign: "center", marginBottom: "40px", color: 'grey', fontSize: "13.5px"}}>
                        Personalised Fashion Search and Recommendation Engine
                    </p>
                    : 
                    <p style={{textAlign: "center", marginBottom: "40px", color: 'grey', fontSize: "13.5px"}}>
                        AI Search & Recommendations powered by <span style={{fontWeight: "bold"}}> <a href='https://tailorai.co.uk' target='_blank' rel="noreferrer">TailorAI</a></span>
                    </p>
                    :
                <></>

                }
                
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-6">
                            {(mode === "Search") && <TextSearch showHomeCallback={removeHomeItems} backCallback={handleButtonClick} collection={gender}/>}
                            {(mode === "Search") && 
                                <FormGroup>
                                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                            <button  
                                                // onMouseEnter={() => set_mens_selected(true)}
                                                // onMouseLeave={() => set_mens_selected(false)}
                                                style={{
                                                    
                                                    border: 'none',
                                                    backgroundColor: mens_selected ? '#1a3c6c' : 'white',
                                                    color: mens_selected ? 'white' : '#1a3c6c',
                                                    
                                                    borderRadius: '0',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={()=>{
                                                    set_gender("mens_clothing")  
                                                    set_mens_selected(true)
                                                    set_womens_selected(false)                          
                                                    
                                                }}
                                                >
                                                Men's
                                            </button>

                                        

                                            <button 
                                                // onMouseEnter={() => set_womens_hovered(true)}
                                                // onMouseLeave={() => set_womens_hovered(false)}
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: womens_selected ? '#1a3c6c' : 'white',
                                                    color: womens_selected ? 'white' : '#1a3c6c',
                                                    
                                                    borderRadius: '0',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={()=>{
                                                    
                                                    set_gender("womens_clothing")
                                                    set_womens_selected(true)
                                                    set_mens_selected(false)  
                                                    
                                                    

                                                }}
                                            >
                                                Women's
                                            </button>
                                        </div>
                                </FormGroup>
                            }  
                            
                        </div>
                    </div>
                </div>

            </div>

            
        }

        

        
        {(mode === "Style") && 
            <StyleSearch backCallback={handleButtonClick}/>   
        }

        {(mode === "Voice") && 
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
                <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
            </div>
        }
    </div>



  )
}

export default Home;
