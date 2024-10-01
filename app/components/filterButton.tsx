import { useRef, useState } from "react";
import { getTeammatesByStatus } from "../lib/actions";
import Image from "next/image";

export default function FilterButton({
  role,
  clickFilter,
  activeRole,
  isStatus,
}: {
  role: string;
  clickFilter: (role: string, status?: string) => void;
  activeRole: string;
  isStatus?: boolean;
}) {
  let [isInput, setIsInput] = useState(false);
  let [editingStatus, setEditingStatus] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      {!isInput ? (
        <button
          key={role}
          className={
            "outline outline-purple-500 bg-purple-400 mx-5 px-4 rounded-full hover:bg-purple-500 hover:outline-purple-500" +
            (role === activeRole ? " outline-blue-500 bg-blue-400" : "")
          }
          onClick={() => {
            if (!isStatus) {
              clickFilter(role);
            } else {
              setIsInput(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }
          }}
        >
          {role}{" "}
          {isStatus && (
            <Image
              alt="pencil"
              src="/pencil-icon.svg"
              width={15}
              height={15}
              className="inline"
            />
          )}
        </button>
      ) : (
        <form
          className="inline"
          onSubmit={async (e) => {
            e.preventDefault();
            clickFilter(role, editingStatus);
            setIsInput(false);
          }}
        >
          <input
            className="text-black mb-1"
            type="text"
            value={editingStatus}
            onChange={(e) => setEditingStatus(e.target.value)}
            onBlur={() => setIsInput(false)}
            ref={inputRef}
          />
        </form>
      )}
    </>
  );
}
