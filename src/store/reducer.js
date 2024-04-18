/* eslint-disable no-unused-vars */
import {
  ADD_PARTICIPANT,
  REMOVE_PARTICIPANT,
  SET_USER,
  UPDATE_USER,
  SET_MEDIA_STREAM,
  UPDATE_PARTICIPANT,
} from "./actionTypes";

import {
  createOffer,
  initializeListensers,
  updatePreference,
} from "../server/peerConnection";

/* eslint-disable no-unused-vars */
let initialState = {
  currentUser: null,
  participants: {},
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

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_MEDIA_STREAM: {
      state = { ...state, ...payload };
      return { ...state, ...payload };
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

      return { ...state, ...payload };
    }

    case SET_USER: {
      let participants = { ...state.participants };
      const userId = Object.keys(payload.currentUser)[0];
      // initializeListensers(userId);
      state = {
        ...state,
        currentUser: { ...payload.currentUser },
        participants,
      };
      return { ...state, ...payload };
    }

    case REMOVE_PARTICIPANT: {
      const participantIdToRemove = payload.participantId;
      const {
        [participantIdToRemove]: removedParticipant,
        ...remainingParticipants
      } = state.participants;

      // Check if the removed participant was the current user
      const currentUserId = Object.keys(state.currentUser)[0];
      // updatePreference(currentUserId, payload.currentUser);
      const currentUserRemoved = participantIdToRemove === currentUserId;

      // If the removed participant was the current user, remove currentUser from state
      if (currentUserRemoved) {
        delete state.currentUser[currentUserId];
      }

      state = {
        ...state,
        participants: remainingParticipants,
        currentUser: { ...state.currentUser },
      };

      return { ...state, ...payload };
    }
    // case REMOVE_PARTICIPANT: {
    //   const participants = { ...state.participants };
    //   delete participants[payload.participantKey];
    //   state = { ...state, participants };
    //   return state;
    // }

    case "UPDATE_PARTICIPANTS":
      return {
        ...state,
        participants: payload,
      };

    case UPDATE_USER: {
      const currentUserId = Object.keys(state.currentUser)[0];
      const updatedUserData = payload.updatedUser[currentUserId];

      if (updatedUserData) {
        // Update the currentUser with the new data
        state.currentUser[currentUserId] = {
          ...state.currentUser[currentUserId],
          ...updatedUserData,
        };
        // Update avatarColor if provided in the payload
        if (updatedUserData.avatarColor) {
          state.currentUser[currentUserId].avatarColor =
            updatedUserData.avatarColor;
        }
      }

      return { ...state, ...payload };
    }

    case UPDATE_PARTICIPANT: {
      const updatedParticipant = payload.updatedParticipant;
      const participantId = Object.keys(updatedParticipant)[0];

      // Merge updatedParticipant into the state
      state.participants[participantId] = {
        ...state.participants[participantId],
        ...updatedParticipant[participantId],
      };

      return { ...state, ...payload };
    }

    default: {
      return { ...state, ...payload };
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
