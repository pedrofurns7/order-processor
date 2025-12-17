import {Router} from 'express'
import { publishOrder } from '../queue/producer.js';
import {IOrder} from "../models/order.model.js";

const router = Router();

router.post('/order', async (req, res) =>{
    try{
        const order: IOrder = req.body;

        if(!order.customerId || !order.total){
            return res.status(400).send({error: 'Invalid order data'});
        }

        await publishOrder('order_created', order);
        
        res.status(201).json({message:"Order received", order});    
    } catch(error){
        console.error("Error processing order:", error);
        res.status(500).send({error: 'Internal Server Error'});
    }
})

export default router;