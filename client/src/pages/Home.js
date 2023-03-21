import '../App.css';
// import { Gallery } from "react-grid-gallery";
import { product_data } from '../data/products';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Search from '../pages/Search';
import { Row, Col, Container, Spinner} from 'react-bootstrap';
import useWindowSize from '../hooks/useWindow';
import ItemSelection from '../pages/ItemSelection';
import axios from 'axios';
import { firebaseApp } from '../config';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage"
import { mixed_clothing } from '../data/mixed_clothing';
import { mens_t_shirts } from '../data/mens_t_shirts';
import { mens_clothing } from '../data/mens_clothing';
import { useNavigate } from 'react-router-dom';
const Typesense = require('typesense')


function Home() {

  const [product_results, set_product_results] = useState(null)
  const [refresh_status, set_refresh_status] = useState("NO_CHANGE")
  const [search_results, set_search_results] = useState(null)
  const [loading_new_choices, set_loading_new_choices] = useState(true)
  const [user_request, set_user_request] = useState(null)

  const width = useWindowSize().width
  const height = useWindowSize().height
  const [spinner, set_spinner] = useState(false)
  const navigate = useNavigate()

  let db;
  let projectStorage;
  let projectFirestore;


  if (!firebase.apps.length) {
    firebaseApp()
    db = firebase.firestore()
    projectStorage = firebase.storage();
    projectFirestore = firebase.firestore();
  }else {
    db = firebase.app().firestore() // if already initialized, use this one
    projectStorage = firebase.app().storage();
    projectFirestore = firebase.app().firestore();

  }

  useEffect(()=>{
        
    productInitialiser()
    

},[])

function productInitialiser(){
  set_loading_new_choices(true)
    let i = 0
    let temp = []
    for(i; i < 100; i++){
        temp.push(mens_clothing[Math.floor(Math.random() * (mens_clothing.length - 1))])
        set_product_results(temp)
        set_loading_new_choices(false)
    }
  
}

  function getSearchResults(request){

    console.log("Request received: ", request)
        
    if((request.u_request !== null) && (request.u_request !== undefined)){
      let url;
      let data_to_send;
      let content_type;
      if(request.type === "file"){
        url = "https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingImage-HomePage"
        // data_to_send = {"image": request.u_request, "collection": "mens_t_shirts"}
        var formData = new FormData();
        formData.append("image", request.u_request);
        // formData.append("collection", "mens_t_shirts");
        data_to_send = formData
        // data_to_send = {"image": request.u_request}
        console.log("Form Data values: ", JSON.stringify(formData.values()))

        content_type = "multipart/form-data"
        set_user_request({"u_request": URL.createObjectURL(request.u_request), "type": "image"})
      }else{
        url = "https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingText-HomePage"
        data_to_send = {"text": request.u_request, "collection": "mens_clothing"}
        content_type = "application/json"
        set_user_request({"u_request": request.u_request, "type": "text"})

      }
        console.log("sending request from getSearchResults function")
        return new Promise(async (resolve, reject)=>{
          try{
            console.log(data_to_send, content_type)
            axios.post(url, data_to_send, {
              headers: {
                'Content-Type': content_type
              }
            }).then((result)=>{
              console.log("search results: ", result)
              const product_results = result.data.results[0].hits
              console.log("search results are: ", JSON.stringify(product_results))
              resolve(product_results)
            }, (err)=>{
              console.log("second_error was:", err)
              resolve("SERVER_ERROR")
            })
          }
          catch(error){
            console.log("second_error was:", error)
            resolve("SERVER_ERROR")
          }
        }).then((search_result)=>{
          //search for similar products
          if(search_result !== "SERVER_ERROR"){
              
            set_search_results(search_result)
            set_refresh_status("CHANGED")
            // set_your_choice(product_select_data[selected_products[0]])
            set_spinner(false)
            return {
              "products": search_result,
              "status": "CHANGED"
            }
            
          } 
          else{
            console.log("there was an issue with your search")
            //navigate('/')
          }    
      })
        
    }    
}


 

  function manageSearchResults(request){
    console.log("App callback, request received: ", request)
    if(request){
      set_spinner(true)
      getSearchResults(request)
    }
    //
    
  }

  function AudioRequest(audio_file){
    set_spinner(true)
    
    console.log("file sent is:", audio_file)
    return new Promise(async (resolve, reject)=>{
      try{
        var formData = new FormData();
        formData.append("speech", audio_file)
        // formData.append("collection", "mens_t_shirts");
        
          axios.post('https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingVoice', formData, {
            headers: {
                'Content-Type': "multipart/form-data"
            }
          }).then((result)=>{
            console.log("search results: ", result)
            const intermediary = result.data.answer
            const product_results = JSON.parse(intermediary)["results"][0]["hits"]  //result.data["answer"]["results"][0]["hits"]
            console.log("search results are: ", JSON.stringify(product_results))
            set_user_request({"u_request": result.data.u_request, "type": "speech"})

            resolve(product_results)
          }, (err)=>{
            console.log("second_error was:", err)
            resolve(err)
          })
        }
        catch(error){
          console.log("second_error was:", error)
          resolve(error)
        }
      }).then((search_result)=>{
        //search for similar products
        if(search_result !== "SERVER_ERROR"){
            
          set_search_results(search_result)
          set_refresh_status("CHANGED")
          // set_your_choice(product_select_data[selected_products[0]])
          set_spinner(false)
          return {
            "products": search_result,
            "status": "CHANGED"
          }
          
        } 
        else{
          console.log("there was an issue with your search")
          set_spinner(false)
          window.alert("There was an issue with your request, please try again", search_result)
        }    
    })
  }


  return (
    <div style={{"width": width}} className="App">
      <div style={{"opacity": spinner ? 0.2 : 1}}>

      
        <Tabs
          defaultActiveKey="search"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="search" title="Multi-Modal Search">
            <div style={{"width": "100%", "margin": "auto"}}>

              {!loading_new_choices ?
              
            
                
                <Container style={{"width": 0.8*width, "margin": "auto"}}>
                 
                    {search_results ? 
                      <div>
                        <Row xl={1}lg={1} md={1} sm={1} xs={1}>
                          {user_request.type === "image" ?
                          <Col>
                          <h5>Your request:</h5>
                            <img alt={"u_request"} src={user_request.u_request} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                          </Col>
                          :
                          <h4>Your request: {user_request.u_request}</h4>
                        }
                        </Row>

                        <Row xl={4}lg={4} md={3} sm={3} xs={2}>
                          {search_results.map((item, index)=>{
                            return( 
                              <Col key={index}>
                                <img alt={index} src={item.document.src} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                              </Col>
                            )
                          })}
                        </Row>
                        
                      </div>
                    :
                    <Row xl={4}lg={4} md={3} sm={3} xs={2}>
                      {product_results.map((item, index)=>{
                        return(
                          <Col key={index}>
                            <img alt={index} src={item.src} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                          </Col>
                        )
                      })}
                    </Row>
                      
                    }
                  

                  <Search HomeCallBack={manageSearchResults} SearchResults={product_results} AudioRequestCallback={AudioRequest}/>
                  {/* <Search/> */}

                </Container>

                :
                <Spinner animation='border'/>

              }

            </div>
            
          </Tab>

          <Tab className='center' eventKey="personalised" title="Similar-Style Search">
            <ItemSelection/>
          </Tab>

        </Tabs>
      </div>
    
    

      <div className='center'>
          {spinner && 
          <div>
            <Spinner animation='border'/>
            <h2 style={{"fontWeight": "bold"}}>Sit back whilst we create a personalised shopping experience for you </h2>
            <br/>
            <p>Note - your initial request may take a while to load, because the machine learning model is being loaded from memory, subsequent responses will load quickly. We will soon cache the model on our server for fast & instantaneous responses at all times</p>
          </div>
          }
      </div>
      
    </div>
  );
}

export default Home;
