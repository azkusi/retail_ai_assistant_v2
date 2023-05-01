// /* eslint-disable no-loop-func */
const functions = require("firebase-functions");
const admin = require('firebase-admin')
const axios  = require('axios')
const cors = require('cors')({origin: "*"});
const similarity = require( 'compute-cosine-similarity' );
const deepai = require('deepai'); // 
const API_KEY_OPEN_AI = process.env.OPEN_AI
const API_KEY_DEEP_AI = process.env.DEEP_AI


const formal_embeddings = require('./formal_embeddings.json') ;
const casual_embeddings = require('./casual_embeddings') ;
const gym_wear_embeddings = require('./gym_wear_embeddings') ;
const smart_casual_embeddings = require('./smart_casual_embeddings.json') ;
const work_embeddings = require('./work_embeddings.json') ;
const street_wear_embeddings = require('./street_wear_embeddings.json') ;
const lounge_wear_embeddings = require('./lounge_wear_embeddings.json') ;
const party_wear_embeddings = require('./party_wear_embeddings.json') ;
const retailers_converter = require('./retailers_converter.json') ;

admin.initializeApp();


const category_embeddings = {
    "formal": formal_embeddings,
    "casual": casual_embeddings,
    "gym-wear": gym_wear_embeddings,
    "smart casual": smart_casual_embeddings,
    "work": work_embeddings,
    "street-wear": street_wear_embeddings,
    "lounge-wear": lounge_wear_embeddings,
    "party": party_wear_embeddings
}

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
        const url = request.body["url"]
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

exports.getRecommendationsUsingTextFromColdStartNotLoggedIn = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, async()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        // {"casual": https://casual.png}
        console.log("data sent: ", request.body)
        const category_images_chosen = request.body.categories
        const collection = request.body["collection"]
        // const url = 'https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingImage-using-buffer'
        const url = "https://europe-west2-clip-embeddings.cloudfunctions.net/getRecommendationsUsingTextColdStart"
        const recommendations = []
        try{

            for (const category of category_images_chosen) {
                // const iteration = i
                const postData = {
                    "category": category.category,
                    "collection": collection
                };
                
                // const category = category_images_chosen[iteration]["category"]
                const promise = (
                    axios.post(url, postData)
                    .then((res)=>{
                        const result = {"category": category.category, "recommendations": res.data};
                        console.log("result data is: ", JSON.stringify(res.data));
                        return result;
                        // console.log("result is: ", res)
                    })
                    .catch((err)=>{
                        console.log("error: ", err)
                        new Promise(err)
                        return err
                    })
                )
                recommendations.push(promise);
            }
            // wait until all promises are done or one promise is rejected
            const results = await Promise.all(recommendations)
            
            console.log("got to promise all")
            console.log("all promises: ", results)
            console.log("recommendations: ", JSON.stringify(results))
            console.log("res: ", results)
            // create an already_seen_recommendations entry in firebase 
            
            let i = 0;
            let recommendations_to_send = []
            let already_seen_doc_id;

            let already_seen_recommendations = []
            let recommendation_descriptions_to_send = []

            console.log("results i is:", JSON.stringify(results[i]))
            console.log("results i results is:", JSON.stringify(results[i].recommendations.results))

            console.log("number of categories: ", results.length.toString())
            console.log("number of hits: ", results[0].recommendations.results[0].hits.length.toString())
            console.log("number of found: ", results[0].recommendations.results[0].found.toString())

            let promises1 = []

            for(i; i < results.length; i++){
                let j=0
                let promises2 = []
                for(j; j < results[i].recommendations.results[0].hits.length; j++){
                    if(already_seen_recommendations.includes(results[i].recommendations.results[0].hits[j].document.description)){
                        console.log("pass completed")
                        continue
                    }
                    else if(recommendation_descriptions_to_send.includes(results[i].recommendations.results[0].hits[j].document.description)){
                        console.log("pass completed")
                        continue
                    }
                    else if(promises2.length === 10){
                        console.log("break completed")
                        break
                    }
                    else{
                        recommendations_to_send.push({ "recommendation" : results[i].recommendations.results[0].hits[j], "category": results[i].category})
                        recommendation_descriptions_to_send.push(results[i].recommendations.results[0].hits[j].document.description)
                        already_seen_recommendations.push(results[i].recommendations.results[0].hits[j].document.description)
                        promises2.push(Promise.resolve());
                        console.log("push completed")

                    }
                }
                promises1.push(Promise.all(promises2))
            }

            Promise.all(promises1).then(() => {

                admin.firestore().collection("already_seen_recommendations")
                .add({"already_seen": already_seen_recommendations}).then((docRef)=>{
                    already_seen_doc_id = docRef.id
                    // console.log("docRef: ", docRef)
                }).catch((err)=>{
                    console.log("error: ", err)

                }).finally(()=>{
                    console.log("already_seen_doc_id to send: ", already_seen_doc_id)
                    response.header({"Access-Control-Allow-Origin": "*"})
                    return response.send({
                        "result": recommendations_to_send,
                        "already_seen_doc_id": already_seen_doc_id
                    })
                })
            })
            
    
        }
        catch(err){
            console.log("error: ", err)
            return response.send({
                "result": "error"
            })
        }
        
        
    })
    
      
});

exports.getRecommendationsUsingImageWarmStartNotLoggedIn = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, async()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        // {"casual": https://casual.png}
        console.log("data sent: ", request.body)
        const category_images_chosen = request.body["categories"]
        const collection = request.body.collection
        const already_seen_doc_id = request.body.already_seen_doc_id
        const url = 'https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingImage-using-buffer'
        const recommendations = []
        console.log("already seen doc id is: ", already_seen_doc_id)

        try{
            if(category_images_chosen === null){
                // get the already seen items and their categories from firebase
                // set the category_images_chosen to the categories from firebase
            }
            // get the already seen items and their categories from firebase
            for (const category of category_images_chosen) {
                // const iteration = i
                const postData = {
                    "url": category.image_url,
                    "collection": collection
                };
                
                // const category = category_images_chosen[iteration]["category"]
                const promise = (
                    axios.post(url, postData)
                    .then((res)=>{
                        const result = {"category": category.category, "recommendations": res.data};
                        console.log("result data is: ", JSON.stringify(res.data));
                        return result;
                        // console.log("result is: ", res)
                    })
                    .catch((err)=>{
                        console.log("error: ", err)
                        new Promise(err)
                        return err
                    })
                )
                recommendations.push(promise);
            }

            const results = await Promise.all(recommendations)
            
            console.log("got to promise all")
            console.log("all promises: ", results)
            console.log("recommendations: ", JSON.stringify(results))
            console.log("res: ", results)
            // create an already_seen_recommendations entry in firebase 
            
            
            
            let recommendations_to_send = []

            let nineties_count = 0;
            let eighties_count = 0;
            let seventies_count = 0;
            let sixties_count = 0;
            let fifties_count = 0;

            let recommendation_descriptions_to_send = []

            let already_seen_recommendations;
            
            admin.firestore().collection("already_seen_recommendations").doc(already_seen_doc_id).get().then((doc)=>{
                if(doc.exists){
                    already_seen_recommendations =  doc.data()["already_seen"]
                    console.log("type: ", typeof(already_seen_recommendations))
                    console.log("already_seen: ", doc.data()["already_seen"])

                }
                else{
                    already_seen_recommendations = []
                }
            }).then(()=>{
                // console.log("already_seen_recommendations: ", already_seen_recommendations, "type: ", typeof(already_seen_recommendations))
                // console.log("recommendations: ", results[0].recommendations.results[0].hits)
                console.log("number of categories: ", results.length.toString())
                console.log("number of hits: ", results[0].recommendations.results[0].hits.length.toString())
                console.log("number of found: ", results[0].recommendations.results[0].found.toString())


                
                let promises1 = []
                let i = 0;
                for(i; i < results.length; i++){
                    let j=0
                    let promises2 = []
                    for(j; j < results[i].recommendations.results[0].hits.length; j++){
                        if(already_seen_recommendations.includes(results[i].recommendations.results[0].hits[j].document.description)){
                            console.log("pass completed")
                            continue
                        }
                        else if(recommendation_descriptions_to_send.includes(results[i].recommendations.results[0].hits[j].document.description)){
                            console.log("pass completed")
                            continue
                        }
                        else if(promises2.length === 10){
                            console.log("break completed")
                            break
                        }
                        else{
                            console.log("pushing: ", results[i].recommendations.results[0].hits[j].document.description)
                            console.log("object being considered for push: ", results[i].recommendations.results[0].hits[j].document)

                            recommendations_to_send.push({ "recommendation" : results[i].recommendations.results[0].hits[j], "category": results[i].category})
                            recommendation_descriptions_to_send.push(results[i].recommendations.results[0].hits[j].document.description)
                            already_seen_recommendations.push(results[i].recommendations.results[0].hits[j].document.description)
                            promises2.push(Promise.resolve());
                            console.log("push completed")

                        }
                    }
                    promises1.push(Promise.all(promises2))
                }
                console.log("already_seen: ", already_seen_recommendations)

                Promise.all(promises1).then(() => {

                    admin.firestore().collection("already_seen_recommendations").doc(already_seen_doc_id)
                    .update({"already_seen": already_seen_recommendations}).then((docRef)=>{
                        // already_seen_doc_id = docRef.id
                        // console.log("docRef: ", docRef)
                    }).catch((err)=>{
                        console.log("error: ", err)

                    }).finally(()=>{
                        console.log("already_seen_doc_id to send: ", already_seen_doc_id)
                        response.header({"Access-Control-Allow-Origin": "*"})
                        return response.send({
                            "result": recommendations_to_send,
                            "already_seen_doc_id": already_seen_doc_id
                        })
                    })
                })
            })

            
            
        }
        catch(err){
            console.log("error: ", err)
            return response.send({
                "result": err
            })
        }
        
        
    })
    
      
});



exports.getRetailerRecommendations = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, async()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        // {"casual": https://casual.png}
        console.log("data sent: ", request.body)
        
        const categories = request.body["categories"]
        const retailers = request.body["retailers"]
        let already_seen = request.body["already_seen"]
        const url = 'https://europe-west2-clip-embeddings.cloudfunctions.net/get_recommendations_from_specific_retailers'
        const recommendations = []

        console.log("categories: ", categories)
        console.log("category_embeddings: ", category_embeddings)
        console.log("already_seen: ", already_seen)
        try{
            for (const retailer of retailers) {
                console.log("retailer: ", retailer)
                const retailer_recommendations = []
                
                for (const category of categories) {
                // const iteration = i
                
                    const postData = {
                        "category": category,
                        "collection": retailers_converter[retailer],
                        "already_seen": already_seen,
                        "embedding": category_embeddings[category]
                    };
                    
                    console.log("collection is: ", retailers_converter[retailer]);
                    // const promise = (
                    try{
                        const query = await axios.post(url, postData)
                        if(query.data === "Cloud Functions Error"){
                            console.log("error: ", query.data)
                            const promise = {"retailer": retailer, "category": category, "recommendations": []};
                            retailer_recommendations.push(promise);
                        }
                        else{
                            console.log("query data is: ", JSON.stringify(query.data));
                            const filtered_query = query.data.results[0].hits.filter((recommendation, index)=>{
                                return(
                                    !(already_seen.includes(recommendation.document.description))
                                )
                            })
                            
                            const promise = {"retailer": retailer, "category": category, "recommendations": filtered_query};
                            console.log("filtered data is: ", JSON.stringify(filtered_query));
                            // console.log("result is: ", res)
                
                            retailer_recommendations.push(promise);
                            already_seen = already_seen.concat(filtered_query.map((recommendation, index)=>{
                                return recommendation.document.description
                            }))
                        }
                        
                    }
                    
                    catch(err){
                        console.log("error: ", err)
                        new Promise(err)
                        return err
                    }
                    // )
                    
                }
                recommendations.push(Promise.all(retailer_recommendations))

                
                
                console.log("got to promise all")
                console.log("all promises: ", recommendations)
                console.log("recommendations: ", JSON.stringify(recommendations))
                console.log("res: ", recommendations)
            }
            Promise.all(recommendations).then((results)=>{
                response.header({"Access-Control-Allow-Origin": "*"})
                return response.send({
                    "result": results
                })
            })
        }
        catch(err){
            console.log("error: ", err)
            return response.send({
                "result": err
            })
        }

    })

});



exports.getCategoryRecommendations = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, async()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        // {"casual": https://casual.png}
        console.log("data sent: ", request.body)
        
        const categories = request.body["categories"]
        let already_seen = request.body["already_seen"]
        const url = 'https://europe-west2-clip-embeddings.cloudfunctions.net/get_recommendations_from_all_retailers'
        const recommendations = []

        try{
            
            for (const category of categories) {
                console.log("category_embeddings: ", category_embeddings[category])
                const postData = {
                    "category": category,
                    "collection": "all_retailers",
                    "already_seen": already_seen,
                    "embedding": category_embeddings[category]
                };
                
                try{
                    const query = await axios.post(url, postData)

                    if(query.data === "Cloud Functions Error"){
                        console.log("error: ", query.data)
                        const promise = {"category": category, "recommendations": []};
                        recommendations.push(Promise.resolve(promise));
                    }
                    else{
                        const filtered_query = query.data.results[0].hits.filter((recommendation, index)=>{
                            return(
                                !(already_seen.includes(recommendation.document.description))
                            )
                        })
                        
                        const promise = {"category": category, "recommendations": query.data};
                        console.log("result data is: ", JSON.stringify(filtered_query));
                        // console.log("result is: ", res)
            
                        recommendations.push(Promise.resolve(promise));
                        already_seen = already_seen.concat(filtered_query.map((recommendation, index)=>{
                            return recommendation.document.description
                        }))
                    }
                    console.log("result data is: ", JSON.stringify(query.data));
                }
                
                catch(err){
                    console.log("error: ", err)
                    new Promise(err)
                    return err
                }
                // )
                
            }
            
            
            console.log("got to promise all")
            console.log("all promises: ", recommendations)
            console.log("recommendations: ", JSON.stringify(recommendations))
            console.log("res: ", recommendations)
            
            Promise.all(recommendations).then((results)=>{
                response.header({"Access-Control-Allow-Origin": "*"})
                return response.send({
                    "result": results,
                })
            })
        }
        catch(err){
            console.log("error: ", err)
            return response.send({
                "result": err
            })
        }

    })

});

