import express from 'express'
import { sendMessage } from './queue/producer.js'
import { consumeMessages } from './queue/consumer.js'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Order processor API - Active!')
})

app.post('/send', async (req, res) => {
    await sendMessage('orders', { orderId: Date.now(), item: 'Example Item', status:'created' });
    res.json({ message: 'Order sent to queue' });
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
});