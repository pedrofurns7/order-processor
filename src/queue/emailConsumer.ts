import amqp from 'amqplib';

export async function startEmailConsumer(queue: string) {
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: true });

        console.log(`Waiting for messages in ${queue}...`);

        channel.consume(queue, async (msg) => {
            if (!msg) return;

            const emailData = JSON.parse(msg.content.toString());

            await new Promise(resolve => setTimeout(resolve, 5000));

            console.log(`Email sent to ${emailData.email}`);

            channel.ack(msg);
        });

    }catch(error){
        console.error("Error in email consumer:", error);
    }
}