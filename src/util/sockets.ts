export function getRole(message: string | undefined): string[] | null {
  if (!message) return null;
  const startSymbol = "[";
  const endSymbol = "]";
  const start = message.indexOf(startSymbol);
  const end = message.indexOf(endSymbol);
  if (start != 0 || end == -1) return null;
  return [message.substring(start + 1, end), message.substring(end + 1)];
}
