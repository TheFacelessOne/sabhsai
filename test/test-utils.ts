// Starts up a discord bot for testing purposes
export { login };

// Required modules
import { Client, GatewayIntentBits, IntentsBitField } from "discord.js";
import "dotenv/config";

// What permissions the bot needs
// Used for what events the bot can listen for too
const myIntents = new IntentsBitField().add(
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent
);

// The client we intend to login on
const client = new Client({ intents: myIntents });

const token = process.env.DEV_TOKEN;
if (!token) throw new Error("No DEV_TOKEN provided");

async function login(): Promise<Client> {
  if (client.uptime == null) {
    await client.login(token).catch((error) => {
      throw new Error(error);
    });
  }
  return client;
}
