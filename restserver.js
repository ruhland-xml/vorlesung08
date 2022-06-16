/* restserver.js 
 * npm i express
 * npm i talisman
 * npm i mongodb
 * NodeJS Restful Server, 03-2021
 * Klaus Ruhland, HSZG, Betriebssysteme II, Web Engineering II
 * Test with curl
 * 1.) curl http://localhost:8000/search/searchword
 */


const express = require('express');
const bs58 = require('bs58');


const MongoSE = require('./SearchengineMongo');


const app = express();
const port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// for the index.html
app.use("/", express.static(__dirname + ''));

// for RESTful webservice
app.get('/search/:bs58searchstring', function(req, res) {
    let bs58searchstring = req.params.bs58searchstring;
    const bytes = bs58.decode(bs58searchstring);
    let searchstring = Buffer.from(bytes).toString("utf8");
    searchstring = searchstring.trim().toLowerCase();

    let search_options = {
        searchstring: searchstring
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