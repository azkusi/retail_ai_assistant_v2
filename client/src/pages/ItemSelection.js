/* eslint-disable no-loop-func */
import { React, useState } from 'react';
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





function ItemSelection(props) {  

  const [mens_ts, set_mens_ts] = useState(mens_t_shirts)
  const [mens_trous, set_mens_trous] = useState(mens_trousers) 
  const API_KEY_DEEP_AI = process.env.API_KEY_DEEP_AI
  const API_KEY_OPEN_AI = process.env.API_KEY_OPEN_AI

  // let db;
  let projectStorage;
  let projectFirestore;

  let no_file_count = 0
  let file_count = 0;

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

//   function sendProducts(product_instance, product_type){
//     if(product_type === "mens_trousers"){
//       db.collection("mens").doc("1").collection("mens_trousers").add({
//         "name": product_instance["thumbnailCaption"],
//         "src": product_instance["src"],
//       })    
//     }
//     if(product_type === "mens_t_shirts"){
//       db.collection("mens").doc("1").collection("mens_t_shirts").add({
//         "name": product_instance["thumbnailCaption"],
//         "src": product_instance["src"],
//       })    
//     }
    
//   }



//   async function t_shirts_image_FB(){
//   const projectStorage = firebaseApp.storage();
//   const projectFirestore = firebaseApp.firestore();
  
//   let i = 0
//   let names = new Set()


//       await db.collection("mens").doc("1").collection("mens_t_shirts")
//       .get().then((querySnapshot)=>{
//         querySnapshot.forEach(async (doc)=>{
//           console.log("data from doc: ", doc.data())
//           const locationRef = doc.id
//           try{
//             axios.get(doc.data()["src"], {
//               responseType: "blob"
//               }).then(async (response)=>{
//                 console.log(response)
//                 console.log(response.data)
              
//               }, (()=>{
//                   console.log("Deleting", doc.id)
//                   return projectFirestore.collection("mens").doc("1").collection("mens_t_shirts")
//                   .doc(locationRef).delete()
//                 }
//               ))
              
//             }
//             catch(error){
//               console.log(error)
//               console.log("Deleting", doc.id)
//               return projectFirestore.collection("mens").doc("1").collection("mens_t_shirts")
//               .doc(locationRef).delete();
//             }
//         })
//       })      
      
  

      
// }

// function getEmbedding(doc){
//   return new Promise((resolve, reject)=>{
//     axios.post('https://api.openai.com/v1/embeddings',
//       {
//           "input": doc.data()["name"],
//           "model":"text-embedding-ada-002"
//       },
//       {
//           headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${API_KEY_OPEN_AI}`
//           }
//       }
//   ).then((result)=>{
//     resolve(result.data)
//   })
//   })
    
// }


// async function insertEmbeddingsTrousers(){

//   db.collection("mens").doc("1").collection("mens_trousers").get()
//   .then((querySnapshot)=>{
//     querySnapshot.forEach(async(doc)=>{
//       if(!("text_embeddings" in doc.data())){
//         console.log("no text embeddings")
//         getEmbedding(doc).then((embedding)=>{
//           console.log("result obtained")
//           // console.log("embedding was: ", embedding["data"][0]["embedding"])
//           db.collection("mens").doc("1")
//           .collection("mens_trousers").doc(doc.id).update({
//               "text_embeddings": embedding["data"][0]["embedding"]
//           }).then(()=>{
//             console.log("embedding placed into: ", doc.id)
//           })
//          })    
//       }else{
//         console.log("text embeddings already in")
//       }
           
//     })
    
//   })
  
// }



  return (
    
    <div className='center'>
        <Dropdown >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select an item you're looking for
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/preference-selection/mens_t_shirts">Men's T-Shirts</Dropdown.Item>
                <Dropdown.Item href="/preference-selection/mens_trousers">Men's Trousers</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>

            
            {/* <Button
              onClick={()=>{
                insertEmbeddingsTrousers()
              }}
            >
              Trousers To FBURL
            </Button> */}
            
    </div>  
          
        
  );
}

export default ItemSelection;
