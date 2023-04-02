import '../App.css';
import logo from '../data/logo.png';
import { useState } from 'react';
import useWindowSize from '../hooks/useWindow';
import { Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import TextSearch from '../components/TextSearch';
import ImageSearch from '../components/ImageSearch';
import StyleSearch from '../components/StyleSearch';


function Home() {

    const [mode, setMode] = useState("Text")
    const [selectedButton, setSelectedButton] = useState("Text");
    const [show_home_items, set_show_home_items] = useState(true)
    
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


  return(
    <div>
        {(mode !== "Style") && 
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: "100vh", marginTop: "30vh"}}>
                {show_home_items && <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <img src={logo} alt="TailorAI Logo" style={{height: "50px", width: "50px"}} />
                    <h1 style={{marginRight: "10px"}}>ailorAI</h1>
                </div>}

                {show_home_items && <h4 style={{textAlign: "center", marginTop: "20px", marginBottom: "10px"}}>Retail AI Search Engine</h4>}
                
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-6">
                            {(mode === "Text") && <TextSearch showHomeCallback={removeHomeItems} backCallback={handleButtonClick}/>}
                            {(mode === "Image") && <ImageSearch showHomeCallback={removeHomeItems} backCallback={handleButtonClick}/>}
                            
                            <br/>
                            <br/>

                            {show_home_items && 
                                <Dropdown >
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Choose your search method
                                    </Dropdown.Toggle>
                    
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={()=>{handleButtonClick("Text")}}>Search by Text</Dropdown.Item>
                                        {/* <Dropdown.Item onClick={()=>{handleButtonClick("Image")}}>Search by Image</Dropdown.Item> */}
                                        <Dropdown.Item onClick={()=>{handleButtonClick("Style")}}>Search by Style</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
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
