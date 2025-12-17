import amqp from "amqplib";
import mongoose from "mongoose";
import Order from "../models/order.model.js";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

export const startConsumer = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  const queue = "order";
  const exchange = "orders_exchange";
  const dlq = "order_dlq";

  await channel.assertExchange(exchange, "direct", { durable: true });

  await channel.assertQueue(dlq, { durable: true });

  await channel.assertQueue(queue, {
    durable: true,
    deadLetterExchange: "",
    deadLetterRoutingKey: dlq,
  });

  await channel.bindQueue(queue, exchange, "order_created");

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());
      console.log("Message received:", content);

      const order = new Order(content);
      await order.save();

      channel.ack(msg);
    } catch(error){
        console.error("Error processing message:", error);
        const retries = Number(msg.properties?.headers?.['x-retry-count'] ?? 0);

        if(retries >= 3){
          console.error("Max retries reached, sending to DQL")
          channel.nack(msg, false, false);
        } else {

          channel.sendToQueue(queue, msg.content, {
            headers: { 'x-retry-count': retries + 1 }
          });
        }
      
    }
  });

  console.log('🟢 Consumer running and waiting for messages...');
};
