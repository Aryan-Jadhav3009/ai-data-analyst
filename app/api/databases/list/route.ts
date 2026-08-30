const BACKEND_URL = "http://54.243.210.131:8000";

export async function GET(request: Request) {
  const response = await fetch(
    `${BACKEND_URL}/api/databases/list/`,
    {
      method: "GET",
      headers: request.headers,
    }
  );

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}