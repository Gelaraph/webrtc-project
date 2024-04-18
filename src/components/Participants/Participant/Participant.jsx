/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Card from "../../Shared/Card/Card";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Participant.css";

export const Participant = ({ participant }) => {
  console.log({ party: participant });
  return (
    <div className="participant">
      <Card>
        <video
          // ref={videoRef}
          className="video"
          // id={`participantVideo${curentIndex}`}
          autoPlay
          playsInline
        ></video>

        <FontAwesomeIcon
          className="muted"
          icon={faMicrophoneSlash}
          title="Muted"
        />
        <div style={{ background: participant.avatarColor }} className="avatar">
          {participant?.userName[0]}
        </div>
        <div className="name">
          {participant.userName}
          {participant.currentUser ? " (You)" : ""}
        </div>
      </Card>
    </div>
  );
};
