/* restserver.js 
 * npm i express
 * npm i helmet
 * NodeJS Restful Server, 03-2021
 * Klaus Ruhland, HSZG, Betriebssysteme II, Web Engineering II
 * Test with curl
 * 1.) curl http://localhost:8000/search/searchword
 */


const express = require('express');
const helmet = require('helmet');

const MongoSE = require('./SearchengineMongo');


const app = express();
const port = process.env.PORT || 8000;



// initializations
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/search/:searchword', function(req, res) {
    let searchword = req.params.searchword;
    let search_options = {
        searchstring: searchword
    }
    function success(result){ return res.json(result);}
    function failure(){res.send('file not found', 404);}
    MongoSE.getSearchResults(search_options,success,failure);
});


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){ res.status(404).send('file not found'); });

// Running the server
app.listen(port, () => {
      console.log(`http://localhost:${port}`);
})