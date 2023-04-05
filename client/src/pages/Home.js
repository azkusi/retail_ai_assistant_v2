import '../App.css';
import logo from '../data/logo.png';
import { useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindow';
import { Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TextSearch from '../components/TextSearch';
import ImageSearch from '../components/ImageSearch';
import StyleSearch from '../components/StyleSearch';
import Recommender from '../components/Recommender';


function Home() {

    const [mode, setMode] = useState("Search")
    const [selectedButton, setSelectedButton] = useState("Search");
    const [show_home_items, set_show_home_items] = useState(true)
    const user = null
    const [styleinstrcuions, set_styleinstructions] = useState(false)
    
    const navigate = useNavigate()
    
    const [gender, set_gender] = useState("mens")
    

  

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
        window.scrollTo(0, 0);
    })


  return(
    <div>
        {/* <h4>Sign Up</h4>
        <h4>Login</h4> */}
        <div style={{marginLeft: "20px", marginTop: "10px"}}>

            <div style={{marginBottom: "10px", display: "flex", alignItems: "flex-start", justifyContent: "flex-start"}}>
                <h4 style={{textAlign: "center"}}>Engine Mode:</h4>
            </div>
            <div style={{display: "flex", alignItems: "flex-start", justifyContent: "flex-start"}}>
                                    
                <div style={{display: "flex", justifyContent: "center"}}>
                    <button className={`btn btn-outline-secondary ${mode === "Search" ? "active" : ""}`} 
                        onClick={()=>{
                            // handleButtonClick("Text")
                            setMode("Search")
                        }}
                    >
                        Search
                    </button>

                    <div style={{width: "10px"}}></div>

                    <button className={`btn btn-outline-secondary ${mode === "Recommend" ? "active" : ""}`} 
                        onClick={()=>{
                            // handleButtonClick("Style")

                            // If user is logged in take them to logged in recommender page instead of showing them recommender
                            if(user){
                                navigate('/recommendation-results', {state: {user: user}})
                            }
                            else{
                                setMode("Recommend")
                            }
                        }}
                    >
                        Recommend
                    </button>
                </div>
            </div>
        </div>
        {(mode !== "Style") && 
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: "100vh", marginTop: "10vh"}}>
                {show_home_items && <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <img src={logo} alt="TailorAI Logo" style={{height: "50px", width: "50px"}} />
                    <h1 style={{marginRight: "10px"}}>ailorAI</h1>
                </div>}

                {show_home_items && <p style={{textAlign: "center", marginBottom: "40px"}}>Retail Search and Recommendation Engine</p>}
                
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-6">
                            {(mode === "Search") && <TextSearch showHomeCallback={removeHomeItems} backCallback={handleButtonClick}/>}
                            {/* If user is logged in take them to logged in recommender page instead of showing them recommender */}
                            {(mode === "Recommend") && 
                                <div>
                                    <br/>
                                    <br/>
                                    {styleinstrcuions && <h4>Scroll & choose two styles</h4>}
                                    
                                    <Recommender 
                                        showHomeCallback={removeHomeItems} 
                                        backCallback={handleButtonClick} 
                                        selectStylesInstructionCallback={selectStylesInstruction} 
                                        unselectStylesInstructionCallback={removeSelectStylesInstruction}
                                    />
                                    
                                </div>
                            }

                            {/* {(mode === "Image") && <ImageSearch showHomeCallback={removeHomeItems} backCallback={handleButtonClick}/>} */}
                            
                            {/* <br/>
                            <br/> */}

                            
                                 {/* <Dropdown >
                                     <Dropdown.Toggle variant="success" id="dropdown-basic">
                                         Choose your search method
                                     </Dropdown.Toggle>
                    
                                     <Dropdown.Menu>
                                         <Dropdown.Item onClick={()=>{handleButtonClick("Text")}}>Search by Text</Dropdown.Item>
                                         <Dropdown.Item onClick={()=>{handleButtonClick("Image")}}>Search by Image</Dropdown.Item>
                                         <Dropdown.Item onClick={()=>{handleButtonClick("Style")}}>Search by Style</Dropdown.Item>
                                     </Dropdown.Menu>
                                 </Dropdown> */}
                                
                            
                            
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
