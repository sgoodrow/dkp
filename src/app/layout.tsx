import { ClientProviders } from "@/ui/shared/contexts/ClientProviders";
import { font } from "@/ui/theme/font";
import { Box } from "@mui/material";
import { auth } from "@/auth";
import { pathname } from "next-extra/pathname";
import { RedirectType, redirect } from "next/navigation";
import { uiRoutes } from "@/app/uiRoutes";
import { app } from "@/shared/constants/app";
import { installController } from "@/api/controllers/installController";

export const metadata = {
  title: app.name,
  applicationName: app.name,
  description: app.description,
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  // The Prisma Adapter for NextAuth cannot be used in the Edge Runtime (yet), so we cannot
  // use middleware.ts (which runs on the Edge Runtime) to manage these redirects.
  // See: https://github.com/prisma/prisma/issues/21310 and
  //      https://github.com/prisma/prisma/issues/24430

  // The hierarchy of redirects is Login > Install > Home
  const isLoggedIn = await auth();

  const path = pathname();
  const loginHref = uiRoutes.login.href();
  const setupHref = uiRoutes.setup.href();
  const migrateHref = uiRoutes.migrate.href();
  const homeHref = uiRoutes.home.href();

  const status = await installController().getStatus();

  if (!isLoggedIn) {
    if (path !== loginHref) {
      redirect(loginHref, RedirectType.replace);
    }
  } else if (status === null || status === "FAIL") {
    if (path !== setupHref) {
      redirect(setupHref, RedirectType.replace);
    }
  } else if (status === "READY_FOR_IMPORT") {
    if (path !== migrateHref) {
      redirect(migrateHref, RedirectType.replace);
    }
  } else {
    if (path === loginHref || path === setupHref || path === migrateHref) {
      redirect(homeHref, RedirectType.replace);
    }
  }

  return (
    // MUI is working on better support for the scrollbarGutter css property (currently conflicts with Backdrop)
    // and currently suggests this which avoids content layout shift.
    // See: https://github.com/mui/base-ui/issues/79#issuecomment-1966720424
    <html lang="en" className={font.className} style={{ overflowY: "scroll" }}>
      <body>
        <ClientProviders>
          <Box
            component="main"
            height="100vh"
            display="flex"
            flexDirection="column"
          >
            {children}
          </Box>
        </ClientProviders>
      </body>
    </html>
  );
}
