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
function partReport(c){const st=c.part_condition||{},labels={original:'Orijinal',replaced:'Değişen',painted:'Boyalı',local:'Lokal Boyalı'},names=['Kaput','Tavan','Bagaj','Ön tampon','Arka tampon','Ön panel','Arka panel','Sol ön çamurluk','Sağ ön çamurluk','Sol ön kapı','Sağ ön kapı','Sol arka kapı','Sağ arka kapı','Sol arka çamurluk','Sağ arka çamurluk'];const paths={'Kaput':'M126 165 Q210 145 294 165 L294 230 Q210 245 126 230Z','Tavan':'M126 240H294V365H126Z','Bagaj':'M126 375 Q210 360 294 375V450H126Z','Ön tampon':'M145 35 Q210 15 275 35 L290 58 Q210 78 130 58Z','Arka tampon':'M130 535 Q210 555 290 535 L275 570 Q210 590 145 570Z','Ön panel':'M82 90 L119 100 L125 220 L82 210Z','Arka panel':'M82 410 L125 400 L119 520 L82 530Z','Sol ön çamurluk':'M82 220 L125 232 L125 300 L82 300Z','Sağ ön çamurluk':'M295 232 L338 220 L338 300 L295 300Z','Sol ön kapı':'M82 305H125V365H82Z','Sağ ön kapı':'M295 305H338V365H295Z','Sol arka kapı':'M82 370H125V410H82Z','Sağ arka kapı':'M295 370H338V410H295Z','Sol arka çamurluk':'M82 415 L125 425 L125 510 L82 520Z','Sağ arka çamurluk':'M295 425 L338 415 L338 520 L295 510Z'};return '<section class="part-report"><h4>BOYA, DEĞİŞEN VE EKSPERTİZ BİLGİSİ</h4><div class="part-legend"><span><i class="original"></i>Orijinal</span><span><i class="replaced"></i>Değişen</span><span><i class="painted"></i>Boyalı</span><span><i class="local"></i>Lokal Boyalı</span></div><div class="part-report-layout"><svg viewBox="0 0 420 620" role="img" aria-label="Araç ekspertiz parça şeması"><path class="car-outline" d="M130 35 Q210 8 290 35 L322 85 L340 170 L340 450 L322 535 Q210 570 98 535 L80 450 L80 170 L98 85Z"/><path class="car-glass" d="M145 82 Q210 55 275 82 L294 155 L126 155Z"/><path class="car-glass" d="M126 465 L294 465 L275 525 Q210 545 145 525Z"/><path class="car-center" d="M126 180H294V440H126Z"/>'+names.map(n=>'<path class="part-shape state-'+(st[n]||'original')+'" d="'+paths[n]+'"><title>'+n+': '+labels[st[n]||'original']+'</title></path>').join('')+'<path class="car-detail" d="M126 235H294M126 370H294M126 455H294M80 300H125M295 300H340M80 410H125M295 410H340"/>'+[ [94,180],[326,180],[94,440],[326,440] ].map(([x,y])=>'<circle class="car-wheel" cx="'+x+'" cy="'+y+'" r="28"/>').join('')+'</svg><div class="part-report-list">'+names.map(n=>'<div class="part-report-row"><span>'+n+'</span><b class="state-'+(st[n]||'original')+'">'+labels[st[n]||'original']+'</b></div>').join('')+'</div></div></section>'}
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
