import { redirect } from "@remix-run/server-runtime";
import { paths } from "~/paths";

export const loader = async () => redirect(paths.dashboard());
