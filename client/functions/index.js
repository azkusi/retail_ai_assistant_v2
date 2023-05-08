// /* eslint-disable no-loop-func */
const functions = require("firebase-functions");
const admin = require('firebase-admin')
const axios  = require('axios')
const cors = require('cors')({origin: "*"});
require('dotenv').config();
const similarity = require( 'compute-cosine-similarity' );


const formal_embeddings = require('./formal_embeddings.json') ;
const casual_embeddings = require('./casual_embeddings') ;
const gym_wear_embeddings = require('./gym_wear_embeddings') ;
const smart_casual_embeddings = require('./smart_casual_embeddings.json') ;
const work_embeddings = require('./work_embeddings.json') ;
const street_wear_embeddings = require('./street_wear_embeddings.json') ;
const lounge_wear_embeddings = require('./lounge_wear_embeddings.json') ;
const party_wear_embeddings = require('./party_wear_embeddings.json') ;
const retailers_converter = require('./retailers_converter.json') ;

const Typesense = require('typesense')

admin.initializeApp();

//firebase config variables, set using cli
// const TYPESENSE_API_KEY = functions.config().typesense.apikey
// const TYPESENSE_HOST = functions.config().typesense.host

// env variables below work but using ones set in firebase config instead
const typesense_env_host = process.env.TYPESENSE_HOST
const typesense_env_apikey = process.env.TYPESENSE_API_KEY


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


exports.getRetailerRecommendations = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, async()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        // {"casual": https://casual.png}
        console.log("env apikey : ", typesense_env_apikey, "env host: ", typesense_env_host)
        // console.log("typesense apikey: ", TYPESENSE_API_KEY, "typesense host: ", TYPESENSE_HOST)
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
                        
                        let client = new Typesense.Client({
                            'nodes': [{
                              'host': typesense_env_host, // For Typesense Cloud use xxx.a1.typesense.net
                              'port': '443',      // For Typesense Cloud use 443
                              'protocol': 'https'   // For Typesense Cloud use https
                            }],
                            'apiKey': typesense_env_apikey,
                            'connectionTimeoutSeconds': 180
                          })
                          
                        let searchRequests = {
                        'searches': [
                            {
                            'collection': retailers_converter[retailer],
                            'q': '*',
                            'vector_query' : `vec:(${JSON.stringify(category_embeddings[category])}, k:30)`,
                            'filter_by' : `description:!=${already_seen}`
                            }
                        ]
                        }
                        let commonSearchParams = {}
                        const query = client.multiSearch.perform(searchRequests, commonSearchParams)
                        console.log("query data is: ", JSON.stringify(query.data));
                        // const query = await axios.post(url, postData)
                        if(query.data === "" || query.data === undefined || query.data === null || query.data === {} || query.data === []){
                            console.log("error in search request was: ", query.data)
                            // const promise = {"retailer": retailer, "category": category, "recommendations": []};
                            const promise = {"retailer": retailer, "category": category, "recommendations": query.data};
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




exports.getMoreRetailerRecommendations = functions.runWith({ memory: "1GB" }).https.onRequest((request, response) => {
    // response.set('Access-Control-Allow-Origin', '*');

    cors(request, response, async()=>{
        functions.logger.info("Hello logs!", {structuredData: true});
        //receive user request and generate embeddings for the request
        // {"casual": https://casual.png}
        console.log("data sent: ", request.body)
        
        const categories = request.body["categories"]
        const retailers = request.body["retailers"]
        let already_seen = request.body["already_seen"]
        const url = 'https://europe-west2-clip-embeddings.cloudfunctions.net/get_more_recommendations_from_specific_retailers'
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
                        let client = new Typesense.Client({
                            'nodes': [{
                              'host': typesense_env_host, // For Typesense Cloud use xxx.a1.typesense.net
                              'port': '443',      // For Typesense Cloud use 443
                              'protocol': 'https'   // For Typesense Cloud use https
                            }],
                            'apiKey': typesense_env_apikey,
                            'connectionTimeoutSeconds': 180
                          })

                        let searchRequests = {
                        'searches': [
                            {
                            'collection': retailers_converter[retailer],
                            'q': '*',
                            'vector_query' : `vec:(${JSON.stringify(category_embeddings[category])}, k:30)`,
                            'filter_by=description' : `!=${already_seen}`
                            }
                        ]
                        }
                        let commonSearchParams = {}
                        const query = client.multiSearch.perform(searchRequests, commonSearchParams)
                        // const query = await axios.post(url, postData)
                        if(query.data === "" || query.data === undefined || query.data === null || query.data === {} || query.data === []){
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
                    let client = new Typesense.Client({
                        'nodes': [{
                          'host': typesense_env_host, // For Typesense Cloud use xxx.a1.typesense.net
                          'port': '443',      // For Typesense Cloud use 443
                          'protocol': 'https'   // For Typesense Cloud use https
                        }],
                        'apiKey': typesense_env_apikey,
                        'connectionTimeoutSeconds': 180
                      })

                    let searchRequests = {
                    'searches': [
                        {
                        'collection': "all_retailers",
                        'q': '*',
                        'vector_query' : category_embeddings[category],
                        'filter_by=description' : `!=${already_seen}`
                        }
                    ]
                    }
                    let commonSearchParams = {}
                    // const query = client.multiSearch.perform(searchRequests, commonSearchParams)
                    const query = await axios.post(url, postData)

                    if(query.data === "" || query.data === undefined || query.data === null || query.data === {} || query.data === []){
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
                        
                        const promise = {"category": category, "recommendations": filtered_query};
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

