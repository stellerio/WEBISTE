const knowledge = {
    gravity: "Gravity is a force that attracts objects with mass.",
    hello: "Hello, I am Steller Core."
};

function tokenize(t) {
    return t.toLowerCase().match(/\w+/g) || [];
}

async function ask() {
    const input = document.getElementById('input').value;
    const tokens = tokenize(input);

    let answer = "";

    // Try local LLM first (no API key, runs on your PC)
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "qwen3.5:9b",
                prompt: `You are Steller Core. Understand this text and answer clearly:\n${input}`,
                stream: false
            })
        });

        const data = await response.json();
        answer = data.response;
    } catch (e) {
        // Fallback to Steller token brain
        answer = "I do not know that yet.";

        for (const token of tokens) {
            if (knowledge[token]) {
                answer = knowledge[token];
            }
        }
    }

    document.getElementById('chat').innerHTML += `<p>${answer}</p>`;
}
