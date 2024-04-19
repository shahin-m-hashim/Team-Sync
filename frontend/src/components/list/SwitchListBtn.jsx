/* eslint-disable react/prop-types */
import switchIcon from "../../assets/images/Switch.png";

const SwitchListBtn = ({ setSwitchList }) => {
  return (
    <button onClick={() => setSwitchList((prevState) => !prevState)}>
      <img src={switchIcon} className="size-10" />
    </button>
  );
};

export default SwitchListBtn;
