import amqp from 'amqplib';

import {IOrder} from "../models/order.model.js";

export const publishOrder = async(routingKey: string, orderData: IOrder) =>{
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel();
    
    const exchange = 'orders_exchange';
    
    await channel.assertExchange(exchange, 'direct', {durable: true});

    channel.publish(exchange,routingKey, Buffer.from(JSON.stringify(orderData)));

    console.log(`📦 Pedido enviado para a ${exchange}`);

    await channel.close();
    await connection.close();
}