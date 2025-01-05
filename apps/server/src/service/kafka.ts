import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  brokers: [],
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

export default kafka;
