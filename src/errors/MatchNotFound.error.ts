export class MatchNotFoundError extends Error {
  constructor({ id }: { id: string }) {
    const message = `Match Not Found [id: ${id}]`;
    super(message);
  }
}
