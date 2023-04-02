const functions = require("firebase-functions");
const admin = require('firebase-admin')
const axios  = require('axios')
const cors = require('cors')({origin: "*"});
const similarity = require( 'compute-cosine-similarity' );
const deepai = require('deepai'); // 
const API_KEY_OPEN_AI = process.env.OPEN_AI
const API_KEY_DEEP_AI = process.env.DEEP_AI

admin.initializeApp();

// const product_data = require('./products')

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//

let cosine_sim_array = []

function cosineSim(u_request_embeddings, type){
    console.log("got to cosine func")
    cosine_sim_array = []
    return new Promise((resolve, reject)=>{
        if(type === "mens_trousers"){
            console.log("type is: ", type)
            admin.firestore().collection("mens")
            .doc("1").collection("mens_trousers")
            .get().then((querySnapshot)=>{
                console.log("got to cosine sim doc")
                console.log(JSON.stringify(querySnapshot.docs))
                console.log(querySnapshot.docs[0].data()["name"])
                
                let i=0
                for(i; i < 150; i++){  
                    cosine_sim_array.push({
                        "name": querySnapshot.docs[i].data()["name"],
                        "src":  querySnapshot.docs[i].data()["src"],
                        "cosine_sim":  similarity(u_request_embeddings, querySnapshot.docs[i].data()["text_embeddings"])
                        
                    })
                }
                if(cosine_sim_array.length === 150){
                    resolve(cosine_sim_array)
                }
            })
        }
        else{
            console.log("type is: ", type)
            admin.firestore().collection("mens")
            .doc("1").collection("mens_t_shirts")
            .get().then((querySnapshot)=>{
                console.log("got to cosine sim doc")
                console.log(JSON.stringify(querySnapshot.docs))
                console.log(querySnapshot.docs[0].data()["name"])
                
                let i=0;
                for(i; i < 150; i++){  
                    cosine_sim_array.push({
                        "name": querySnapshot.docs[i].data()["name"],
                        "src":  querySnapshot.docs[i].data()["src"],
                        "cosine_sim":  similarity(u_request_embeddings, querySnapshot.docs[i].data()["text_embeddings"])
                        
                    })
                }
                if(cosine_sim_array.length === 150){
                    resolve(cosine_sim_array)
                }
            })
        }
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


// exports.getDummyDataEmbeddings = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
//     // response.set('Access-Control-Allow-Origin', '*');

//     cors(request, response, ()=>{
//         functions.logger.info("Hello logs!", {structuredData: true});
//         //receive user request and generate embeddings for the request
//         admin.firestore().collection("mens").doc("1").collection("mens_trousers").get().then((querySnapshot)=>{
//             querySnapshot.forEach(async (doc)=>{
//                 await insertEmbeddingsTrousers(doc)
//             })
            
//         }).then(()=>{
//             console.log("done first embeddings insert")
//             response.header({"Access-Control-Allow-Origin": "*"})
//                     return response.send({
//                     "result1": "finished"
//                     })
//         })
        
//     })
    
      
// });


exports.getImages = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, ()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        const url = request.body.url
        console.log("url: ", url)

        try{
            axios.get(url, {
                responseType: 'blob'
            }).then((res)=>{
                console.log("got to axios")
                const buffer = Buffer.from(res.data, 'binary')
                response.set('Content-Type', 'image/png')
                response.send(buffer)

            },(err)=>{
                    console.log("error: ", err)
                    return response.send({
                        "result": "error"
                    })
                })
                
            // })
        }
        catch(err){
            console.log("error: ", err)
            return response.send({
                "result": "error"
            })
        }
        
        
    })
    
      
});
