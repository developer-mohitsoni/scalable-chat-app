import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: [],
});

export const createProducer = async () => {
  const producer = kafka.producer();

  await producer.connect();

  return producer;
};

export default kafka;
