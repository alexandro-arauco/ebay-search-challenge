export class EbayAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EbayAuthError";
  }
}

export class EbayApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "EbayApiError";
    this.status = status;
  }
}
