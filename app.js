// SEM AUTO storefront — only vehicles saved in Supabase are displayed.
const $ = id => document.getElementById(id);
let cars = [], category = '', sb = null;
const money = n => new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(Number(n)||0);
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const list=cars.filter(c=>(!category||c.body_type===category)&&(!$('brand').value||c.brand===$('brand').value)&&(!$('model').value||(c.model+' '+(c.trim_name||'')).toLocaleLowerCase('tr').includes($('model').value.toLocaleLowerCase('tr')))&&(!$('fuel').value||c.fuel_type===$('fuel').value)&&(!$('gear').value||c.transmission===$('gear').value)&&(!$('price').value||Number(c.price)<=Number($('price').value)));
 $('count').textContent=list.length+' ARAÇ';$('empty').hidden=list.length>0;
 $('grid').innerHTML=list.length?list.map(c=>'<article class="car '+(c.status==='satildi'?'is-sold':'')+'"><div class="photo" style="background-image:url(&quot;'+esc(c.cover_image_url||'')+'&quot;)"><span class="tag">'+esc(c.body_type||'Araç').toLocaleUpperCase('tr')+'</span>'+(c.status==='satildi'?'<span class="sold-ribbon">SATILDI</span>':'')+'</div><div class="carbody"><h3>'+esc(c.brand)+' '+esc(c.model)+'</h3><div class="subtitle">'+esc(c.trim_name||'')+' '+(c.model_year||'')+' MODEL • '+esc(c.fuel_type)+' • '+esc(c.transmission)+'</div><div class="specs"><div><span>Yıl</span><b>'+esc(c.model_year)+'</b></div><div><span>Kilometre</span><b>'+Number(c.mileage_km||0).toLocaleString('tr-TR')+' km</b></div><div><span>Vites</span><b>'+esc(c.transmission)+'</b></div></div><div class="price">'+money(c.price)+'</div><button class="detail" data-car="'+cars.indexOf(c)+'">DETAYLAR ↗</button></div></article>').join(''):'<p class="empty">Henüz vitrine eklenmiş araç bulunmuyor.</p>';
 const brands=[...new Set(cars.map(c=>c.brand).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));const selected=$('brand').value;
 $('brand').innerHTML='<option value="">Tüm markalar</option>'+brands.map(b=>'<option value="'+esc(b)+'">'+esc(b)+'</option>').join('');$('brand').value=selected;
 document.querySelectorAll('[data-car]').forEach(b=>b.onclick=()=>showDetail(Number(b.dataset.car)));
}
let lightboxImages=[],lightboxIndex=0;
function ensureLightbox(){
 if(document.getElementById('imageLightbox'))return;
 const box=document.createElement('div');box.id='imageLightbox';box.className='image-lightbox';box.innerHTML='<button class="lightbox-close" type="button" aria-label="Kapat">×</button><button class="lightbox-prev" type="button" aria-label="Önceki fotoğraf">‹</button><img class="lightbox-image" alt="Araç fotoğrafı"><button class="lightbox-next" type="button" aria-label="Sonraki fotoğraf">›</button><div class="lightbox-count"></div>';
 document.body.appendChild(box);
 box.querySelector('.lightbox-close').onclick=closeLightbox;
 box.querySelector('.lightbox-prev').onclick=()=>stepLightbox(-1);
 box.querySelector('.lightbox-next').onclick=()=>stepLightbox(1);
 box.addEventListener('click',e=>{if(e.target===box)closeLightbox()});
}
function openLightbox(index){
 if(!lightboxImages.length)return;
 ensureLightbox();lightboxIndex=(index+lightboxImages.length)%lightboxImages.length;
 const box=$('imageLightbox'),img=box.querySelector('.lightbox-image');
 img.src=lightboxImages[lightboxIndex];box.querySelector('.lightbox-count').textContent=(lightboxIndex+1)+' / '+lightboxImages.length;
 box.classList.add('open');document.body.classList.add('lightbox-active');
}
function stepLightbox(direction){openLightbox(lightboxIndex+direction)}
function closeLightbox(){const box=$('imageLightbox');if(box)box.classList.remove('open');document.body.classList.remove('lightbox-active')}
document.addEventListener('keydown',e=>{
 const box=$('imageLightbox');if(!box?.classList.contains('open'))return;
 if(e.key==='Escape')closeLightbox();if(e.key==='ArrowRight')stepLightbox(1);if(e.key==='ArrowLeft')stepLightbox(-1);
});
function partReport(c){const st={...(c.part_condition||{})},labels={original:'Orijinal',replaced:'Değişen',painted:'Boyalı',local:'Lokal Boyalı'},names=['Kaput','Tavan','Bagaj','Ön tampon','Arka tampon','Ön panel','Arka panel','Sol ön çamurluk','Sağ ön çamurluk','Sol ön kapı','Sağ ön kapı','Sol arka kapı','Sağ arka kapı','Sol arka çamurluk','Sağ arka çamurluk'];if(!Object.keys(st).length){(c.replaced_parts||[]).forEach(n=>st[n]='replaced');(c.painted_parts||[]).forEach(n=>{if(!st[n])st[n]='painted'})}const paths={'Kaput':'M133 150 Q210 128 287 150 L300 255 Q210 275 120 255Z','Tavan':'M132 275 Q210 258 288 275 L282 438 Q210 452 138 438Z','Bagaj':'M138 452 Q210 465 282 452 L294 520 Q210 545 126 520Z','Ön tampon':'M150 28 Q210 10 270 28 L292 58 Q210 78 128 58Z','Arka tampon':'M126 535 Q210 558 294 535 L272 582 Q210 600 148 582Z','Ön panel':'M70 92 Q93 78 119 85 L130 155 L78 170Z','Arka panel':'M78 475 L130 490 L119 545 Q93 552 70 535Z','Sol ön çamurluk':'M78 175 L125 165 L132 258 L78 250Z','Sağ ön çamurluk':'M295 165 L342 175 L342 250 L288 258Z','Sol ön kapı':'M78 265 L132 270 L132 350 L78 350Z','Sağ ön kapı':'M288 270 L342 265 L342 350 L288 350Z','Sol arka kapı':'M78 358 L132 358 L132 438 L78 438Z','Sağ arka kapı':'M288 358 L342 358 L342 438 L288 438Z','Sol arka çamurluk':'M78 445 L132 448 L130 485 L78 470Z','Sağ arka çamurluk':'M288 448 L342 445 L342 470 L290 485Z'};return '<section class="part-report"><h4>BOYA, DEĞİŞEN VE EKSPERTİZ BİLGİSİ</h4><div class="part-legend"><span><i class="original"></i>Orijinal</span><span><i class="replaced"></i>Değişen</span><span><i class="painted"></i>Boyalı</span><span><i class="local"></i>Lokal Boyalı</span></div><div class="part-report-layout"><svg viewBox="0 0 420 620" role="img" aria-label="Araç ekspertiz parça şeması"><path class="car-outline" d="M150 24 Q210 8 270 24 Q305 42 320 95 L345 170 L345 455 Q335 520 292 555 Q210 585 128 555 Q85 520 75 455 L75 170 L100 95 Q115 42 150 24Z"/><path class="car-glass" d="M150 82 Q210 58 270 82 L286 145 Q210 162 134 145Z"/><path class="car-glass" d="M135 485 Q210 502 285 485 L270 535 Q210 553 150 535Z"/><path class="car-center" d="M132 265 Q210 250 288 265 L282 445 Q210 460 138 445Z"/>'+names.map(n=>'<path class="part-shape state-'+(st[n]||'original')+'" d="'+paths[n]+'"><title>'+n+': '+labels[st[n]||'original']+'</title></path>').join('')+'<path class="car-detail" d="M120 258 Q210 280 300 258 M132 270H288 M138 445H282 M76 255L132 265 M288 265L344 255 M76 350H132 M288 350H344 M76 440H132 M288 440H344"/>'+[ [94,180],[326,180],[94,440],[326,440] ].map(([x,y])=>'<circle class="car-wheel" cx="'+x+'" cy="'+y+'" r="28"/>').join('')+'</svg><div class="part-report-list">'+names.map(n=>'<div class="part-report-row"><span>'+n+'</span><b class="state-'+(st[n]||'original')+'">'+labels[st[n]||'original']+'</b></div>').join('')+'</div></div></section>'}
function showDetail(i){
 const c=cars[i];if(!c)return;
 lightboxImages=[c.cover_image_url,...(Array.isArray(c.gallery_urls)?c.gallery_urls:[])].filter(Boolean);
 const title=[c.brand,c.model,c.trim_name].filter(Boolean).join(' ');
 $('mtitle').textContent=title;
 const hero=lightboxImages[0]||'';
 const thumbs=lightboxImages.slice(1).map((url,n)=>'<button type="button" class="detail-thumb" data-image-index="'+(n+1)+'"><img src="'+esc(url)+'" alt="'+esc(title)+' fotoğrafı '+(n+2)+'" loading="lazy"><span>⤢</span></button>').join('');
 const spec=(label,value)=>'<div class="detail-spec"><small>'+label+'</small><strong>'+esc(value||'—')+'</strong></div>';
 $('mdetail').innerHTML='<div class="detail-layout"><div class="detail-media">'+(hero?'<button type="button" class="detail-hero" data-image-index="0"><img src="'+esc(hero)+'" alt="'+esc(title)+'"><span class="hero-zoom">⤢ FOTOĞRAFI BÜYÜT</span></button>':'<div class="detail-no-photo">FOTOĞRAF YOK</div>')+(thumbs?'<div class="detail-thumbs">'+thumbs+'</div>':'')+'<div class="detail-gallery-note"><span>SEM AUTO PHOTO GALLERY</span><span>'+lightboxImages.length+' FOTOĞRAF</span></div></div><div class="detail-info"><div class="detail-eyebrow">SEM AUTO SEÇKİSİ <span>•</span> '+esc(c.body_type||'ARAÇ').toLocaleUpperCase('tr')+'</div><div class="detail-price">'+money(c.price)+'</div><div class="detail-price-caption">İLAN FİYATI</div><div class="detail-specs">'+spec('MODEL YILI',c.model_year)+spec('KİLOMETRE',Number(c.mileage_km||0).toLocaleString('tr-TR')+' KM')+spec('YAKIT',c.fuel_type)+spec('VİTES',c.transmission)+'</div><div class="detail-section"><h4>ARAÇ HAKKINDA</h4><p>'+esc(c.description||'Araç açıklaması eklenmemiş.')+'</p></div><div>'+partReport(c)+'</div><div class="detail-condition"><div><small>HASAR / TRAMER</small><p>'+esc(c.damage_notes||'Hasar bilgisi belirtilmemiş')+'</p></div></div><div class="detail-footnote"><span class="contact-name">Mesut ÖZ</span><a class="contact-phone" href="tel:+905417333323">+90 541 733 33 23</a></div></div></div>';
 document.querySelectorAll('[data-image-index]').forEach(b=>b.onclick=()=>openLightbox(Number(b.dataset.imageIndex)));
 $('modal').classList.add('open');
}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');category=b.dataset.cat;render()});
['brand','model','fuel','gear','price'].forEach(id=>$(id).addEventListener('input',render));$('filter').onclick=render;$('close').onclick=()=>$('modal').classList.remove('open');$('modal').onclick=e=>{if(e.target===$('modal'))$('modal').classList.remove('open')};
render();
async function loadLiveCars(){try{if(!window.supabase?.createClient||!window.SEM_AUTO_SUPABASE_URL||!window.SEM_AUTO_SUPABASE_KEY)throw new Error('Supabase SDK/config yüklenemedi');sb=window.supabase.createClient(window.SEM_AUTO_SUPABASE_URL,window.SEM_AUTO_SUPABASE_KEY);const {data,error}=await sb.from('sem_auto_vehicles').select('*').eq('is_active',true).order('sort_order',{ascending:true}).order('created_at',{ascending:false});if(error)throw error;cars=Array.isArray(data)?data:[];render();}catch(error){console.error('SEM AUTO araçları yüklenemedi:',error);$('grid').innerHTML='<p class="empty">Araçlar şu anda yüklenemedi. Lütfen biraz sonra tekrar deneyin.</p>';}}
loadLiveCars();
