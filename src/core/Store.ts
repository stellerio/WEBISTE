import type { ChatMessage } from './OllamaClient';
export type Conversation={id:string;title:string;created:number;messages:ChatMessage[]};
const KEY='steller-conversations-v1';
export class Store{
 conversations:Conversation[]=[]; activeId:string|null=null;
 constructor(){try{this.conversations=JSON.parse(localStorage.getItem(KEY)||'[]')}catch{this.conversations=[]}}
 save(){localStorage.setItem(KEY,JSON.stringify(this.conversations.slice(0,40)))}
 newConversation(){const c={id:crypto.randomUUID(),title:'New conversation',created:Date.now(),messages:[]};this.conversations.unshift(c);this.activeId=c.id;this.save();return c}
 active(){return this.conversations.find(c=>c.id===this.activeId)||null}
 ensure(){return this.active()||this.newConversation()}
 setMessages(messages:ChatMessage[]){this.ensure().messages=messages;this.save()}
 rename(){const c=this.active();if(!c)return;const u=c.messages.find(x=>x.role==='user');if(u)c.title=u.content.trim().replace(/\s+/g,' ').slice(0,34)||'Conversation';this.save()}
}