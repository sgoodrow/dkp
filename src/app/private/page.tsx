import { uiRoutes } from "@/app/uiRoutes";
import { RedirectType, permanentRedirect } from "next/navigation";

export default function Page() {
  permanentRedirect(uiRoutes.home.href(), RedirectType.replace);
}
