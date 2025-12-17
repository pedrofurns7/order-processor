import mongoose, {Schema, Document} from "mongoose";

interface IItem {
  name: string;
  price: number;
}

export interface IOrder extends Document{
    customerId: string;
    customerEmail: string; 
    total: number;
    items: IItem[];
    createdAt: Date;
}

const ItemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    customerId: {type: String, required: true},
    customerEmail: { type: String, required: true },
    total: {type: Number, required: true},
    items: { type: [ItemSchema], required: true },
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model<IOrder>('Order', OrderSchema);