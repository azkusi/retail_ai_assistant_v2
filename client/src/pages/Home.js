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


function Home() {

  // const product_results = useGetResults().products
  // const refresh_status = useGetResults().status

  const [product_results, set_product_results] = useState(product_data)
  const [refresh_status, set_refresh_status] = useState("NO_CHANGE")

  const width = useWindowSize().width
  const height = useWindowSize().height
  const [spinner, set_spinner] = useState(false)
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


  function getResults(request){
    // const [result_to_send, set_result_to_send] = useState(product_data)
    // const [status, set_status] = useState("NO_CHANGE")

    console.log("Request received: ", request)
    // useEffect(()=>{
        
        if((request.u_request !== null) && (request.u_request !== undefined)){
            console.log("sending request from getResults hook")
            axios.post('https://us-central1-retail-assistant-demo.cloudfunctions.net/search',
              {
                  "request": request.u_request,
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


function uploadFileComparison(data){
  const file = data["u_request"]
  const projectStorage = firebaseApp.storage();
  const projectFirestore = firebaseApp.firestore();

  set_spinner(true)
  projectFirestore.collection("images_to_check").add({"placeholder": "placeholder"}).then((docRef)=>{
    const locationRef = docRef.id
    const storageRef = projectStorage.ref(locationRef);
    storageRef.put(file).on('state_changed', (snap) => {
      let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      console.log(percentage, "% loaded");
      }, (err) => {
      console.log(err);
      //set an error
      }, async () => {
      const url = await storageRef.getDownloadURL();
      const createdAt = Date.now();
      projectFirestore.collection("images_to_check").doc(locationRef).get().then(async (doc)=>{
        console.log("Finished uploading")
          return await projectFirestore.collection("images_to_check")
          .doc(locationRef).update({"image_url": url, "created_at": createdAt});
      }).then(()=>{
        axios.post('https://us-central1-retail-assistant-demo.cloudfunctions.net/compareImages',
            {
                "source_url": url,
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
      })
    })
  })    
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
      <div style={{"opacity": spinner ? 0.2 : 1}}>

      
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

                <Search HomeCallBack={manageSearchResults} HomeSecondCallBack={uploadFileComparison}/>
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
          {spinner && 
          <div>
            <Spinner animation='border'/>
            <h3>Sit back whilst we create a personalised shopping experience for you </h3>
            <h5>Note - this service does not <span style={{"fontWeight": "bold"}}>yet</span> use a vector database, hence the vector search may take up to 60 secs </h5>
          </div>
          }
      </div>
      
    </div>
  );
}

export default Home;
