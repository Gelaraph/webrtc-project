import { child, onValue, push } from "firebase/database";
import { connectedRef, dbRef, userRef } from "./firebase";
import { roomNumber } from "../App";
import { store } from "../main";

// Invoke connectedRef to get the reference
const participantRef = connectedRef(roomNumber);

export const updatePreference = (userId, preference) => {
  const currentParticipantRef = participantRef
    .child(userId)
    .child("preferences");
  setTimeout(() => {
    currentParticipantRef.update(preference);
  });
};

export const createOffer = async (peerConnection, createdId, receiverId) => {
  let receiverRef;

  peerConnection.onicecandidate = (event) => {
    event.candidate &&
      // receiverRef
      // .child("offerCandidates").push({ ...event.candidate.toJSON(), userId: createdId });
      onValue(receiverRef(dbRef.key), (snap) => {
        const data = snap.val();
        console.log(data);
        if (snap) {
          data["offerCandidates"].push({
            ...event.candidate.candidate.toJSON(),
            userId: createdId,
          });
        }
      });
  };

  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  const offerPayload = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
    userId: createdId,
  };

  receiverRef = push(child(dbRef(receiverId), "offers")).key;

  // update the offers container with the offerPayload
  const updates = {};
  updates["/offers/" + receiverRef] = offerPayload;

  console.log({ receiverRef, roomNumber });

  await userRef(receiverRef, updates);
};

export const initializeListensers = async (userId) => {
  const currentUserRef = participantRef.child(userId);

  currentUserRef.child("offers").on("child_added", async (snapshot) => {
    const data = snapshot.val();
    if (data?.offer) {
      const pc =
        store.getState().participants[data.offer.userId].peerConnection;
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      await createAnswer(data.offer.userId, userId);
    }
  });

  currentUserRef.child("offerCandidates").on("child_added", (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = store.getState().participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  });

  currentUserRef.child("answers").on("child_added", (snapshot) => {
    const data = snapshot.val();
    if (data?.answer) {
      const pc =
        store.getState().participants[data.answer.userId].peerConnection;
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  currentUserRef.child("answerCandidates").on("child_added", (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = store.getState().participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  });
};

const createAnswer = async (otherUserId, userId) => {
  const pc = store.getState().participants[otherUserId].peerConnection;
  const participantRef1 = participantRef.child(otherUserId);
  pc.onicecandidate = (event) => {
    event.candidate &&
      participantRef1
        .child("answerCandidates")
        .push({ ...event.candidate.toJSON(), userId: userId });
  };

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
    userId: userId,
  };

  await participantRef1.child("answers").push().set({ answer });
};
