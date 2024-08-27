"use client";

import { useEffect, useState } from "react";
import {
  getAllTeammates,
  getTeammatesByRole,
  updateTeammate,
} from "./lib/actions";
import { isTeammateArray, roles, Teammate } from "./lib/definitions";
import { generateRandomTeamMember, sortResponse } from "./lib/utils";

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

  return (
    <div>
      <h1 className="container mx-auto text-center">
        Random Team Member Selector
      </h1>
      <div>
        filters
        {roles.map((role) => {
          return (
            <button
              key={role}
              className="outline outline-purple-500 bg-purple-400 mx-5 px-4"
              onClick={async () => {
                setRandomTeammates([]);
                let teammates;
                setCurrentRoleFilter(role);
                if (role === "All") {
                  teammates = await getAllTeammates();
                  if (isTeammateArray(teammates)) {
                    const sortedResponse = sortResponse(teammates);
                    setTeammates(sortedResponse);
                  }
                } else {
                  teammates = await getTeammatesByRole(role);
                  if (isTeammateArray(teammates)) {
                    const sortedResponse = sortResponse(teammates);
                    setTeammates(sortedResponse);
                  }
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
          className="outline outline-red-500 bg-red-400 mx-5 px-4"
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
          <button
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
