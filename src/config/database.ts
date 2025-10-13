import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://root:secret@localhost:27017/ordersdb?authSource=admin"

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error);
    process.exit(1); 
  }
};
