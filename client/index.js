const express = require("express");
const app = express();

app.use(express.json());

const amqp = require('amqplib');
let channel, connection;
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

app.post("/solvemath", async (req, res) => {
    try {
        const digit = req.body["digit"];
        const result = await solvemath(digit);
        res.send(result);
    } catch (error) {
        res.status(500).send("Error while solving math: " + error.message);
    }
});

const solvemath = async (digit) => {
    const correlationId = generateUuid();
    return new Promise(async (resolve, reject) => {
        let result;
        channel.assertQueue("client-queue");
        channel.consume(
            "client-queue",
            (msg) => {
                if (msg.properties.correlationId === correlationId) {
                    console.log("Got %s", msg.content.toString());
                    result = msg.content.toString();
                    connection.close();
                    resolve(result);
                }
            },
            {
                noAck: true,
            }
        );
        const content = Buffer.from(digit.toString());
        channel.sendToQueue("rpc_queue", content, {
            correlationId: correlationId,
            replyTo: "client-queue",
        });
    });
}

const generateUuid = () => {
    return (
        Math.random().toString() +
        Math.random().toString() +
        Math.random().toString()
    );
}
const setupAMQP = async () => {
    try {
        connection = await amqp.connect(amqpUrl, 'heartbeat=60');
        channel = await connection.createChannel();
        channel.assertQueue("client-queue");
    } catch (error) {
        console.error("Error while setting up AMQP:", error);
    }
}

setupAMQP().then(() => {
    app.listen("4001", () => console.log("Server running at port 4001"));
});