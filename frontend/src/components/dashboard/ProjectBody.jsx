import bye from "../../assets/images/bye brain.png";

export default function ProjectBody() {
  return (
    <div
      id="projectBody"
      className="flex items-center justify-center gap-10 pt-10"
    >
      <img src={bye} width="20%" />
      <div className="text-center">
        <span className="text-[1.7vw]">You currently have no projects</span>
        <br />
        <br />
        <span className="text-[1.5vw] text-[#BDBDBD]">
          How about you create one ? <br /> Or join an existing project
        </span>
      </div>
    </div>
  );
}
