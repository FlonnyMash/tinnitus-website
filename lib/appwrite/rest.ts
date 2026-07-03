import {
  getAppwriteApiKey,
  getAppwriteEndpoint,
  getAppwriteProjectId,
} from "./config";

export class AppwriteRestError extends Error {
  code: number;
  type: string;

  constructor(message: string, code: number, type: string) {
    super(message);
    this.name = "AppwriteRestError";
    this.code = code;
    this.type = type;
  }
}

type AppwriteDocument = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  [key: string]: unknown;
};

type DocumentList = {
  total: number;
  documents: AppwriteDocument[];
};

type AppwriteSession = {
  $id: string;
  userId: string;
  secret: string;
  expire: string;
};

type AppwriteUser = {
  $id: string;
  email: string;
  labels?: string[];
};

function adminHeaders(extra?: Record<string, string>) {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Project": getAppwriteProjectId(),
    "X-Appwrite-Key": getAppwriteApiKey(),
    ...extra,
  };
}

function sessionHeaders(sessionSecret: string, extra?: Record<string, string>) {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Project": getAppwriteProjectId(),
    "X-Appwrite-Session": sessionSecret,
    ...extra,
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as {
    message?: string;
    code?: number;
    type?: string;
  };

  if (!response.ok) {
    throw new AppwriteRestError(
      body.message ?? `Appwrite request failed (${response.status})`,
      body.code ?? response.status,
      body.type ?? "unknown",
    );
  }

  return body as T;
}

function buildUrl(path: string, queries?: string[]) {
  const url = new URL(`${getAppwriteEndpoint()}${path}`);
  queries?.forEach((query, index) => {
    url.searchParams.set(`queries[${index}]`, query);
  });
  return url.toString();
}

export const AppwriteQuery = {
  orderDesc(attribute: string) {
    return JSON.stringify({ method: "orderDesc", attribute });
  },
  equal(attribute: string, value: string) {
    return JSON.stringify({ method: "equal", attribute, values: [value] });
  },
  limit(count: number) {
    return JSON.stringify({ method: "limit", values: [count] });
  },
};

export async function listDocuments(params: {
  databaseId: string;
  collectionId: string;
  queries?: string[];
}): Promise<DocumentList> {
  const response = await fetch(
    buildUrl(
      `/databases/${params.databaseId}/collections/${params.collectionId}/documents`,
      params.queries,
    ),
    { headers: adminHeaders() },
  );
  return parseResponse<DocumentList>(response);
}

export async function createDocument(params: {
  databaseId: string;
  collectionId: string;
  documentId: string;
  data: Record<string, unknown>;
}): Promise<AppwriteDocument> {
  const response = await fetch(
    `${getAppwriteEndpoint()}/databases/${params.databaseId}/collections/${params.collectionId}/documents`,
    {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({
        documentId: params.documentId,
        data: params.data,
      }),
    },
  );
  return parseResponse<AppwriteDocument>(response);
}

export async function updateDocument(params: {
  databaseId: string;
  collectionId: string;
  documentId: string;
  data: Record<string, unknown>;
}): Promise<AppwriteDocument> {
  const response = await fetch(
    `${getAppwriteEndpoint()}/databases/${params.databaseId}/collections/${params.collectionId}/documents/${params.documentId}`,
    {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ data: params.data }),
    },
  );
  return parseResponse<AppwriteDocument>(response);
}

export async function deleteDocument(params: {
  databaseId: string;
  collectionId: string;
  documentId: string;
}): Promise<void> {
  const response = await fetch(
    `${getAppwriteEndpoint()}/databases/${params.databaseId}/collections/${params.collectionId}/documents/${params.documentId}`,
    {
      method: "DELETE",
      headers: adminHeaders(),
    },
  );
  await parseResponse(response);
}

export async function createEmailPasswordSession(params: {
  email: string;
  password: string;
}): Promise<AppwriteSession> {
  const response = await fetch(`${getAppwriteEndpoint()}/account/sessions/email`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(params),
  });
  return parseResponse<AppwriteSession>(response);
}

export async function getUser(userId: string): Promise<AppwriteUser> {
  const response = await fetch(`${getAppwriteEndpoint()}/users/${userId}`, {
    headers: adminHeaders(),
  });
  return parseResponse<AppwriteUser>(response);
}

export async function getAccount(sessionSecret: string): Promise<AppwriteUser> {
  const response = await fetch(`${getAppwriteEndpoint()}/account`, {
    headers: sessionHeaders(sessionSecret),
  });
  return parseResponse<AppwriteUser>(response);
}

export async function deleteCurrentSession(sessionSecret: string): Promise<void> {
  const response = await fetch(`${getAppwriteEndpoint()}/account/sessions/current`, {
    method: "DELETE",
    headers: sessionHeaders(sessionSecret),
  });
  await parseResponse(response);
}

export async function createStorageFile(params: {
  bucketId: string;
  fileId: string;
  file: File;
}): Promise<{ $id: string }> {
  const formData = new FormData();
  formData.append("fileId", params.fileId);
  formData.append("file", params.file, params.file.name);

  const response = await fetch(
    `${getAppwriteEndpoint()}/storage/buckets/${params.bucketId}/files`,
    {
      method: "POST",
      headers: {
        "X-Appwrite-Project": getAppwriteProjectId(),
        "X-Appwrite-Key": getAppwriteApiKey(),
      },
      body: formData,
    },
  );

  return parseResponse<{ $id: string }>(response);
}

export type { AppwriteDocument, AppwriteSession, AppwriteUser };
