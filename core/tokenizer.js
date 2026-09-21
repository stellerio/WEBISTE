export function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);
}

export function analyze(text) {
    const tokens = tokenize(text);

    return {
        original: text,
        tokens,
        count: tokens.length
    };
}
