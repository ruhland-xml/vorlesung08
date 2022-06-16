// npm install mongodb

const {MongoClient} = require('mongodb');
const daitchMokotoff = require('talisman/phonetics/daitch-mokotoff');
const levenshtein = require('talisman/metrics/levenshtein');


const DB_USER = "xmluser";
const DB_PASSWORD = "xml123";
const DB_IP = "127.0.0.1";
const DB_NAME = "xmldb";
const COLLECTION = "geonames";

const URL=`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_IP}:27017/?authSource=${DB_NAME}`;
const OPTIONS = { useNewUrlParser: true };

const LIMIT = 100;

class Searchengine{
    static getWordDistance( searchword, keywords ){
      let distance=null;
      for (let i=0; i<keywords.length; i++){
        let keyword = keywords[i];
        let word_distance = levenshtein(searchword, keyword);
        if ( distance === null || word_distance < distance )
          distance = word_distance;
      }
      return distance;
    }

    static getDistance( searchstring, keywords ){
        let searcharray = searchstring.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        let min_distance = null;
        for (let i=0; i<searcharray.length; i++){
          let searchword = searcharray[i];
          let word_distance = this.getWordDistance(searchword, keywords);
          if ( min_distance === null || word_distance < min_distance )
            min_distance = word_distance;
        }
        return min_distance;
      }

      static getSimilaritySearchstring( searchstring ){
        // durchlaufe den Searchstring
        let searcharray = searchstring.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
        let newsearchstring = "";
        for ( let i=0; i<searcharray.length; i++ ){
            let similarwords = daitchMokotoff(searcharray[i]);
            let first_similarword = similarwords[0];
            let first_similarword_without_trailing_zeros = first_similarword.replace(/0+$/g, "");
            if ( first_similarword_without_trailing_zeros.length > 0 ){
                newsearchstring+=first_similarword_without_trailing_zeros+" ";
            }
            else {
                newsearchstring+=searcharray[i];
            }
        }
        newsearchstring = newsearchstring.trim();
        return newsearchstring;
      }
  
    // get_suggestions
    // options = { searchstring: "kl ruh" }
    // result = { success: true/false, docs: [ {doc1}, {doc2}, ... ] }
    static getSearchResults( options, success, failure ){
      let instance = this;
      console.log("Mongodb URL connect to "+URL);
      const mongo_client = new MongoClient(URL,OPTIONS);
      //let pg_client = new Client(ClientCredentials);
      mongo_client.connect(function(err){
        if (err){
          let error = {
            success: false,
            message: 'error in mongodb connect'
          } 
          failure(error);
          return;
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
          let searchitems = searchstring.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
          let sim_searchstring = instance.getSimilaritySearchstring(searchstring);
          let sim_searchitems = sim_searchstring.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
          let query_array = [];
          for ( let i=0; i<sim_searchitems.length; i++ ){
            let query_item = { "meta.keywords": new RegExp("^"+sim_searchitems[i]) };
            query_array.push(query_item);
          }
          let query = { $and: query_array }  
          searchenginedb.collection(COLLECTION).find(query).limit(LIMIT).toArray(function(err, result) {
            if ( err){
              let error = {
                success: false,
                message: 'error in mongodb connect'
              } 
              mongo_client.close();
              failure(error);
              return;
            };
            // sort the result
            for ( let i=0; i<result.length; i++ ){
              let distance = instance.getDistance(searchstring,result[i].meta.keywords);
              result[i].distance = distance;
            }
            result.sort(function(a, b) {
              return a.distance - b.distance;;
            });
            let final_result = { success: true, docs: result }
            success(final_result);
            mongo_client.close();
          });
        }
      })
    }
}

module.exports = Searchengine;
