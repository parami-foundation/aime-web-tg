export enum TelegramAuth {
  APP = "telegram-app",
  WEB = "telegram-bot",
}

export enum ApiError {
  Conflict = "conflict",
  InvalidGrant = "invalid_grant",
  InvalidRequest = "invalid_request",
  InvalidSignature = "invalid_signature",
  InvalidToken = "invalid_token",
  NotFound = "not_found",
  ServerError = "server_error",
  Impossible = "impossible",
}