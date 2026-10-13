/** Payload for creating a payment request with Zibal. */
export interface ZibalRequestPayload {
  merchant: string;
  amount: number;
  callbackUrl: string;
  orderId: string;
  description?: string;
}

/** Payload for verifying a Zibal payment. */
export interface ZibalVerifyPayload {
  merchant: string;
  trackId: number;
}

/** Generic payload for an HTTP POST request. */
export interface PostHttpRequestPayload<T> {
  url: string;
  data: T;
}
