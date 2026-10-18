(() => {
 document.querySelectorAll('.records-block').forEach(block=>{
  const search=block.querySelector('[data-record-search]'),year=block.querySelector('[data-record-year]');if(!search||!year)return;
  const rows=[...block.querySelectorAll('tbody tr')],count=block.querySelector('[data-record-count]'),empty=block.querySelector('.records-empty');
  const years=[...new Set(rows.map(row=>row.dataset.year).filter(Boolean))].sort().reverse();years.forEach(y=>year.add(new Option(y,y)));if(!years.length)year.closest('label').hidden=true;
  function update(){const query=search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);let shown=0;rows.forEach(row=>{const text=row.textContent.toLowerCase();const on=(!year.value||row.dataset.year===year.value)&&query.every(word=>text.includes(word));row.hidden=!on;if(on)shown++;});count.textContent=`${shown} of ${rows.length} records`;empty.hidden=shown>0;}
  search.addEventListener('input',update);year.addEventListener('change',update);update();
 });
 const path=location.pathname.split('/').pop();document.querySelectorAll('.opportunity-nav a').forEach(a=>{if(a.getAttribute('href')===path||(path==='placement.html'&&a.getAttribute('href')==='tpo.html'))a.setAttribute('aria-current','page');});
})();
