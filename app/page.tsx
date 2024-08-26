"use client";

import { useEffect, useState } from "react";
import { getAllTeammates, getTeammatesByRole } from "./lib/actions";
import { isTeammateArray, Teammate } from "./lib/definitions";
import { generateRandomTeamMember } from "./lib/utils";
import { get } from "http";

// import { useActionState } from "react";
// import { createTeammate, State } from "./lib/actions";

export default function Home() {
  let [randomTeammates, setRandomTeammates] = useState<Teammate[]>([]);
  let [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  let [teammates, setTeammates] = useState<Teammate[]>([]);
  let [currentButtonEditingId, setCurrentButtonEditingId] =
    useState<string>("");
  let [editingTeammateName, setEditingTeammateName] = useState<string>("");
  let [editingTeammateStatus, setEditingTeammateStatus] = useState<string>("");
  let [editingTeammateRole, setEditingTeammateRole] = useState<string>("");
  let [currentRoleFilter, setCurrentRoleFilter] = useState<string>("All");

  // const [state, formAction] = useActionState(createTeammate, initialState);
  useEffect(() => {
    getAllTeammates().then((response) => {
      if (isTeammateArray(response)) {
        setTeammates(response);
        setIsFetchingData(false);
      } else {
        throw new Error("Response is not a Teammate array");
      }
    });
  }, []);

  const roles = [
    "All",
    "Frontend",
    "Backend",
    "Product",
    "Designer",
    "Devops",
    "Manager",
  ];

  return (
    <div>
      <h1 className="container mx-auto text-center">
        Random Team Member Selector
      </h1>

      {/* <form action={formAction}></form> */}
      {/* <input type="text" placeholder="Enter team member name" /> */}
      <div>
        filters
        {roles.map((role) => {
          return (
            <button
              key={role}
              className="outline outline-purple-500 bg-purple-400 mx-5 px-4"
              onClick={() => {
                if (role === "All") {
                  getAllTeammates().then(
                    (teammates) =>
                      isTeammateArray(teammates) && setTeammates(teammates)
                  );
                } else {
                  getTeammatesByRole(role).then(
                    (teammates) =>
                      isTeammateArray(teammates) && setTeammates(teammates)
                  );
                }
              }}
            >
              {role}
            </button>
          );
        })}
      </div>
      <div className="outline outline-red-700 container mx-auto p-4 h-96">
        {isFetchingData ? (
          <p>loading</p>
        ) : (
          teammates.map((teammate) => {
            return (
              <button
                className="outline outline-purple-500 bg-purple-400 mx-5 px-4"
                key={teammate.id}
                onClick={() => setCurrentButtonEditingId(teammate.id)}
              >
                {currentButtonEditingId === teammate.id ? (
                  <>
                    <input
                      className="text-black block mb-1"
                      type="text"
                      value={teammate.name}
                      onChange={(e) => setEditingTeammateName(e.target.value)}
                    />
                    <input
                      className="text-black block mb-1"
                      type="text"
                      value={teammate.status}
                      onChange={(e) => setEditingTeammateStatus(e.target.value)}
                    />
                    <input
                      className="text-black block"
                      type="text"
                      value={teammate.role}
                      onChange={(e) => setEditingTeammateRole(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <div>{teammate.name}</div>
                    <div>{teammate.status}</div>
                    <div>{teammate.role}</div>
                  </>
                )}
              </button>
            );
          })
        )}
        {currentButtonEditingId && (
          <button onClick={() => setCurrentButtonEditingId("")}>Save</button>
        )}
      </div>
      <div className="outline outline-red-700 container mx-auto p-4 h-96">
        <button
          className="outline outline-red-500 bg-red-400 mx-5 px-4"
          onClick={() =>
            setRandomTeammates([
              ...randomTeammates,
              generateRandomTeamMember(teammates),
            ])
          }
        >
          Pick Random Team Members
        </button>
        {randomTeammates.map((randomTeammate) => {
          return (
            <button
              className="outline outline-purple-500 bg-purple-400 mx-5 px-4"
              key={randomTeammate.id}
            >
              <div>{randomTeammate.name}</div>
              <div>{randomTeammate.status}</div>
              <div>{randomTeammate.role}</div>
            </button>
          );
        })}
        {randomTeammates.length > 0 && (
          <button onClick={() => setRandomTeammates([])}>Clear</button>
        )}
      </div>
    </div>
  );
}
