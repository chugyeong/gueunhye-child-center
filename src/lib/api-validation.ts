export function parseRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(message);
  }

  return value.trim();
}

export function parseBoolean(value: unknown, message: string) {
  if (typeof value !== "boolean") {
    throw new Error(message);
  }

  return value;
}
