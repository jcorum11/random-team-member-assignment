import { useActionState } from "react";
import { createTeammate, State } from "./lib/actions";

export default function Home() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createTeammate, initialState);
  return (
    <div>
      <h1>Random Team Member Selector</h1>

      <form action={formAction}></form>
      <input type="text" placeholder="Enter team member name" />
    </div>
  );
}
