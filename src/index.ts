/// <reference types="node" />

import * as readline from "node:readline";

import {
  getUserById,
  setUserOnline,
} from "./firebase";

import { startGroupChat } from "./groupChat";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question: string) =>
  new Promise<string>((resolve) => rl.question(question, resolve));

async function login() {
  while (true) {
    const userId = (await ask("Enter User ID:\n> ")).trim();
    const password = (await ask("Enter Password:\n> ")).trim();

    const user = await getUserById(userId);

    if (!user || String(user.password) !== password) {
      console.log("\nInvalid User ID or Password\n");
      continue;
    }

    await setUserOnline(user.id, true);

    return user;
  }
}

async function cleanup(userId: string) {
  await setUserOnline(userId, false);
  rl.close();
  process.exit(0);
}

async function main() {
  console.log("CLI Chat Application\n");

  const currentUser = await login();

  console.log(`\nLogged in as ${currentUser.username}\n`);

  process.on("SIGINT", () => {
    void cleanup(currentUser.id);
  });

  startGroupChat(rl, currentUser.id);
}

main();