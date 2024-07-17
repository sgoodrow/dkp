import { userController } from "@/api/controllers/userController";
import { ENV } from "@/api/env";

const email = ENV.DEV_USER_EMAIL;
if (!email) {
  throw new Error("Cannot seed the database. Set DEV_USER_EMAIL.");
}

export const testDataDataMigration = async () => {
  console.log(`Running test data data migration on ${ENV.POSTGRES_DATABASE}`);
  const user = await userController.getByEmail({ email });
  if (!user?.id) {
    throw new Error(
      `Cannot seed the database. There is no user in the database with the email ${email}. Did you forget to log in?`,
    );
  }

  const userId = user.id;

  // add characters, raids, etc.
};
