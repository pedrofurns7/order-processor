import express from 'express'


import { connectDB } from "./config/database.js";

import { consumeMessages } from './queue/consumer.js'
import { startEmailConsumer } from './queue/emailConsumer.js';
import orderRoutes from './routes/order.routes.js'
import { start } from 'repl';

const app = express()
app.use(express.json())
app.use(orderRoutes)


async function startServer(){
  try{
    await connectDB();
    console.log("Connected to MongoDB");

    consumeMessages('order');
    startEmailConsumer('email');

    
    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    });
  }catch(error){
    console.error("❌ Failed to start server:", error);
  }
}


// app.get('/', (req, res) => {
//   res.send('Order processor API - Active!')
// })

// app.post('/send', async (req, res) => {
//     await sendMessage('orders', { orderId: Date.now(), item: 'Example Item', status:'created' });
//     res.json({ message: 'Order sent to queue' });
// })

startServer()