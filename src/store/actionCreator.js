import {
  ADD_PARTICIPANT,
  REMOVE_PARTICIPANT,
  SET_USER,
  SET_MEDIA_STREAM,
  UPDATE_USER,
  UPDATE_PARTICIPANT,
} from "./actionTypes";

export const setUserStream = (stream) => {
  return {
    type: SET_MEDIA_STREAM,
    payload: {
      mainStream: stream,
    },
  };
};

export const setUser = (user) => {
  return { type: SET_USER, payload: { currentUser: user } };
};

export const addParticipant = (participant) => {
  return { type: ADD_PARTICIPANT, payload: { participant } };
};

export const updateUser = (user) => {
  return {
    type: UPDATE_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const updateParticipant = (user) => {
  return {
    type: UPDATE_PARTICIPANT,
    payload: {
      newUser: user,
    },
  };
};

export const removeParticipant = (participantKey) => {
  return { type: REMOVE_PARTICIPANT, payload: { participantKey } };
};
