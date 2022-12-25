declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      SESSION_SECRET: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      DISCORD_TOKEN: string;
      BASE_URL: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
