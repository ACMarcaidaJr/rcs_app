// lib/getDataverseToken.ts
import qs from 'querystring';

export async function getDataverseAccessToken() {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const body = qs.stringify({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: process.env.NEXT_PUBLIC_SCOPES,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const tokenData = await response.json();

  if (!response.ok) {
    throw new Error(tokenData.error_description || 'Failed to get token');
  }

  return tokenData.access_token;
}
