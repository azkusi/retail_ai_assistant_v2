import {React, useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import useWindowSize from './hooks/useWindow';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { mens_t_shirts } from './data/mens_t_shirts';
import { SearchClient as TypesenseSearchClient } from "typesense";
import TextResults from './pages/TextResults';

import Home from './pages/Home';
import ClusterInserts from './components/ClusterInserts';



function App() {


  const width = useWindowSize().width
  const height = useWindowSize().height
  const [model_initialiser, set_model_initialiser] = useState(0)

  let client = new TypesenseSearchClient({
    'nodes': [{
      'host': 'j1e5iohdgu2ya7nqp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
      'port': '443',      // For Typesense Cloud use 443
      'protocol': 'https'   // For Typesense Cloud use https
    }],
    'apiKey': 'qVEACzIepH6miYVADVgngiTOZOjxjKiR',
    'connectionTimeoutSeconds': 2
  })

  // useEffect(()=>{
    
  //   const url = mens_t_shirts[0].src
  //   if(model_initialiser === 0){
  //     try{
  //       axios.get(url, {
  //         responseType: 'blob'
  //       }).then(async (response)=>{
  //         if(response.status === 200){
  //           console.log("image response: ", response)
  //           // resolve(1)
  //           // const blob_data = response.data
  //           const file = new File([response.data], "test.jpg")
  //           console.log("blob is", response.data)
  //           console.log("file is ", file)
    
  //           var formData = new FormData();
  //           formData.append("image", file);
  //             var formData = {"text": "blue t-shirt", "collection": "mens_clothing"}
    
  //             axios.post('https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingText-HomePage', formData, {
  //               headers: {
  //                 'Content-Type': 'application/json'
  //               }
  //             }).then((result)=>{
  //               const embedding = (result.data)
  //               console.log("embedding is: ", JSON.stringify(embedding))
  //               console.log("embedding0 is: ", JSON.stringify(embedding[0]))
                
  //             })
  //             // .then(()=>{
  //             axios.get(mens_t_shirts[0].src, {
  //               responseType: "blob"
  //             }).then((response)=>{
  //               const file = new File([response.data], "test.jpg")
  //               console.log("blob is", response.data)
  //               console.log("file is ", file)
        
  //               var imageformData = new FormData();
  //               imageformData.append("image", file);
  //               axios.post('https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingImage-HomePage', imageformData, {
  //                 headers: {
  //                   'Content-Type': 'multipart/form-data'
  //                 }
  //               }).then((result)=>{
  //                 const embedding = (result.data)
  //                 console.log("embedding is: ", JSON.stringify(embedding))
  //                 console.log("embedding0 is: ", JSON.stringify(embedding[0]))
  //               })
  //             })
  //         }
  //         if(response.status === 404){
  //           console.log("error image does not exist:")
  //           return null
  //         }
  //       })
        
  //     }
  //     catch(error){
  //       console.log("second_error was:", error)
  //       return null
  //     }
      
  //   }
    
    
  // }, [])
  
  return (
    <div style={{"width": width}} className="App">

      <Routes>
        {/* <Route path="/" element={<Results />}/> */}
        <Route path="/" element={<Home />}/>
        <Route path="/text-search-results/:id" element={<TextResults/>}/>
        <Route path="/image-search-results/:id" element={<TextResults/>}/>
        <Route path="/cluster-inserts" element={<ClusterInserts/>}/>

      </Routes>
      
    </div>
  );
}

export default App;
