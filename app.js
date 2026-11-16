const sb=window.supabase.createClient(window.SEM_AUTO_SUPABASE_URL,window.SEM_AUTO_SUPABASE_KEY);
const $=id=>document.getElementById(id);
let cars=[],category='',source='database';
const money=n=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(Number(n)||0);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const demo=[
{brand:'BMW',model:'320i M Sport',model_year:2021,mileage_km:68500,price:2145000,fuel_type:'Benzin',transmission:'Otomatik',body_type:'Sedan',painted_parts:['Sol ön çamurluk boyalı'],cover_image_url:'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80'},
{brand:'Mercedes-Benz',model:'C 200 AMG',model_year:2020,mileage_km:74200,price:2390000,fuel_type:'Benzin',transmission:'Otomatik',body_type:'Sedan',painted_parts:['2 parça boya'],cover_image_url:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80'},
{brand:'Audi',model:'Q3 35 TFSI',model_year:2022,mileage_km:41000,price:2680000,fuel_type:'Benzin',transmission:'Otomatik',body_type:'SUV',painted_parts:[],cover_image_url:'https://images.unsplash.com/photo-1606394585888-4a7b0f4c7f1a?auto=format&fit=crop&w=1000&q=80'},
{brand:'Volkswagen',model:'Golf 1.0 TSI',model_year:2021,mileage_km:53000,price:1495000,fuel_type:'Benzin',transmission:'Otomatik',body_type:'Hatchback',painted_parts:['Sağ arka kapı boyalı'],cover_image_url:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?auto=format&fit=crop&w=1000&q=80'},
{brand:'Volvo',model:'XC60 D4',model_year:2019,mileage_km:96500,price:2290000,fuel_type:'Dizel',transmission:'Otomatik',body_type:'SUV',painted_parts:['1 parça boya'],cover_image_url:'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80'},
{brand:'Porsche',model:'718 Cayman',model_year:2018,mileage_km:38000,price:4250000,fuel_type:'Benzin',transmission:'Otomatik',body_type:'Coupe',painted_parts:[],cover_image_url:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'}
];
function normalizeLegacy(v){return {brand:v.brand||'',model:v.model||'',trim_name:v.trim_name||'',model_year:Number(v.model_year??v.year)||0,mileage_km:Number(v.mileage_km??v.km)||0,price:Number(v.price)||0,fuel_type:v.fuel_type||v.fuel||'',transmission:v.transmission||v.gear||'',body_type:v.body_type||v.cat||'Diğer',painted_parts:Array.isArray(v.painted_parts)?v.painted_parts:(v.paint?[v.paint]:[]),replaced_parts:Array.isArray(v.replaced_parts)?v.replaced_parts:[],damage_notes:v.damage_notes||'',description:v.description||'',cover_image_url:v.cover_image_url||v.img||'',gallery_urls:v.gallery_urls||[]};}
async function loadCars(){
  try{
    const {data,error}=await sb.from('sem_auto_vehicles').select('*').eq('is_active',true).eq('status','satilik').order('sort_order',{ascending:true}).order('created_at',{ascending:false});
    if(error)throw error;
    if(data&&data.length){cars=data;source='database';}
    else{
      let legacy=[];try{const raw=localStorage.getItem('sem-auto-cars');if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed)&&parsed.length)legacy=parsed.map(normalizeLegacy);}}catch(e){console.warn('Eski vitrin kayıtları okunamadı',e)}
      cars=legacy.length?legacy:demo;source=legacy.length?'legacy':'demo';
    }
    render();
  }catch(error){
    console.error('Supabase araç listesi yüklenemedi:',error);
    let legacy=[];try{const raw=localStorage.getItem('sem-auto-cars');if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed)&&parsed.length)legacy=parsed.map(normalizeLegacy);}}catch(e){}
    cars=legacy.length?legacy:demo;source=legacy.length?'legacy':'demo';render();
    const note=document.getElementById('sourceNote');if(note)note.textContent='Canlı veritabanına şu anda bağlanılamadı; kayıtlı vitrin yedeği gösteriliyor.';
  }
}
function render(){
 const list=cars.filter(c=>(!category||c.body_type===category)&&(!$('brand').value||c.brand===$('brand').value)&&(!$('model').value||(c.model+' '+(c.trim_name||'')).toLocaleLowerCase('tr').includes($('model').value.toLocaleLowerCase('tr')))&&(!$('fuel').value||c.fuel_type===$('fuel').value)&&(!$('gear').value||c.transmission===$('gear').value)&&(!$('price').value||Number(c.price)<=Number($('price').value)));
 $('count').textContent=list.length+' ARAÇ';$('empty').hidden=list.length>0;
 $('grid').innerHTML=list.map((c)=>'<article class="car"><div class="photo" style="background-image:url(&quot;'+esc(c.cover_image_url||'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80')+'&quot;)"><span class="tag">'+esc(c.body_type||'Araç').toLocaleUpperCase('tr')+(source==='demo'?' • ÖRNEK':'')+'</span></div><div class="carbody"><h3>'+esc(c.brand)+' '+esc(c.model)+'</h3><div class="subtitle">'+esc(c.trim_name||'')+' '+(c.model_year||'')+' MODEL • '+esc(c.fuel_type)+' • '+esc(c.transmission)+'</div><div class="specs"><div><span>Yıl</span><b>'+esc(c.model_year)+'</b></div><div><span>Kilometre</span><b>'+Number(c.mileage_km||0).toLocaleString('tr-TR')+' km</b></div><div><span>Vites</span><b>'+esc(c.transmission)+'</b></div></div><div class="price">'+money(c.price)+'</div><button class="detail" data-car="'+cars.indexOf(c)+'">DETAYLAR ↗</button></div></article>').join('');
 const brands=[...new Set(cars.map(c=>c.brand).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
 const selected=$('brand').value;$('brand').innerHTML='<option value="">Tüm Markalar</option>'+brands.map(b=>'<option value="'+esc(b)+'">'+esc(b)+'</option>').join('');$('brand').value=selected;
 document.querySelectorAll('[data-car]').forEach(b=>b.onclick=()=>showDetail(Number(b.dataset.car)));
}
function showDetail(i){
 const c=cars[i];if(!c)return;
 $('mtitle').textContent=[c.brand,c.model,c.trim_name].filter(Boolean).join(' ');
 $('mdetail').innerHTML=(c.cover_image_url?'<img src="'+esc(c.cover_image_url)+'" alt="" style="width:100%;max-height:260px;object-fit:cover">':'')+
 'Model yılı: '+esc(c.model_year)+'<br>Kilometre: '+Number(c.mileage_km||0).toLocaleString('tr-TR')+' km<br>Yakıt: '+esc(c.fuel_type)+'<br>Vites: '+esc(c.transmission)+'<br>Kasa: '+esc(c.body_type)+'<br>Değişen: '+esc((c.replaced_parts||[]).join(', ')||'Belirtilmemiş')+'<br>Boyalı: '+esc((c.painted_parts||[]).join(', ')||'Belirtilmemiş')+'<br>Hasar: '+esc(c.damage_notes||'Belirtilmemiş')+'<br><br>'+esc(c.description||'')+'<br><br><b>'+money(c.price)+'</b>';
 $('modal').classList.add('open');
}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');category=b.dataset.cat;render()});
['brand','model','fuel','gear','price'].forEach(id=>$(id).addEventListener('input',render));
$('filter').onclick=render;$('close').onclick=()=>$('modal').classList.remove('open');$('modal').onclick=e=>{if(e.target===$('modal'))$('modal').classList.remove('open')};
loadCars();
