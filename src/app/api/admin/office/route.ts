import { NextRequest, NextResponse } from 'next/server';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { handleApiError } from '@/lib/api-error';

export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();
        const { parent_id, ...fields } = req_body;
        const office_data = await fetchFromDataverse({
            table: `${process.env.OFFICE_TABLE}`,
            method: 'POST',
            body: {
                ...prefixKeysWithCrc9f({ ...fields, is_active: 1 }),
                "crc9f_parent_id@odata.bind": `/${process.env.OFFICE_TABLE}(${parent_id})`
            }
        })
        const response = NextResponse.json({
            success: true,
            data: office_data,
            message_title: 'Add account office',
            message: 'Successfully updated account\'s info',
        });
        return response
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}

const transformToGraph = (data: any[]) => {
  const nodes: { id: string; text: string }[] = []
  const lines: { from: string; to: string }[] = []

  data.forEach((item) => {
    const id = item.rcs_officeid
    const text = item.name_of_office

    // ✅ add node
    nodes.push({ id, text })

    // ✅ add line if has parent
    if (item._crc9f_parent_id_value) {
      lines.push({
        from: item._crc9f_parent_id_value, // parent
        to: id // child
      })
    }
  })

  // ✅ find root (no parent)
  const root = data.find(item => !item._crc9f_parent_id_value)

  return {
    rootId: root?.rcs_officeid || null,
    nodes,
    lines
  }
}

export async function GET(req: NextRequest) {
    try {
        const office_data = await fetchFromDataverse({
            table: `${process.env.OFFICE_TABLE}`,
            query: `$select=crc9f_rcs_officeid,crc9f_name_of_office,_crc9f_parent_id_value`
        })
        const response = NextResponse.json({
            success: true,
            data: transformToGraph(stripPrefixFromKeys(office_data.value)),
            message_title: 'Success',
            message: 'Successfully fetch the offces',
        });
        return response;
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}