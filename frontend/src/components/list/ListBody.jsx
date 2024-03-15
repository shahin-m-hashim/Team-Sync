/* eslint-disable react/prop-types */
import ListItem from "./ListItem";
import { useContext } from "react";
import EmptyListBody from "./EmptyListBody";
import { projectContext } from "@/contexts/projectContext";
import { teamContext } from "@/contexts/teamContext";
import { subTeamContext } from "@/contexts/subTeamContext";

export default function ListBody({ displayList }) {
  const { teams, teamNameSearchTxt } = useContext(teamContext);
  const { projects, projectNameSearchTxt } = useContext(projectContext);
  const { subTeams, subTeamNameSearchTxt } = useContext(subTeamContext);

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
        .filter((team) =>
          team.name.toLowerCase().includes(teamNameSearchTxt.toLowerCase())
        )
        .map((team, index) => <ListItem key={index} {...team} />);
    }

    return teams.length > 0 ? (
      teams.map((team, index) => <ListItem key={index} {...team} />)
    ) : (
      <EmptyListBody name={displayList} />
    );
  }

  if (displayList === "Sub Team") {
    if (subTeamNameSearchTxt && subTeams.length > 0) {
      return subTeams
        .filter((subTeam) =>
          subTeam.name
            .toLowerCase()
            .includes(subTeamNameSearchTxt.toLowerCase())
        )
        .map((subTeam, index) => <ListItem key={index} {...subTeam} />);
    }

    return subTeams.length > 0 ? (
      subTeams.map((subTeam, index) => <ListItem key={index} {...subTeam} />)
    ) : (
      <EmptyListBody name={displayList} />
    );
  }
}
