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
function partReport(c){const st={...(c.part_condition||{})},labels={original:'Orijinal',replaced:'Değişen',painted:'Boyalı',local:'Lokal Boyalı'},names=['Kaput','Tavan','Bagaj','Ön tampon','Arka tampon','Sol ön çamurluk','Sağ ön çamurluk','Sol ön kapı','Sağ ön kapı','Sol arka kapı','Sağ arka kapı','Sol arka çamurluk','Sağ arka çamurluk'];if(!Object.keys(st).length){(c.replaced_parts||[]).forEach(n=>st[n]='replaced');(c.painted_parts||[]).forEach(n=>{if(!st[n])st[n]='painted'})}const shapes=[['Ön tampon','143,0 295,0 295,65 143,65'],['Kaput','146,72 292,72 298,175 140,175'],['Sol ön çamurluk','132,82 148,100 151,190 132,190'],['Sol ön çamurluk','24,74 55,74 69,180 24,180'],['Sağ ön çamurluk','290,82 306,100 306,190 287,190'],['Sağ ön çamurluk','383,74 414,74 414,180 369,180'],['Sol ön kapı','132,190 153,190 155,285 132,285'],['Sol ön kapı','24,184 124,184 128,278 25,278'],['Sağ ön kapı','285,190 306,190 306,285 283,285'],['Sağ ön kapı','310,184 413,184 413,278 310,278'],['Sol arka kapı','132,286 155,286 155,356 132,356'],['Sol arka kapı','25,282 128,282 128,347 25,347'],['Sağ arka kapı','283,286 306,286 306,356 283,356'],['Sağ arka kapı','310,282 413,282 413,347 310,347'],['Sol arka çamurluk','134,356 156,356 158,423 136,423'],['Sol arka çamurluk','24,350 72,350 68,438 24,438'],['Sağ arka çamurluk','282,356 304,356 302,423 280,423'],['Sağ arka çamurluk','366,350 414,350 414,438 370,438'],['Bagaj','146,365 292,365 300,431 138,431'],['Arka tampon','139,435 299,435 299,482 139,482'],['Tavan','158,205 280,205 284,356 154,356']];return '<section class="part-report"><h4>BOYA, DEĞİŞEN VE EKSPERTİZ BİLGİSİ</h4><div class="part-legend"><span><i class="original"></i>Orijinal</span><span><i class="replaced"></i>Değişen</span><span><i class="painted"></i>Boyalı</span><span><i class="local"></i>Lokal Boyalı</span></div><div class="part-report-layout exact-template"><div class="template-canvas"><img src="assets/sem-auto-expert-template.png" alt="Ekspertiz araç şeması" class="expert-template-img"><svg class="expert-hotspots" viewBox="0 0 438 503" aria-hidden="true">'+shapes.map(([n,p])=>'<polygon class="state-'+(st[n]||'original')+'" points="'+p+'"><title>'+n+': '+labels[st[n]||'original']+'</title></polygon>').join('')+'</svg></div><div class="part-report-list">'+names.map(n=>'<div class="part-report-row"><span>'+n+'</span><b class="state-'+(st[n]||'original')+'">'+labels[st[n]||'original']+'</b></div>').join('')+'</div></div></section>'}
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
