export type Teammate = {
  id: string;
  name: string;
  status: string;
  role: string;
};

export const roles = [
  "All",
  "Devs",
  "Frontend",
  "Backend",
  "Product",
  "Designer",
  "Devops",
  "Manager",
  "Status",
];

export function isTeammate(object: any): object is Teammate {
  return (
    "id" in object && "name" in object && "status" in object && "role" in object
  );
}

export function isTeammateArray(object: any): object is Teammate[] {
  return Array.isArray(object) && object.every(isTeammate);
}
