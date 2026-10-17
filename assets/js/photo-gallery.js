
(() => {
 const buttons=[...document.querySelectorAll('[data-gallery-src]')],dialog=document.getElementById('photo-dialog');if(!dialog||!buttons.length)return;
 let index=0,opener,oldOverflow='';const img=document.getElementById('photo-large');
 function show(n){index=(n+buttons.length)%buttons.length;const b=buttons[index];img.src=b.dataset.gallerySrc;img.alt=b.dataset.galleryCaption;document.getElementById('photo-caption').textContent=img.alt;document.getElementById('photo-original').href=img.src;document.getElementById('photo-position').textContent=`Photo ${index+1} of ${buttons.length}`;}
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{if(!dialog.showModal){window.open(b.dataset.gallerySrc,'_blank','noopener');return;}opener=b;show(i);oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();document.getElementById('photo-close').focus();}));
 document.getElementById('photo-prev').onclick=()=>show(index-1);document.getElementById('photo-next').onclick=()=>show(index+1);document.getElementById('photo-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;opener?.focus();});dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
 let startX=0,startY=0;img.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;startY=e.changedTouches[0].clientY;},{passive:true});img.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))show(index+(dx<0?1:-1));},{passive:true});
})();
