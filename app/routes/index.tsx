import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";

import { authenticator } from "~/auth.server";

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/notes",
  });
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo");
  return returnTo;
}

export default function Index() {
  const returnTo = useLoaderData() || "/notes";
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <Form action={`/auth/login?returnTo=${returnTo}`} method="post">
          <button>Log In with Discord</button>
        </Form>
      </div>
    </main>
  );
}
