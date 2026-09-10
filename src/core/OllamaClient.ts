export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export type ModelInfo = { name: string; size: number; details?: { parameter_size?: string; family?: string } };
export class OllamaClient {
  endpoint: string;
  constructor(endpoint='http://localhost:11434'){ this.endpoint=endpoint.replace(/\/$/,''); }
  async health(){ try{ const r=await fetch(this.endpoint+'/api/tags',{signal:AbortSignal.timeout(2500)}); return r.ok; }catch{return false;} }
  async models():Promise<ModelInfo[]>{ const r=await fetch(this.endpoint+'/api/tags'); if(!r.ok) throw new Error('Could not read Ollama models.'); const j=await r.json(); return j.models ?? []; }
  async chat(model:string,messages:ChatMessage[],temperature:number,onToken:(s:string)=>void,onDone:(n:number)=>void,signal:AbortSignal){
    const r=await fetch(this.endpoint+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,messages,stream:true,options:{temperature},keep_alive:'10m'}),signal});
    if(!r.ok) throw new Error(await r.text() || ('Ollama returned '+r.status)); if(!r.body) throw new Error('Ollama returned no stream.');
    const reader=r.body.getReader(), decoder=new TextDecoder(); let buffer=''; let tokens=0;
    for(;;){ const x=await reader.read(); if(x.done) break; buffer+=decoder.decode(x.value,{stream:true}); const lines=buffer.split('\n'); buffer=lines.pop() || ''; for(const line of lines){ if(!line.trim()) continue; const chunk=JSON.parse(line); if(chunk.message?.content) onToken(chunk.message.content); if(chunk.done) tokens=chunk.eval_count||tokens; } }
    onDone(tokens);
  }
}
