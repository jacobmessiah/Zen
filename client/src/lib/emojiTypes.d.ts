type EmojiItem = {
  text: string;
  shortCode: string;
  value: string;
};

type EmojiCategory = {
  categoryText: string;
  value: string;
  emojis: EmojiItem[];
};

export type { EmojiItem, EmojiCategory };
export const emojiArray: EmojiCategory[];
