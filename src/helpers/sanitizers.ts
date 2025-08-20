export function sanitizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // decompose accents
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/\s+/g, '-') // replace spaces with dashes
    .replace(/[^a-z0-9-]/g, ''); // remove punctuation like apostrophes
}

export function sanitizeId(id: string) {
  return id
    .normalize('NFC')
    .trim()
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, '');
}
