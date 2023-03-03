const functions = require("firebase-functions");
const admin = require('firebase-admin')
const axios  = require('axios')
const cors = require('cors')({origin: "*"});
const similarity = require( 'compute-cosine-similarity' );
const API_KEY = process.env.OPEN_AI

admin.initializeApp();

// const product_data = require('./products')

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//

let cosine_sim_array = []

function cosineSim(u_request_embeddings){
    cosine_sim_array = []
    return new Promise((resolve, reject)=>{
        admin.firestore().collection("test_products").get().then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                cosine_sim_array.push({
                   "name": doc.data()["name"],
                   "src":  doc.data()["image_url"],
                   "cosine_sim":  similarity(u_request_embeddings, doc.data()["text_embedding"])
                   
                })
            })
            if(cosine_sim_array.length === querySnapshot.size){
                resolve(cosine_sim_array)
            }
        })
    })
}

function rank_cosine_sim(a, b) {
    // Use toUpperCase() to ignore character casing
    const cos_sim_A = a["cosine_sim"]
    const cos_sim_B = b["cosine_sim"]
  
    let comparison = 0;
    if (cos_sim_B > cos_sim_A){
        comparison = 1;
    } 
    if (cos_sim_A > cos_sim_B){
        comparison = -1;
    } 

    return comparison;


}
  


exports.search = functions.https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, ()=>{
        functions.logger.info("Hello logs!", {structuredData: true});

        //receive user request and generate embeddings for the request
        const user_request = request.body["request"]

        axios.post('https://api.openai.com/v1/embeddings',
            {
                "input": user_request,
                "model":"text-embedding-ada-002"
            },
            {
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
                }
            }
        ).then((user_request_embeddings)=>{
            const embedding_vector = user_request_embeddings["data"]["data"][0]["embedding"]
            //compare the user request embeddings to product text embeddings
            //and obtain a cosine_similarity score (%)
            console.log("openai response: ", user_request_embeddings["data"])
            cosineSim(embedding_vector).then((result)=>{
                //rank the products frommost similar to least similar
                return(result.sort(rank_cosine_sim)) 
            }).then((final_array)=>{
                // response.set('Access-Control-Allow-Origin', '*');
                response.header({"Access-Control-Allow-Origin": "*"})
                return response.send({"result": final_array})
            })
        })
    })
    
      
});


exports.getPersonalisedProducts = functions.https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, ()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        const available_products = request.body["available_products"]
        const selected_products =  request.body["selected_products"]

        const user_request = available_products[selected_products[0]]["thumbnailCaption"]
        console.log("user_request received is: ", user_request)
        axios.post('https://api.openai.com/v1/embeddings',
            {
                "input": user_request,
                "model":"text-embedding-ada-002"
            },
            {
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
                }
            }
        ).then((user_request_embeddings)=>{
            const embedding_vector = user_request_embeddings["data"]["data"][0]["embedding"]
            //compare the user request embeddings to product text embeddings
            //and obtain a cosine_similarity score (%)
            console.log("openai response: ", user_request_embeddings["data"])
            cosineSim(embedding_vector).then((result)=>{
                //rank the products frommost similar to least similar
                return(result.sort(rank_cosine_sim)) 
            }).then((final_array)=>{
                let array_to_send = []
                let i = 0
                for(i; i < 24; i ++){
                    array_to_send.push(final_array[i])
                }
                if(i === 24){
                    response.header({"Access-Control-Allow-Origin": "*"})
                    return response.send({
                        "received": available_products[selected_products[0]],
                        "result": array_to_send
                    })
                }
                // response.set('Access-Control-Allow-Origin', '*');
                
            })
        })
    })
    
      
});
