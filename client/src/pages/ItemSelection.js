/* eslint-disable no-loop-func */
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useWindowSize from "../hooks/useWindow";
import Dropdown from 'react-bootstrap/Dropdown';
import '../App.css';
import {Button} from 'react-bootstrap';
import { product_data } from '../data/products';
import axios from 'axios';

const {db} = require('../config')

function sendProducts(i){
  return new Promise((resolve, reject)=>{
    axios.post('https://api.openai.com/v1/embeddings',
    {
        "input": product_data[i]["thumbnailCaption"],
        "model":"text-embedding-ada-002"
    },
    {
        headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
        }
    }
    ).then((result)=>{
        console.log(`result for ${i} is`, JSON.stringify(result["data"]))
        const embedding = result["data"]["data"][0]["embedding"]
        product_data[i]["embedding"] = embedding
        db.collection("test_products").add({
          "name": product_data[i]["thumbnailCaption"],
          "image_url": product_data[i]["src"],
          "text_embedding": embedding,
          "image_embedding": ""
        }).then(()=>{
          console.log("data is", result["data"]["data"][0]["embedding"])
          console.log("wrote to db")
          resolve("Done")
        })
        
    })
  })
  
}


function ItemSelection(props) {
  const width = useWindowSize().width
  const height = useWindowSize().height

  
  

  return (
    
    <div className='center'>
        <Dropdown >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select an item you're looking for
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/preference-selection/mens_tops">Men's T-Shirts and Tops</Dropdown.Item>
                <Dropdown.Item href="/preference-selection/mens_shoes">Men's Shoes</Dropdown.Item>
                <Dropdown.Item href="/preference-selection/womens_tops">Women's Tops</Dropdown.Item>
                <Dropdown.Item href="/preference-selection/womens_shoes">Women's Shoes</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>

            <Button
              onClick={ async ()=>{
                let i = 0;
                for(i; i < 500; i++){
                  await sendProducts(i)
                }
              }}
            >
              Products To firebase
            </Button>
    </div>  
          
        
  );
}

export default ItemSelection;
