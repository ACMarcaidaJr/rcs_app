import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import { fetchFromDataverse } from "@/lib/fetchFromDataverse";
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

const fetchModules = async (user_name: string) => {
  const data = await fetchFromDataverse({
    table: `${process.env.USER_TABLE}`,
    query: `$filter=crc9f_user_name eq '${user_name.replace(/'/g, "''")}'` +
      `&$select=crc9f_rcs_userid` +
      `&$expand=crc9f_rcs_user_role_user_id($select=crc9f_rcs_user_roleid;$filter=crc9f_is_active eq 1;` +
      `$expand=crc9f_role_id($select=crc9f_rcs_roleid, crc9f_role_name;$filter=crc9f_is_active eq '1';` +
      `$expand=crc9f_rcs_module_role_role_id_crc9f_rcs_role($select=crc9f_rcs_module_roleid;$filter=crc9f_is_active eq 1;` +
      `$expand=crc9f_module_id($select=crc9f_title,crc9f_description, crc9f_href, crc9f_icon, crc9f_module_id, crc9f_is_active, crc9f_is_sidelink, crc9f_order_number;$filter=crc9f_is_active eq 1;)` + // should add is_active condition
      `)` +
      `)` +
      `)`
  });
  const roles = data?.value?.flatMap((user: any) =>
    user.crc9f_rcs_user_role_user_id.flatMap((userRole: any) => {
      return {
        roleName: userRole.crc9f_role_id.crc9f_role_name,
        roleGuid: userRole.crc9f_role_id.crc9f_rcs_roleid
      }
    }
    ))
  const userguid = data.value[0]?.crc9f_rcs_userid
  const userOfficedData = await fetchFromDataverse({
    table: `${process.env.USER_OFFICE_TABLE}`,
    query: `$filter=crc9f_user_id/crc9f_rcs_userid eq ${userguid} and crc9f_is_active eq 1&$select=_crc9f_office_id_value`
  })
  const userOffice = userOfficedData?.value[0]?._crc9f_office_id_value ?? null
  const seen = new Set();
  const modules = data.value.flatMap((user: any) =>
    user.crc9f_rcs_user_role_user_id.flatMap((userRole: any) =>
      userRole.crc9f_role_id.crc9f_rcs_module_role_role_id_crc9f_rcs_role
        .map((moduleRole: any) => moduleRole.crc9f_module_id)
        .filter((module: any) => {
          if (seen.has(module.crc9f_module_id)) return false;
          seen.add(module.crc9f_module_id);
          return true;
        })
    )
  ).sort((a: any, b: any) => (a.crc9f_order_number || 0) - (b.crc9f_order_number || 0));
  return { userguid, roles, userOffice, modules: stripPrefixFromKeys(modules) };
};

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_CLIENT_SECRET!,
      tenantId: process.env.NEXT_PUBLIC_TENANT_ID!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },

  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        if (user?.email) {
          const { modules, userguid, userOffice, roles } = await fetchModules(user.email)
          token.moduleLinks = modules;
          token.userGuid = userguid;
          token.userOffice = userOffice;
          token.roles = roles;
        }
      }
      return token
    },


    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.moduleLinks = token.moduleLinks
      session.userGuid = token.userGuid
      session.userOffice = token.userOffice
      session.roles = token.roles;

      return session
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }