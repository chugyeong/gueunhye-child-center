export function toApiErrorResponse(error: unknown, fallbackMessage: string, status = 500) {
  const message = error instanceof Error ? error.message : fallbackMessage;

  return Response.json({ message }, { status });
}

export function toApiMessageResponse(message: string, status: number) {
  return Response.json({ message }, { status });
}
