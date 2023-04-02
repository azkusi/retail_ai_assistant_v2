/* eslint-disable no-loop-func */
import { React, useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import useWindowSize from "../hooks/useWindow";
import Dropdown from 'react-bootstrap/Dropdown';
import {Button} from 'react-bootstrap'
import '../App.css';
import {mens_trousers} from '../data/mens_trousers'
import {mens_t_shirts} from '../data/mens_t_shirts'
import { db } from '../config';
import axios from 'axios';
import { firebaseApp } from '../config';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage"

import { plt_womens_clothing } from '../data/PLT_1_240';
const Typesense = require('typesense')



 



function ClusterInserts(props) {  

  const [mens_ts, set_mens_ts] = useState(mens_t_shirts)
  const [mens_trous, set_mens_trous] = useState(mens_trousers) 
  const API_KEY_DEEP_AI = process.env.DEEP_AI
  const API_KEY_OPEN_AI = process.env.OPEN_AI
  const PINECONE_API_KEY = process.env.PINECONE
  const TYPESENSE_API_KEY = "0ay9AbptlTqyP2egi7V6tXYSm0fRSolX"
  const [embedding, set_embedding] = useState(null)
  // const [trousers_insert, set_trousers_insert] = useState([])
  const navigate = useNavigate()


  // let db;
  let projectStorage;
  let projectFirestore;



  // let trousers_insert = []

  if (!firebase.apps.length) {
    firebaseApp()
    db = firebase.firestore()
    projectStorage = firebase.storage();
    projectFirestore = firebase.firestore();
  }else {
  let db = firebase.app().firestore() // if already initialized, use this one
    projectStorage = firebase.app().storage();
    projectFirestore = firebase.app().firestore();

  }

  let client = new Typesense.Client({
                'nodes': [{
                  'host': 'j1e5iohdgu2ya7nqp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
                  'port': '443',      // For Typesense Cloud use 443
                  'protocol': 'https'   // For Typesense Cloud use https
                }],
                'apiKey': 'qVEACzIepH6miYVADVgngiTOZOjxjKiR',
                'connectionTimeoutSeconds': 10
              })

  useEffect(()=>{
    
  }, [])

  
  

async function getImageEmbedding(url){
  return new Promise(async (resolve, reject)=>{
    const CORS_ANYWHERE_URL = 'https://cors-anywhere.herokuapp.com/';

    // url = url + "?not-from-cache-please";
    try{
      const response = await axios.post(`https://europe-west2-clip-embeddings.cloudfunctions.net/getImageEmbedding-on-server`,
        {
            "url": url
        }
      
    //     {
    //     responseType: 'blob'
    //   }
      )
      if(response.status === 200){
        console.log("image response: ", response)
        console.log(response.data); // The image data
        const embedding = response.data

        resolve(embedding)
        // const blob_data = response.data
        // const file = new File([response.data], "test.jpg")
        // console.log("blob is", response.data)
        // console.log("file is ", file)

        // var formData = new FormData()
        // formData.append("image", file)

        //   axios.post('https://europe-west2-clip-embeddings.cloudfunctions.net/getImageEmbedding', formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }
        //   }).then((result)=>{
        //     const embedding = (result.data)
        //     console.log("type of embedding ", typeof(embedding))
        //     console.log("embedding is: ", JSON.stringify(embedding))
        //     resolve(embedding)
        //   })
      }else{
        console.log("error image does not exist:")
        resolve(0)
      }
    //   if(response.status === 404){
    //     console.log("error image does not exist:")
    //     resolve(0)
    //   }
    }
    catch(error){
      console.log("Retrieval error occured:", error)
      resolve(0)
    }
  })
  

    
}


  return (
    <div>
      
      <Button 
        style={{"margin": "5px", "position": "fixed", "top": "2%", "left": "2%"}} 
        onClick={()=>{navigate('/#search')}}
    >
        Back
    </Button>
    
      <div className='center'>
          
              
              <Button
                onClick={async ()=>{
                  // let i = 970
                  let i = 11
                  let plt_womens_clothing_insert = []
                  // let new_mens_trousers = []
                  // let legit_count = 0;
                  console.log("plt_womens_clothing length", plt_womens_clothing[0].products.length.toString())
                  for(i; i < plt_womens_clothing[0].products.length; i++){
                    console.log("i is : ", i , "plt_womens_clothing length is: ", plt_womens_clothing[0].products.length.toString())
                    await getImageEmbedding(plt_womens_clothing[0].products[i]["product_image_url"])
                    .then(async (embedding)=>{
                        if((embedding !== 0) ){
                            console.log("embedding for retailer image is: ", embedding)
                            let retailer;
                            let url = plt_womens_clothing[0].products[i]["product_url"]

                            if(url.split("/")[2].split('.').includes("www")){
                                console.log("yes")
                                retailer = (url.split("/")[2].split('.')[1])
                            }
                            else{
                                retailer = (url.split("/")[2].split('.')[0])
                            }
                            console.log("parseInt: ", parseInt(plt_womens_clothing[0].products[i]["price"].replace("£", "")),)
                            plt_womens_clothing_insert.push({
                                // "ID": i,
                                "vec": embedding,
                                "description": plt_womens_clothing[0].products[i]["description"],
                                "price": parseInt(plt_womens_clothing[0].products[i]["price"].replace("£", "")),
                                "product_url": plt_womens_clothing[0].products[i]["product_url"],
                                "product_image_url": plt_womens_clothing[0].products[i]["product_image_url"],
                                "retailer": retailer,
                            })

                            if(((i+1) % 10 === 0) && (i !== 0)){
                                console.log("womens_clothing_insert embeddings array: ", plt_womens_clothing_insert)

                                try{
                                console.log("i is ", i)
                                await client.collections('womens_clothing').documents().import(plt_womens_clothing_insert, {action: 'create'})
                                .then((result)=>{
                                    console.log("INSERT DONE", (i / 100).toString(), result)
                                }, (error)=>{
                                    console.log("error was: ", error.importResults)
                                })
                                }
                                catch(err){
                                console.log("error was: ", err)
                                }
                                
                                plt_womens_clothing_insert = []
                            }
                            }
                            else{
                            console.log("issue with embedding insert")
                            }
                      
                    })
                    
                    // }
                    // if(i === plt_womens_clothing[0].length - 1){
                    //   console.log("plt_womens_clothing[0] embeddings: ", plt_womens_clothing_insert)
                    //   client.collections('womens_clothing').documents().import(plt_womens_clothing_insert, {action: 'create'})
                    //   .then((result)=>{
                    //     console.log("FINAL INSERT DONE", result)
                    //   }).then(()=>{

                    //   })
                    // }
                  }
                  
                }}
              >
                Insert Womens Clothing Embeddings
              </Button>

              

              {/* <Button
                onClick={()=>{
                  client.collections().retrieve().then((result)=>{
                    console.log("collections: ", result)

                  })
                }}
              >
                Create Collection
              </Button> */}


              {/* <br/>
              <br/>
              <Button
                onClick={()=>{
                  getTextEmbedding()
                }}
              >
                Warm up embeddings
              </Button> */}
              
      </div>  
    </div>
          
        
  );
}

export default ClusterInserts;
