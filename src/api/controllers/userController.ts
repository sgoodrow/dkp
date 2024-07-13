import { apiKeyController } from "@/api/controllers/apiKeyController";
import { userRepository } from "@/api/repositories/userRepository";

export const userController = {
  getStatus: async ({ userId }: { userId: string }) => {
    return {
      numApiKeys: await apiKeyController.count({ userId }),
    };
  },

  getByEmail: async ({ email }: { email: string }) => {
    return userRepository.getByEmail({ email });
  },
};
