(()=>{const paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
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


function updateMethodConsole(index){const box=document.querySelector('.method-media');if(!box)return;box.dataset.active=String(index);box.querySelectorAll('[data-slide]').forEach((el,i)=>{el.classList.toggle('is-visible',i===index);el.setAttribute('aria-hidden',String(i!==index))});document.querySelectorAll('[data-method]').forEach((el,i)=>el.setAttribute('aria-pressed',String(index===i)));syncAboutVideo()}

function goToMethod(index){const el=methodSteps[index];if(!el)return;el.scrollIntoView({behavior:paused?'auto':'smooth',block:'center'});el.focus({preventScroll:true});updateMethodConsole(index)}
document.querySelectorAll('[data-method]').forEach(button=>button.addEventListener('click',()=>goToMethod(Number(button.dataset.method))));const nextMethod=document.querySelector('.method-next');if(nextMethod)nextMethod.addEventListener('click',()=>goToMethod((Number(document.querySelector('.method-console').dataset.current||0)+1)%4));

methodSteps.forEach((el,i)=>{function activate(){hoveredMethod=i;methodSteps.forEach((row,n)=>row.classList.toggle('is-current',n===i));updateMethodConsole(i)}el.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')activate()});el.addEventListener('pointerleave',()=>{hoveredMethod=null});el.addEventListener('focus',activate);el.addEventListener('blur',()=>{hoveredMethod=null});el.addEventListener('click',activate);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}})});
function syncAboutVideo(){document.querySelectorAll('.about-film,video.method-slide,.history-film').forEach(video=>{const rect=video.getBoundingClientRect(),visible=rect.bottom>0&&rect.top<innerHeight&&rect.width>0;const shouldPlay=!paused&&!document.hidden&&visible&&(video.classList.contains('about-film')||video.classList.contains('is-visible')||(video.classList.contains('history-film')&&video.closest('details').open));if(shouldPlay){if(video.paused)video.play().catch(()=>{})}else video.pause()})}
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
const crew=[...document.querySelectorAll('.crew-card')];
let activeCrew=0;
function showCrew(index){
 activeCrew=(index+crew.length)%crew.length;
 crew.forEach((card,i)=>{
  let offset=(i-activeCrew+crew.length)%crew.length;
  if(offset>crew.length/2)offset-=crew.length;
  card.style.setProperty('--offset',offset);
  card.style.setProperty('--depth',Math.min(Math.abs(offset),2));
  card.style.opacity=Math.abs(offset)>2?'0':'1';
  card.style.pointerEvents=Math.abs(offset)>2?'none':'auto';
  card.setAttribute('aria-hidden',String(Math.abs(offset)>2));
  card.classList.toggle('is-active',offset===0);
  card.querySelector('.crew-toggle').tabIndex=offset===0?0:-1;
 });
 const label=document.querySelector('.team-position');
 if(label)label.textContent=String(activeCrew+1).padStart(2,'0')+' / '+String(crew.length).padStart(2,'0');
}
if(crew.length){
 showCrew(0);
 document.querySelectorAll('[data-team-step]').forEach(b=>b.addEventListener('click',()=>showCrew(activeCrew+Number(b.dataset.teamStep))));
 crew.forEach((card,i)=>card.addEventListener('click',e=>{if(i!==activeCrew){e.stopImmediatePropagation();showCrew(i)}},true));
 const grid=document.querySelector('.team-grid');
 grid.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showCrew(activeCrew+(e.key==='ArrowRight'?1:-1));crew[activeCrew].querySelector('button').focus()}});
 let touchX=null;
 grid.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX},{passive:true});
 grid.addEventListener('touchend',e=>{if(touchX!==null&&Math.abs(e.changedTouches[0].clientX-touchX)>45)showCrew(activeCrew+(e.changedTouches[0].clientX<touchX?1:-1));touchX=null},{passive:true});
}
/* Contrast follows the actual contact panel beneath the BBC symbol. */
function syncBrandContrast(){
 const brand=document.querySelector('.contact-shell .brand-motion-bbc');
 const panel=document.querySelector('.brief-panel');
 if(!brand||!panel)return;
 const a=brand.getBoundingClientRect(),b=panel.getBoundingClientRect();
 const x=a.right-25,y=a.top+a.height/2;
 brand.classList.toggle('on-light',x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom);
}
addEventListener('scroll',syncBrandContrast,{passive:true});
addEventListener('resize',syncBrandContrast);
syncBrandContrast();

document.querySelectorAll('.history details').forEach(item=>item.addEventListener('toggle',syncAboutVideo));

const form=document.querySelector('#simple-contact');
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const status=document.querySelector('#contact-status'),button=form.querySelector('[type=submit]');
 button.disabled=true;status.textContent='Enviando…';
 try{
  const config=await fetch('/contact-config.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()});
  if(!config.submitEndpoint){status.textContent='El envío aún no está habilitado. El canal de recepción está pendiente de configuración.';return}
  const values=new FormData(form);const payload=Object.fromEntries(values);payload.servicios=values.getAll('servicios');
  const response=await fetch(config.submitEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error();const result=await response.json();if(result.success!==true)throw Error();
  status.textContent='Gracias. Recibimos tu mensaje.';form.reset();
 }catch{status.textContent='No pudimos enviar tu mensaje. Tus datos siguen aquí para que puedas intentarlo de nuevo.'}
 finally{button.disabled=false}
});
})();
