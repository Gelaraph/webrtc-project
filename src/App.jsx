/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import {
  connectedRef,
  defaultPreferences,
  getAllParticipants,
  generateRoomId,
  joinRoom,
  db,
} from "./server/firebase";
import { connect } from "react-redux";
import {
  addParticipant,
  removeParticipant,
  setUser,
  setUserStream,
  updateUser,
  updateParticipant,
} from "./store/actionCreator";
import { onValue, ref } from "firebase/database";
import { useSearchParams } from "react-router-dom";
import MainScreen from "./components/MainScreen/MainScreen";

export let roomNumber;

// eslint-disable-next-line react/prop-types
function App({ addParticipant, setUser, setUserStream }) {
  const [userData, setUserData] = useState();
  const [params, setParams] = useSearchParams();
  const roomId = params.get("id");

  roomNumber = roomId;

  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return localStream;
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((mediaStream) => {
        mediaStream.getVideoTracks()[0].enabled = false;
        setUserStream(mediaStream);
      });

    const updateParams = async () => {
      if (roomId) {
        joinRoom(roomId, userData);
      } else {
        const newRoomId = await generateRoomId(userData);
        params.set("id", newRoomId.key);
        setParams(params.toString());
      }
    };

    updateParams();
  }, [roomId, userData?.userName, params, setParams]);

  useEffect(() => {
    const name = prompt("What's your name?");
    setUserData({
      userName: name,
      preference: defaultPreferences,
    });
    const dbRef = ref(db, roomId);
    onValue(connectedRef(dbRef.key), (snap) => {
      const isConnected = snap.val();
      if (isConnected) {
        // Get the first key from the isConnected object which is the ref
        const firstKey = Object.keys(isConnected)[0];
        setUser({
          [firstKey]: { userName: userData?.userName, ...defaultPreferences },
        });
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (roomId) {
        try {
          getAllParticipants(roomId, (allParticipants) => {
            if (allParticipants && allParticipants !== null) {
              addParticipant({
                ...allParticipants,
              });
            } else {
              // Handle the case when no participants data is found
            }
          });
        } catch (error) {
          console.error("Error retrieving participants data:", error);
        }
      } else {
        // Handle the case when no roomId is available
      }
    };

    fetchData();
  }, [roomId]);

  return (
    <div>
      <MainScreen />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { user: state.CurrentUser, participant: state.participant };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserStream: (stream) => dispatch(setUserStream(stream)),
    setUser: (user) => dispatch(setUser(user)),
    addParticipant: (participant) => dispatch(addParticipant(participant)),
    removeParticipant: (participantKey) =>
      dispatch(removeParticipant(participantKey)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
  };
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default ConnectedApp;
