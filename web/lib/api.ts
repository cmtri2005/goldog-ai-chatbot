export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Prefer runtime-configured env on client
    const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (fromEnv && fromEnv.trim().length > 0) return fromEnv;
  }
  // Default to local backend dev port
  return "http://localhost:8080";
}

export async function postJson<TResponse>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<TResponse> {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
    ...init,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Request failed ${resp.status}: ${text || resp.statusText}`);
  }
  return (await resp.json()) as TResponse;
}




