export type Response = OkResponse | ErrorResponse;

type OkResponse = {
  data: unknown;
};

type ErrorResponse = {
  error: string;
};
