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

        var data = JSON.parse(message);
        console.log(data);

        responseBody = await queryDatabase(data.body, data.amount);
        response = JSON.stringify({response: responseBody});

        ws.send(response);
    });
});

app.get('/', (req, res) => res.send('Hello World!'));

server.listen(3000, () => console.log(`Lisening on port :3000`));

async function queryDatabase(queryBody, limitAmount) {

    nearTextArgs = {
        "concepts": [queryBody]
    }

    result = await databaseClient.graphql.get().withClassName("Paper").withFields("pdfId title").withNearText(nearTextArgs).withLimit(limitAmount).do();

    result = result.data.Get.Paper;

    for (let i = 0; i < result.length; i++) {
        result[i].pdfId = await convertPdfLink(result[i].pdfId);
    }

    for (let i = 0; i < result.length; i++) {
        console.log(result[i]);
    }

    return result;
}

async function convertPdfLink(pdfId){

    resultPdfLink = pdfId;

    if (!pdfId.includes("/")) {
        resultPdfLink = pdfId.replace("-", ".");
    }

    resultPdfLink = "https://arxiv.org/pdf/" + resultPdfLink + ".pdf";

    return resultPdfLink;
}