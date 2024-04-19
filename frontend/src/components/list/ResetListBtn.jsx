/* eslint-disable react/prop-types */
import reset from "../../assets/images/Reset.png";

const ResetListBtn = ({ resetList }) => {
  return (
    <button onClick={() => resetList()}>
      <img src={reset} className="size-10" />
    </button>
  );
};

export default ResetListBtn;
