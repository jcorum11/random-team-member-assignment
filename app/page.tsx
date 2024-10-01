"use client";

import { useEffect, useState } from "react";
import {
  getAllTeammates,
  getDevs,
  getTeammatesByRole,
  updateTeammate,
} from "./lib/actions";
import { isTeammateArray, roles, Teammate } from "./lib/definitions";
import { generateRandomTeamMember, sortResponse } from "./lib/utils";
import Header from "./components/header";
import FilterButton from "./components/filterButton";

// TODO: status filter: click status filter turns into an input that will filter by string (add pen icon)
// TODO: move status below role on buttons
// TODO: add a delete/add button to teammates
// TODO: add pen icon to teammate buttons so its clear that it can be edited
// TODO: add a discard button to edit state (next to save)
// TODO: test that changing role and then filtering works well
// TODO: fix space bug on edit state
// TODO: Tech debt: components, state management?
// TODO: filter button color on hover should be blue not purple

export default function Home() {
  let [randomTeammates, setRandomTeammates] = useState<Teammate[]>([]);
  let [currentTeammatePool, setCurrentTeammatePool] = useState<Teammate[]>([]);
  let [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  let [teammates, setTeammates] = useState<Teammate[]>([]);
  let [currentButtonEditingId, setCurrentButtonEditingId] =
    useState<string>("");
  let [editingTeammateName, setEditingTeammateName] = useState<string>("");
  let [editingTeammateStatus, setEditingTeammateStatus] = useState<string>("");
  let [editingTeammateRole, setEditingTeammateRole] = useState<string>("");
  let [currentRoleFilter, setCurrentRoleFilter] = useState<string>("All");

  useEffect(() => {
    getAllTeammates().then((response) => {
      if (isTeammateArray(response)) {
        const sortedResponse = sortResponse(response);
        setTeammates(sortedResponse);
        setCurrentTeammatePool(sortedResponse);
        setIsFetchingData(false);
      } else {
        throw new Error("Response is not a Teammate array");
      }
    });
  }, []);

  async function clickFilter(role: string) {
    setRandomTeammates([]);
    setCurrentRoleFilter(role);
    let teammates;
    if (role === "All") {
      teammates = await getAllTeammates();
    } else if (role === "Devs") {
      teammates = await getDevs();
    } else {
      teammates = await getTeammatesByRole(role);
    }
    if (isTeammateArray(teammates)) {
      const sortedResponse = sortResponse(teammates);
      setTeammates(sortedResponse);
      setCurrentTeammatePool(sortedResponse);
    }
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto mb-5">
        filters
        {roles.map((role) => {
          return (
            <FilterButton
              key={role}
              role={role}
              activeRole={currentRoleFilter}
              clickFilter={clickFilter}
            />
          );
        })}
      </div>
      <div className="outline outline-red-700 container mx-auto p-4 h-96">
        <p className="mx-5 mb-5">Teammate Pool</p>
        {isFetchingData ? (
          <p>loading</p>
        ) : (
          teammates.map((teammate) => {
            return (
              <button
                className="outline outline-purple-500 bg-purple-400 mx-5 px-4 mb-5 rounded-md hover:bg-purple-500"
                key={teammate.id}
                onClick={() => {
                  setEditingTeammateName(teammate.name);
                  setEditingTeammateStatus(teammate.status);
                  setEditingTeammateRole(teammate.role);
                  setCurrentButtonEditingId(teammate.id);
                }}
              >
                {currentButtonEditingId === teammate.id ? (
                  <>
                    <input
                      className="text-black block mb-1"
                      type="text"
                      value={editingTeammateName}
                      onChange={(e) => setEditingTeammateName(e.target.value)}
                    />
                    <input
                      className="text-black block mb-1"
                      type="text"
                      value={editingTeammateStatus}
                      onChange={(e) => {
                        setEditingTeammateStatus(e.target.value);
                      }}
                    />
                    <input
                      className="text-black block"
                      type="text"
                      value={editingTeammateRole}
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
          <button
            className="outline outline-blue-500 bg-blue-400 px-4 rounded-full hover:bg-blue-500"
            onClick={async () => {
              await updateTeammate({
                id: currentButtonEditingId,
                name: editingTeammateName,
                status: editingTeammateStatus,
                role: editingTeammateRole,
              });
              let teammates;
              if (currentRoleFilter === "All") {
                teammates = await getAllTeammates();
                if (isTeammateArray(teammates)) {
                  const sortedResponse = sortResponse(teammates);
                  setTeammates(sortedResponse);
                }
              } else {
                teammates = await getTeammatesByRole(currentRoleFilter);
                if (isTeammateArray(teammates)) {
                  const sortedResponse = sortResponse(teammates);
                  setTeammates(sortedResponse);
                }
              }
              setCurrentButtonEditingId("");
            }}
          >
            Save
          </button>
        )}
      </div>
      <div className="outline outline-red-700 container mx-auto p-4 h-96">
        <button
          className="block outline outline-blue-500 bg-blue-400 mx-5 mb-5 px-4 rounded-full hover:bg-blue-500"
          onClick={() => {
            if (currentTeammatePool.length !== 0) {
              const randomTeammate =
                generateRandomTeamMember(currentTeammatePool);
              setCurrentTeammatePool(
                currentTeammatePool.filter(
                  (teammate) => randomTeammate.id !== teammate.id
                )
              );
              setRandomTeammates([...randomTeammates, randomTeammate]);
            }
          }}
        >
          Pick Random Team Members
        </button>
        {randomTeammates.map((randomTeammate) => {
          return (
            <button
              className="outline outline-purple-500 bg-purple-400 rounded-md mx-5 mb-5 px-4"
              key={randomTeammate.id}
            >
              <div>{randomTeammate.name}</div>
              <div>{randomTeammate.status}</div>
              <div>{randomTeammate.role}</div>
            </button>
          );
        })}
        {randomTeammates.length > 0 && (
          <button
            className="outline outline-red-500 bg-red-400 px-4 rounded-full hover:bg-red-500"
            onClick={() => {
              setRandomTeammates([]);
              setCurrentTeammatePool(teammates);
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
