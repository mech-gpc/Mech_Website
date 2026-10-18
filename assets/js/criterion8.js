(() => {
 document.querySelectorAll('.criterion-player').forEach(player=>{
  const image=player.querySelector('[data-support-image]'),play=player.querySelector('[data-support-play]'),select=player.querySelector('[data-support-select]'),status=player.querySelector('[data-support-status]'),full=player.querySelector('[data-support-fullscreen]');
  const count=11,motion=matchMedia('(prefers-reduced-motion: reduce)');let index=0,paused=motion.matches,timer,hover=false,focused=false,visible=true,texts=[];
  for(let n=1;n<=count;n++)select.add(new Option(String(n),String(n-1)));
  function schedule(){clearTimeout(timer);if(!paused&&!hover&&!focused&&visible&&!document.hidden)timer=setTimeout(()=>show(index+1),8000);}
  function show(n){index=(n+count)%count;image.src=`assets/criterion8/slide-${index+1}.webp`;image.alt=texts[index]||`Student Support Systems · slide ${index+1} of ${count}`;select.value=String(index);status.textContent=`Slide ${index+1} of ${count}`;schedule();const next=new Image();next.src=`assets/criterion8/slide-${(index+1)%count+1}.webp`;}
  function pause(value){paused=value;play.textContent=paused?'Play':'Pause';schedule();}
  player.querySelector('[data-support-prev]').onclick=()=>show(index-1);player.querySelector('[data-support-next]').onclick=()=>show(index+1);play.onclick=()=>pause(!paused);select.onchange=()=>show(Number(select.value));
  player.addEventListener('keydown',e=>{if(e.target.tagName==='SELECT')return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
  player.addEventListener('mouseenter',()=>{hover=true;schedule();});player.addEventListener('mouseleave',()=>{hover=false;schedule();});
  player.addEventListener('focusin',()=>{focused=true;status.setAttribute('aria-live','polite');schedule();});player.addEventListener('focusout',e=>{if(!player.contains(e.relatedTarget)){focused=false;status.setAttribute('aria-live','off');schedule();}});
  document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',e=>{if(e.matches)pause(true);});if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();}).observe(player);
  if(!player.requestFullscreen)full.hidden=true;else full.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await player.requestFullscreen();}catch{status.textContent='Full screen unavailable in this browser.';}};
  let x=0,y=0;image.addEventListener('touchstart',e=>{x=e.changedTouches[0].clientX;y=e.changedTouches[0].clientY;},{passive:true});image.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))show(index+(dx<0?1:-1));},{passive:true});
  image.addEventListener('error',()=>{status.textContent=`Unable to load slide ${index+1}. Download the presentation or read the transcript below.`;pause(true);});
  fetch('assets/criterion8/slides.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(data=>{texts=data;image.alt=texts[index]||image.alt;}).catch(()=>{});
  player.querySelector('.criterion-controls').hidden=false;status.textContent='Slide 1 of 11';pause(paused);
 });
})();
