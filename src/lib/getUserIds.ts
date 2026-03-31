import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"
import { fetchFromDataverse } from "./fetchFromDataverse";

export async function getUserIds(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })
        const email = token?.email
        console.log("email>>", email)
        if (!email) throw ('No User Found')
        const userdata = await fetchFromDataverse({
            table: `${process.env.USER_TABLE}`,
            query: `$filter=crc9f_user_name eq '${email.replace(/'/g, "''")}'&$select=crc9f_user_id, crc9f_rcs_userid`
        })
        const { crc9f_user_id, crc9f_rcs_userid } = userdata?.value[0]
        return { pkid: crc9f_user_id, guid: crc9f_rcs_userid };
    } catch (err) {
        return null
    }
}

