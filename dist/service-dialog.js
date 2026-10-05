(()=>{
 const services={"Eventos": {"description": "Capturamos la esencia de cada experiencia, desde eventos corporativos hasta encuentros exclusivos de networking, transformando cada momento en una herramienta de posicionamiento para tu marca.", "items": ["Networking premium", "Eventos corporativos", "Lanzamientos de marca", "Conferencias y congresos", "Ferias y exposiciones", "Workshops y capacitaciones"]}, "Promotoría": {"description": "Buscamos conectar a la marca con el consumidor dentro de tiendas departamentales y de autoservicio, generando una experiencia relevante en el punto de venta que impulse la interacción y favorezca la conversión.", "items": ["Revisión de inventarios", "Logística", "Anaqueleo", "Canvaseo", "Muestreo", "Reporteo", "Conversión", "Investigación de mercado"]}, "Talento artístico": {"description": "Seleccionamos y coordinamos talento que eleva la experiencia de cada evento, generando momentos auténticos que fortalecen la conexión entre las marcas y su audiencia.", "items": ["Artistas nacionales e internacionales", "DJs y música en vivo", "Speakers y conferencistas", "Maestros de ceremonia", "Influencers y embajadores de marca", "Shows y performances", "Entretenimiento corporativo"]}, "Central de medios": {"description": "Amplificar la presencia de la marca a través de medios de alto alcance, integrando televisión, radio, exteriores, sports y otros formatos estratégicos para generar visibilidad, recordación y conexión con audiencias.", "items": ["TV (abierta y paga)", "Radio", "Medios impresos", "OOH", "Programmatic", "DOOH"]}, "Experiencias inmersivas": {"description": "Integramos tecnología para convertir al público en parte activa de la experiencia, creando interacciones que sorprenden y generan conexión.", "items": ["Experiencias gamificadas", "Activaciones digitales", "AR", "VR", "XR", "IA", "Experiencias con sensores", "Proyección", "Entornos inmersivos"]}, "Creatividad": {"description": "Desarrollamos conceptos e ideas que traducen la esencia de cada marca en experiencias relevantes, creando mensajes memorables que conectan con la audiencia y generan impacto.", "items": ["Creatividad estratégica", "Inbound marketing", "Comunicación corporativa", "Activación estratégica de patrocinios", "Identidad de marca", "Shopper marketing"]}, "Marketing 360": {"description": "Integramos estrategia, comunicación y acciones de marca para conectar cada punto de contacto con un mismo objetivo.", "items": []}};
 const dialog=document.querySelector('#service-dialog');
 const title=dialog.querySelector('h2'),description=dialog.querySelector('#service-dialog-description'),section=dialog.querySelector('.service-development'),list=section.querySelector('ul');
 let trigger=null,previousOverflow='',closing=false,opening=null,anchor=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=(value,min,max)=>Math.max(min,Math.min(value,max));
 function position(){
  if(!dialog.open||!anchor)return;
  const margin=16,gap=18,w=innerWidth,h=innerHeight;
  const header=document.querySelector('.brand-navigation')?.getBoundingClientRect();
  const topEdge=Math.min(h-120,Math.max(margin,(header?.bottom||0)+12));
  dialog.style.maxHeight=Math.max(100,h-topEdge-margin)+'px';
  const width=dialog.offsetWidth,height=dialog.offsetHeight;
  let x=anchor.left+anchor.width/2-width/2;
  let y=anchor.bottom+gap;
  if(y+height>h-margin){
   const above=anchor.top-gap-height;
   if(above>=topEdge)y=above;
   else {x=anchor.left<w/2?anchor.right+gap:anchor.left-width-gap;y=anchor.top+anchor.height/2-height/2;}
  }
  x=clamp(x,margin,w-width-margin);y=clamp(y,topEdge,h-height-margin);
  dialog.style.left=x+'px';dialog.style.top=y+'px';
  dialog.style.transformOrigin=clamp(anchor.left+anchor.width/2-x,0,width)+'px '+clamp(anchor.top+anchor.height/2-y,0,height)+'px';
 }
 function close(){
  if(!dialog.open||closing)return;closing=true;opening?.cancel();dialog.classList.remove('is-visible');
  const end=()=>{dialog.close();closing=false};
  if(reduced.matches){end();return}
  const animation=dialog.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.98)'}],{duration:180,easing:'ease-out',fill:'forwards'});
  animation.finished.then(()=>{end();animation.cancel()});
 }
 for(const button of document.querySelectorAll('#nodes .node:not(.core)')){
  const entry=services[button.textContent.trim()];if(!entry)continue;
  button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','service-dialog');
  button.addEventListener('click',()=>{
   if(dialog.open)return;
   trigger=button;anchor=button.getBoundingClientRect();title.textContent=button.textContent;description.textContent=entry.description;
   list.replaceChildren(...entry.items.map(text=>{const li=document.createElement('li');li.textContent=text;return li}));section.hidden=entry.items.length===0;
   previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();position();
   dialog.classList.add('is-visible');
   if(!reduced.matches)opening=dialog.animate([{opacity:0,transform:'translateY(8px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
   dialog.querySelector('button').focus({preventScroll:true});
  });
 }
 dialog.querySelector('.service-dialog-close').addEventListener('click',close);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close()}});
 dialog.addEventListener('close',()=>{dialog.classList.remove('is-visible');document.body.style.overflow=previousOverflow;trigger?.focus({preventScroll:true})});
 addEventListener('resize',()=>{if(dialog.open){anchor=trigger.getBoundingClientRect();position()}});
})();
