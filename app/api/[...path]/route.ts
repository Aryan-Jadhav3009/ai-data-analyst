const BACKEND_URL = "http://54.243.210.131:8000";

async function proxy(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  const url = `${BACKEND_URL}/api/${path.join("/")}/`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const response = await fetch(url, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export const GET = proxy;
export const POST = proxy;