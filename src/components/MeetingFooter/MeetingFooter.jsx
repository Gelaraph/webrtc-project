/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faDesktop,
  faVideoSlash,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
// import ReactTooltip from "react-tooltip";
import "./MeetingFooter.css";

const MeetingFooter = (props) => {
  return (
    <div className="meeting-footer">
      <div className="meeting-icons">
        <FontAwesomeIcon icon={faMicrophone} title="Mute" />
      </div>
      <div className="meeting-icons ">
        <FontAwesomeIcon icon={faVideo} />
      </div>
      <div className="meeting-icons" data-tip="Share Screen">
        <FontAwesomeIcon icon={faDesktop} />
      </div>
      {/* <ReactTooltip /> */}
    </div>
  );
};

export default MeetingFooter;
