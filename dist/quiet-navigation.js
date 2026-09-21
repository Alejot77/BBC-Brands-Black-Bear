(()=>{
 const nav=document.querySelector('.quiet-nav');if(!nav)return;
 let previous=scrollY,queued=false;
 function update(){const current=scrollY;const down=current>previous+4,up=current<previous-4;if(down&&current>120&&!nav.contains(document.activeElement))nav.classList.add('is-hidden');if(up||current<120)nav.classList.remove('is-hidden');previous=current;queued=false}
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});
 nav.addEventListener('focusin',()=>nav.classList.remove('is-hidden'));
 document.addEventListener('pointermove',e=>{if(e.clientY>innerHeight-100)nav.classList.remove('is-hidden')},{passive:true});
})();
