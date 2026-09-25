export function createEmptyAnswer(type, page) {
  if (type === 'multiple_choice') return { optionIndex: null };
  if (type === 'matching') return { matches: [] };
  if (type === 'budgeting') return { selectedItemIndexes: [] };
  if (type === 'wants_needs') {
    const items = page?.items ?? [];
    return {
      classifications: items.map((item) => ({
        itemIndex: item.index,
        category: null,
      })),
    };
  }
  return {};
}

function isIndex(value, length) {
  return Number.isInteger(value) && value >= 0 && value < length;
}

export function getActivityAnswerError(type, answer, page) {
  if (type === 'multiple_choice') {
    const optionCount = page?.options?.length ?? 0;
    if (answer?.optionIndex === null || answer?.optionIndex === undefined) {
      return 'Choose one answer before checking.';
    }
    if (!isIndex(answer.optionIndex, optionCount)) {
      return 'Choose a valid answer before checking.';
    }
    return null;
  }

  if (type === 'matching') {
    const wordCount = page?.words?.length ?? 0;
    const matches = answer?.matches;
    if (!Array.isArray(matches) || matches.length !== wordCount) {
      return 'Match every word to a definition before checking.';
    }
    const wordIndexes = new Set();
    const definitionIndexes = new Set();
    for (const match of matches) {
      if (
        !isIndex(match?.wordIndex, wordCount) ||
        !isIndex(match?.definitionIndex, page?.definitions?.length ?? 0) ||
        wordIndexes.has(match.wordIndex) ||
        definitionIndexes.has(match.definitionIndex)
      ) {
        return 'Each word needs a different definition before checking.';
      }
      wordIndexes.add(match.wordIndex);
      definitionIndexes.add(match.definitionIndex);
    }
    return null;
  }

  if (type === 'budgeting') {
    const itemCount = page?.availableItems?.length ?? 0;
    const selected = answer?.selectedItemIndexes;
    if (!Array.isArray(selected) || selected.length === 0) {
      return 'Select at least one item before checking.';
    }
    const unique = new Set(selected);
    if (
      unique.size !== selected.length ||
      selected.some((index) => !isIndex(index, itemCount))
    ) {
      return 'Choose each budget item only once.';
    }
    return null;
  }

  if (type === 'wants_needs') {
    const items = page?.items ?? [];
    const classifications = answer?.classifications;
    if (
      !Array.isArray(classifications) ||
      classifications.length !== items.length
    ) {
      return 'Classify every item before checking.';
    }
    const itemIndexes = new Set();
    for (const classification of classifications) {
      if (
        !isIndex(classification?.itemIndex, items.length) ||
        !['want', 'need'].includes(classification?.category) ||
        itemIndexes.has(classification.itemIndex)
      ) {
        return 'Choose a want or need for every item.';
      }
      itemIndexes.add(classification.itemIndex);
    }
    return null;
  }

  return 'This activity is not available yet.';
}

export function isActivityAnswerValid(type, answer, page) {
  return getActivityAnswerError(type, answer, page) === null;
}
