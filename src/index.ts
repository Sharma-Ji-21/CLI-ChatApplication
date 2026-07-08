import { addUser, db, getGroupMessages, getUsers, sendGroupMessage } from "./firebase";

async function main() {
//   await addUser("Om's iPhone", "om-iphone");
//   await addUser("Om's MacBook", "om-macbook");
//   await addUser("Om's iPad", "om-ipad");

// await getUsers().then((users) => {
//     console.log("Users:", users);
//   });
// console.log(await getUsers());

await sendGroupMessage("om-iphone", "Hello, everyone!");
await sendGroupMessage("om-macbook", "Hi, macbook here! How are you?");
console.log(await getGroupMessages());

}

main();
