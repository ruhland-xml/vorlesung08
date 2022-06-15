// npm install mongodb

const {MongoClient} = require('mongodb');

const DB_USER = "xmluser";
const DB_PASSWORD = "xml123";
const DB_IP = "127.0.0.1";
const DB_NAME = "xmldb";
const COLLECTION = "geonames";

const URL=`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_IP}:27017/?authSource=${DB_NAME}`;
const OPTIONS = { useNewUrlParser: true };

class Searchengine{
    // get_suggestions
    // options = { searchstring: "kl ruh" }
    // result = { success: true/false, docs: [ {doc1}, {doc2}, ... ] }
    static getSearchResults( options, success, failure ){
      console.log("Mongodb URL connect to "+URL);
      const mongo_client = new MongoClient(URL,OPTIONS);
      //let pg_client = new Client(ClientCredentials);
      mongo_client.connect(function(err){
        if ( err){
          let error = {
            success: false,
            message: 'error in mongodb connect'
          } 
          failure(error) 
        };
        var searchenginedb = mongo_client.db(DB_NAME);
        console.log("Database "+DB_NAME+" connected");
        let searchstring = options.searchstring.trim();
        if ( searchstring.length === 0 ){
          result = { success: true, docs: [] }
          success(result);
          mongo_client.close();
        }
        else {
          let searchitems = searchstring.split(" ");
          let query_array = [];
          for ( let i=0; i<searchitems.length; i++ ){
            let query_item = { "meta.keywords": new RegExp("^"+searchitems[i]) };
            query_array.push(query_item);
          }
          let query = { $and: query_array }  
          searchenginedb.collection(COLLECTION).find(query).limit(10).toArray(function(err, result) {
            if ( err){
              let error = {
                success: false,
                message: 'error in mongodb connect'
              } 
              failure(error) 
              mongo_client.close();
            };
            let final_result = { success: true, docs: result }
            success(final_result);
            mongo_client.close();
          });
        }
      })
    }
}

module.exports = Searchengine;
