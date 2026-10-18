'use strict';
const KEY='wuxia-life-v1';
const places=[
 {name:'หุบเขาเมฆาคราม',dir:'ทิศเหนือ',icon:'☁',desc:'สายหมอกคลุมยอดเขา สำนักเก่าแก่ซ่อนวิชาลึกล้ำไว้ท่ามกลางความเงียบสงบ',bonus:'ฝึกวิชาได้พลังเพิ่ม',train:8},
 {name:'นครบุปผา',dir:'ทิศตะวันออก',icon:'❀',desc:'เมืองการค้าริมสายน้ำ ผู้คนหลากสำนักมาพบกัน โอกาสและข่าวลือลอยมาตามสายลม',bonus:'ทำงานได้เหรียญเพิ่ม',money:15},
 {name:'ป่าไผ่มรกต',dir:'ทิศใต้',icon:'竹',desc:'เสียงใบไผ่ไหวกล่อมจิตใจ สมุนไพรหายากเติบโตในผืนป่าอันอุดมสมบูรณ์',bonus:'พักผ่อนฟื้นชีวิตเพิ่ม',heal:15},
 {name:'ทะเลทรายตะวันดับ',dir:'ทิศตะวันตก',icon:'☀',desc:'แดนกันดารแห่งเส้นทางคาราวาน โจรร้ายและสมบัติโบราณรอผู้กล้าเข้าท้าทาย',bonus:'ผจญภัยได้รางวัลเพิ่ม',loot:15}
];
const realms=['ผู้เริ่มฝึกยุทธ์','ก่อกำเนิดปราณ','หลอมรวมปราณ','ยอดฝีมือ','ปรมาจารย์','เซียนยุทธ์'];
const thresholds=[40,75,120,180,260];
let s;
const $=id=>document.getElementById(id),roll=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
function fresh(name){return {name:name||'จอมยุทธ์พเนจร',age:16,hp:100,power:5,wisdom:5,money:30,fame:0,exp:0,realm:0,place:0,dead:false,log:[{age:16,text:'เจ้าก้าวออกจากหมู่บ้าน พร้อมเงิน 30 เหรียญ และความฝันที่จะฝากชื่อไว้ในยุทธภพ'}]};}
function record(text){s.log.unshift({age:s.age,text});s.log=s.log.slice(0,60);}
function save(){try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}}
function act(type){if(s.dead)return;const p=places[s.place];let text='';
 if(type==='train'){let gain=roll(12,20)+(p.train||0);s.exp+=gain;s.power+=roll(2,4);s.hp-=roll(3,8);text=`เจ้าฝึกกระบี่และเดินลมปราณ ได้ค่าฝึกฝน ${gain} และพลังยุทธ์เพิ่มขึ้น`;}
 if(type==='study'){s.wisdom+=roll(3,6);s.exp+=8;text='เจ้าอ่านคัมภีร์และสนทนาธรรม ปัญญาเพิ่มขึ้น พร้อมค่าฝึกฝน 8';}
 if(type==='work'){let gain=roll(18,30)+(p.money||0);s.money+=gain;text=`เจ้ารับงานคุ้มกันและช่วยชาวบ้าน ได้รับ ${gain} เหรียญ`;}
 if(type==='rest'){let gain=roll(20,35)+(p.heal||0);s.hp=Math.min(100,s.hp+gain);text=`เจ้าพักฟื้นและปรุงยาสมุนไพร ฟื้นพลังชีวิต ${gain} หน่วย (สูงสุด 100)`;}
 if(type==='adventure'){const chance=Math.min(.9,.45+s.power/180+s.realm*.04);if(Math.random()<chance){let gain=roll(20,45)+(p.loot||0);s.money+=gain;s.fame+=roll(3,7);s.exp+=18;s.hp-=roll(5,12);text=`เจ้าพิชิตอันตราย พบสมบัติ ${gain} เหรียญ ได้ชื่อเสียงและค่าฝึกฝน 18`;}else{s.hp-=roll(18,30);s.exp+=8;text='เจ้าพบศัตรูที่แข็งแกร่งและบาดเจ็บกลับมา แต่ได้รับประสบการณ์ฝึกฝน 8';}}
 if(type==='break'){if(s.realm>=5||s.exp<thresholds[s.realm]||s.money<20)return;const chance=Math.min(.95,.6+s.wisdom/150);s.money-=20;if(Math.random()<chance){s.exp-=thresholds[s.realm];s.realm++;s.power+=15;s.fame+=10;text=`ทะลวงสำเร็จ! เจ้าก้าวสู่ขั้น${realms[s.realm]} พลังยุทธ์ +15 ชื่อเสียง +10`;}else{s.hp-=15;s.wisdom+=3;text='ลมปราณติดขัด ทะลวงไม่สำเร็จ เสียพลังชีวิต 15 แต่ปัญญา +3 และยังคงค่าฝึกฝนไว้';}}
 finish(text);
}
function finish(text){s.age++;s.hp=Math.max(0,s.hp);record(text);if(s.age>=80||s.hp<=0){s.dead=true;record(s.hp<=0?'เจ้าสิ้นแรงลงกลางเส้นทางยุทธภพ ตำนานชีวิตได้ปิดฉากลง':'ในวัย 80 ปี เจ้าล้างมือในอ่างทองคำ ทิ้งตำนานให้คนรุ่นหลัง');}save();render();}
function travel(i){if(s.dead||s.place===i)return;s.place=i;finish(`เจ้าเดินทางสู่${places[i].name} เริ่มต้นบทใหม่ในแดน${places[i].dir}`);}
function render(){const p=places[s.place];$('name').textContent=s.name;$('identity').textContent=s.dead?'ตำนานที่สิ้นสุดแล้ว':'จอมยุทธ์อิสระ · '+p.dir;$('year').textContent=`ปีที่ ${s.age-15} · อายุ ${s.age} ปี`;$('realm').textContent=realms[s.realm];$('direction').textContent=p.dir+' / ยุทธภพสี่แดน';$('location').textContent=p.name;$('description').textContent=p.desc;
 $('stats').innerHTML=[['อายุ',s.age+' ปี'],['พลังชีวิต',s.hp+' / 100'],['พลังยุทธ์',s.power],['ปัญญา',s.wisdom],['เงิน',s.money+' เหรียญ'],['ชื่อเสียง',s.fame]].map(([k,v])=>`<div class="stat"><span>${k}</span><strong>${v}</strong></div>`).join('');
 const need=thresholds[s.realm];$('progress').style.width=(need?Math.min(100,s.exp/need*100):100)+'%';$('training').textContent=need?`ค่าฝึกฝน ${s.exp} / ${need} · ทะลวงใช้ 20 เหรียญ`:'บรรลุจุดสูงสุดแห่งวิถียุทธ์';
 const actions=[['train','⚔','ฝึกวิชายุทธ์','เพิ่มพลังและค่าฝึกฝน · เสียชีวิต 3–8'],['study','書','ศึกษาคัมภีร์','เพิ่มปัญญาและค่าฝึกฝน 8'],['work','◈','รับงานคุ้มกัน','ได้รับเงิน 18–30 เหรียญ'],['rest','茶','พักผ่อนรักษาตัว','ฟื้นชีวิต 20–35 หน่วย'],['adventure','山','ออกผจญภัย','เสี่ยงบาดเจ็บ · ได้สมบัติและชื่อเสียง'],['break','✧','ทะลวงขั้นพลัง',need?`ต้องการฝึกฝน ${need} และ 20 เหรียญ`:'บรรลุขั้นสูงสุดแล้ว']];
 $('actions').innerHTML=actions.map(([id,icon,title,desc])=>`<button class="action" data-action="${id}" ${s.dead||(id==='break'&&(!need||s.exp<need||s.money<20))?'disabled':''}><span class="icon">${icon}</span><span><strong>${title}</strong><small>${desc}</small></span></button>`).join('');
 $('map').innerHTML=places.map((p,i)=>`<button data-place="${i}" class="${i===s.place?'active':''}" ${s.dead||i===s.place?'disabled':''}>${p.icon} ${p.dir}<small>${p.name}</small><small>${i===s.place?'● เจ้าอยู่ที่นี่':p.bonus}</small></button>`).join('');
 $('log').replaceChildren(...s.log.map(e=>{let row=document.createElement('div');row.className='entry';let age=document.createElement('span');age.textContent=`อายุ ${e.age} ปี`;let text=document.createElement('p');text.textContent=e.text;row.append(age,text);return row;}));
}
$('actions').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)act(b.dataset.action);});$('map').addEventListener('click',e=>{const b=e.target.closest('[data-place]');if(b)travel(Number(b.dataset.place));});
$('reset').onclick=()=>{if(confirm('เริ่มชีวิตใหม่? บันทึกชีวิตเดิมจะถูกแทนที่เมื่อออกเดินทาง'))$('intro').showModal();};
$('nameform').onsubmit=e=>{e.preventDefault();s=fresh($('hero').value.trim());save();render();$('intro').close();};
try{const old=JSON.parse(localStorage.getItem(KEY));if(old&&typeof old.name==='string'&&Number.isInteger(old.age)&&Array.isArray(old.log)&&places[old.place]&&realms[old.realm]&&['hp','power','wisdom','money','fame','exp'].every(k=>Number.isFinite(old[k])))s=old;}catch{}
if(!s){s=fresh();render();$('intro').showModal();}else render();
