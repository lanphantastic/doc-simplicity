import { auth } from "@clerk/nextjs/server";

export class AuthService {
  async getUserId() {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return userId;
  }
}
