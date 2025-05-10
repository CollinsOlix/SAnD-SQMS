let WSServer = require("ws").Server;
let server = require("http").createServer();
const { onSnapshot, where, collection, query } = require("firebase/firestore");
const { getRealTimeQueueData } = require("./config/firestoreFunctions");
let app = require("./server");
const { db } = require("./config/firebase");

let wss = new WSServer({ server: server, perMessageDeflate: false });

// Also mount the app here
server.on("request", app);

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    const { branch } = JSON.parse(message);
    onSnapshot(
      collection(
        db,
        "Organizations",
        "Apex Bank",
        "branches",
        branch,
        "availableServices"
      ),
      (querySnapshot) => {
        let queueData = [];
        querySnapshot.forEach((doc) => {
          queueData.push(doc.data());
        });
        ws.send(JSON.stringify(queueData));
      }
    );

    console.log(`received: ${branch}`);
  });
});

server.listen(5000, function () {
  console.log(`http/ws server listening on ${5000}`);
});
