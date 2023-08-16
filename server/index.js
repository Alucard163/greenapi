#!/usr/bin/env node

const amqp = require("amqplib/callback_api");
const amqpUrl = 'amqp://localhost';

(async () => {
    await amqp.connect(amqpUrl, async (error0, connection) => {
        if (error0) {
            console.error(error0.message);
            throw error0;
        }

        await connection.createChannel(async (error1, channel) => {
            if (error1) {
                console.error(error1.message);
                throw error1;
            }

            const queue = 'rpc_queue';

            process.once('SIGINT', async () => {
                console.log('got sigint, closing connection');
                await channel.close();
                await connection.close();
                process.exit(0);
            });

            await channel.assertQueue(queue, { durable: false });

            await channel.prefetch(1);

            await channel.consume(queue, async (msg) => {
                console.log('processing messages');

                const n = parseInt(msg.content.toString());

                console.log("fib(%d)", n);

                const r = fibonacci(n);

                await channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
                    correlationId: msg.properties.correlationId,
                });

                await channel.ack(msg);
            });
        });
    });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();

function fibonacci(n) {
    if (n === 0 || n === 1) return n;
    else return fibonacci(n - 1) + fibonacci(n - 2);
}