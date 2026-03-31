// utils/dataverseBatch.ts
import { getDataverseAccessToken } from "@/lib/getDataverseToken";

const BASE_URL = "https://orgb2a75cb3.crm5.dynamics.com/api/data/v9.2";

export type BatchOperation = {
    method: "POST" | "PATCH" | "DELETE";
    table: string;
    id?: string;
    body?: any;
    contentId?: string | number
};

export async function executeBatch(operations: BatchOperation[]): Promise<string> {
    if (!operations.length) return ""; // <-- always return string

    const token = await getDataverseAccessToken();

    const batchId = `batch_${Date.now()}`;
    const changeSetId = `changeset_${Date.now()}`;

    let body = "";

    // 🔹 Start batch
    body += `--${batchId}\r\n`;
    body += `Content-Type: multipart/mixed;boundary=${changeSetId}\r\n\r\n`;

    // Inside executeBatch or executeBatchMulti
    operations.forEach((op, index) => {
        body += `--${changeSetId}\r\n`;
        body += `Content-Type: application/http\r\n`;
        body += `Content-Transfer-Encoding: binary\r\n`;
        body += `Content-ID: ${op.contentId ?? index + 1}\r\n\r\n`;

        let url = `${BASE_URL}/${op.table}`;
        if (op.id) url += `(${op.id})`;

        body += `${op.method} ${url} HTTP/1.1\r\n`;
        body += `Accept: application/json\r\n`;
        // If it's a DELETE, we end the HTTP request part here with double CRLF
        if (op.method === "DELETE") {
            body += `\r\n`;
        } else {
            body += `Content-Type: application/json\r\n\r\n`;
            body += `${JSON.stringify(op.body || {})}\r\n`;
        }
    });

    // 🔹 Close changeset & batch
    body += `--${changeSetId}--\r\n`;
    body += `--${batchId}--`;

    const response = await fetch(`${BASE_URL}/$batch`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `multipart/mixed;boundary=${batchId}`,
            Accept: "application/json",
            "OData-Version": "4.0",
            "OData-MaxVersion": "4.0",
            Prefer: "return=minimal", // ⚡ faster
        },
        body,
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Batch request failed");
    }

    return text; // always string
}

/**
 * Split array into chunks
 */
function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

/**
 * Safe batch execution with chunking
 */
export async function executeBatchSafe(
    operations: BatchOperation[],
    chunkSize = 100
): Promise<string[]> {
    if (!operations.length) return [];

    const chunks = chunkArray(operations, chunkSize);
    const results: string[] = [];

    for (const chunk of chunks) {
        const res = await executeBatch(chunk); // always string
        results.push(res);
    }

    return results;
}

export async function executeBatchMulti(
    groupedOps: BatchOperation[][]
): Promise<string> {
    if (!groupedOps.length) return "";

    const token = await getDataverseAccessToken();

    const batchId = `batch_${Date.now()}`;
    let body = "";

    for (const groupOps of groupedOps) {
        const changeSetId = `changeset_${Date.now()}_${Math.random()}`;

        // 🔹 Start changeset
        body += `--${batchId}\r\n`;
        body += `Content-Type: multipart/mixed;boundary=${changeSetId}\r\n\r\n`;

        groupOps.forEach((op, index) => {
            body += `--${changeSetId}\r\n`;
            body += `Content-Type: application/http\r\n`;
            body += `Content-Transfer-Encoding: binary\r\n`;

            // ✅ Respect contentId OR fallback
            const contentId = op.contentId ?? index + 1;
            body += `Content-ID: ${contentId}\r\n\r\n`;

            let url = `${BASE_URL}/${op.table}`;
            if (op.id) url += `(${op.id})`;

            body += `${op.method} ${url} HTTP/1.1\r\n`;
            body += `Accept: application/json\r\n`;
            body += `OData-Version: 4.0\r\n`;
            body += `OData-MaxVersion: 4.0\r\n`;

            if (op.method !== "DELETE") {
                body += `Content-Type: application/json\r\n\r\n`;
                body += `${JSON.stringify(op.body || {})}\r\n`;
            } else {
                body += `\r\n`;
            }
        });

        // 🔹 End changeset
        body += `--${changeSetId}--\r\n`;
    }

    // 🔹 End batch
    body += `--${batchId}--`;

    const response = await fetch(`${BASE_URL}/$batch`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `multipart/mixed;boundary=${batchId}`,
            Accept: "application/json",
            "OData-Version": "4.0",
            "OData-MaxVersion": "4.0",
            Prefer: "return=minimal",
        },
        body,
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Batch request failed");
    }

    return text;
}