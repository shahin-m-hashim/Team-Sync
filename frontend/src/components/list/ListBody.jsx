/* eslint-disable react/prop-types */
import ListItem from "./ListItem";
import bye from "../../assets/images/bye brain.png";
import google from "../../assets/images/project icons/Google.png";
import facebook from "../../assets/images/project icons/Facebook.png";
import instagram from "../../assets/images/project icons/Instagram.png";
import youtube from "../../assets/images/project icons/Youtube.png";

const allProjects = [
  {
    name: "Project 1",
    createdDate: "01/02/2024",
    icon: google,
    progress: 0,
    status: "Not Started",
    role: "Leader",
  },
  {
    name: "Project 2",
    createdDate: "01/02/2024",
    icon: facebook,
    progress: 20,
    status: "Pending",
    role: "Member",
  },
  {
    name: "Project 3",
    createdDate: "01/02/2024",
    icon: instagram,
    progress: 100,
    status: "Done",
    role: "Co-Leader",
  },
  {
    name: "Project 4",
    createdDate: "01/02/2024",
    icon: youtube,
    progress: 50,
    status: "Stopped",
    role: "Guide",
  },
];

export default function ListBody({ listOnlyAdminProjects }) {
  const projects = listOnlyAdminProjects
    ? allProjects.filter((project) => project.role === "Leader")
    : allProjects;

  return projects.length > 0 ? (
    projects.map((project, index) => <ListItem key={index} {...project} />)
  ) : (
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
