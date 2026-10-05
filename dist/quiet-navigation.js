(()=>{
 const button=document.querySelector('.header-whatsapp');
 const note=document.querySelector('#header-whatsapp-note');
 if(!button||!note)return;
 const close=()=>{note.hidden=true;button.setAttribute('aria-expanded','false')};
 button.addEventListener('click',()=>{const open=note.hidden;note.hidden=!open;button.setAttribute('aria-expanded',String(open))});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
 document.addEventListener('click',event=>{if(!button.contains(event.target)&&!note.contains(event.target))close()});
})();
