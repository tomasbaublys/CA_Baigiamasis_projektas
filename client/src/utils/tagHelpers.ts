export const parseTags = (value: string): string[] => {
  const normalized = value
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(normalized)];
};

export const formatTags = (tags: string[]): string => tags.join(', ');

export const tagsInputPattern = /^([a-zA-Z0-9-]+,?\s*)+$/;

