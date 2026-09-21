import { analyze } from './tokenizer.js';

export class StellerBrain {
    constructor(knowledge = {}) {
        this.knowledge = knowledge;
        this.memory = {};
    }

    understand(text) {
        const data = analyze(text);
        const concepts = [];

        for (const token of data.tokens) {
            if (this.knowledge[token]) {
                concepts.push(this.knowledge[token]);
            }
        }

        return {
            ...data,
            concepts
        };
    }

    think(text) {
        const thought = this.understand(text);

        if (!thought.concepts.length) {
            return "I do not know that yet, but I can learn it.";
        }

        return thought.concepts
            .map(c => c.explain)
            .filter(Boolean)
            .join(' ');
    }
}
