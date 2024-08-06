import { SECONDS } from "@/shared/constants/time";
import ky from "ky";
import PromiseQueue from "p-queue";
import { DEVENV } from "prisma/dataMigrations/testdata/devenv";

const queue = new PromiseQueue({
  interval: 1 * SECONDS,
  intervalCap: 10,
});

if (DEVENV.DEV_EQ_DKP_PLUS_BASE_URL === undefined) {
  throw new Error("Cannot use eqdkpService without a base URL.");
}
if (DEVENV.DEV_EQ_DKP_PLUS_DB_URL === undefined) {
  throw new Error("Cannot use eqdkpService without a DB URL.");
}
if (DEVENV.DEV_EQ_DKP_PLUS_API_KEY === undefined) {
  throw new Error("Cannot use eqdkpService without an API key.");
}

const createEqdkpService = ({
  baseUrl,
  apiKey: atoken,
}: {
  baseUrl: string;
  apiKey: string;
}) => {
  const client = ky.extend({
    prefixUrl: baseUrl,
    hooks: {
      beforeRequest: [(request) => queue.add(async () => ky(request))],
    },
  });

  return {
    getUserById: async ({ userId }: { userId: number }) => {
      const { data } = await client
        .get("api.php", {
          searchParams: new URLSearchParams({
            function: "user",
            user_id: String(userId),
            atoken,
            atype: "api",
            format: "json",
          }),
        })
        .json<{
          data: {
            user_id: string;
            username: string;
            email: string;
            user_lastvisit: string;
          };
        }>();
      return data;
    },
  };
};

export const eqdkpService = createEqdkpService({
  baseUrl: DEVENV.DEV_EQ_DKP_PLUS_BASE_URL,
  apiKey: DEVENV.DEV_EQ_DKP_PLUS_API_KEY,
});
