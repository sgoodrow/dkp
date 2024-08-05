import { userController } from "@/api/controllers/userController";
import { ENV } from "@/api/env";

export const getDevUser = async () => {
  const email = ENV.DEV_USER_EMAIL;
  if (!email) {
    throw new Error("Cannot seed the database. Set DEV_USER_EMAIL.");
  }

  const user = await userController().getByEmail({ email });
  if (!user?.id) {
    throw new Error(
      `Cannot seed the database. There is no user in the database with the email ${email}. Did you forget to log in?`,
    );
  }

  return user;
};
