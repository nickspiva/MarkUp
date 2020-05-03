import React from "react";
import { connect } from "react-redux";

const TaggedStickers = () => <div>Tagged Stickers</div>;

const mapState = (state) => {
  return {
    testProp: "testProp",
  };
};

const mapDispatch = (dispatch) => {
  return {
    testFn: function () {
      console.log("test dispatch function");
    },
  };
};

export default connect(mapState, mapDispatch)(TaggedStickers);
