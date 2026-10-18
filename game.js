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
const sects=[
 {name:'สำนักกระบี่เมฆา',master:'หลินเฟิง',role:'ศิษย์พี่ผู้เคร่งขรึม',desc:'วิถีกระบี่แห่งขุนเขา',bonus:'ฝึกวิชาได้ค่าฝึกฝนเพิ่ม 8',stat:'exp',amount:8},
 {name:'หอบุปผาพิรุณ',master:'เยว่หลัน',role:'ผู้ดูแลหอข่าวสาร',desc:'ปัญญาและเครือข่ายแห่งเมืองน้ำ',bonus:'ศึกษาคัมภีร์ได้ปัญญาเพิ่ม 3',stat:'wisdom',amount:3},
 {name:'สำนักไผ่โอสถ',master:'ซูชิง',role:'หมอพเนจรผู้ใจดี',desc:'รักษาชีวิตและบำเพ็ญจิต',bonus:'พักผ่อนฟื้นชีวิตเพิ่ม 15',stat:'hp',amount:15},
 {name:'พรรคเหยี่ยวทะเลทราย',master:'จ้าวเหยียน',role:'มือกระบี่แห่งคาราวาน',desc:'ความกล้าบนเส้นทางตะวันดับ',bonus:'รับงานได้เงินเพิ่ม 15',stat:'money',amount:15}
];
const sectRanks=['ศิษย์ใหม่','ศิษย์ชั้นใน','ศิษย์เอก','ผู้อาวุโส'];
function rank(){return Math.min(3,Math.floor(s.merit/30));}
function bondLabel(n){return n>=80?'สหายร่วมเป็นร่วมตาย':n>=50?'สหายสนิท':n>=20?'มิตรสหาย':'คนรู้จัก';}
function socialDefaults(state){
 state.sect=Number.isInteger(state.sect)&&sects[state.sect]?state.sect:null;
 state.merit=Number.isFinite(state.merit)?Math.max(0,state.merit):0;
 state.bonds=sects.map((_,i)=>Math.max(0,Math.min(100,Number.isFinite(state.bonds?.[i])?state.bonds[i]:0)));
 return state;
}
let s;
const $=id=>document.getElementById(id),roll=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
function fresh(name){return socialDefaults({name:name||'จอมยุทธ์พเนจร',age:16,hp:100,power:5,wisdom:5,money:30,fame:0,exp:0,realm:0,place:0,dead:false,log:[{age:16,text:'เจ้าก้าวออกจากหมู่บ้าน พร้อมเงิน 30 เหรียญ และความฝันที่จะฝากชื่อไว้ในยุทธภพ'}]});}
function record(text){s.log.unshift({age:s.age,text});s.log=s.log.slice(0,60);}
function save(){try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}}
function act(type){if(s.dead)return;const p=places[s.place];let text='';
 if(type==='train'){let gain=roll(12,20)+(p.train||0);s.exp+=gain;s.power+=roll(2,4);s.hp-=roll(3,8);text=`เจ้าฝึกกระบี่และเดินลมปราณ ได้ค่าฝึกฝน ${gain} และพลังยุทธ์เพิ่มขึ้น`;}
 if(type==='study'){s.wisdom+=roll(3,6);s.exp+=8;text='เจ้าอ่านคัมภีร์และสนทนาธรรม ปัญญาเพิ่มขึ้น พร้อมค่าฝึกฝน 8';}
 if(type==='work'){let gain=roll(18,30)+(p.money||0);s.money+=gain;text=`เจ้ารับงานคุ้มกันและช่วยชาวบ้าน ได้รับ ${gain} เหรียญ`;}
 if(type==='rest'){let gain=roll(20,35)+(p.heal||0);s.hp=Math.min(100,s.hp+gain);text=`เจ้าพักฟื้นและปรุงยาสมุนไพร ฟื้นพลังชีวิต ${gain} หน่วย (สูงสุด 100)`;}
 if(type==='adventure'){const chance=Math.min(.9,.45+s.power/180+s.realm*.04);if(Math.random()<chance){let gain=roll(20,45)+(p.loot||0);s.money+=gain;s.fame+=roll(3,7);s.exp+=18;s.hp-=roll(5,12);text=`เจ้าพิชิตอันตราย พบสมบัติ ${gain} เหรียญ ได้ชื่อเสียงและค่าฝึกฝน 18`;}else{s.hp-=roll(18,30);s.exp+=8;text='เจ้าพบศัตรูที่แข็งแกร่งและบาดเจ็บกลับมา แต่ได้รับประสบการณ์ฝึกฝน 8';}}
 if(type==='break'){if(s.realm>=5||s.exp<thresholds[s.realm]||s.money<20)return;const chance=Math.min(.95,.6+s.wisdom/150);s.money-=20;if(Math.random()<chance){s.exp-=thresholds[s.realm];s.realm++;s.power+=15;s.fame+=10;text=`ทะลวงสำเร็จ! เจ้าก้าวสู่ขั้น${realms[s.realm]} พลังยุทธ์ +15 ชื่อเสียง +10`;}else{s.hp-=15;s.wisdom+=3;text='ลมปราณติดขัด ทะลวงไม่สำเร็จ เสียพลังชีวิต 15 แต่ปัญญา +3 และยังคงค่าฝึกฝนไว้';}}
 if(!text)return;
 const bonusAction=['train','study','rest','work'];
 if(s.sect!==null&&type===bonusAction[s.sect]){const sect=sects[s.sect],gain=sect.amount+rank()*2;s[sect.stat]+=gain;s.hp=Math.min(100,s.hp);text+=` · วิชาสำนักเสริม${gain} หน่วย`;}
 finish(text);
}
function finish(text){s.age++;s.hp=Math.max(0,s.hp);record(text);if(s.age>=80||s.hp<=0){s.dead=true;record(s.hp<=0?'เจ้าสิ้นแรงลงกลางเส้นทางยุทธภพ ตำนานชีวิตได้ปิดฉากลง':'ในวัย 80 ปี เจ้าล้างมือในอ่างทองคำ ทิ้งตำนานให้คนรุ่นหลัง');}save();render();}
function travel(i){if(s.dead||s.place===i)return;s.place=i;finish(`เจ้าเดินทางสู่${places[i].name} เริ่มต้นบทใหม่ในแดน${places[i].dir}`);}
function render(){const p=places[s.place];$('name').textContent=s.name;$('identity').textContent=s.dead?'ตำนานที่สิ้นสุดแล้ว':(s.sect===null?'จอมยุทธ์อิสระ':sects[s.sect].name+' · '+sectRanks[rank()])+' · '+p.dir;$('year').textContent=`ปีที่ ${s.age-15} · อายุ ${s.age} ปี`;$('realm').textContent=realms[s.realm];$('direction').textContent=p.dir+' / ยุทธภพสี่แดน';$('location').textContent=p.name;$('description').textContent=p.desc;
 $('stats').innerHTML=[['อายุ',s.age+' ปี'],['พลังชีวิต',s.hp+' / 100'],['พลังยุทธ์',s.power],['ปัญญา',s.wisdom],['เงิน',s.money+' เหรียญ'],['ชื่อเสียง',s.fame]].map(([k,v])=>`<div class="stat"><span>${k}</span><strong>${v}</strong></div>`).join('');
 const need=thresholds[s.realm];$('progress').style.width=(need?Math.min(100,s.exp/need*100):100)+'%';$('training').textContent=need?`ค่าฝึกฝน ${s.exp} / ${need} · ทะลวงใช้ 20 เหรียญ`:'บรรลุจุดสูงสุดแห่งวิถียุทธ์';
 const actions=[['train','⚔','ฝึกวิชายุทธ์','เพิ่มพลังและค่าฝึกฝน · เสียชีวิต 3–8'],['study','書','ศึกษาคัมภีร์','เพิ่มปัญญาและค่าฝึกฝน 8'],['work','◈','รับงานคุ้มกัน','ได้รับเงิน 18–30 เหรียญ'],['rest','茶','พักผ่อนรักษาตัว','ฟื้นชีวิต 20–35 หน่วย'],['adventure','山','ออกผจญภัย','เสี่ยงบาดเจ็บ · ได้สมบัติและชื่อเสียง'],['break','✧','ทะลวงขั้นพลัง',need?`ต้องการฝึกฝน ${need} และ 20 เหรียญ`:'บรรลุขั้นสูงสุดแล้ว']];
 $('actions').innerHTML=actions.map(([id,icon,title,desc])=>`<button class="action" data-action="${id}" ${s.dead||(id==='break'&&(!need||s.exp<need||s.money<20))?'disabled':''}><span class="icon">${icon}</span><span><strong>${title}</strong><small>${desc}</small></span></button>`).join('');
 $('map').innerHTML=places.map((p,i)=>`<button data-place="${i}" class="${i===s.place?'active':''}" ${s.dead||i===s.place?'disabled':''}>${p.icon} ${p.dir}<small>${p.name}</small><small>${i===s.place?'● เจ้าอยู่ที่นี่':p.bonus}</small></button>`).join('');
 renderSocial();
 $('log').replaceChildren(...s.log.map(e=>{let row=document.createElement('div');row.className='entry';let age=document.createElement('span');age.textContent=`อายุ ${e.age} ปี`;let text=document.createElement('p');text.textContent=e.text;row.append(age,text);return row;}));
}
function social(type,i){
 if(s.dead||!Number.isInteger(i)||!sects[i])return;
 const sect=sects[i];
 if(type==='leave'){
  if(s.sect===null||!confirm('ออกจากสำนัก? แต้มผลงานจะหายไป แต่ความสัมพันธ์ยังคงอยู่'))return;
  const name=sects[s.sect].name;s.sect=null;s.merit=0;finish(`เจ้าลาออกจาก${name} กลับสู่วิถีจอมยุทธ์อิสระ`);return;
 }
 if(i!==s.place)return;
 if(type==='join'){
  if(s.sect!==null||s.power<10||s.money<15)return;
  s.sect=i;s.money-=15;s.merit=0;finish(`เจ้าฝากตัวเป็นศิษย์${sect.name} จ่ายค่าบำรุง 15 เหรียญ และเริ่มต้นวิถีใหม่`);return;
 }
 if(type==='mission'){
  if(s.sect!==i)return;
  const reward=20+rank()*5;s.merit+=10;s.money+=reward;s.exp+=12;s.fame+=2;s.hp-=8;
  finish(`เจ้าทำภารกิจให้${sect.name} สำเร็จ ผลงาน +10 เงิน +${reward} ค่าฝึกฝน +12 ชื่อเสียง +2 พลังชีวิต -8 · ยศปัจจุบัน: ${sectRanks[rank()]}`);return;
 }
 let gain=0,text='';
 if(type==='talk'){gain=12;s.wisdom+=2;text=`เจ้าสนทนากับ${sect.master} แลกเปลี่ยนเรื่องราวยุทธภพ ปัญญา +2`;}
 if(type==='gift'){if(s.money<15)return;s.money-=15;gain=22;text=`เจ้ามอบของขวัญให้${sect.master} ใช้เงิน 15 เหรียญ`;}
 if(type==='spar'){if(s.bonds[i]<20)return;gain=8;s.exp+=15;s.power+=2;s.hp-=5;text=`เจ้าประลองกับ${sect.master} อย่างมิตร ได้ค่าฝึกฝน 15 พลังยุทธ์ +2 พลังชีวิต -5`;}
 if(!gain)return;
 s.bonds[i]=Math.min(100,s.bonds[i]+gain);
 if(s.bonds[i]>=50){s.hp=Math.min(100,s.hp+5);text+=' · สหายช่วยดูแล ฟื้นพลังชีวิต 5';}
 finish(text+` · ความสนิท ${s.bonds[i]}/100 (${bondLabel(s.bonds[i])})`);
}
function renderSocial(){
 const i=s.place,sect=sects[i],bond=s.bonds[i];
 $('sects').innerHTML=sects.map((t,n)=>`<article class="social-card ${s.sect===n?'member':''}"><small>${places[n].dir}${n===i?' · อยู่ในพื้นที่':''}</small><h3>${t.name}</h3><p>${t.desc}</p><p class="benefit">${t.bonus}</p>${s.sect===n?`<strong>${sectRanks[rank()]} · ผลงาน ${s.merit}</strong><small>เลื่อนยศทุก 30 ผลงาน · สูงสุดผู้อาวุโส</small><button data-social="mission" data-person="${n}" ${s.dead||i!==n?'disabled':''}>ทำภารกิจ · 1 ปี</button><button data-social="leave" data-person="${n}" ${s.dead?'disabled':''}>ออกจากสำนัก · 1 ปี</button>`:`<button data-social="join" data-person="${n}" ${s.dead||s.sect!==null||i!==n||s.power<10||s.money<15?'disabled':''}>ฝากตัวเป็นศิษย์ · 1 ปี</button><small>ต้องอยู่ในพื้นที่ · พลังยุทธ์ 10 · เงิน 15</small>`}</article>`).join('');
 $('relations').innerHTML=`<article class="social-card"><small>สหายประจำ${places[i].dir}</small><h3>${sect.master}</h3><p>${sect.role}</p><strong>${bondLabel(bond)} · ${bond}/100</strong><div class="bar"><i style="width:${bond}%"></i></div><p>สนิท 20: ประลองร่วมกัน · สนิท 50: ฟื้นชีวิต 5 หลังพบปะ</p><div class="social-buttons"><button data-social="talk" data-person="${i}" ${s.dead?'disabled':''}>พูดคุย · ปัญญา +2</button><button data-social="gift" data-person="${i}" ${s.dead||s.money<15?'disabled':''}>ให้ของขวัญ · 15 เหรียญ</button><button data-social="spar" data-person="${i}" ${s.dead||bond<20?'disabled':''}>ประลองฉันมิตร</button></div><small>ทุกการพบปะใช้เวลา 1 ปี · เดินทางเพื่อพบสหายอีกสามคน</small></article><div class="bond-list">${sects.map((t,n)=>`<p>${t.master} <span>${bondLabel(s.bonds[n])} · ${s.bonds[n]}/100</span></p>`).join('')}</div>`;
}
for(const id of ['sects','relations'])$(id).addEventListener('click',e=>{const b=e.target.closest('[data-social]');if(b&&!b.disabled)social(b.dataset.social,Number(b.dataset.person));});
$('actions').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)act(b.dataset.action);});$('map').addEventListener('click',e=>{const b=e.target.closest('[data-place]');if(b)travel(Number(b.dataset.place));});
$('reset').onclick=()=>{if(confirm('เริ่มชีวิตใหม่? บันทึกชีวิตเดิมจะถูกแทนที่เมื่อออกเดินทาง'))$('intro').showModal();};
$('nameform').onsubmit=e=>{e.preventDefault();s=fresh($('hero').value.trim());save();render();$('intro').close();};
try{const old=JSON.parse(localStorage.getItem(KEY));if(old&&typeof old.name==='string'&&Number.isInteger(old.age)&&Array.isArray(old.log)&&places[old.place]&&realms[old.realm]&&['hp','power','wisdom','money','fame','exp'].every(k=>Number.isFinite(old[k])))s=socialDefaults(old);}catch{}
if(!s){s=fresh();render();$('intro').showModal();}else render();
