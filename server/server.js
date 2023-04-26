const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');
const weaviate = require('weaviate-ts-client');

const wss = new WebSocket.Server({ server:server });

const databaseClient = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

wss.on('connection', (ws) => {
    console.log('A new client Connected!');

    ws.on('message', async (message) => {
        // On client message parse message to object and query database with arguments parsed

        var data = JSON.parse(message);
        console.log(data);

        responseBody = await queryDatabase(data.body, data.amount);
        response = JSON.stringify({response: responseBody});

        // Send response to client socket with returned query results
        ws.send(response);
    });
});

app.get('/', (req, res) => res.send('Hello World!'));

server.listen(3000, () => console.log(`Lisening on port: 3000`));

async function queryDatabase(queryBody, limitAmount) {
    // Query database with given arguments

    // Creates an object in the correct format to query near text with Weaviate
    nearTextArgs = {
        "concepts": [queryBody]
    }

    // Calls graphql query returning only pdfId and title fields
    result = await databaseClient.graphql.get().withClassName("Paper")
    .withFields("pdfId title").withNearText(nearTextArgs).withLimit(limitAmount).do();

    // removes unnecessary object layers
    result = result.data.Get.Paper;

    // Loops over pdf title and converts them to valid urls
    for (let i = 0; i < result.length; i++) {
        result[i].pdfId = await convertPdfLink(result[i].pdfId);
    }

    // Logs cleaned resulting objects from database query
    for (let i = 0; i < result.length; i++) {
        console.log(result[i]);
    }

    return result;
}

async function convertPdfLink(pdfId){

    resultPdfLink = pdfId;

    // Checks if pdfId includes / and replaces - with . if false
    // This is needed as the valid pdf url requires a . instead of a -
    if (!pdfId.includes("/")) {
        resultPdfLink = pdfId.replace("-", ".");
    }

    // Add surrounding url
    resultPdfLink = "https://arxiv.org/pdf/" + resultPdfLink + ".pdf";

    return resultPdfLink;
}