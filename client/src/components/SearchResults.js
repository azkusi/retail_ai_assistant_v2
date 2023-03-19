// import { Gallery } from "react-grid-gallery";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useEffect, useState, useRef } from 'react';
import { Modal, Button, Form, CloseButton, Overlay, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dictaphone from '../components/Dictaphone';
import useWindowSize from "../hooks/useWindow";
import '../App.css'




function SearchResults(props) {
  const width = useWindowSize().width
  const height = useWindowSize().height  
//   const [results, set_results] = useState(props.results)
  const [results, set_results] = useState(["Result 1", "Result 2", "Result 3"])
//   const [user_request, set_user_request] = useState(null)
//   const user_result = useGetResults(user_request)
  
  
    
  
  

  return (
    <div>

        <Container>
        <Row xl={1}lg={1} md={1} sm={1} xs={1}>
                {results.map((item, index)=>{
                    return(
                        <Col>
                            <div>
                                <img alt={index} src={item.src} style={{"maxHeight": 0.5*props.Height, "maxWidth": 0.8*props.Width, "padding": "10px"}}/>
                                <h5>{item.name}</h5>
                                <p>{item.price}</p>
                            </div>                            
                        </Col>
                    ) 
                })} 
            </Row>
            
        </Container>
        
            
         
    </div>
        
  );
}

export default SearchResults;
