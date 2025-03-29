import { redirect } from "next/navigation";

export default function TodoPage() {
  redirect("/dashboard/workspace/1"); // Redirect to the first workspace by default
}
