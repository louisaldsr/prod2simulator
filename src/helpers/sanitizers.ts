export function sanitizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD") // decompose accents
    .replace(/[\u0300-\u036f]/g, "") // remove accent marks
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/[^a-z0-9-]/g, ""); // remove punctuation like apostrophes
}

export function sanitizeId(id: string) {
  return id
    .normalize("NFC")
    .trim()
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, "");
}

export function normalizeFinalDay(finalDay: number): string {
  switch (finalDay) {
    case 1:
      return "PlayOffs";
    case 2:
      return "SemiFinals";
    case 3:
      return "Final";
    default:
      throw new Error("Non existing final in the competition");
  }
}
