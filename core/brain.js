import { analyze } from './tokenizer.js';

export class StellerBrain {
    constructor(knowledge = {}) {
        this.knowledge = knowledge;
        this.memory = {};
    }

    understand(text) {
        const data = analyze(text);
        const concepts = [];
        const unknown = [];

        for (const token of data.tokens) {
            if (this.knowledge[token]) {
                concepts.push(this.knowledge[token]);
            } else {
                unknown.push(token);
            }
        }

        return {
            ...data,
            concepts,
            unknown
        };
    }

    learn(word, data) {
        this.knowledge[word.toLowerCase()] = data;
    }

    think(text) {
        const thought = this.understand(text);

        if (!thought.concepts.length) {
            return `I don't know about "${thought.tokens.join(' ')}" yet. My knowledge can be expanded by teaching me new concepts.`;
        }

        const answer = thought.concepts
            .map(c => c.explain)
            .filter(Boolean)
            .join(' ');

        if (thought.unknown.length) {
            return `${answer}\n\nI also noticed these unknown tokens: ${thought.unknown.join(', ')}.`;
        }

        return answer;
    }
}
