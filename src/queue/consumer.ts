import amqp from 'amqplib';
import mongoose from 'mongoose';
import { connectDB } from "../config/database.js";
import Order from '../models/order.model.js';

await connectDB();

export const startConsumer = async(queue: string) =>{
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    
    await channel.assertQueue(queue, {durable: true});
    channel.prefetch(1);

    console.log(`Waiting for messages in ${queue}...`);

    channel.consume(queue, (msg)=> {
        if(!msg) return;
            
        try{
            const content = JSON.parse(msg.content.toString()); 
            console.log("Message received:", content);

            const order = new Order(content);
            order.save();

            channel.ack(msg);
        } catch(error){
            console.error("Error processing message:", error);
            channel.nack(msg, false, false); 
        }
    })
}