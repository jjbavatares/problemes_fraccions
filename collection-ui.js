(() => {
'use strict';
const {problems,blocks,iterations}=window.FRACTIONS_COLLECTION;
const {rich,solutionGrid}=window.FRACTIONS_UI;
const $=s=>document.querySelector(s);
const unlocked=new Map();let generation=0;
const names=['Comença i consolida','Combina les idees','Accepta el repte'];
$('#collection-list').innerHTML=blocks.map((block,i)=>`<section class="collection-block" id="bloc-${block.id}" aria-labelledby="block-heading-${block.id}"><div class="block-heading"><div><p class="eyebrow">PROBLEMES ${block.first}–${block.last}</p><h2 id="block-heading-${block.id}">${names[i]}</h2></div><span class="block-state" id="block-state-${block.id}" aria-live="polite"></span></div>${problems.slice(block.first-1,block.last).map(p=>`<article class="problem-card collection-card" id="collection-${p.id}" aria-labelledby="collection-title-${p.id}"><div class="problem-main"><h3 class="card-kicker" id="collection-title-${p.id}">PROBLEMA ${String(p.id).padStart(2,'0')}</h3><p class="statement">${rich(p.q)}</p><div class="answer-strip"><strong>Solució:</strong> ${rich(p.answer)}</div></div><div class="protected-steps" id="protected-${p.id}"></div></article>`).join('')}</section>`).join('');
const dialog=$('#access-dialog'),form=$('#access-form'),message=$('#access-message');
function updateState(){
 for(const block of blocks)$('#block-state-'+block.id).textContent=unlocked.has(block.id)?'Resolucions disponibles':'';
 $('#access-relock').hidden=unlocked.size===0;
}
function relock(){
 generation++;unlocked.clear();document.querySelectorAll('.protected-steps').forEach(e=>e.replaceChildren());updateState();
 message.textContent='Totes les resolucions estan bloquejades.';
 $('#status').textContent=message.textContent;
}
$('#collection-access').addEventListener('click',()=>{message.textContent='';$('#access-block').value=String(blocks.find(b=>!unlocked.has(b.id))?.id||1);dialog.showModal();$('#access-password').focus();});
$('#access-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{form.reset();message.textContent='';generation++;});
$('#access-relock').addEventListener('click',relock);
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
form.addEventListener('submit',async e=>{
 e.preventDefault();const id=Number($('#access-block').value),block=blocks.find(b=>b.id===id);
 if(unlocked.has(id)){message.textContent='Aquest bloc ja està obert.';$('#access-password').value='';return;}
 if(!window.crypto?.subtle){message.textContent='Obre la web amb un navegador actual, des del fitxer local o des de la seva adreça HTTPS.';return;}
 const password=$('#access-password').value;$('#access-password').value='';
 const token=generation;$('#access-submit').disabled=true;$('#access-block').disabled=true;message.textContent='Comprovant la clau…';
 try{
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:bytes(block.salt),iterations},material,{name:'AES-GCM',length:256},false,['decrypt']);
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(block.iv)},key,bytes(block.ciphertext));
  if(token!==generation)return;
  const items=JSON.parse(new TextDecoder().decode(plain));
  if(items.length!==10||items.some((item,i)=>item.id!==block.first+i))throw Error('Invalid block');
  unlocked.set(id,items);
  for(const item of items)$('#protected-'+item.id).innerHTML=`<details><summary>Resolució pas a pas</summary>${solutionGrid(item)}</details>`;
  updateState();dialog.close();$('#status').textContent=`Resolucions dels problemes ${block.first} a ${block.last} disponibles.`;
  $('#bloc-'+id).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 }catch{
  if(token!==generation)return;
  message.textContent='La contrasenya no és correcta per a aquest bloc.';$('#access-password').focus();
 }finally{$('#access-submit').disabled=false;$('#access-block').disabled=false;}
});
})();
