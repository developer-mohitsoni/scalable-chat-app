import { Kafka, Producer } from "kafkajs";
import path from "node:path";
import fs from "node:fs";

import "dotenv/config";
import prisma from "./prisma";

const kafka = new Kafka({
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf8")],
  },
  sasl: {
    username: process.env.KAFKA_USER as string,
    password: process.env.KAFKA_PASSWORD as string,
    mechanism: "plain",
  },
});

let producer: null | Producer = null;

export const createProducer = async () => {
  if (producer) return producer;

  const _producer = kafka.producer();

  await _producer.connect();

  producer = _producer;

  return producer;
};

export const produceMessage = async (message: string) => {
  const producer = await createProducer();

  await producer.send({
    topic: "MESSAGES",
    messages: [{ key: `message-${Date.now()}`, value: message }],
  });

  console.log("Message Produced: ", message);

  return true;
};

export const startMessageConsumer = async () => {
  const consumer = await kafka.consumer({
    groupId: "chat-app",
  });

  await consumer.connect();

  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log("New Message Received");

      try {
        await prisma.message.create({
          data: {
            text: message.value?.toString(),
          },
        });
      } catch (err) {
        console.error("Error saving message: ", err);

        pause();

        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
};

export default kafka;
