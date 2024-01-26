/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import "./Participants.css";
import { useSelector } from "react-redux";
import { Participant } from "./Participant/Participant";

const Participants = () => {
  const participants = useSelector((state) => state.participants);

  let participantKey = participants ? Object.keys(participants) : [];

  let gridCol =
    participantKey.length === 1 ? 1 : participantKey.length <= 4 ? 2 : 4;

  const gridColSize = participantKey.length <= 4 ? 1 : 2;

  let gridRowSize =
    participantKey.length <= 4
      ? participantKey.length
      : Math.ceil(participantKey.length / 2);

  // const screenPresenter = participantKey.find((element) => {
  //   const currentParticipant = props.participants[element];
  //   return currentParticipant.screen;
  // });

  // if (screenPresenter) {
  //   gridCol = 1;
  //   gridRowSize = 2;
  // }
  return (
    <>
      {participants ? (
        <div
          style={{
            "--grid-size": gridCol,
            "--grid-col-size": gridColSize,
            "--grid-row-size": gridRowSize,
          }}
          className={`participants`}
        >
          {Object.keys(participants).map((participantsKey) => {
            const currentParticipant = participants[participantsKey];
            return (
              <Participant
                participant={currentParticipant}
                key={participantsKey}
              />
            );
          })}
        </div>
      ) : (
        "Loading"
      )}
    </>
  );
};

export default Participants;
