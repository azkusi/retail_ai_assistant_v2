import '../App.css';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Row, Container, Spinner, Modal} from 'react-bootstrap';
import useWindowSize from '../hooks/useWindow';
import axios from 'axios';
import { auth, firebaseApp } from '../config';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { number_six_style } from '../data/number_six';
import { useLocation } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Header from '../components/Header';


const Typesense = require('typesense')


function SearchResults() {

  const [search_results, set_search_results] = useState(null)
  const [user_request, set_user_request] = useState(null)
  const { id } = useParams()
  const width = useWindowSize().width
  const height = useWindowSize().height
  const [spinner, set_spinner] = useState(false)
  const navigate = useNavigate()
  const [preview, set_preview] = useState(false)
  const [preview_item, set_preview_item] = useState(null)
  const [view_retailer_hovered, set_view_retailer_hovered] = useState(false)


  const [window_height, set_window_height] = useState("100vh")
  

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
    if(!id){
      navigate("/")
    }
    else{
      sendUserRequest(id)
    }
        
    
    

},[])



 
function sendUserRequest(data){
  let filtered_retailers = "NONE"
  

  // Convert the sentence to lowercase to make the comparison case-insensitive
  // const query_check = data.toLowerCase();

  // // Loop through each word in the array and check if it's in the sentence
  // query_check.forEach(word => {
  //   if (retailers_array.includes(word.toLowerCase())) {
  //     filtered_retailers = word.toLowerCase()
  //     return null;
  //   }
  // });

  // const collection = location.state.collection
  // var data_to_send = {"text": data, "collection": "all_clothing"}
  // let filtered_retailers;
  
  // if(selected_retailers.length > 0){
  //   filtered_retailers = selected_retailers
  // }
  // else{
  //   filtered_retailers = "NONE"
  // }

  set_spinner(true)
  var url = "https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingText-HomePage"

  let  data_to_send = {"text": data, "collection": "all_retailers", "retailers": filtered_retailers}

  var content_type = "application/json"
  set_user_request(data)
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
          set_window_height("100%")
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
        // set_your_choice(product_select_data[selected_products[0]])
        set_spinner(false)
        return {
          "products": search_result,
          "status": "CHANGED"
        }
        
      } 
      else{
        set_search_results("NO RESULTS FOR THIS SEARCH")
        console.log("there was an issue with your search")
        //navigate('/')
        window.alert("There was an issue with your search")
      }    
  })          
}


  return (
    <div style={{"width": width, color: number_six_style[0].color, 
      fontFamily: number_six_style[0].fontFamily, 
      backgroundColor: number_six_style[0].backgroundColor, height: window_height}} className="App">
      
      <Header/>
      <div style={{"opacity": spinner ? 0.2 : 1}}>
        <button 
            className="btn btn-outline-secondary"
            style={{
                "margin": "5px", "position": "fixed", "top": "5%", "left": "0%",
                backgroundColor: "transparent", 
                border: "none", 
                color: "grey", 
                padding: "0.5rem 1rem"
            }} 
            onClick={()=>{
              if(auth.currentUser){
                db.collection("users").where("email", "==", auth.currentUser.email).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, " => ", doc.data());
                        navigate(`/home/b-${doc.id}`)
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                }
                );
              }
              else{
                navigate("/")
              }
                
                
            }}
        >
            Back
        </button>
        <br/>      
          <br/>
            <div style={{"width": "100%", "margin": "auto"}}>
              {/* <Typography variant="h1" component="h1"> */}
                <h2>Your Search Results</h2>
              {/* </Typography> */}

              <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "30px",
                  flexDirection: "column"

              }}>
                <br/>
                  
              </div>
              <br/>


              {search_results &&
              <div>
                
                <Container style={{"width": 0.8*width, "margin": "auto"}}>
                 
                  <div>

                    <Row xl={4}lg={4} md={3} sm={3} xs={2}>
                      {search_results.map((item, index)=>{
                        return( 
                          <Link 
                              onClick={()=>{set_preview(true)
                                console.log("item is:", item)
                                set_preview_item(item.document)
                              }} 
                              key={index}
                              to="#"
                              // to={item.document.retailer_url}
                          >
                              <img alt={index} src={item.document["product_image_url"]} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                              {/* <label>{item.document["retailer"]}</label> */}
                              <label>{item.document["description"]}</label>
                              <label>£{item.document["price"]}</label>

                          </Link>
                        )
                      })}
                    </Row>
                    
                  </div>

                  {preview && 
                    <Modal show onHide={()=>{set_preview(false)}}>
                      <Modal.Header closeButton/>
                      <Modal.Body style={{"textAlign": "center"}}>
                          {/* <img alt={preview_item.name} src={preview_item.src} style={{"maxHeight": 0.5*height, "maxWidth": 0.5*width, "padding": "10px"}}/> */}
                        <img alt={preview_item["description"]} src={preview_item["product_image_url"]} style={{"maxHeight": 0.5*height, "maxWidth": 0.5*width, "padding": "10px"}}/>
                        <h5>{preview_item["description"]}</h5>
                        <label>£{preview_item["price"]}</label>

                      </Modal.Body>
                      <Modal.Footer>
                          {/* <Button variant="secondary" onClick={handleClose}>
                              Add to Saved
                          </Button> */}
                          <button variant="primary"
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
                            }}
                          >
                              View on Retailer's Site
                              {/* View on {item.document.retailer_name} */}
                          </button>
                      </Modal.Footer>
                  </Modal>
                }
                

                </Container>
                </div>

                // :
                // <Spinner animation='border'/>

              }

            </div>
      </div>
    
    

      <div className='center'>
          {spinner && 
          <div>
            <Spinner animation='border'/>
            <h2 style={{"fontWeight": "bold"}}>Loading your results</h2>
          </div>
          }
      </div>
      
    </div>
  );
}

export default SearchResults;