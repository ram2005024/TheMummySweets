import { ErrorResponse, SuccessResponse } from "@/type/common.type";
import { APIError } from "./error_class";

interface Options {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  cache?: RequestCache;
  body?: unknown;
  revalidate?: number | false;
  tags?: string[];
}

const baseURL = process.env.BACKEND_URL!;

type Props = {
  apiString: string;
  options?: Options;
};

export async function serverAPI<T>({
  apiString,
  options = {},
}: Props): Promise<T | null> {
  const {
    method = "GET",
    revalidate,
    tags,
    body,
    cache,
    headers = {},
  } = options;

  const response = await fetch(`${baseURL}${apiString}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache: revalidate !== undefined ? undefined : cache,
    next: {
      ...(revalidate && { revalidate }),
      ...(tags && { tags }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 404) {
    return null;
  }

  const res_json: SuccessResponse<T> | ErrorResponse<null> =
    await response.json();

  if (!res_json.success) {
    throw new APIError(res_json.message, response.status, res_json.error_code);
  }

  return res_json.data;
}
