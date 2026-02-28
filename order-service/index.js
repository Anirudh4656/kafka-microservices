import kafka from "kafkajs";
const kafka=new kafka({
    clientId:"order-service",
     brokers: ["localhost:9094","localhost:9095","localhost:9096"],
});

const producer=kafka.producer();
const consumer=kafka.consumer({groupId:"order-service"});

const run=async()=>{
    try{
        await producer.connect();
        await consumer.connect();
        await consumer.subscribe({
            topic:'payment-successful',
            fromBeginning:true,
        })
        await consumer.run({
            eachMessage:async({topic,partition,message})=>{
                const value=message.value.toString();
                const {userId,cart}=JSON.parse(value);
                //ToDO:create a order on db
                const dummyOrderId="5555555555";
                console.log(`Order consumer:Order created for userID:${userId}`)
                await producer.send({
                    topic:"order-successful",
                    messages:[
                        {value:JSON.stringify({userId,orderId:dummyOrderId})}
                    ],
                })

            },
        })

    }catch(e){
        console.log(e);
    }

}

run();