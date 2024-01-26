/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
import MeetingFooter from "../MeetingFooter/MeetingFooter";
import Participants from "../Participants/Participants";
import "./MainScreen.css";
import { connect } from "react-redux";

const MainScreen = (props) => {
  return (
    <div className="wrapper">
      <div className="main-screen">
        <Participants />
      </div>

      <div className="footer">
        <MeetingFooter />
      </div>
    </div>
  );
};

// export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

export default MainScreen;
