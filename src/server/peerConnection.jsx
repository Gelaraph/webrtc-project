import { child, onValue, push } from "firebase/database";
import { dbRef, userRef } from "./firebase";
import { check } from "../App";

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

  console.log({ receiverRef, check });

  await userRef(receiverRef, updates);
};
