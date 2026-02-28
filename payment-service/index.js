import express from "express";
import {Kafka} from 'kafkajs';
import cors from "cors";
const app=express();
app.use(cors({
  origin:"http://localhost:3000"
}
  
))


app.use(express.json());
const kafka=new Kafka({
    clientId:"payment-service",
     brokers: ["localhost:9094","localhost:9095","localhost:9096"],
})
const producer=kafka.producer();
const connectToKafka=async()=>{
    try{
        await producer.connect();
        console.log("producer connected");

    }catch(e){
        console.log("error to kafka",err);
    }
}
app.post("/payment-service",async(req,res)=>{
    const {cart}=req.body;
    const userId="123";
    //Todo:Payment
    console.log("API end point hit");
    //kafka
    await producer.send({
        topic:"payment-successful",
        messages:[{value:JSON.stringify({userId,cart})}]

    })
    return res.status(200).send("Payment sucessful");
})
//global error handler
app.use((err,req,res,next)=>{
    res.status(err.status||500).send(err.message);
})
app.listen(8000,()=>{
    connectToKafka();
    console.log("Payment service is running on port 8000");

})