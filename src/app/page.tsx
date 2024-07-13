import { uiRoutes } from "@/app/uiRoutes";
import { RedirectType, permanentRedirect } from "next/navigation";

export default function Page() {
  permanentRedirect(uiRoutes.private.home.href(), RedirectType.replace);
}
