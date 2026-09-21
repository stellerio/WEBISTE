const knowledge={
 gravity:"Gravity is a force that attracts objects with mass.",
 hello:"Hello, I am Steller Core, a token based AI system."
};
function tokenize(t){return t.toLowerCase().match(/\w+/g)||[];}
function ask(){
 const input=document.getElementById('input').value;
 const tokens=tokenize(input);
 let answer="I do not know that token yet.";
 for(const token of tokens){if(knowledge[token]) answer=knowledge[token];}
 document.getElementById('chat').innerHTML += `<p>${answer}</p>`;
}