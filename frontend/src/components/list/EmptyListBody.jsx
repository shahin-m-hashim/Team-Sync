/* eslint-disable react/prop-types */
import bye from "../../assets/images/bye brain.png";

export default function EmptyListBody({ name }) {
  return (
    <div
      id={`${name}Body`}
      className="flex items-center justify-center gap-10 pt-10"
    >
      <img src={bye} width="20%" alt={`no${name}`} />
      <div className="text-center">
        <span className="text-[1.7vw]">You currently have no {name}s</span>
        <br />
        <br />
        <span className="text-[1.5vw] text-[#BDBDBD]">
          How about you create one ? <br /> Or join an existing{" "}
          {name.toLowerCase()}
        </span>
      </div>
    </div>
  );
}
