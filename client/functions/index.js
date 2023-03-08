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


// async function imageEmbedding(doc) {
    
// }
  


exports.search = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, ()=>{
        functions.logger.info("Hello logs!", {structuredData: true});

        //receive user request and generate embeddings for the request
        const user_request = request.body["request"]
        const type = "mens_t_shirts"

        axios.post('https://api.openai.com/v1/embeddings',
            {
                "input": user_request,
                "model":"text-embedding-ada-002"
            },
            {
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY_OPEN_AI}`
                }
            }
        ).then((user_request_embeddings)=>{
            const embedding_vector = user_request_embeddings["data"]["data"][0]["embedding"]
            //compare the user request embeddings to product text embeddings
            //and obtain a cosine_similarity score (%)
            console.log("openai response: ", user_request_embeddings["data"])
            cosineSim(embedding_vector, type).then((result)=>{
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


exports.getPersonalisedProducts = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, ()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        const available_products = request.body["available_products"]
        const selected_products =  request.body["selected_products"]
        const type = request.body["type"]

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
                "Authorization": `Bearer ${API_KEY_OPEN_AI}`
                }
            }
        ).then((user_request_embeddings, type)=>{
            const embedding_vector = user_request_embeddings["data"]["data"][0]["embedding"]
            //compare the user request embeddings to product text embeddings
            //and obtain a cosine_similarity score (%)
            console.log("openai response: ", user_request_embeddings["data"])
            cosineSim(embedding_vector, type).then((result)=>{
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



exports.compareImages = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, ()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        const source_url = request.body["source_url"]
        deepai.setApiKey(API_KEY_DEEP_AI);
        let temp = [];
        admin.firestore().collection("test_products").get().then((querySnapshot)=>{
            return new Promise(async(resolve, reject)=>{
                let i = 0
                for(i; i < 100; i++){
                    const doc = querySnapshot.docs[i]
                    console.log("source url: ", source_url)
                    console.log("doc url: ", doc.data()["image_url"])
                    try{
                        var resp = await deepai.callStandardApi("image-similarity", {
                        image1: source_url,
                        image2: doc.data()["image_url"],
                        });
                        console.log(resp);
                        temp.push({ 
                            "name": doc.data()["name"],
                            "src":  doc.data()["image_url"],
                            "cosine_sim":  resp
                        })
                    }
                    catch(error){
                        console.log("error with deepai...:",  error)
                        break
                    }
                    // const resp = await axios.post('https://api.deepai.org/api/image-similarity',
                    //     {
                    //         "image1":source_url,
                    //         "image2": doc.data()["image_url"]
                    //     },
                    //     {
                    //         headers: {
                    //         "Content-Type": "application/json",
                    //         "api-key": `${API_KEY_DEEP_AI}`
                    //         }
                    //     }
                    // )
                    // temp.push({ 
                    //         "name": doc.data()["name"],
                    //         "src":  doc.data()["image_url"],
                    //         "cosine_sim":  resp
                    //     })
            
                }
                if(i === 250){
                    resolve(temp)
                }
            }).then((result)=>{
                result.sort(rank_cosine_sim)
            }).then((final_array)=>{
                response.header({"Access-Control-Allow-Origin": "*"})
                    return response.send({
                        "result": final_array
                    })
            })     
            
        })
        
    })
    
      
});


async function insertEmbeddingsTrousers(doc){
    return axios.post('https://api.openai.com/v1/embeddings',
                    {
                        "input": doc.data()["name"],
                        "model":"text-embedding-ada-002"
                    },
                    {
                        headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${API_KEY_OPEN_AI}`
                        }
                    }
                ).then((product_embeddings)=>{
                    console.log("embeddings are: ", product_embeddings)
                    admin.firestore().collection("mens").doc("1")
                    .collection("mens_trousers").doc(doc.id).update({
                        "text_embeddings": product_embeddings["data"]["data"][0]["embedding"]
                    })
                    //compare the user request embeddings to product text embeddings
                    //and obtain a cosine_similarity score (%)
                    
                })
}

async function insertEmbeddingsTs(doc){

    return new Promise((resolve, reject)=>{
        axios.post('https://api.openai.com/v1/embeddings',
            {
                "input": doc.data()["name"],
                "model":"text-embedding-ada-002"
            },
            {
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY_OPEN_AI}`
                }
            }
        ).then((product_embeddings)=>{
            console.log("embeddings are: ", product_embeddings)
            admin.firestore().collection("mens").doc("1")
            .collection("mens_trousers").doc(doc.id).update({
                "text_embeddings": product_embeddings["data"]["data"][0]["embedding"]
            }).then((result)=>{
                resolve(result)
            })
            //compare the user request embeddings to product text embeddings
            //and obtain a cosine_similarity score (%)
            
        })
    })
    
}



exports.getDummyDataEmbeddings = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, ()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        admin.firestore().collection("mens").doc("1").collection("mens_trousers").get().then((querySnapshot)=>{
            querySnapshot.forEach(async (doc)=>{
                await insertEmbeddingsTrousers(doc)
            })
            
        }).then(()=>{
            console.log("done first embeddings insert")
            response.header({"Access-Control-Allow-Origin": "*"})
                    return response.send({
                    "result1": "finished"
                    })
        })
        
    })
    
      
});


function getEmbedding(doc){
    return new Promise((resolve, reject)=>{
      axios.post('https://api.openai.com/v1/embeddings',
        {
            "input": doc.data()["name"],
            "model":"text-embedding-ada-002"
        },
        {
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY_OPEN_AI}`
            }
        }
    ).then((result)=>{
      resolve(result.data)
    })
    })
      
  }

exports.getDummyDataEmbeddings2 = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, ()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request

        admin.firestore().collection("mens").doc("1").collection("mens_t_shirts").get()
        .then((querySnapshot)=>{
            querySnapshot.forEach(async(doc)=>{
            console.log(doc.data())
            if(!("text_embeddings" in doc.data())){
                getEmbedding(doc).then((embedding)=>{
                console.log("result obtained: ", embedding["data"][0]["embedding"])
                // console.log("embedding was: ", embedding["data"][0]["embedding"])
                admin.firestore().collection("mens").doc("1")
                .collection("mens_t_shirts").doc(doc.id).update({
                    "text_embeddings": embedding["data"][0]["embedding"]
                }).then(()=>{
                    console.log("embedding placed into: ", doc.id)
                })
                })
            }
            
            })
            
        }).then(()=>{
            console.log("done second embeddings insert")
            response.header({"Access-Control-Allow-Origin": "*"})
            return response.send({
            "result2": "finished"
            })
        })
    })
})


async function createFile(doc){ 
    return new Promise(async(resolve, reject)=>{
      const locationRef = doc.id
      const URL = doc.data()["src"]
      // const storageRef = projectStorage.ref(locationRef);
      try{
        const file = await axios.get(URL);
        if(file.status === 200){
          console.log("file found")
        //   file_count++
          const new_file = new File([file.data], URL, file.data.type)
          resolve(new_file)
        }
        if(file.status !== 200){
          console.log("no file found")
        //   no_file_count++
          admin.firestore().collection("mens").doc("1").collection("mens_t_shirts")
          .doc(doc.id).delete().then(()=>{
            resolve("no file found")
          })      
        } 
      }
      catch(error){
        console.log("error occurred: ", error)
        admin.firestore().collection("mens").doc("1").collection("mens_t_shirts")
          .doc(doc.id).delete().then(()=>{
            reject("no file found", error)
          }) 
        
      }
      
    })
}

exports.goodImages = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, ()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        response.header({"Access-Control-Allow-Origin": "*"})
        
        const projectStorage = admin.storage();
        const projectFirestore = admin.firestore();
    
        admin.firestore().collection("mens").doc("1").collection("mens_t_shirts").get()
        .then((querySnapshot)=>{
            querySnapshot.forEach(async (doc)=>{
                console.log("data from doc: ", doc.data())
                const locationRef = doc.id
                // const storageRef = projectStorage.ref(locationRef);
                try{
                  axios.get(doc.data()["src"], {
                    responseType: "blob"
                    }).then(async (response)=>{
                      console.log(response)
                      console.log(response.data)
                      // await storageRef.put(new File([response.data], URL, {"type": response.data.type})).on('state_changed', (snap) => {
                      //   let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
                      //   console.log(percentage, "% loaded");
                      //   }, (err) => {
                      //   console.log(err);
                      //   //set an error
                      //   }, async () => {
                      //     const url = await storageRef.getDownloadURL();
                          
                      //     console.log("Finished uploading")
                      //     return projectFirestore.collection("mens").doc("1").collection("mens_t_shirts")
                      //     .doc(locationRef).update({
                      //       "src": url, 
                      //       "name": doc.data()["thumbnailCaption"],
                      //     });
                      // })
                    }, (()=>{
                        console.log("Deleting", doc.id)
                        return projectFirestore.collection("mens").doc("1").collection("mens_t_shirts")
                        .doc(locationRef).delete()
                      }
                    ))
                    
                  }
                  catch(error){
                    console.log(error)
                    console.log("Deleting", doc.id)
                    return projectFirestore.collection("mens").doc("1").collection("mens_t_shirts")
                    .doc(locationRef).delete();
                  }
              })
        // console.log("no image count: ", no_file_count)
        // console.log("image count: ", file_count)
            response.send({
                "result": "finished"
            })        
        }) 
    })
})   
