/* A bounded brand entrance: never blocks scrolling, navigation or video errors. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const header=document.querySelector('body > header'),universe=document.querySelector('#universo');
 function navigation(){const visible=true;header.classList.toggle('is-revealed',visible);header.inert=!visible}
 navigation();addEventListener('scroll',navigation,{passive:true});addEventListener('resize',navigation);addEventListener('pageshow',navigation);
 if(reduced||location.hash||scrollY>30)return;
 const cover=document.createElement('div');cover.className='brand-entrance';cover.setAttribute('aria-hidden','true');
 cover.innerHTML='<div class="brand-intro-stage"><img src="/assets/bbc-brands.svg" alt=""><img src="/assets/black-bear.svg" alt=""></div>';
 document.body.append(cover);
 const film=document.querySelector('.hero-film');
 let finished=false;
 const finish=()=>{if(finished)return;finished=true;cover.classList.add('is-leaving');setTimeout(()=>cover.remove(),900)};
 const ready=new Promise(resolve=>{if(film.readyState>=2)return resolve();film.addEventListener('loadeddata',resolve,{once:true});film.addEventListener('error',resolve,{once:true});setTimeout(resolve,2600)});
 Promise.all([ready,new Promise(resolve=>setTimeout(resolve,2800))]).then(finish);
 setTimeout(finish,3000);addEventListener('pagehide',()=>cover.remove(),{once:true});
})();
