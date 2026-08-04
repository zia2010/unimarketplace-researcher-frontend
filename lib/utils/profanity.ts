const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s/g, '')
    .replace(/[^a-z0-9]/g, '');

export const containsEmail = (text: string) => {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  return emailRegex.test(text);
};

export const containsPhone = (text: string) => {
  const digitsOnly = text.replace(/\D/g, '');
  return digitsOnly.length >= 10;
};

export const containsLink = (text: string) => {
  const lower = text.toLowerCase();
  return (
    lower.includes('http') ||
    lower.includes('www.') ||
    lower.includes('.com') ||
    lower.includes('.in') ||
    lower.includes('.org') ||
    lower.includes('.net') ||
    lower.includes('://')
  );
};

export const containsProfanity = (text: string) => {
  // add any words that should not be sent or allowed in chat
  const bannedWords = [
    'fuck',
    'fvck',
    'f u c k',
    'shit',
    'bitch',
    'asshole',
    'stfu',
    'sybau',
    'mc',
    'bc',
  ];

  const normalized = normalizeText(text);
  return bannedWords.some((word) => normalized.includes(word));
};
