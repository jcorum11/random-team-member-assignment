"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { isTeammateArray, Teammate } from "./definitions";

let sql: NeonQueryFunction<false, false>;
if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
} else {
  throw new Error("environment variable is not set");
}

const FormSchema = z.object({
  id: z.string(),
  userId: z.string(),
  teammateId: z.string({
    invalid_type_error: "Please select a Teammate",
  }),
  name: z.string(),
  status: z.enum(["active", "inactive"]),
  role: z.enum(["Frontend", "Backend", "Product", "Design", "Devops"]),
  date: z.string(),
});

const CreateTeammate = FormSchema.omit({ id: true, userId: true, date: true });
const UpdateTeammate = FormSchema.omit({ id: true, userId: true, date: true });

export type State = {
  errors?: {
    teammateId?: string[];
    name?: string[];
    status?: string[];
    role?: string[];
  };
  message?: string | null;
};

export async function createTeammate(prevState: State, formData: FormData) {
  try {
    const validatedFields = CreateTeammate.safeParse({
      teammateId: formData.get("teammateId"),
      name: formData.get("name"),
      status: formData.get("status"),
      role: formData.get("role"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Create Teammate.",
      };
    }

    const { teammateId, name, status, role } = validatedFields.data;
    const date = new Date().toISOString().split("T")[0];
    await sql`
    INSERT INTO teammates (user_id, name, status, role)
    VALUES (${teammateId}, ${name}, ${status}, ${role}, ${date})
  `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Teammate",
    };
  }

  revalidatePath("/"); // make sure the invoices page has updated data (clears cach and re-fetches from the server)
  redirect("/");
}

export async function updateTeammate(
  id: string,
  prevState: State,
  formData: FormData
) {
  try {
    const validatedFields = UpdateTeammate.safeParse({
      teammateId: formData.get("teammateId"),
      name: formData.get("name"),
      status: formData.get("status"),
      role: formData.get("role"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Update Invoice.",
      };
    }

    const { teammateId, name, status, role } = validatedFields.data;

    await sql`
    UPDATE teammates
    SET teammate_id = ${teammateId}, name = ${name}, status = ${status}, role = ${role}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Teammate",
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM teammates WHERE id = ${id}`;
    revalidatePath("/");
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Teammate",
    };
  }
}

export async function getData() {
  const response = await sql`SELECT * FROM teammates`;
  if (isTeammateArray(response)) {
    return response as Teammate[];
  } else {
    return response;
  }
}
