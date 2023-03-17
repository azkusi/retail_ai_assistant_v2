/* eslint-disable no-loop-func */
import { React, useEffect, useState } from 'react';
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
import { mixed_clothing } from '../data/mixed_clothing';
const Typesense = require('typesense')



 



function ItemSelection(props) {  

  const [mens_ts, set_mens_ts] = useState(mens_t_shirts)
  const [mens_trous, set_mens_trous] = useState(mens_trousers) 
  const API_KEY_DEEP_AI = process.env.DEEP_AI
  const API_KEY_OPEN_AI = process.env.OPEN_AI
  const PINECONE_API_KEY = process.env.PINECONE
  const TYPESENSE_API_KEY = "0ay9AbptlTqyP2egi7V6tXYSm0fRSolX"
  const [embedding, set_embedding] = useState(null)
  // const [trousers_insert, set_trousers_insert] = useState([])

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

  
  
async function getTextEmbedding(){
  return new Promise(async (resolve, reject)=>{
    try{
      var formData = {"text": "blue t-shirt"}
        axios.post('https://europe-west2-clip-embeddings.cloudfunctions.net/getTextEmbedding', formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((result)=>{
          const embedding = (result.data)
          console.log("type of embedding ", typeof(embedding))
          console.log("embedding is: ", JSON.stringify(embedding))
          resolve(embedding)
        }, (error)=>{
          console.log("error text could not be converted to an embedding:", error)
          reject(0)
        })
    }
    catch(error){
      console.log("error text could not be converted to an embedding:", error)
      reject(0)
    }
  })
  

    
}

async function getImageEmbedding(url){
  return new Promise(async (resolve, reject)=>{
    url = url + "?not-from-cache-please";
    try{
      const response = await axios.get(url, {
        responseType: 'blob'
      })
      if(response.status === 200){
        console.log("image response: ", response)
        // resolve(1)
        // const blob_data = response.data
        const file = new File([response.data], "test.jpg")
        console.log("blob is", response.data)
        console.log("file is ", file)

        var formData = new FormData()
        formData.append("image", file)

          axios.post('https://europe-west2-clip-embeddings.cloudfunctions.net/getImageEmbedding', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then((result)=>{
            const embedding = (result.data)
            console.log("type of embedding ", typeof(embedding))
            console.log("embedding is: ", JSON.stringify(embedding))
            resolve(embedding)
          })
      }
      if(response.status === 404){
        console.log("error image does not exist:")
        resolve(0)
      }
    }
    catch(error){
      console.log("second_error was:", error)
      resolve(0)
    }
  })
  

    
}


  return (
    
    <div className='center'>
        <Dropdown >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select an item you're looking for
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/preference-selection/mens_t_shirts">Men's T-Shirts</Dropdown.Item>
                <Dropdown.Item disabled={true} href="/preference-selection/mens_trousers">Men's Trousers</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>

            
            {/* <Button
              onClick={async ()=>{
                let i = 0
                let mixed_clothes_insert = []
                // let new_mens_trousers = []
                // let legit_count = 0;
                for(i; i < 250; i++){
                  console.log("i is : ", i , "mixed_clothing length is: ", mixed_clothing.length.toString())
                  await getImageEmbedding(mixed_clothing[i]["src"])
                  .then(async (embedding)=>{
                      if((embedding !== 0) ){
                        mixed_clothes_insert.push({
                          "ID": i,
                          "vec": embedding,
                          "name": mixed_clothing[i]["thumbnailCaption"],
                          "src": mixed_clothing[i]["src"],
                          "price": Math.floor(Math.random() * 100)
                        })

                        if(((i+1) % 10 === 0) && (i !== 0)){
                          console.log("mixed_clothes_insert embeddings array: ", mixed_clothes_insert)

                          try{
                            console.log("i is ", i)
                            await client.collections('mixed_clothing').documents().import(mixed_clothes_insert, {action: 'create'})
                            .then((result)=>{
                              console.log("INSERT DONE", (i / 100).toString(), result)
                            }, (error)=>{
                              console.log("error was: ", error.importResults)
                            })
                          }
                          catch(err){
                            console.log("error was: ", err)
                          }
                          
                          mixed_clothes_insert = []
                        }
                      }
                      else{
                        console.log("issue with embedding insert")
                      }
                    
                  })
                  
                  // }
                  // if(i === mens_t_shirts.length - 1){
                  //   console.log("trousers embeddings test: ", t_shirts_insert)
                  //   client.collections('mens_t_shirts').documents().import(t_shirts_insert, {action: 'create'})
                  //   .then((result)=>{
                  //     console.log("FINAL INSERT DONE", result)
                  //   }).then(()=>{

                  //   })
                  // }
                }
                
              }}
            >
              Insert Mixed Clothing Embeddings
            </Button> */}

            

            {/* <Button
              onClick={()=>{
                client.collections().retrieve().then((result)=>{
                  console.log("collections: ", result)
                    client.collections('mixed_clothing').documents().create().then((insert_result)=>{
                      console.log("insert result: ", result)
                    })
                })
              }}
            >
              Create Collection
            </Button>


            <br/>
            <br/>
            <Button
              onClick={()=>{
                getTextEmbedding()
              }}
            >
              Warm up embeddings
            </Button> */}
            
    </div>  
          
        
  );
}

export default ItemSelection;
