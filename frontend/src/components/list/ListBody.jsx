/* eslint-disable react/prop-types */
import ListItem from "./ListItem";
import { useContext } from "react";
import EmptyListBody from "./EmptyListBody";
import { projectContext } from "@/contexts/projectContext";

export default function ListBody({ searchByName }) {
  const { projects } = useContext(projectContext);

  if (searchByName) {
    return projects
      .filter((project) =>
        project.name.toLowerCase().includes(searchByName.toLowerCase())
      )
      .map((project, index) => <ListItem key={index} {...project} />);
  }

  return projects.length > 0 ? (
    projects.map((project, index) => <ListItem key={index} {...project} />)
  ) : (
    <EmptyListBody name="Project" />
  );
}
