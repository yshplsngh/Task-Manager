export const API_URL =
  import.meta.env.VITE_ENV === 'development'
    ? 'http://localhost:4000'
    : 'https://taskserver.yshplsngh.in';

export const WEB_URL =
  import.meta.env.VITE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://task.yshplsngh.in';

export const API_NAME =
  import.meta.env.VITE_ENV === 'development'
    ? 'localhost:4000'
    : 'taskserver.yshplsngh.in';

export const WEB_NAME =
  import.meta.env.VITE_ENV === 'development'
    ? 'localhost:3000'
    : 'task.yshplsngh.in';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export type RequestData = Record<string, unknown>;

// if response type not provided set default unknown
export interface ProcessedResponse<T = unknown> {
  json: T;
  code: number;
  ok: boolean;
  message?: string;
}

export class FetchResponseError extends Error {
  json: unknown;
  code: string;
  additionalInfo: unknown;

  constructor(message: string, details: ProcessedResponse) {
    super(message);
    const { json, code, ...rest } = details;
    this.json = json;
    this.code = String(code);
    this.additionalInfo = rest;
  }
}

async function fetchData<T = unknown>({
  url,
  data,
  method,
}: {
  url: string;
  data?: RequestData;
  method: HttpMethod;
}): Promise<ProcessedResponse<T>> {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
  };

//   only add data if it is put or post request
  if ((method==='put' || method==='post') && data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  const json = await response.json().catch(() => ({}));

  const processedResponse: ProcessedResponse<T> = {
    json: json as T,
    code: response.status,
    ok: response.ok,
    message: response.ok ? undefined : json.message || response.statusText,
  };

  if (!response.ok) {
    throw new FetchResponseError(
      `${processedResponse.message}`,
      processedResponse,
    );
  }

  return processedResponse;
}

function createApiMethod<T = unknown>(method: HttpMethod) {
  return (url: string, data?: RequestData) => {
    return fetchData<T>({
      url: `${API_URL}${url}`,
      data,
      method,
    });
  };
}

export const api = {
  get: <T = unknown>(url: string, data?: RequestData) =>
    createApiMethod<T>('get')(url, data),
  post: <T = unknown>(url: string, data?: RequestData) =>
    createApiMethod<T>('post')(url, data),
  put: <T = unknown>(url: string, data?: RequestData) =>
    createApiMethod<T>('put')(url, data),
  delete: <T = unknown>(url: string, data?: RequestData) =>
    createApiMethod<T>('delete')(url, data),
};