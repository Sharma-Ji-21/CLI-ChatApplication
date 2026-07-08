import * as readline from "node:readline";

import {
    listenForDirectMessages,
    sendDirectMessage,
    Message,
} from "./firebase";

export function startDirectChat(
    rl: readline.Interface,
    currentUserId: string,
    receiverId: string
) {
    console.log("\nDirect Chat Started");
    console.log("------------------------\n");

    listenForDirectMessages(
        currentUserId,
        receiverId,
        (message: Message) => {
            console.log(`${message.senderId}: ${message.text}`);
            rl.prompt();
        }
    );

    rl.setPrompt("> ");
    rl.prompt();

    rl.on("line", async (line) => {
        const text = line.trim();
        if (!text) {
            rl.prompt();
            return;
        }
        await sendDirectMessage(
            currentUserId,
            receiverId,
            text
        );
        rl.prompt();
    });
}