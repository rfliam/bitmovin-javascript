export interface BitmovinConfiguration {
  apiKey: string;
  tenantOrgId?: string;
  debug?: boolean;
  protocol?: string;
  host?: string;
  apiBaseUrl?: string;
  basePath?: string;
  requestTimeout?: number;
  xApiClient?: string;
  additionalHeaders?: object;
  httpHeaders?: object;
}

export interface InternalConfiguration {
  apiKey: string;
  tenantOrgId?: string;
  debug?: boolean;
  protocol: string;
  host: string;
  apiBaseUrl: string;
  basePath: string;
  requestTimeout: number;
  xApiClient: string;
  additionalHeaders?: object;
  httpHeaders?: object;
}

export interface Pagination<T> {
  totalCount: number;
  items: Array<ApiResource<T>>;
}

interface ResponseSuccessData<T> {
  result: T;
  messages?: Array<{
    id: string;
    date: string;
    interface: string;
  }>;
}

interface ResponseErrorData {
  code: number;
  message: string;
  developerMessage: string;
}

export interface ResponseEnvelope<T> {
  requestId: string;
  status: 'SUCCESS' | 'ERROR';
  data: ResponseSuccessData<T> | ResponseErrorData;
}

export type ApiResource<T> = T & {
  id: string;
  name?: string;
  description?: string;
  createdAt?: string;
  customData?: string;
};

interface CustomDataT {
  customData?: string;
  createdAt?: string;
}

export type List<T> = (
  limit?: number,
  offset?: number,
  sort?: string,
  filter?: object
) => Promise<Pagination<ApiResource<T>>>;

export type Create<T> = (data: T) => Promise<ApiResource<T>>;
export type Details<T> = () => Promise<ApiResource<T>>;
export type Delete<T> = () => Promise<T>;
export type CustomData = () => Promise<CustomDataT>;

export interface HttpClient {
  get<T>(configuration: InternalConfiguration, url: string, fetchMethod?: any): Promise<T>;
  post<T, J>(configuration: InternalConfiguration, url: string, object?: J, fetchMethod?: any): Promise<T>;
  put<T, J>(configuration: InternalConfiguration, url: string, object?: J, fetchMethod?: any): Promise<T>;
  delete_<T>(configuration: InternalConfiguration, url: string, fetchMethod?: any): Promise<T>;
}
