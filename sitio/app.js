'use strict';
const canvas=document.querySelector('#space'),ctx=canvas.getContext('2d'),universe=document.querySelector('#universo'),nodesEl=document.querySelector('#nodes'),detail=document.querySelector('#detail');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let paused=reduce,w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio,2),mx=0,my=0,px=0,py=0,time=0,last=0,selected=null,group='all';
const data=[["BBC Brands | Experiencias", "Estrategia, creatividad y medios para conectar marcas con personas a través de experiencias integrales e inmersivas.", 0, 0.27, 0.43, 0.5, 0.15, true], ["Marketing 360", "Integramos estrategia, comunicación y acciones de marca para conectar cada punto de contacto con un mismo objetivo.", 0, 0.14, 0.23, 0.5, 0.24], ["Central de medios", "Planificamos y coordinamos medios y canales para llevar el mensaje de cada marca a las audiencias adecuadas.", 0, 0.4, 0.24, 0.5, 0.33], ["Experiencias inmersivas", "Combinamos creatividad, espacios y tecnología para que las personas vivan la marca y participen en su historia.", 0, 0.17, 0.65, 0.5, 0.42], ["Creatividad", "Desarrollamos conceptos, ideas y narrativas que dan identidad a las campañas y convierten los objetivos de marca en experiencias.", 0, 0.43, 0.57, 0.5, 0.51], ["Black Bear | Servicios", "Eventos, promotoría y talento artístico: coordinación y ejecución para llevar cada experiencia a la vida real.", 1, 0.73, 0.43, 0.5, 0.61, true], ["Eventos", "Producimos y coordinamos eventos, desde la planeación y el montaje hasta la operación y la ejecución en campo.", 1, 0.65, 0.22, 0.5, 0.69], ["Promotoría", "Coordinamos personal de campo para representar a las marcas, acercar sus productos al público y acompañar sus activaciones.", 1, 0.88, 0.28, 0.5, 0.77], ["Talento artístico", "Gestionamos y coordinamos talento artístico para integrar entretenimiento y presentaciones en eventos y experiencias de marca.", 1, 0.77, 0.65, 0.5, 0.85]];
const buttons=data.map((d,i)=>{const b=document.createElement('button');b.className='node '+(d[2]?'purple ':'')+(d[7]?'core':'');b.textContent=d[7]?(d[2]?"Black Bear":"BBC Brands"):d[0];b.addEventListener('pointerenter',()=>activate(i));b.addEventListener('focus',()=>activate(i));b.addEventListener('click',()=>activate(i));nodesEl.append(b);return b});
function activate(i){selected=i;buttons.forEach((b,j)=>b.classList.toggle('active',j===i))}
function setGroup(g){group=g;selected=null;buttons.forEach((b,j)=>{b.classList.remove('active');b.classList.toggle('dim',g!=='all'&&String(data[j][2])!==g)});document.querySelectorAll('[data-group]').forEach(b=>{const on=b.dataset.group===g;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))})}
document.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>setGroup(b.dataset.group));document.querySelectorAll('[data-select-group]').forEach(a=>a.onclick=()=>setGroup(a.dataset.selectGroup));setGroup('all');
const toggle=document.createElement('button');function motionUI(){document.body.classList.toggle('paused',paused)}motionUI();
let seed=724;function rand(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
// A single, irregular 3D field; service labels belong to this same mesh.
const stars=Array.from({length:500},()=>({x:(rand()-.5)*5.4,y:(rand()-.5)*3.5,z:(rand()-.5)*2.8,r:rand()}));
const field=Array.from({length:165},()=>({x:(rand()-.5)*4.8,y:(rand()-.5)*2.9,z:(rand()-.5)*2,phase:rand()*6.28}));
const serviceWorld=data.map((d,i)=>({x:(d[3]-.5)*3.7,y:(d[4]-.46)*2.9,z:[.1,-.35,.6,-.5,.3,-.15,.5,-.2,.45,-.45,.1,.5,-.15,-.55,.25][i],phase:i*.8}));
const full=[...field,...serviceWorld];const edges=[];
for(let i=0;i<full.length;i++){const a=full[i];const near=full.map((b,j)=>({j,d:(a.x-b.x)**2+(a.y-b.y)**2+(a.z-b.z)**2*.3})).filter(n=>n.j!==i).sort((a,b)=>a.d-b.d).slice(0,i>=field.length?7:3);for(const n of near){if(n.j>i||i>=field.length)edges.push([i,n.j])}}
const gestures=document.querySelector('#gestures'),gx=gestures.getContext('2d'),cursor=document.querySelector('#cursor');let stamps=[],path=[],pointerX=-100,pointerY=-100,stampX=-100,stampY=-100,pointerActive=false,lightSurface=false,lastPointer=0;
function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio,2);for(const c of [canvas,gestures]){c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px'}ctx.setTransform(dpr,0,0,dpr,0,0);gx.setTransform(dpr,0,0,dpr,0,0)}addEventListener('resize',resize);resize();
document.addEventListener('pointermove',e=>{mx=(e.clientX/w-.5)*2;my=(e.clientY/h-.5)*2;pointerX=e.clientX;pointerY=e.clientY;pointerActive=e.pointerType!=='touch';lightSurface=false;if(pointerActive){cursor.style.opacity='1';cursor.style.transform=`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;if(!paused){const now=performance.now();if(now-lastPointer>12){path.push({x:e.clientX,y:e.clientY,t:now});lastPointer=now}if(Math.hypot(e.clientX-stampX,e.clientY-stampY)>52&&!lightSurface){stamps.push({x:e.clientX,y:e.clientY,t:now,rot:Math.atan2(e.clientY-stampY,e.clientX-stampX),type:Math.floor(rand()*2)});stampX=e.clientX;stampY=e.clientY;}}}});
document.addEventListener('pointerleave',()=>{cursor.style.opacity='0';pointerActive=false});
function line(a,b,color,width=1){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
let yaw=0,pitch=0,scrollCamera=0;
function project(p,centerY,scale){const x1=p.x*Math.cos(yaw)-p.z*Math.sin(yaw),z1=p.x*Math.sin(yaw)+p.z*Math.cos(yaw);const y1=p.y*Math.cos(pitch)-z1*Math.sin(pitch),z2=p.y*Math.sin(pitch)+z1*Math.cos(pitch);const f=3.8/(3.8-z2);return{x:w*.5+x1*scale*f,y:centerY+y1*scale*f,z:z2,f}}
let previousScroll=scrollY;function frame(now){requestAnimationFrame(frame);if(document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!paused)time+=dt;
px+=(mx-px)*.045;py+=(my-py)*.045;const mobile=w<=800;const r=universe.getBoundingClientRect();const visible=r.top<h&&r.bottom>0;const inWorld=clamp((h-r.top)/h,0,1);scrollCamera+=(clamp((scrollY-universe.offsetTop)/Math.max(1,h),-.8,.8)-scrollCamera)*.045;
yaw=paused?0:px*.22+scrollCamera*.12+Math.sin(time*.035)*.065;pitch=paused?0:-py*.09+Math.cos(time*.028)*.035;
canvas.style.opacity=visible?'1':'0';ctx.clearRect(0,0,w,h);const centerY=visible?r.top+(r.height-90)*.5:h*.53;const scale=mobile?w*.34:Math.min(w*.27,r.height*.58);const fade=visible?1:.42;
for(const star of stars){const p=project(star,visible?centerY:h*.5,Math.max(w,h)*.36);if(p.x<0||p.x>w||p.y<0||p.y>h)continue;ctx.beginPath();ctx.arc(p.x,p.y,(star.r*.9+.25)*p.f,0,7);ctx.fillStyle=`rgba(235,235,235,${clamp((p.z+2.2)/5,.15,.8)*fade})`;ctx.fill()}
const projected=full.map(p=>project(p,centerY,scale));
// Mobile uses stable readable label rows, connected into the spatial field.
for(let i=0;i<data.length;i++){let p=projected[field.length+i];if(!visible&&!mobile){p=project(serviceWorld[i],centerY,scale);projected[field.length+i]=p}const b=buttons[i];if(mobile){p.x=data[i][5]*w;p.y=r.top+70+data[i][6]*(r.height-180);p.z=0;p.f=1}const half=b.offsetWidth/2+16;p.x=clamp(p.x,half,w-half);if(!mobile)p.y=clamp(p.y,r.top+100,r.bottom-170);b.style.left=p.x+'px';b.style.top=(p.y-r.top)+'px';b.style.fontSize=mobile?(data[i][7]?20:12)+'px':clamp((data[i][7]?26:15)*p.f,data[i][7]?23:13,data[i][7]?34:20)+'px';}
for(const [i,j]of edges){const a=projected[i],b=projected[j];if((a.y<0&&b.y<0)||(a.y>h&&b.y>h))continue;const alpha=clamp((a.z+b.z+3.8)/23,.05,.25)*fade;line(a,b,`rgba(205,205,205,${alpha})`,.55)}
for(let i=0;i<projected.length;i++){const p=projected[i];if(p.x<0||p.x>w||p.y<0||p.y>h)continue;ctx.beginPath();ctx.arc(p.x,p.y,i>=field.length?2:clamp(p.f,.6,1.7),0,7);ctx.fillStyle=`rgba(230,230,230,${i>=field.length?.8:.4*fade})`;ctx.fill()}
// Cursor leaves sparse geometric impressions on dark surfaces and a fluid ribbon on light ones.
gx.clearRect(0,0,w,h);stamps=stamps.filter(s=>now-s.t<900);path=path.filter(p=>now-p.t<650);if(!paused){for(const s of stamps){const life=1-(now-s.t)/900;const size=24+12*(1-life);gx.save();gx.translate(s.x,s.y);gx.rotate(s.rot*.3);gx.strokeStyle=`rgba(240,240,240,${life*.28})`;gx.lineWidth=.75;for(let k=0;k<4;k++){const a=size-k*5;if(s.type===0){gx.strokeRect(-a/2,-a/2,a,a)}else if(s.type===1){gx.beginPath();gx.moveTo(-a/2,-a/2);gx.lineTo(a/2,0);gx.lineTo(-a/2,a/2);gx.closePath();gx.stroke()}else{gx.beginPath();gx.arc(0,0,a/2,0,Math.PI*1.5);gx.stroke()}}gx.restore()}if(lightSurface&&path.length>2){for(let i=1;i<path.length;i++){const life=1-(now-path[i].t)/650;gx.beginPath();gx.moveTo(path[i-1].x,path[i-1].y);gx.lineTo(path[i].x,path[i].y);gx.strokeStyle=`rgba(235,235,235,${life*.7})`;gx.lineWidth=life*9;gx.lineCap='round';gx.stroke()}}}
const docHeight=Math.max(1,document.documentElement.scrollHeight-h);document.querySelector('.scroll-progress').style.width=(scrollY/docHeight*100)+'%';previousScroll=scrollY;}
requestAnimationFrame(frame);
const cards=[...document.querySelectorAll('.project-tv')],empty=document.querySelector('.empty-projects');
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});let count=0;cards.forEach(card=>{const show=b.dataset.filter==='all'||card.dataset.categories.split(' ').includes(b.dataset.filter);card.hidden=!show;if(show)count++;else card.querySelector('video').pause()});empty.hidden=count>0});
cards.forEach(card=>{const v=card.querySelector('video');const play=()=>{if(!paused)v.play().catch(()=>{})};const stop=()=>{v.pause();card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')};card.addEventListener('pointerenter',play);card.addEventListener('focus',play);card.addEventListener('pointerleave',stop);card.addEventListener('blur',stop);card.addEventListener('click',()=>{if(!paused)(v.paused?play():stop())});card.addEventListener('pointermove',e=>{if(paused||e.pointerType==='touch')return;const r=card.getBoundingClientRect();card.style.setProperty('--rx',(-(e.clientY-r.top-r.height/2)/r.height*2)+'deg');card.style.setProperty('--ry',((e.clientX-r.left-r.width/2)/r.width*2)+'deg')})});
const stats=document.querySelectorAll('[data-count]');const observer=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;observer.unobserve(e.target);const el=e.target,n=Number(el.dataset.count),start=performance.now();function count(t){const p=paused?1:clamp((t-start)/1300,0,1);el.textContent=(el.dataset.prefix||'')+Math.round(n*(1-Math.pow(1-p,3))).toLocaleString('en-US')+(el.dataset.suffix||'');if(p<1)requestAnimationFrame(count)}requestAnimationFrame(count)}},{threshold:.6});stats.forEach(s=>observer.observe(s));
const brands=[["revlon", "Revlon"], ["red-bull", "Red Bull"], ["kelloggs", "Kellogg’s"], ["jumex", "Grupo Jumex"], ["lala", "Lala"], ["rappi", "Rappi"], ["walmart", "Walmart"], ["bachoco", "Bachoco"], ["bimbo", "Grupo Bimbo"], ["adidas", "Adidas"]];
const clientLogo=document.querySelector('#client-logo-active');let activeBrand=0,brandTimer=null;function brandSource(file){return'assets/partners/'+file+'.svg'}function showNextBrand(){if(!clientLogo)return;clientLogo.classList.add('is-changing');setTimeout(()=>{activeBrand=(activeBrand+1)%brands.length;const[file,name]=brands[activeBrand];clientLogo.src=brandSource(file);clientLogo.alt=name;clientLogo.dataset.brand=file;clientLogo.classList.remove('is-changing')},260)}if(clientLogo){clientLogo.dataset.brand=brands[0][0];if(!paused)brandTimer=setInterval(showNextBrand,1450)}
const heroVideo=document.querySelector('.hero-film');if(paused)heroVideo.pause();toggle.addEventListener('click',()=>{if(paused){document.querySelectorAll('video').forEach(v=>v.pause());stamps=[];path=[]}else document.querySelectorAll('.hero-film,.closing-film').forEach(v=>v.play().catch(()=>{}))});const videoObserver=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)e.target.pause();else if((e.target===heroVideo||e.target.classList.contains('closing-film'))&&!paused)e.target.play().catch(()=>{})}),{threshold:.1});document.querySelectorAll('video').forEach(v=>videoObserver.observe(v));
document.querySelectorAll('[data-proposal]').forEach(b=>b.onclick=()=>location.href='/contacto/');

cards.forEach(card=>{const video=card.querySelector('video');card.setAttribute('role','button');card.setAttribute('aria-pressed','false');card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click()}});video.addEventListener('play',()=>card.setAttribute('aria-pressed','true'));video.addEventListener('pause',()=>card.setAttribute('aria-pressed','false'))});

addEventListener("resize",motionUI);

// Cards rise over each other; the covered cards recede into the stack.
let scrollQueued=false;
function updateProjectScroll(){
 scrollQueued=false;
 const visible=cards.filter(card=>!card.hidden);
 visible.forEach((card,i)=>{
  card.style.setProperty('--stack-index',i);
  const next=visible[i+1],top=90+i*22;
  const overlap=next?clamp((innerHeight-next.getBoundingClientRect().top)/(innerHeight-top),0,1):0;
  card.style.setProperty('--stack-scale',paused?1:1-overlap*.055);
  card.style.setProperty('--stack-dim',paused?1:1-overlap*.22);
 });
}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProjectScroll)}},{passive:true});
addEventListener('resize',updateProjectScroll);
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',updateProjectScroll));
updateProjectScroll();
document.querySelectorAll('[data-social-pending]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.social-status').hidden=false}));

function sectionDrift(){if(!paused)document.querySelectorAll('.project-heading h2,.number-intro h2,.method-heading h2,.team-heading h2').forEach(el=>{const rect=el.parentElement.getBoundingClientRect();const y=Math.max(-14,Math.min(24,(rect.top-innerHeight*.4)*.055));el.style.setProperty('--heading-y',y+'px')})}addEventListener('scroll',sectionDrift,{passive:true});sectionDrift();
