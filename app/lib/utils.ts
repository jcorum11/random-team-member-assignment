import { Teammate } from "./definitions";

export function generateRandomTeamMember(teammates: Teammate[]) {
  const seed = Math.random();
  const randomIndex = Math.floor(seed * teammates.length);
  return teammates[randomIndex];
}

export function sortResponse(response: Teammate[]) {
  return response.sort((a: Teammate, b: Teammate) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}
