import {React, useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import useWindowSize from './hooks/useWindow';
import ItemSelection from './pages/ItemSelection';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PreferenceSelection from './pages/PreferenceSelection';
import PersonalisedResults from './pages/PersonalisedResults';
import axios from 'axios';
import { mens_t_shirts } from './data/mens_t_shirts';
import { SearchClient as TypesenseSearchClient } from "typesense";



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

  useEffect(()=>{
    
    const url = mens_t_shirts[0].src
    if(model_initialiser === 0){
      try{
        // axios.get(url, {
        //   responseType: 'blob'
        // }).then(async (response)=>{
        //   if(response.status === 200){
        //     console.log("image response: ", response)
        //     // resolve(1)
        //     // const blob_data = response.data
        //     const file = new File([response.data], "test.jpg")
        //     console.log("blob is", response.data)
        //     console.log("file is ", file)
    
        //     var formData = new FormData();
        //     formData.append("image", file);
                var formData = {"text": "blue t-shirt"}
    
              axios.post('https://europe-west2-clip-embeddings.cloudfunctions.net/getTextEmbedding', formData, {
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then((result)=>{
                const embedding = (result.data)
                console.log("type of embedding ", [ embedding.length, embedding[0].length ])
                console.log("embedding is: ", JSON.stringify(embedding))
                console.log("embedding0 is: ", JSON.stringify(embedding[0]))
                // let searchRequests = {
                //   'searches': [
                //     {
                //       'collection': 'mens_t_shirts',
                //       'q': '*',
                //       'vector_query' : `vec:(${JSON.stringify(embedding[0])}, k:100)`
                //     }
                //   ]
                // }
                // let commonSearchParams = {}
                // client.multiSearch.perform(searchRequests, commonSearchParams).then((search_result)=>{
                //   console.log(search_result)
                // })
                
                
                return(embedding)
              })
        //   }
        //   if(response.status === 404){
        //     console.log("error image does not exist:")
        //     return null
        //   }
        // })
        
      }
      catch(error){
        console.log("second_error was:", error)
        return null
      }
      
    }
    
    
  }, [])
  
  return (
    <div style={{"width": width}} className="App">

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/preference-selection/:id" element={<PreferenceSelection/>}/>
        <Route path="/personalised-results/:id" element={<PersonalisedResults/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
