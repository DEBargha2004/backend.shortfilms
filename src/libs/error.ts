type ErrorCode =
  | 'DUPLICATE_USER'
  | 'USER_NOT_FOUND'
  | 'USER_NOT_VERIFIED'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_TOKEN'
  | 'INVALID_MIMETYPE'
  | 'UNKNOWN_ERROR';

export class ErrorMessage {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
  ) {}
}
