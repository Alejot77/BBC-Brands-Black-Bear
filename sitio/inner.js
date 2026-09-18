'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let paused=reduce;const toggle=document.querySelector('#motion'),canvas=document.querySelector('#gestures'),ctx=canvas.getContext('2d'),cursor=document.querySelector('#cursor');let marks=[],lastX=-100,lastY=-100;
function motionUI(){toggle.textContent=innerWidth<=1000?(paused?'Activar':'Pausar'):(paused?'Activar movimiento':'Pausar movimiento');toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Activar movimiento':'Pausar movimiento');document.body.classList.toggle('paused',paused)}toggle.onclick=()=>{paused=!paused;marks=[];motionUI()};motionUI();function resize(){const d=Math.min(devicePixelRatio,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0);motionUI()}addEventListener('resize',resize);resize();
document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;cursor.style.opacity='1';cursor.style.transform=`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;cursor.classList.toggle('hot',!!e.target.closest('a,button,label,summary'));if(!paused&&!e.target.closest('.brief-panel')&&Math.hypot(e.clientX-lastX,e.clientY-lastY)>50){marks.push({x:e.clientX,y:e.clientY,t:performance.now()});lastX=e.clientX;lastY=e.clientY}});document.addEventListener('pointerleave',()=>cursor.style.opacity='0');
function draw(t){requestAnimationFrame(draw);ctx.clearRect(0,0,innerWidth,innerHeight);marks=marks.filter(m=>t-m.t<750);if(!paused)for(const m of marks){const life=1-(t-m.t)/750;ctx.strokeStyle=`rgba(240,240,240,${life*.35})`;ctx.lineWidth=.7;for(let i=0;i<3;i++){const size=26-i*7;ctx.strokeRect(m.x-size/2,m.y-size/2,size,size)}}const denom=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-progress').style.width=(denom>0?scrollY/denom*100:0)+'%'}requestAnimationFrame(draw);
const form=document.querySelector('#brief');if(form){let step=0;const fields=[...form.querySelectorAll('.brief-step')],back=document.querySelector('#brief-back'),next=document.querySelector('#brief-next'),error=document.querySelector('#brief-error'),date=document.querySelector('#event-date'),unknown=document.querySelector('#date-unknown');
unknown.onchange=()=>{date.disabled=unknown.checked;if(unknown.checked)date.value=''};
function show(focus=true){fields.forEach((f,i)=>f.hidden=i!==step);back.hidden=step===0;next.innerHTML=step===3?'Enviar solicitud <span>↗</span>':'Continuar <span>↗</span>';document.querySelector('#step-count').textContent='0'+(step+1)+' / 04';document.querySelector('.brief-track i').style.width=((step+1)/4*100)+'%';error.textContent='';if(focus){const legend=fields[step].querySelector('legend');legend.tabIndex=-1;legend.focus({preventScroll:true});if(innerWidth<=800)document.querySelector('.brief-panel').scrollIntoView({behavior:paused?'auto':'smooth',block:'start'})}}
function validate(){if(step===0&&!form.querySelector('[name="tipo"]:checked')){error.textContent='Selecciona el tipo de proyecto.';form.querySelector('[name="tipo"]').focus();return false}if(step===1&&!date.value&&!unknown.checked){error.textContent='Elige una fecha o marca que aún está por definir.';date.focus();return false}for(const input of fields[step].querySelectorAll('input')){if(!input.disabled&&(!input.checkValidity()||(input.required&&input.type!=='radio'&&!input.value.trim()))){error.textContent=input.type==='email'?'Escribe un correo electrónico válido.':'Completa este dato para continuar.';input.focus();return false}}return true}
back.onclick=()=>{if(step>0){step--;show()}};
let sending=false;
form.onsubmit=async e=>{
 e.preventDefault();if(sending||!validate())return;if(step<3){step++;show();return}
 sending=true;next.disabled=true;back.disabled=true;next.textContent='Enviando…';error.textContent='';form.setAttribute('aria-busy','true');
 try{
  const settings=await fetch('/contact-config.json').then(r=>{if(!r.ok)throw new Error('config');return r.json()});
  if(!settings.submitEndpoint){error.textContent='El envío aún no está habilitado. Estamos conectando el canal de recepción.';return}
  const data=Object.fromEntries(new FormData(form));if(unknown.checked)data.fecha='Por definir';
  const response=await fetch(settings.submitEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error('send');const receipt=await response.json();if(receipt.success!==true)throw new Error('receipt');
  form.hidden=true;const result=document.querySelector('#brief-result');result.hidden=false;result.querySelector('h2').tabIndex=-1;result.querySelector('h2').focus();
 }catch{error.textContent='No pudimos enviar tu solicitud. Tus datos siguen aquí; vuelve a intentarlo.'}
 finally{sending=false;next.disabled=false;back.disabled=false;next.innerHTML='Enviar solicitud <span>↗</span>';form.removeAttribute('aria-busy')}
};show(false);
document.querySelector('#whatsapp-float').onclick=()=>{const note=document.querySelector('#whatsapp-note');note.hidden=!note.hidden};}

function sectionDrift(){if(!paused)document.querySelectorAll('.project-heading h2,.number-intro h2,.method-heading h2,.team-heading h2').forEach(el=>{const rect=el.parentElement.getBoundingClientRect();const y=Math.max(-14,Math.min(24,(rect.top-innerHeight*.4)*.055));el.style.setProperty('--heading-y',y+'px')})}addEventListener('scroll',sectionDrift,{passive:true});sectionDrift();
// Crew: physical response on hover; personal side on click, tap or keyboard.
document.querySelectorAll('.crew-toggle').forEach(button=>{
 const front=button.querySelector('.crew-front'),back=button.querySelector('.crew-back');
 button.addEventListener('pointermove',e=>{if(paused||e.pointerType==='touch')return;const r=button.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;button.style.setProperty('--rx',(y-.5)*-5+'deg');button.style.setProperty('--ry',(x-.5)*7+'deg');button.style.setProperty('--spot-x',x*100+'%');button.style.setProperty('--spot-y',y*100+'%');button.style.setProperty('--letter-x',(x-.5)*16+'px')});
 button.addEventListener('pointerleave',()=>{button.style.setProperty('--rx','0deg');button.style.setProperty('--ry','0deg');button.style.setProperty('--letter-x','0px')});
 button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));back.setAttribute('aria-hidden',String(!open));front.setAttribute('aria-hidden',String(open))});
 button.addEventListener('keydown',e=>{if(e.key==='Escape'){button.setAttribute('aria-expanded','false');back.setAttribute('aria-hidden','true');front.setAttribute('aria-hidden','false')}});
});
const methodSteps=[...document.querySelectorAll('.method-list article')];let hoveredMethod=null;
function editorialScroll(){
 if(methodSteps.length){let chosen=0;methodSteps.forEach((el,i)=>{if(el.getBoundingClientRect().top<innerHeight*.55)chosen=i});if(hoveredMethod!==null)chosen=hoveredMethod;methodSteps.forEach((el,i)=>el.classList.toggle('is-current',i===chosen));updateMethodConsole(chosen)}
 if(paused)return;
 const mark=document.querySelector('.manifesto-mark');if(mark)mark.style.setProperty('--mark-angle',(-15+Math.min(scrollY,900)*.05)+'deg');
 document.querySelectorAll('.crew-card').forEach(el=>{const y=Math.max(0,Math.min(24,(el.getBoundingClientRect().top-innerHeight*.65)*.06));el.style.setProperty('--crew-y',y+'px')});
}addEventListener('scroll',editorialScroll,{passive:true});editorialScroll();
if(form){
 const labels=['Tu proyecto.','El momento.','El lugar.','Hablemos.'];
 function updateStage(){const visible=[...form.querySelectorAll('.brief-step')].findIndex(el=>!el.hidden),i=Math.max(0,visible);document.querySelector('.stage-number').textContent=String(i+1).padStart(2,'0');document.querySelector('.stage-title').textContent=labels[i];document.querySelectorAll('.stage-dots i').forEach((el,n)=>el.classList.toggle('on',n<=i));const selected=form.querySelector('[name="tipo"]:checked');document.querySelector('.contact-selection').textContent=selected?selected.value:'Toda gran experiencia empieza con una idea.'}
 new MutationObserver(updateStage).observe(document.querySelector('#step-count'),{childList:true});form.addEventListener('change',updateStage);updateStage();
}

function updateMethodConsole(index){const box=document.querySelector('.method-media');if(!box)return;box.dataset.active=String(index);box.querySelectorAll('[data-slide]').forEach((el,i)=>{el.classList.toggle('is-visible',i===index);el.setAttribute('aria-hidden',String(i!==index))});box.querySelector('.method-media-label').textContent=String(index+1).padStart(2,'0')+' — '+methodSteps[index].querySelector('h3').textContent;document.querySelectorAll('[data-method]').forEach((el,i)=>el.setAttribute('aria-pressed',String(index===i)));syncAboutVideo()}

function goToMethod(index){const el=methodSteps[index];if(!el)return;el.scrollIntoView({behavior:paused?'auto':'smooth',block:'center'});el.focus({preventScroll:true});updateMethodConsole(index)}
document.querySelectorAll('[data-method]').forEach(button=>button.addEventListener('click',()=>goToMethod(Number(button.dataset.method))));const nextMethod=document.querySelector('.method-next');if(nextMethod)nextMethod.addEventListener('click',()=>goToMethod((Number(document.querySelector('.method-console').dataset.current||0)+1)%4));

methodSteps.forEach((el,i)=>{function activate(){hoveredMethod=i;methodSteps.forEach((row,n)=>row.classList.toggle('is-current',n===i));updateMethodConsole(i)}el.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')activate()});el.addEventListener('pointerleave',()=>{hoveredMethod=null});el.addEventListener('focus',activate);el.addEventListener('blur',()=>{hoveredMethod=null});el.addEventListener('click',activate);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}})});
function syncAboutVideo(){document.querySelectorAll('.about-film,video.method-slide').forEach(video=>{const rect=video.getBoundingClientRect(),visible=rect.bottom>0&&rect.top<innerHeight&&rect.width>0;const shouldPlay=!paused&&!document.hidden&&visible&&(video.classList.contains('about-film')||video.classList.contains('is-visible'));if(shouldPlay){if(video.paused)video.play().catch(()=>{})}else video.pause()})}
new MutationObserver(syncAboutVideo).observe(document.body,{attributes:true,attributeFilter:['class']});addEventListener('scroll',syncAboutVideo,{passive:true});document.addEventListener('visibilitychange',syncAboutVideo);syncAboutVideo();

// Contact cards retain native keyboard/touch disclosure when motion is paused.
document.querySelectorAll('.channel-card').forEach(card=>{
 card.addEventListener('pointermove',e=>{
  if(paused||e.pointerType==='touch')return;
  const r=card.getBoundingClientRect();
  card.style.setProperty('--card-rx',((.5-(e.clientY-r.top)/r.height)*3)+'deg');
  card.style.setProperty('--card-ry',(((e.clientX-r.left)/r.width-.5)*3)+'deg');
 });
 card.addEventListener('pointerleave',()=>{card.style.removeProperty('--card-rx');card.style.removeProperty('--card-ry')});
});
