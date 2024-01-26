/* eslint-disable no-unused-vars */
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  push,
  ref,
  update,
  child,
  onDisconnect,
  onValue,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCEP2adIb7cQqnKA_NvhIoBgKoMZ4Gx6Ts",
  dbURL: "https://webrtc-4db61-default-rtdb.firebaseio.com/",
  projectId: "webrtc-4db61",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize db
export const db = getDatabase(app);

export function connectedRef(roomId) {
  const refVar = ref(db, `${roomId}/participants`);
  return refVar;
}

export const defaultPreferences = {
  audio: true,
  video: false,
  screen: false,
};

export async function getAllParticipants(roomId, callback) {
  const participantsRef = ref(db, `${roomId}/participants`);

  // Set up a listener for real-time updates
  onValue(participantsRef, (snapshot) => {
    if (snapshot.exists()) {
      const participantsData = snapshot.val();
      callback(participantsData);
    } else {
      console.log("No participants data found");
      callback(null);
    }
  });
}
export let dbRef;

export let participantRef;

export const userRef = async function updateDatabase(ref, updates) {
  try {
    await update(ref, updates);
  } catch (err) {
    console.error("Error:", err);
  }
  // Return the reference for onDisconnect usage
  return ref;
};

export async function generateRoomId(userData) {
  const newPushRef = push(ref(db, "WebRTC Project"));
  dbRef = ref(db, newPushRef.key);

  participantRef = push(child(dbRef, "participants")).key;

  // Write the new user's data simultaneously in the participants list and the user's data list.
  const updates = {};
  updates["/participants/" + participantRef] = userData;

  await userRef(dbRef, updates);

  // Use onDisconnect on the specific user reference inside participants list
  onDisconnect(child(dbRef, "participants/" + participantRef)).remove();
  return newPushRef;
}

export async function joinRoom(roomId, userData) {
  dbRef = ref(db, roomId);
  participantRef = push(child(dbRef, "participants")).key;

  // update the participant container with the new paticipant data that joined
  const updates = {};
  updates["/participants/" + participantRef] = userData;

  await userRef(dbRef, updates);

  // Use onDisconnect on the specific user reference inside participants list
  onDisconnect(child(dbRef, "participants/" + participantRef)).remove();
}
