const BACKEND_URL = "http://54.243.210.131:8000";

export async function POST(request: Request) {
  const body = await request.arrayBuffer();

  const response = await fetch(
    `${BACKEND_URL}/api/query/`,
    {
      method: "POST",
      headers: request.headers,
      body,
    }
  );

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}