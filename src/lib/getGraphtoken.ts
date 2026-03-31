export async function getGraphAccessToken() {
  const tenantId = process.env.AZURE_TENANT_ID!;
  const clientId = process.env.AZURE_CLIENT_ID!;
  const clientSecret = process.env.AZURE_CLIENT_SECRET!;

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("scope", "https://graph.microsoft.com/.default");
  params.append("grant_type", "client_credentials");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description);
  }

  return data.access_token;
}
