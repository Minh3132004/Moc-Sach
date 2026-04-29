export default class ApiError extends Error {
  status: number;
  timestamp?: string;

  constructor(message: string, status: number, timestamp?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.timestamp = timestamp;
  }
}