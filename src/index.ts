#!/usr/bin/env node

/// <reference types="node" />

import * as readline from "node:readline";
import {
    getUserById,
    setUserOnline,
} from "./firebase";
import { startGroupChat } from "./groupChat";
import { startDirectChat } from "./directChat";
import { getUsers } from "./firebase";

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
    console.log("1. Group Chat");
    console.log("2. Direct Message\n");

    const choice = await ask("> ");
    if(choice.trim()==="1"){
        startGroupChat(rl, currentUser.id);
    }
    else if(choice.trim()==="2"){
        const users = await getUsers();
        const otherUsers = users.filter(user => user.id !== currentUser.id);

        if (otherUsers.length === 0) {
            console.log("\nNo other users available for direct messaging.\n");
            rl.close();
            return;
        }

        console.log("\nAvailable Users:");
        otherUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} (ID: ${user.id})`);
        });

        const userChoice = await ask("\nSelect a user by number:\n> ");
        const selectedIndex = parseInt(userChoice.trim(), 10) - 1;

        if (selectedIndex < 0 || selectedIndex >= otherUsers.length) {
            console.log("\nInvalid selection.\n");
            rl.close();
            return;
        }

        const receiverId = otherUsers[selectedIndex].id;
        startDirectChat(rl, currentUser.id, receiverId);
    } else {
        console.log("\nInvalid choice.\n");
        rl.close();
        return;
    }

    process.on("SIGINT", () => {
        void cleanup(currentUser.id);
    });
}

main();