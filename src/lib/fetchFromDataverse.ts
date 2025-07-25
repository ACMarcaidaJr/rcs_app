// utils/fetchFromDataverse.ts
import { getDataverseAccessToken } from '@/lib/getDataverseToken';

interface FetchFromDataverseParams {
    table: string;
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: any;
    query?: string; // for $filter, $top etc.
}

export async function fetchFromDataverse({
    table,
    method = 'GET',
    body,
    query,
}: FetchFromDataverseParams) {
    const token = await getDataverseAccessToken();

    const url = new URL(`https://orgb2a75cb3.crm5.dynamics.com/api/data/v9.2/${table}`);
    if (query) {
        url.search = query;
    }

    const response = await fetch(url.toString(), {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'OData-Version': '4.0',
            'OData-MaxVersion': '4.0',
            'Prefer': 'return=representation'
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        const error = data.error || data;
        throw new Error(error.message || 'Failed to fetch from Dataverse');
    }

    return data;
}
