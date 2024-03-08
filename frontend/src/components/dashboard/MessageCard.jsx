import msg from "../../assets/images/Open Envelope.png";

export default function MessageCard() {
  return (
    <div
      id="messages"
      className="bg-[#141414] flex flex-col m-1 rounded-lg items-center p-3 text-center justify-evenly"
    >
      <img src={msg} width="35%" />
      <span className="font-medium">You have no new messages </span>
      <span className="text-xs text-[#828282]">
        See the message, you can go to your <br />
        personal account - received messages
      </span>
      <button className="bg-[#9685FF] px-5 py-1 rounded-sm w-fit">Read</button>
    </div>
  );
}
