import { SECONDS } from "@/shared/constants/time";
import ky from "ky";
import PromiseQueue from "p-queue";

const queue = new PromiseQueue({
  interval: 1 * SECONDS,
  intervalCap: 20,
});

export const createEqdkpService = ({
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
    getUserById: async ({ eqdkpUserId }: { eqdkpUserId: number }) => {
      const { data } = await client
        .get("api.php", {
          searchParams: new URLSearchParams({
            function: "user",
            user_id: String(eqdkpUserId),
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

export type EqdkpService = ReturnType<typeof createEqdkpService>;
