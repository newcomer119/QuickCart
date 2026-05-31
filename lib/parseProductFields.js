/** Split multiline text into non-empty lines */
export function parseLines(text) {
  if (!text || typeof text !== "string") return [];
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Parse "Title|Description" or "Label: Value" lines */
export function parseLabeledItems(text, separator = "|") {
  return parseLines(text).map((line) => {
    const sep = line.includes(separator) ? separator : ":";
    const idx = line.indexOf(sep);
    if (idx === -1) return { title: line, description: "" };
    return {
      title: line.slice(0, idx).trim(),
      description: line.slice(idx + 1).trim(),
    };
  });
}

/** Parse key-value pairs for spec tables */
export function parseSpecLines(text) {
  return parseLabeledItems(text, "|").map(({ title, description }) => ({
    label: title,
    value: description,
  }));
}

/** FAQ fields: "Question|Answer" or first line = question, rest = answer */
export function parseFaqs(...faqFields) {
  return faqFields
    .filter(Boolean)
    .map((raw) => {
      const text = String(raw).trim();
      if (!text) return null;
      if (text.includes("|")) {
        const [question, ...rest] = text.split("|");
        return { question: question.trim(), answer: rest.join("|").trim() };
      }
      const lines = parseLines(text);
      if (lines.length === 0) return null;
      return {
        question: lines[0],
        answer: lines.slice(1).join("\n") || lines[0],
      };
    })
    .filter(Boolean);
}
