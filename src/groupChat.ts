import * as readline from "node:readline";
import {
    Message,
    listenForGroupMessages,
    sendGroupMessage,
} from "./firebase";

export function startGroupChat(
    rl: readline.Interface,
    currentUserId: string
) {
    console.log("\nGroup Chat Started");
    console.log("------------------------\n");

    listenForGroupMessages((message: Message) => {
        console.log(`${message.senderId}: ${message.text}`);
        rl.prompt();
    });

    rl.setPrompt("> ");
    rl.prompt();

    rl.on("line", async (line) => {
        const text = line.trim();
        if (!text) {
            rl.prompt();
            return;
        }
        await sendGroupMessage(currentUserId, text);
        rl.prompt();
    });
}