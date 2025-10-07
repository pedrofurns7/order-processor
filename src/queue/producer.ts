import amqp from 'amqplib';

export const sendMessage = async(queue: string, message: any) =>{
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to ${queue}`, message);
    await channel.close();
    await connection.close();
}