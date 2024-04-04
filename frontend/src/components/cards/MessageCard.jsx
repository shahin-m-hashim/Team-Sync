import msg from "../../assets/images/Open Envelope.png";

export default function MessageCard() {
  return (
    <div className="bg-[#141414] h-full border-x-2 rounded-md flex flex-col items-center p-3 text-center">
      <img src={msg} width="30%" />
      <span className="text-base font-medium">You have no new messages </span>
      <span className="text-sm text-[#828282] my-3">
        See the message, you can go to your <br />
        personal account - received messages
      </span>
      <button className="bg-[#9685FF] mt-3 px-5 rounded-sm">Read</button>
    </div>
  );
}
