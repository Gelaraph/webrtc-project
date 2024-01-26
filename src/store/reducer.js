import { createOffer } from "../server/peerConnection";
import {
  ADD_PARTICIPANT,
  REMOVE_PARTICIPANT,
  SET_USER,
  SET_USERSTREAM,
} from "./actionTypes";

/* eslint-disable no-unused-vars */
let initialState = {
  currentUser: null,
  participant: {},
  mediaStream: null,
};

const stunServers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.services.mozilla.com",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USERSTREAM: {
      state = { ...state, ...payload };
      return state;
    }
    case SET_USER: {
      state = { ...state, currentUser: { ...payload.currentUser } };
      return state;
    }

    case ADD_PARTICIPANT: {
      const currentUserId = Object.keys(state.currentUser)[0];
      const participantIds = Object.keys(payload.participant);

      for (const participantId of participantIds) {
        const participant = payload.participant[participantId];

        // Check if the participant is the current user
        if (participantId === currentUserId) {
          participant.currentUser = true;
        }

        // Set the avatarColor for each participant
        participant.avatarColor = `#${Math.floor(
          Math.random() * 16777215
        ).toString(16)}`;
      }

      // establish a connection only with other participants, not the current user
      if (state.mainStream) {
        for (const participantId of participantIds) {
          if (participantId !== currentUserId) {
            addConnection(
              state.currentUser,
              payload.participant,
              state.mainStream
            );
          }
        }
      }

      const participants = {
        ...state.currentUser,
        ...state.participants,
        ...payload.participant,
      };
      state = { ...state, participants };

      return state;
    }

    case "UPDATE_PARTICIPANTS":
      return {
        ...state,
        participants: payload,
      };

    case REMOVE_PARTICIPANT: {
      const participants = { ...state.participants };
      delete participants[payload.participantKey];
      state = { ...state, participants };
      return state;
    }
    default: {
      return state;
    }
  }
};

const addConnection = (currentUser, newUser, mediaStream) => {
  const peerConnection = new RTCPeerConnection(stunServers);
  mediaStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, mediaStream);
  });

  const currentUserKey = Object.keys(currentUser)[0];
  const newUserKey = Object.keys(newUser)[0];

  const sortedIDs = [currentUserKey, newUserKey].sort((a, b) =>
    a.localeCompare(b)
  );

  newUser[newUserKey].peerConnection = peerConnection;

  if (sortedIDs[1] === currentUserKey) {
    createOffer(peerConnection, sortedIDs[1], sortedIDs[0]);
  }
};
