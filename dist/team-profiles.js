// Confirmed profile data can be supplied without replacing the carousel.
(async()=>{
 if(!document.querySelector('.team-grid'))return;
 try{
  const {profiles}={"profiles":[{"id":"01","name":null,"role":null,"bio":null,"photo":null,"linkedin":null,"playlist":null},{"id":"02","name":null,"role":null,"bio":null,"photo":null,"linkedin":null,"playlist":null},{"id":"03","name":null,"role":null,"bio":null,"photo":null,"linkedin":null,"playlist":null},{"id":"04","name":null,"role":null,"bio":null,"photo":null,"linkedin":null,"playlist":null},{"id":"05","name":null,"role":null,"bio":null,"photo":null,"linkedin":null,"playlist":null},{"id":"06","name":null,"role":null,"bio":null,"photo":null,"linkedin":null,"playlist":null}]};
  const httpsUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:null}catch{return null}};
  profiles.forEach(p=>{
   const card=[...document.querySelectorAll('[data-crew]')].find(c=>c.dataset.crew===p.id);if(!card||!p.name)return;
   card.querySelector('.crew-name').textContent=p.name;
   card.querySelector('.crew-toggle').setAttribute('aria-label','Explorar '+p.name);
   if(p.role)card.querySelector('.crew-role').textContent=p.role;
   if(p.bio)card.querySelector('.crew-back-note').textContent=p.bio;
   if(p.photo&&(p.photo.startsWith('/assets/')||httpsUrl(p.photo))){const image=card.querySelector('.crew-photo');image.src=p.photo;image.alt=p.name}
   const links=document.createElement('div');links.className='crew-profile-links';
   [['linkedin','LinkedIn'],['playlist','Escuchar su playlist ↗']].forEach(([key,label])=>{const url=httpsUrl(p[key]);if(!url)return;const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;links.append(a)});
   if(links.childElementCount)card.append(links);
  });
 }catch{/* Provisional profiles remain available when configuration is unavailable. */}
})();
