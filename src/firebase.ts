import { initializeApp } from "firebase/app";
import {
  getDatabase,
  push,
  ref,
  set,
  get,
  onChildAdded,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBfW0WfOTbFohp07zk8ec4WF6PLc29QRLE",
  authDomain: "cli-chatapplication.firebaseapp.com",
  databaseURL: "https://cli-chatapplication-default-rtdb.firebaseio.com",
  projectId: "cli-chatapplication",
  storageBucket: "cli-chatapplication.firebasestorage.app",
  messagingSenderId: "55342612463",
  appId: "1:55342612463:web:f38ed096aba89be102001a",
  measurementId: "G-QQERSBHLDF",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

type User = {
  id: string;
  username: string;
  password: string;
  online: boolean;
};

type GroupMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
};

async function addUser(username: string, userId: string, password: string) {
  await set(ref(db, `users/${userId}`), {
    username,
    password,
    online: false,
  });
}

async function getUsers(): Promise<User[]> {
  const snapshot = await get(ref(db, "users"));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({
    id,
    ...(value as Omit<User, "id">),
  }));
}

async function getUserById(userId: string): Promise<User | null> {
  const snapshot = await get(ref(db, `users/${userId}`));
  if (!snapshot.exists()) {
    return null;
  }
  return {
    id: userId,
    ...(snapshot.val() as Omit<User, "id">),
  };
}

async function setUserOnline(userId: string, online: boolean) {
  await set(ref(db, `users/${userId}/online`), online);
}

async function sendGroupMessage(senderId: string, text: string) {
  const newMessageRef = push(ref(db, "groupMessages"));

  await set(newMessageRef, {
    senderId,
    text,
    timestamp: Date.now(),
  });
}

async function getGroupMessages(): Promise<GroupMessage[]> {
  const snapshot = await get(ref(db, "groupMessages"));
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({
    id,
    ...(value as Omit<GroupMessage, "id">),
  }));
}

function listenForGroupMessages(callback: (message: GroupMessage) => void) {
  const groupMessagesRef = ref(db, "groupMessages");
  onChildAdded(groupMessagesRef, (snapshot) => {
    callback({
      id: snapshot.key!,
      ...(snapshot.val() as Omit<GroupMessage, "id">),
    });
  });
}

export {
  db,
  addUser,
  getUsers,
  getUserById,
  setUserOnline,
  sendGroupMessage,
  getGroupMessages,
  listenForGroupMessages,
  GroupMessage,
};
