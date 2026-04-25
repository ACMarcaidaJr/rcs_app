import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import { fetchFromDataverse } from "@/lib/fetchFromDataverse";
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

const fetchModules = async (user_name: string) => {
  const data = await fetchFromDataverse({
    table: `${process.env.USER_TABLE}`,
    query:
      `$filter=crc9f_user_name eq '${user_name.replace(/'/g, "''")}'` +
      `&$select=crc9f_rcs_userid` +
      `&$expand=crc9f_rcs_user_role_user_id($select=crc9f_rcs_user_roleid;$filter=crc9f_is_active eq 1;` +
      `$expand=crc9f_role_id($select=crc9f_rcs_roleid, crc9f_role_name;$filter=crc9f_is_active eq '1';` +
      `$expand=crc9f_rcs_module_role_role_id_crc9f_rcs_role($select=crc9f_rcs_module_roleid;$filter=crc9f_is_active eq 1;` +
      `$expand=crc9f_module_id($select=crc9f_title,crc9f_description,crc9f_href,crc9f_icon,crc9f_module_id,crc9f_rcs_moduleid,crc9f_is_active,crc9f_is_sidelink,crc9f_order_number,crc9f_is_header,_crc9f_header_value;$filter=crc9f_is_active eq 1;$expand=crc9f_header)` +
      `)` +
      `)` +
      `)`
  });

  const userguid = data.value[0]?.crc9f_rcs_userid;

  // 1. Collect unique modules + headers
  const moduleMap = new Map();

  data.value?.forEach((user: any) => {
    user.crc9f_rcs_user_role_user_id?.forEach((userRole: any) => {
      userRole.crc9f_role_id?.crc9f_rcs_module_role_role_id_crc9f_rcs_role?.forEach((modRole: any) => {
        const mod = modRole.crc9f_module_id;
        if (!mod) return;

        // add module
        if (!moduleMap.has(mod.crc9f_rcs_moduleid)) {
          moduleMap.set(mod.crc9f_rcs_moduleid, mod);
        }

        // add header if exists
        if (mod.crc9f_header && !moduleMap.has(mod.crc9f_header.crc9f_rcs_moduleid)) {
          moduleMap.set(mod.crc9f_header.crc9f_rcs_moduleid, mod.crc9f_header);
        }
      });
    });
  });

  // 2. Normalize fields
  const flatModules = stripPrefixFromKeys(Array.from(moduleMap.values()))
    .map((m: any) => ({
      ...m,
      is_header: Number(m.is_header),
      header_value: m.header_value || m.header?.rcs_moduleid || null
    }));

  // 3. Identify headers
  const headers = flatModules.filter((m: any) => m.is_header === 1);
  const headerIds = new Set(headers.map((h: any) => h.rcs_moduleid));

  // 4. Build grouped (with children)
  const structuredHeaders = headers.map((header: any) => {
    const subLinks = flatModules
      .filter((m: any) => m.header_value === header.rcs_moduleid)
      .sort((a, b) => (a.order_number || 0) - (b.order_number || 0))
      .map((child: any) => ({
        title: child.title,
        href: child.href,
        icon: child.icon,
        label: child.label || '',
        is_sidelink: child.is_sidelink
      }));

    return {
      title: header.title,
      href: header.href || '#',
      icon: header.icon,
      label: header.label || '',
      is_sidelink: header.is_sidelink,
      order_number: header.order_number,
      sub: subLinks.length > 0 ? subLinks : undefined
    };
  });

  // 5. Standalone links
  const standaloneLinks = flatModules
    .filter((m: any) => {
      return (
        m.is_header !== 1 &&
        (!m.header_value || !headerIds.has(m.header_value))
      );
    })
    .map((m: any) => ({
      title: m.title,
      href: m.href,
      icon: m.icon,
      label: m.label || '',
      is_sidelink: m.is_sidelink,
      order_number: m.order_number
    }));

  // 6. Merge + sort
  const finalModules = [...structuredHeaders, ...standaloneLinks].sort(
    (a, b) => (a.order_number || 0) - (b.order_number || 0)
  );

  // roles
  const roles = data.value[0]?.crc9f_rcs_user_role_user_id.map((ur: any) => ({
    roleName: ur.crc9f_role_id.crc9f_role_name,
    roleGuid: ur.crc9f_role_id.crc9f_rcs_roleid
  }));

  // office
  const userOfficedData = await fetchFromDataverse({
    table: `${process.env.USER_OFFICE_TABLE}`,
    query: `$filter=crc9f_user_id/crc9f_rcs_userid eq ${userguid} and crc9f_is_active eq 1`
  });

  console.log("finalModulesfinalModules", JSON.stringify(finalModules))
  return {
    userguid,
    roles,
    userOffice: userOfficedData?.value[0]?._crc9f_office_id_value ?? null,
    modules: finalModules
  };
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
          token.flattedLinks = modules
            .flatMap((m: any) => [
              m,
              ...(m.sub || [])
            ])
            .filter((m: any) =>
              m.is_sidelink === 1 &&
              m.href &&
              m.href !== "#"
            )
            .map((m: any) => ({
              href: m.href
            }));
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
      session.flattedLinks = token.flattedLinks
      session.userGuid = token.userGuid
      session.userOffice = token.userOffice
      session.roles = token.roles;

      return session
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }