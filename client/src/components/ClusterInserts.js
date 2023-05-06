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

import {cos} from '../data/cos'
import {missguided} from '../data/missguided'
import {arket} from '../data/retailer_products_jsons/arket';
import {bershka} from '../data/retailer_products_jsons/bershka';
import {boohoo} from '../data/retailer_products_jsons/boohoo';
import {lululemon} from '../data/retailer_products_jsons/lululemon';
import {nastygal} from '../data/retailer_products_jsons/nastygal';
import {next} from '../data/retailer_products_jsons/next';
import {pullandbear} from '../data/retailer_products_jsons/pullandbear';
import {riverisland} from '../data/retailer_products_jsons/riverisland';
import { reiss } from '../data/retailer_products_jsons/reiss';
import {selfridges} from '../data/retailer_products_jsons/selfridges';
import {uniqlo} from '../data/retailer_products_jsons/uniqlo';

const Typesense = require('typesense')



 



function ClusterInserts(props) {  

  // const retailers = ["arket", "bershka", "boohoo", "lululemon", "nastygal", "next", "pullandbear", "riverisland", "reiss", "selfridges", "uniqlo"]

  const retailers_object = {
    "arket": arket,
    "bershka": bershka,
    "boohoo": boohoo,
    "lululemon": lululemon,
    "missguided": missguided,
    "nastygal": nastygal,
    "next": next,
    "pullandbear": pullandbear,
    "riverisland": riverisland,
    "reiss": reiss,
    "selfridges": selfridges,
    "uniqlo": uniqlo,
    "cos": cos

  }

  const retailers_converter = {

    "arket": "Arket",
    "bershka": "Bershka",
    "boohoo": "Boohoo",
    "lululemon": "Lululemon",
    "missguided": "Missguided",
    "nastygal": "Nasty Gal",
    "next": "Next",
    "pullandbear": "Pull and Bear",
    "riverisland": "River Island",
    "reiss": "Reiss",
    "selfridges": "Selfridges",
    "uniqlo": "Uniqlo",
    "cos": "COS",
  }
  
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
                'connectionTimeoutSeconds': 180
              })

  useEffect(()=>{
    
  }, [])

  



  async function getTextEmbedding(text){
    return new Promise(async (resolve, reject)=>{
      axios.post(`https://europe-west2-clip-embeddings.cloudfunctions.net/getTextEmbedding-on-server`,
          {
              "text": text
          }

      )
      .then((response)=>{
        if(response.status === 200){
          console.log("text response: ", response)
          console.log(response.data); // The image data
          const embedding = response.data
  
          resolve(embedding)
        }
      })
      .catch((error)=>{
        console.log("Retrieval error occured:", error)
        resolve(0)
      })
    })
  }
      
  

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
        console.log(`error retrieving image encoding:, ${response.status}, ${response.statusText}`)
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
                  let i = 0
                  let already_submitted = []
                  let products_insert = []
                  // let new_mens_trousers = []
                  // let legit_count = 0;
                  for(i; i < Object.keys(retailers_object).length; i++){
                    console.log("i is : ", i , "retailer is:", Object.keys(retailers_object)[i], "length is: ", retailers_object[Object.keys(retailers_object)[i]].length.toString())
                    for(let j = 0; j < retailers_object[Object.keys(retailers_object)[i]].length; j++){
                      if(j > 100){
                        break
                      }
                      console.log("j is : ", j)

                      await getImageEmbedding(retailers_object[Object.keys(retailers_object)[i]][j]["product_image_url"])
                      .then(async (embedding)=>{
                          if((embedding !== 0) ){
                              console.log("embedding for retailer image is: ", embedding)

                              // if(url.split("/")[2].split('.').includes("www")){
                              //     console.log("yes")
                              //     retailer = (url.split("/")[2].split('.')[1])
                              // }
                              // else{
                              //     retailer = (url.split("/")[2].split('.')[0])
                              // }
                              console.log( "parseInt: ", parseInt(retailers_object[Object.keys(retailers_object)[i]][j]["price"].replace("£", "").replace(" ", "").replace("GBP", "").replace("$", "")) )
                              // if(!already_submitted.includes(cos[i]["title"])){
                              //     already_submitted.push(cos[i]["title"])
                              //     console.log("Pushing")
                                //   cos_products_insert.push({
                                //   // "ID": i,
                                //   "vec": embedding,
                                //   "description": number_six_products[i]["title"],
                                //   "price": parseInt(number_six_products[i]["price"].replace("£", "").replace(" ", "").replace("GBP", "")),
                                //   "product_url": number_six_products[i]["link"],
                                //   "product_image_url": number_six_products[i]["image_link"],
                                //   "retailer": retailer,
                                // })
                              // }
                              // else{
                              //   console.log("Already included")
                              // }

                              // if(((i+1) % 10 === 0) && (i !== 0)){
                                products_insert.push({
                                // "ID": i,
                                "vec": embedding,
                                "description": retailers_object[Object.keys(retailers_object)[i]][j]["description"],
                                "price": parseInt(retailers_object[Object.keys(retailers_object)[i]][j]["price"].replace("£", "").replace(" ", "").replace("GBP", "").replace("$", "") ),
                                "product_url": retailers_object[Object.keys(retailers_object)[i]][j]["product_url"],
                                "product_image_url": retailers_object[Object.keys(retailers_object)[i]][j]["product_image_url"],
                                "retailer": retailers_object[Object.keys(retailers_object)[i]][j]["retailer"],
                              })

                              if(products_insert.length === 10){
                                  console.log("products embeddings array: ", products_insert)

                                  try{
                                    console.log("i is ", i)
                                    let client = new Typesense.Client({
                                      'nodes': [{
                                        'host': 'j1e5iohdgu2ya7nqp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
                                        'port': '443',      // For Typesense Cloud use 443
                                        'protocol': 'https'   // For Typesense Cloud use https
                                      }],
                                      'apiKey': 'qVEACzIepH6miYVADVgngiTOZOjxjKiR',
                                      'connectionTimeoutSeconds': 180
                                    })
                                    await client.collections(Object.keys(retailers_object)[i]).documents().import(products_insert, {action: 'create'})
                                    .then((result)=>{
                                        console.log(`INSERT DONE for ${Object.keys(retailers_object)[i]}`, (i / 100).toString(), result)
                                    }, (error)=>{
                                        console.log("error was: ", error.importResults)
                                    }).then(async()=>{
                                      await client.collections("all_retailers").documents().import(products_insert, {action: 'create'})
                                      .then((result)=>{
                                          console.log("INSERT DONE for all_retailers", (i / 100).toString(), result)
                                      }, (error)=>{
                                        console.log("error was: ", error.importResults)
                                    })

                                    })
                                  }
                                  catch(err){
                                    console.log("error was: ", err)
                                  }
                                  
                                  products_insert = []
                              }
                            }
                            else{
                              console.log("trying text embedding instead")
                              getTextEmbedding(retailers_object[Object.keys(retailers_object)[i]][j]["description"]).then(async(textEmbedding)=>{
                                if((textEmbedding !== 0) ){
                                  console.log("embedding for retailer image is: ", textEmbedding)
    
                                  // if(url.split("/")[2].split('.').includes("www")){
                                  //     console.log("yes")
                                  //     retailer = (url.split("/")[2].split('.')[1])
                                  // }
                                  // else{
                                  //     retailer = (url.split("/")[2].split('.')[0])
                                  // }
                                  console.log( "parseInt: ", parseInt(retailers_object[Object.keys(retailers_object)[i]][j]["price"].replace("£", "").replace(" ", "").replace("GBP", "").replace("$", "")) )
                                  // if(!already_submitted.includes(cos[i]["title"])){
                                  //     already_submitted.push(cos[i]["title"])
                                  //     console.log("Pushing")
                                    //   cos_products_insert.push({
                                    //   // "ID": i,
                                    //   "vec": embedding,
                                    //   "description": number_six_products[i]["title"],
                                    //   "price": parseInt(number_six_products[i]["price"].replace("£", "").replace(" ", "").replace("GBP", "")),
                                    //   "product_url": number_six_products[i]["link"],
                                    //   "product_image_url": number_six_products[i]["image_link"],
                                    //   "retailer": retailer,
                                    // })
                                  // }
                                  // else{
                                  //   console.log("Already included")
                                  // }
    
                                  // if(((i+1) % 10 === 0) && (i !== 0)){
                                    products_insert.push({
                                    // "ID": i,
                                    "vec": textEmbedding,
                                    "description": retailers_object[Object.keys(retailers_object)[i]][j]["description"],
                                    "price": parseInt(retailers_object[Object.keys(retailers_object)[i]][j]["price"].replace("£", "").replace(" ", "").replace("GBP", "").replace("$", "") ),
                                    "product_url": retailers_object[Object.keys(retailers_object)[i]][j]["product_url"],
                                    "product_image_url": retailers_object[Object.keys(retailers_object)[i]][j]["product_image_url"],
                                    "retailer": retailers_object[Object.keys(retailers_object)[i]][j]["retailer"],
                                  })
    
                                  if(products_insert.length === 10){
                                      console.log("products embeddings array: ", products_insert)
    
                                      try{
                                        console.log("i is ", i)
                                        let client = new Typesense.Client({
                                          'nodes': [{
                                            'host': 'j1e5iohdgu2ya7nqp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
                                            'port': '443',      // For Typesense Cloud use 443
                                            'protocol': 'https'   // For Typesense Cloud use https
                                          }],
                                          'apiKey': 'qVEACzIepH6miYVADVgngiTOZOjxjKiR',
                                          'connectionTimeoutSeconds': 180
                                        })
                                        await client.collections(Object.keys(retailers_object)[i]).documents().import(products_insert, {action: 'create'})
                                        .then((result)=>{
                                            console.log(`INSERT DONE for ${Object.keys(retailers_object)[i]}`, (i / 100).toString(), result)
                                        }, (error)=>{
                                            console.log("error was: ", error.importResults)
                                        }).then(async()=>{
                                          await client.collections("all_retailers").documents().import(products_insert, {action: 'create'})
                                          .then((result)=>{
                                              console.log("INSERT DONE for all_retailers", (i / 100).toString(), result)
                                          }, (error)=>{
                                            console.log("error was: ", error.importResults)
                                        })
    
                                        })
                                      }
                                      catch(err){
                                        console.log("error was: ", err)
                                      }
                                      
                                      products_insert = []
                                  }
                                }
                                else{
                                  console.log("issue with text embedding retrieval")
                                }
                              })
                            }
                        
                      })
                      
                      // }
                      if((j === retailers_object[Object.keys(retailers_object)[i]].length - 1)){
                        console.log("products_insert embeddings: ", products_insert)
                          if(products_insert.length > 0){
                            let client = new Typesense.Client({
                              'nodes': [{
                                'host': 'j1e5iohdgu2ya7nqp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
                                'port': '443',      // For Typesense Cloud use 443
                                'protocol': 'https'   // For Typesense Cloud use https
                              }],
                              'apiKey': 'qVEACzIepH6miYVADVgngiTOZOjxjKiR',
                              'connectionTimeoutSeconds': 180
                            })
                            client.collections(Object.keys(retailers_object)[i]).documents().import(products_insert, {action: 'create'})
                            .then((result)=>{
                              console.log(`FINAL INSERT DONE for ${Object.keys(retailers_object)[i]}`, result)
                            }).then(async()=>{
                                  await client.collections("all_retailers").documents().import(products_insert, {action: 'create'})
                                  .then((result)=>{
                                    console.log("FINAL INSERT DONE for all_retailers", (i / 100).toString(), result)
                                  }, (error)=>{
                                    console.log("error was: ", error.importResults)
                              })
                            })
                        }
                        
                      }
                    }
                  }
                  
                }}
              >
                Insert Product Embeddings
              </Button>

              

              <Button
                onClick={()=>{
                  let client = new Typesense.Client({
                    'nodes': [{
                      'host': 'j1e5iohdgu2ya7nqp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
                      'port': '443',      // For Typesense Cloud use 443
                      'protocol': 'https'   // For Typesense Cloud use https
                    }],
                    'apiKey': 'qVEACzIepH6miYVADVgngiTOZOjxjKiR',
                    'connectionTimeoutSeconds': 180
                  })
                  // client.collections('all_retailers').documents().delete({'filter_by': 'product_image_url:= ""'})
                  let j = 0;
                  const retailers = Object.keys(retailers_converter)
                  for(j; j < retailers.length; j++){
                      client.collections(retailers[j]).documents().search({"q": "*", "query_by": "retailer", "per_page": 250, "page": 4})
                      .then((result)=>{
                        console.log("result was: ", result)
                        let i = 0
                        for(i; i < result.hits.length; i++){
                          console.log("i is: ", i, "collection is: ", j.toString(), "and retailer is: ", result.hits[i].document["retailer"])
                          //if(result.hits[i].document["retailer"] !== retailers[j] || result.hits[i].document["product_image_url"] === undefined || result.hits[i].document["product_image_url"] === null){

                          if(result.hits[i].document["retailer"] !== retailers_converter[retailers[j]]){
                            console.log("found differing retailers")
                            client.collections(retailers[j]).documents(result.hits[i].document["id"]).delete()
                            .then((result)=>{
                              console.log("DELETED EMPTY IMAGE URL")
                              console.log("result was: ", result)
                            })
                          }
                        }
                      })
                  
                  }
                  

                  
                }}
              >
                Delete Document
              </Button>

              {/* {embedding !== null &&
                <div>
                  <p>Embedding: {embedding}</p>
                </div>
              } */}
              
      </div>  
    </div>
          
        
  );
}

export default ClusterInserts;
