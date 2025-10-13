import amqp from 'amqplib';

import {IOrder} from "../models/order.model.js";

export const publishOrder = async(orderData: IOrder) =>{
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel();
    
    const orderQueue = "order";
    const emailQueue = "email";
    
    await channel.assertQueue(orderQueue, {durable: true});
    await channel.assertQueue(emailQueue, {durable: true});


    channel.sendToQueue(orderQueue, Buffer.from(JSON.stringify(orderData)), {
        persistent: true
    });
    console.log("📦 Pedido enviado para fila orderQueue");

    channel.sendToQueue(emailQueue, Buffer.from(JSON.stringify({email: orderData.customerEmail})), {
        persistent: true
    });
    console.log("📨 E-mail enviado para fila emailQueue");


    await channel.close();
    await connection.close();
}