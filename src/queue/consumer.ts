import amqp from 'amqplib';

export const consumeMessages = async(queue: string) =>{
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue);
    console.log(`Waiting for messages in ${queue}...`);

    channel.consume(queue, (msg)=>{
        if(msg){
            const content = JSON.parse(msg.content.toString());
            console.log("Message received:", content);
            channel.ack(msg);
        }
    })
}