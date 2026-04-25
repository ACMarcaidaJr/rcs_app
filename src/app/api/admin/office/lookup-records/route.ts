import { NextRequest, NextResponse } from 'next/server';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
    try {
        const nextLink = req.nextUrl.searchParams.get('nextLink');
        let query;
        if (nextLink) {
            query = nextLink.substring(nextLink.indexOf('?'));
        } else {
            query = `$filter=crc9f_is_active eq 1` +
                `&$expand=crc9f_rcs_record_series_item_office_id_crc9f_rcs_office` +
                `($expand=crc9f_record_series_id($select=crc9f_record_series_title, crc9f_rcs_record_series_titleid,_crc9f_office_id_value,crc9f_record_series_title_id))`
        }

        const data = await fetchFromDataverse({
            table: `${process.env.OFFICE_TABLE}`,
            maxsize: 10,
            query: query
        });

        const rawOffices = stripPrefixFromKeys(data.value);

        const transformedData = rawOffices.map((office: any) => {
            const rawItems = office.rcs_record_series_item_office_id_crc9f_rcs_office || [];

            const groupedRecords: any[] = [];
            const seriesMap = new Map();

            rawItems.forEach((item: any) => {
                const seriesInfo = item.record_series_id;

                if (seriesInfo && seriesInfo.rcs_record_series_titleid) {
                    const seriesId = seriesInfo.rcs_record_series_titleid;

                    if (!seriesMap.has(seriesId)) {
                        const newGroup = {
                            record_series_title: seriesInfo.record_series_title,
                            record_series_id: seriesId,
                            is_group: true,
                            subseries: []
                        };
                        seriesMap.set(seriesId, newGroup);
                        groupedRecords.push(newGroup);
                    }

                    seriesMap.get(seriesId).subseries.push(item);
                } else {
                    groupedRecords.push({
                        ...item,
                        is_group: false
                    });
                }
            });

            return {
                ...office,
                records: groupedRecords,
                rcs_record_series_item_office_id_crc9f_rcs_office: undefined
            };
        });

        return NextResponse.json({
            success: true,
            data: transformedData,
            total: data['@odata.count'] ?? null,
            nextLink: data['@odata.nextLink'] ?? null,
            hasNextPage: !!data['@odata.nextLink'],
            message_title: 'Success',
            message: 'Successfully fetching records series',
        });
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}
