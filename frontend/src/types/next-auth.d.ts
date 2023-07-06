import { Roles } from "@/utils/constants";
import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      access_token: string;
      refresh_token: string;
      role: Roles;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    access_token: string;
    refresh_token: string;
    firstname: string;
    lastname: string;
    email: string;
    role: Roles;
    authorities: Authority[];
    username: string;
  }

  interface Authority {
    authority: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: integer;
    access_token: string;
    refresh_token: string;
    role: Roles;
    email: string;
    name: string;
  }
}
