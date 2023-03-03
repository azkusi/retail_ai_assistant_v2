import '../App.css';
// import { Gallery } from "react-grid-gallery";
import { product_data } from '../data/products';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import useGetResults from '../hooks/useGetResults';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Search from '../pages/Search';
import { Grid, Row, Col, Container, Spinner} from 'react-bootstrap';
import useWindowSize from '../hooks/useWindow';
import ItemSelection from '../pages/ItemSelection';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';


function Home() {

  // const product_results = useGetResults().products
  // const refresh_status = useGetResults().status

  const [product_results, set_product_results] = useState(product_data)
  const [refresh_status, set_refresh_status] = useState("NO_CHANGE")

  const width = useWindowSize().width
  const height = useWindowSize().height
  const [spinner, set_spinner] = useState(false)


  function getResults(request){
    // const [result_to_send, set_result_to_send] = useState(product_data)
    // const [status, set_status] = useState("NO_CHANGE")

    console.log("Request received: ", request)
    // useEffect(()=>{
        
        if((request !== null) && (request !== undefined)){
            console.log("sending request from getResults hook")
            axios.post('https://us-central1-retail-assistant-demo.cloudfunctions.net/search',
              {
                  "request": request,
              }, 
              {
                headers: {
                    "Access-Control-Allow-Origin": "*"

                }
              }
            ).then((result)=>{
                console.log("get results hooked received a result: ", result.data.result)
                set_product_results(result.data.result)
                set_refresh_status("CHANGED")
                set_spinner(false)
                return {
                  "products": result.data.result,
                  "status": "CHANGED"
                }
            })
            
        }

    // },[request])
    // console.log("status at usegetresults: ", status)
    
}

  function manageSearchResults(request){
    console.log("App callback, request received: ", request)
    if(request){
      set_spinner(true)
      getResults(request)
    }
    //
    
  }


  // useEffect(()=>{
  //   console.log("refresh status now:", refresh_status)
  //   if(refresh_status === "CHANGED"){
  //     console.log("useEffect ran in home, PRODUCTS CHANGED")
  //     console.log("product results: ", product_results)
  //     set_spinner(false)
  //   }
    
  // },[product_results, refresh_status])

  return (
    <div style={{"width": width}} className="App">
      <div style={{"opacity": spinner ? 0.4 : 1}}>

      
        <Tabs
          defaultActiveKey="search"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="search" title="Search">
            <div style={{"width": "100%", "margin": "auto"}}>
                
              <Container style={{"width": 0.8*width, "margin": "auto"}}>
                <Row xl={4}lg={4} md={3} sm={3} xs={2}>
                  {product_results.map((item, index)=>{
                    return(
                      <Col key={index}>
                        <img alt={index} src={item.src} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                      </Col>
                    )
                  })}
                </Row>

                <Search HomeCallBack={manageSearchResults}/>
                {/* <Search/> */}

              </Container>

            </div>
            
          </Tab>

          <Tab className='center' eventKey="personalised" title="Personalised Shopping">
            <ItemSelection/>
          </Tab>

        </Tabs>
      </div>
    
    

      <div className='center'>
          {spinner && <Spinner animation='border'/>}
      </div>
      
    </div>
  );
}

export default Home;
