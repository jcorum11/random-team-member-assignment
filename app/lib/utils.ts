import { Teammate } from "./definitions";

export function generateRandomTeamMember(teammates: Teammate[]) {
  const seed = Math.random();
  const randomIndex = Math.floor(seed * teammates.length);
  return teammates[randomIndex];
}
