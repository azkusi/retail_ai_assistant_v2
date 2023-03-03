import { useEffect, useState } from 'react';
import axios from 'axios'
import { product_data } from '../data/products';



const useGetResults = (request)=> {
    const [result_to_send, set_result_to_send] = useState(product_data)
    const [status, set_status] = useState("NO_CHANGE")

    console.log("Request received: ", request)
    useEffect(()=>{
        
        if((request !== null) && (request !== undefined)){
            console.log("sending request from getResults hook")
            axios.post('https://us-central1-retail-assistant-demo.cloudfunctions.net/search',
              {
                  "request": request,
              }, 
              {
                headers: {
                    "Access-Control-Allow-Origin": "*"

                }
              }
            ).then((result)=>{
                console.log("get results hooked received a result: ", result.data.result)
                set_result_to_send(result.data.result)
                set_status("CHANGED")
            })
            
        }

    },[request])
    console.log("status at usegetresults: ", status)
    return {"products": result_to_send,
            "status": status}
}

export default useGetResults;
