"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { isTeammateArray, Teammate } from "./definitions";

export let sql: NeonQueryFunction<false, false>;
if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
} else {
  throw new Error("environment variable is not set");
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  role: z.enum(["Frontend", "Backend", "Product", "Design", "Devops"]),
});

const CreateTeammate = FormSchema.omit({ id: true });
const UpdateTeammate = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    name?: string[];
    status?: string[];
    role?: string[];
  };
  message?: string | null;
};

export async function createTeammate(prevState: State, formData: FormData) {
  try {
    const validatedFields = CreateTeammate.safeParse({
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

    const { name, status, role } = validatedFields.data;
    await sql`
    INSERT INTO teammates (user_id, name, status, role)
    VALUES (${name}, ${status}, ${role})
  `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Teammate",
    };
  }

  revalidatePath("/"); // make sure the invoices page has updated data (clears cach and re-fetches from the server)
  redirect("/");
}

export async function updateTeammate(teammate: Teammate) {
  try {
    const validatedFields = UpdateTeammate.safeParse({
      name: teammate.name,
      status: teammate.status,
      role: teammate.role,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Update Invoice.",
      };
    }

    const { name, status, role } = validatedFields.data;

    await sql`
    UPDATE teammates
    SET name = ${name}, status = ${status}, role = ${role}
    WHERE id = ${teammate.id}
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

export async function getAllTeammates() {
  const response = await sql`SELECT * FROM teammates`;
  if (isTeammateArray(response)) {
    return response as Teammate[];
  } else {
    return response;
  }
}

export async function getTeammatesByRole(role: string) {
  const response = await sql`SELECT * FROM teammates WHERE role = ${role}`;
  if (isTeammateArray(response)) {
    return response as Teammate[];
  } else {
    return response;
  }
}
