import { redirect } from "next/navigation";

export default function LegacyJobDetailsRedirect() {
  redirect("/opportunities");
}
