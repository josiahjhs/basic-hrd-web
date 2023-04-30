export interface HttpSingleResponse<T> {
  code: string;
  data: T | null;
}

export interface HttpNullResponse {
  code: string;
  data: null;
}

export interface HttpPaginationResponse<T> {
  code: string;
  data: T[] | null;
  totalData: number;
}


export interface Pagination {
  pageIndex: number;
  pageSize: number;
  length: number;
}
