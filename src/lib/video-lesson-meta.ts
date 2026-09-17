import type { AdminDialogue, AdminVocab } from "./admin.functions";

export type LessonMeta = {
  badge: string;
  dialogues: AdminDialogue[];
  vocab: AdminVocab[];
};

const MARKER = "\n\n__HASTI_LESSON_META_V1__\n";
const DEFAULT_META: LessonMeta = { badge: "درس جدید", dialogues: [], vocab: [] };

export function packLessonDescription(description: string, meta: LessonMeta): string {
  return `${description}${MARKER}${JSON.stringify(meta)}`;
}

export function unpackLessonDescription(raw: unknown): { description: string; meta: LessonMeta } {
  const value = typeof raw === "string" ? raw : "";
  const index = value.indexOf(MARKER);
  if (index < 0) return { description: value, meta: DEFAULT_META };

  const description = value.slice(0, index);
  try {
    const parsed = JSON.parse(value.slice(index + MARKER.length)) as Partial<LessonMeta>;
    return {
      description,
      meta: {
        badge: typeof parsed.badge === "string" && parsed.badge.trim() ? parsed.badge : DEFAULT_META.badge,
        dialogues: Array.isArray(parsed.dialogues) ? parsed.dialogues : [],
        vocab: Array.isArray(parsed.vocab) ? parsed.vocab : [],
      },
    };
  } catch {
    return { description: value, meta: DEFAULT_META };
  }
}
