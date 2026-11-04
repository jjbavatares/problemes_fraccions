(() => {
'use strict';
const { learn, practice } = window.FRACTIONS_DATA;
const $ = s => document.querySelector(s);
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mathPart = s => { s=s.trim(); const sep=s.includes(':')?':':s.includes('/')?'/':null; if(sep){const at=s.indexOf(sep);return `<mfrac><mrow>${mathPart(s.slice(0,at))}</mrow><mrow>${mathPart(s.slice(at+1))}</mrow></mfrac>`;} return `<mn>${escape(s)}</mn>`; };
function rich(s){
 s=String(s).replaceAll('×','·').replaceAll('−','−');
 const regex=/(?:\d+\/\d+|\d+)\s*:\s*(?:\d+\/\d+|\d+)|\d+\/\d+/g;
 let out='',last=0;
 for(const m of s.matchAll(regex)){out+=escape(s.slice(last,m.index));out+=`<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="${escape(m[0].replaceAll('/',' partit per ').replace(':',' dividit entre '))}">${mathPart(m[0])}</math>`;last=m.index+m[0].length;}
 return out+escape(s.slice(last));
}
function stepsHtml(steps){return steps.map(s=>s.startsWith('=')?`<p class="calc">${rich(s.slice(1))}</p>`:`<p>${rich(s).replace(/^(\d+\.)/, '<span class="step-num">$1</span>')}</p>`).join('');}
function solutionGrid(item){return `<div class="solution-grid"><section class="solution-column"><h4>Dades</h4>${item.data.map(s=>`<p>${rich(s)}</p>`).join('')}</section><section class="solution-column"><h4>Resolució</h4>${stepsHtml(item.steps)}</section><section class="solution-column result"><h4>Solució</h4><p>${rich(item.answer)}</p></section></div>`;}
function bar(y,n,blue,teal=0,label=''){
 const left=45,width=510,h=28,cell=width/n;
 return `${label?`<text x="45" y="${y-13}">${escape(label)}</text>`:''}${Array.from({length:n},(_,i)=>`<rect x="${left+i*cell+2}" y="${y}" width="${cell-4}" height="${h}" rx="3" fill="${i<blue?'#6b9fff':i<blue+teal?'#58b9ad':'#213450'}" stroke="${i<blue?'#a6c8ff':i<blue+teal?'#87d7c9':'#385371'}"/>`).join('')}`;
}
function diagram(i){
 const config=[{n:4,b:1,label:'20 llapis · 4 parts iguals',caption:'Cada part conté 5 llapis. En prenem una.'},{n:8,b:5,t:3,label:'40 cL · 8 parts iguals',caption:'Blau: suc begut. Verd: suc que queda.'},{n:5,b:3,label:'El llibre sencer: 5 parts iguals',caption:'Les 3 parts blaves són les 18 pàgines llegides.'},{n:5,b:2,label:'30 alumnes · 5 parts de 6 alumnes',caption:'12 alumnes són 2 de les 5 parts del grup.'},{n:12,b:3,t:4,label:'24 galetes · cada part representa 2 galetes',caption:'Blau: matí (3/12). Verd: tarda (4/12). Totes dues parts són del total inicial.'},{n:15,b:10,label:'Aina · 40 de 60 pàgines',caption:'Les dues barres representen llibres de 60 pàgines. La mateixa escala.'},{n:6,b:5,label:'5/6 L de suc en total',caption:'Cada part blava és 1/6 L: n’hi ha una per a cadascuna de les 5 persones.'},{n:6,b:6,label:'3/2 L en total · 6 porcions iguals',caption:'Cada part representa un got d’1/4 L.'},{n:12,b:3,t:6,label:'120 L inicials · cada part representa 10 L',caption:'Blau: consum del matí. Verd: consum de la tarda. Les 3 parts fosques són l’aigua final.'}][i];
 let svg=bar(35,config.n,config.b,config.t||0,config.label);
 if(i===5)svg+=bar(112,15,9,0,'Nil · 36 de 60 pàgines');
 return `<figure class="diagram"><svg viewBox="0 0 600 ${i===5?155:82}" role="img" aria-label="${escape(config.label+'. '+config.caption)}">${svg}</svg><figcaption class="diagram-caption">${escape(config.caption)}</figcaption></figure>`;
}
const labels=['Una part del total','La quantitat que queda','El total a partir d’una part','Quina fracció representa','Parts d’un mateix total','Comparar quantitats','Repartir una quantitat','Quantes porcions hi caben','Una fracció del que queda'];
function selectType(index,moveFocus=false){
 $('#type-nav').innerHTML=learn.map((_,i)=>`<button class="type-button ${i===index?'active':''}" data-type="${i}" aria-pressed="${i===index}"><span class="type-number">${String(i+1).padStart(2,'0')}</span><span>${labels[i]}</span></button>`).join('');
 const item=learn[index];$('#learn-example').innerHTML=`<article class="example-card"><div class="example-top"><p class="card-kicker">EXEMPLE RESOLT ${String(index+1).padStart(2,'0')}</p><h3>${escape(item.title)}</h3><p class="statement">${rich(item.q)}</p></div>${diagram(index)}${solutionGrid(item)}</article>`;
 if(moveFocus)$('#type-nav').querySelector(`[data-type="${index}"]`).focus({preventScroll:true});
}
const key='fraccions-problemes-v1';let done=new Set();let storageAvailable=true;
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))done=new Set(saved.filter(x=>Number.isInteger(x)&&x>=1&&x<=10));}catch{storageAvailable=false;}
function persist(){try{localStorage.setItem(key,JSON.stringify([...done]));}catch{storageAvailable=false;}if(!storageAvailable)$('#save-note').textContent='Progrés disponible durant aquesta sessió.';}
function updateProgress(){
 $('#progress').value=done.size;$('#progress-count').textContent=`${done.size} / 10`;
 $('#problem-nav').innerHTML=practice.map(p=>`<a href="#problem-${p.id}" class="${done.has(p.id)?'done':''}" aria-label="Problema ${p.id}${done.has(p.id)?', fet':''}">${done.has(p.id)?'✓':p.id}</a>`).join('');$('#problem-nav').className='problem-nav';
 document.querySelectorAll('[data-done]').forEach(input=>{input.checked=done.has(Number(input.dataset.done));});
}
function renderPractice(){
 $('#practice-list').innerHTML=practice.map((item,i)=>{
 const level=i<3?1:i<8?2:3,label=['Per començar','Un pas més','Connecta els passos'][level-1];
 return `<article class="problem-card" id="problem-${item.id}" aria-labelledby="problem-title-${item.id}"><div class="problem-main"><div class="problem-heading"><h2 class="card-kicker" id="problem-title-${item.id}">PROBLEMA ${String(item.id).padStart(2,'0')}</h2><span class="level"><span class="level-bars" aria-hidden="true">${[1,2,3].map(n=>`<i class="${n<=level?'on':''}"></i>`).join('')}</span>${label}</span></div><p class="statement">${rich(item.q)}</p><div class="answer-strip"><strong>Solució:</strong> ${rich(item.answer)}</div><label class="practice-check"><input type="checkbox" data-done="${item.id}"> L’he treballat amb llapis i paper</label></div><details><summary>Resolució pas a pas</summary><p class="type-reveal">${escape(item.title)}</p>${solutionGrid(item)}</details></article>`;
 }).join('');updateProgress();if(!storageAvailable)$('#save-note').textContent='Progrés disponible durant aquesta sessió.';
}
function setPage(page,scroll=true){
 const selected=['apren','practica','colleccio'].includes(page)?page:'apren';
 const sections=[['learn','apren'],['practice','practica'],['collection','colleccio']];
 for(const [name,route] of sections){const active=selected===route;$('#'+name+'-panel').hidden=!active;const button=$('#tab-'+name);button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');}
 $('#collection-access').hidden=selected!=='colleccio';
 try{history.replaceState(null,'','#'+selected);}catch{}
 if(scroll)window.scrollTo({top:0,behavior:'instant'});
 document.title=({apren:'Aprèn',practica:'Practica',colleccio:'Col·lecció'})[selected]+' · Problemes amb fraccions';
}
window.FRACTIONS_UI={rich,solutionGrid};
$('#tab-collection').addEventListener('click',()=>setPage('colleccio'));
$('#type-nav').addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(b)selectType(Number(b.dataset.type),true);});
$('#tab-learn').addEventListener('click',()=>setPage('apren'));$('#tab-practice').addEventListener('click',()=>setPage('practica'));
$('#start-practice').addEventListener('click',()=>{setPage('practica');$('#practice-heading').setAttribute('tabindex','-1');$('#practice-heading').focus({preventScroll:true});});
$('#back-learn').addEventListener('click',()=>setPage('apren'));
$('#practice-list').addEventListener('change',e=>{if(!e.target.matches('[data-done]'))return;const id=Number(e.target.dataset.done);if(e.target.checked)done.add(id);else done.delete(id);persist();updateProgress();$('#status').textContent=`${done.size} de 10 problemes marcats com a fets.`;});
$('#reset-progress').addEventListener('click',()=>{done.clear();persist();updateProgress();$('#status').textContent='Progrés reiniciat.';});
window.addEventListener('hashchange',()=>{if(['#practica','#apren','#colleccio'].includes(location.hash))setPage(location.hash.slice(1));});
const initialHash=location.hash;
selectType(0);renderPractice();setPage(initialHash==='#colleccio'||/^#(?:bloc-|collection-)/.test(initialHash)?'colleccio':initialHash==='#practica'||initialHash.startsWith('#problem-')?'practica':'apren',false);
if(/^#(?:problem-|bloc-|collection-)/.test(initialHash))requestAnimationFrame(()=>document.getElementById(initialHash.slice(1))?.scrollIntoView());
})();
