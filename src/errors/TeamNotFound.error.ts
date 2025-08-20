export class TeamNotFoundError extends Error {
  constructor({ id }: { id: string }) {
    const message = `Team Not Found [id: ${id}]`;
    super(message);
  }
}
