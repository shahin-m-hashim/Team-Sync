/* eslint-disable react/prop-types */
import ListItem from "./ListItem";
import { useContext } from "react";
import EmptyListBody from "./EmptyListBody";
import { projectContext } from "@/contexts/projectContext";
import { teamContext } from "@/contexts/teamContext";

export default function ListBody({ displayList }) {
  const { projects, projectNameSearchTxt } = useContext(projectContext);
  const { teams, teamNameSearchTxt } = useContext(teamContext);

  if (displayList === "Project") {
    if (projectNameSearchTxt && projects.length > 0) {
      return projects
        .filter((project) =>
          project.name
            .toLowerCase()
            .includes(projectNameSearchTxt.toLowerCase())
        )
        .map((project, index) => <ListItem key={index} {...project} />);
    }

    return projects.length > 0 ? (
      projects.map((project, index) => <ListItem key={index} {...project} />)
    ) : (
      <EmptyListBody name={displayList} />
    );
  }

  if (displayList === "Team") {
    if (teamNameSearchTxt && teams.length > 0) {
      return teams
        .filter((project) =>
          project.name.toLowerCase().includes(teamNameSearchTxt.toLowerCase())
        )
        .map((project, index) => <ListItem key={index} {...project} />);
    }

    return teams.length > 0 ? (
      teams.map((project, index) => <ListItem key={index} {...project} />)
    ) : (
      <EmptyListBody name={displayList} />
    );
  }
}
