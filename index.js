const request = require('request');
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, {
    useNewUrlParser: true
});

var objShazam = {};

request('https://www.shazam.com/shazam/v2/ru/UA/web/-/tracks/world-chart-world?pageSize=200&startFrom=0', (error, response, html) => {

    if (!error && response.statusCode == 200) {

        var jsonObj = JSON.parse(html);

        jsonObj = jsonObj['chart'];

        mongoClient.connect(function (err, client) {
            const db = client.db("Parse");
            const collection = db.collection("Result");

            for (keyFirst in jsonObj) {
                const name = jsonObj[keyFirst]['share']['subject'];
                const link = jsonObj[keyFirst]['share']['href'];

                number = Number(keyFirst) + 1;

                objShazam = {
                    number,
                    name,
                    link
                };

                console.log(objShazam);

                collection.insertOne(objShazam, function (err, results) {
                    console.log(results.ops);
                });

            }
            client.close();

        })
    }
})