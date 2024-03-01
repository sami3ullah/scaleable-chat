import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";

const kafka = new Kafka({
  brokers: [`${process.env.KAFKA_URI}`],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    username: `${process.env.KAFKA_USERNAME}`,
    password: `${process.env.KAFKA_PASSWORD}`,
    mechanism: "plain",
  },
});

let producer: Producer | null = null;
export async function createProducer() {
  // signleton pattern basically, return
  // the instance if it's already created
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}

export async function startMessageConsumer() {
  console.log("Consumer is running...");
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log(`New Message Received...`);
      try {
        await prismaClient.message.create({
          data: {
            text: message.value?.toString(),
          },
        });
      } catch (err) {
        console.log("Something went wrong");
        pause();
        // resume the topic for 3s if something went wrong
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 3 * 1000);
      }
    },
  });
}

export default kafka;
