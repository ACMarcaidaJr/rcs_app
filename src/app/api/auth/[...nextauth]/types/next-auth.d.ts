import { DefaultSession } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    moduleLinks?: any[]
    user?: DefaultSession["user"]
    oid: string;
    userGuid: string;
    userOffice: string;
    roles: any[];
    flattedLinks?: any[]

  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string
    moduleLinks?: any[]
    flattedLinks?: any[]
    oid: string;
    userGuid: string;
    userOffice: string;
    roles: any[];
  }
}