# Steller Ollama AI

This repository contains a GitHub Pages frontend that connects directly to an Ollama server. The UI discovers installed models, streams `/api/chat` responses, saves conversations locally in the browser, and provides system-prompt and temperature controls.

Recommended high-capability family: Qwen3.5. Ollama currently lists 9B, 27B, 35B and larger local variants, with text/image input and 256K context windows. The 9B Q4 variant is about 6.6GB; the 27B Q4 variant is about 17GB.

Install a model with `ollama pull qwen3.5:9b` or use `ollama pull qwen3.5:27b` on a stronger machine.

Ollama normally listens on `localhost:11434`. For a GitHub Pages page to call a local Ollama server, allow the site origin with the Ollama `OLLAMA_ORIGINS` setting. See Ollama's FAQ for Linux/systemd instructions.
