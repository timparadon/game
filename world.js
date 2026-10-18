'use strict';
const sites={
 town:{name:'ชุมชนหน้าสำนัก',icon:'市',description:'ตลาดและโรงเตี๊ยม จุดพักของผู้เดินทางก่อนเข้าสำนัก',action:'work',label:'รับงานในชุมชน · 1 ปี'},
 gate:{name:'ประตูสำนัก',icon:'門',description:'ศิษย์เฝ้าประตูคอยต้อนรับผู้มาเยือนและผู้ขอฝากตัว',action:null},
 yard:{name:'ลานฝึกยุทธ์',icon:'⚔',description:'ลานกว้างสำหรับฝึกวิชาและพบปะศิษย์พี่',action:'train',label:'ฝึกวิชาที่ลาน · 1 ปี'},
 library:{name:'หอคัมภีร์',icon:'書',description:'ผู้อาวุโสดูแลคัมภีร์และให้คำแนะนำแก่ผู้ใฝ่รู้',action:'study',label:'ศึกษาคัมภีร์ · 1 ปี'},
 dorm:{name:'เรือนศิษย์',icon:'舍',description:'เรือนพักอันสงบ พบปะศิษย์ชั้นในและพักฟื้นร่างกาย',action:'rest',label:'พักฟื้นที่เรือน · 1 ปี'}
};
function npcSite(npc){return ['yard','gate','dorm','library'][Number(npc.id.split('-')[1])];}
function isNearby(npc){return npc.sect===s.place&&npcSite(npc)===s.site;}
function nearbyPeople(){return disciples.filter(isNearby);}
function moveSite(id){
 if(s.dead||!Object.hasOwn(sites,id)||s.site===id)return;
 s.site=id;const text=`เจ้าเดินไปยัง${sites[id].name} · ไม่เสียปี`;
 record(text);save();render();animateAction('travel',text);
}
function visitNpc(id){
 const npc=disciples.find(n=>n.id===id);
 if(s.dead||!npc||npc.sect!==s.place)return;
 moveSite(npcSite(npc));category='journey';renderCategory();
}
function encounter(type,id){
 const npc=disciples.find(n=>n.id===id);
 if(s.dead||!npc||!isNearby(npc)||!['talk','gift'].includes(type))return;
 if(type==='gift'&&s.money<15)return;
 const gain=type==='talk'?12:22;
 if(type==='gift')s.money-=15;else s.wisdom+=2;
 s.bonds[npc.sect]=Math.min(100,s.bonds[npc.sect]+gain);
 if(s.bonds[npc.sect]>=50)s.hp=Math.min(100,s.hp+5);
 finish(`${type==='talk'?'เจ้าพูดคุยกับ':'เจ้ามอบของขวัญให้'}${npc.name} ณ ${sites[s.site].name} · ${type==='talk'?'ปัญญา +2':'เงิน -15'} · มิตรภาพสำนัก ${s.bonds[npc.sect]}/100${s.bonds[npc.sect]>=50?' · สหายช่วยฟื้นชีวิต 5':''}`,type);
}
function localAction(type){
 if(s.dead)return;
 if(type===sites[s.site].action){act(type);return;}
 if(type==='shop'&&s.site==='town'){category='bag';renderCategory();return;}
 if(type==='join'&&s.site==='gate'){social('join',s.place);return;}
 if(type==='mission'&&s.site==='gate'){social('mission',s.place);}
}
function localMapMarkup(inside=false){
 const here=sites[s.site],people=nearbyPeople();
 const options=inside?['gate','yard','library','dorm','town']:Object.keys(sites);
 const nodes=options.map(id=>{const occupants=disciples.filter(n=>n.sect===s.place&&npcSite(n)===id);return `<button class="site-node ${s.site===id?'current':''}" data-site="${id}" aria-pressed="${s.site===id}" ${s.dead?'disabled':''}><span class="site-icon">${sites[id].icon}</span><strong>${sites[id].name}</strong><small>${s.site===id?'● เจ้าอยู่ที่นี่':'เดินไป · ไม่เสียปี'}</small><small>${id==='town'?'พ่อค้า · เจ้าของโรงเตี๊ยม':occupants.map(n=>n.name).join(' · ')}</small></button>`;}).join('');
 const cards=people.map(n=>`<article class="social-card"><small>${sectRanks[n.rank]} · ${sects[n.sect].name}</small><h3>${n.name}</h3><p>พลัง ${npcPower(n)} · ${weapons[n.weapon].name}<br>ความเกรงใจ ${deference(n)}/100 · มิตรภาพสำนัก ${s.bonds[n.sect]}/100</p><button data-encounter="talk" data-npc="${n.id}" ${s.dead?'disabled':''}>พูดคุย · 1 ปี</button><button data-encounter="gift" data-npc="${n.id}" ${s.dead||s.money<15?'disabled':''}>มอบของขวัญ · 15 เหรียญ / 1 ปี</button><button data-duel="${n.id}" data-mode="challenge" ${s.dead?'disabled':''}>ประลอง · 1 ปี</button><button class="danger" data-duel="${n.id}" data-mode="attack" ${s.dead?'disabled':''}>โจมตี · 1 ปี</button></article>`).join('');
 const town=s.site==='town'?`<article class="social-card"><small>พ่อค้าประจำชุมชน</small><h3>เถ้าแก่หวัง</h3><p>ซื้อยา คัมภีร์ และอาวุธ</p><button data-local="shop" ${s.dead?'disabled':''}>ซื้อสินค้า · ไม่เสียปี</button></article><article class="social-card"><small>เจ้าของโรงเตี๊ยม</small><h3>ป้าหลี่</h3><p>มีงานคุ้มกันสำหรับผู้เดินทาง</p><button data-local="work" ${s.dead?'disabled':''}>รับงาน · 1 ปี</button></article>`:'';
 return `<h3>${inside?'แผนผังสำนัก':'แผนที่พื้นที่'} · ${sects[s.place].name}</h3><p class="inventory-note">เดินภายในพื้นที่ไม่เสียปี · เดินทางข้ามทิศใช้ 1 ปี · ต้องอยู่จุดเดียวกันจึงพบปะและต่อสู้ได้</p><div class="site-map">${nodes}</div><div class="whereabouts"><small>ตำแหน่งปัจจุบัน</small><h3>${here.icon} ${here.name}</h3><p>${here.description}</p>${here.action?`<button data-local="${here.action}" ${s.dead?'disabled':''}>${here.label}</button>`:''}${s.site==='gate'?`<button data-local="${s.sect===s.place?'mission':'join'}" ${s.dead||(s.sect!==s.place&&(s.sect!==null||s.power<10||s.money<15))?'disabled':''}>${s.sect===s.place?'รับภารกิจสำนัก · 1 ปี':'ฝากตัว · พลัง 10 / เงิน 15 / 1 ปี'}</button>`:''}</div><h3>ผู้คนที่อยู่ที่นี่ · ${people.length+(s.site==='town'?2:0)} คน</h3><div class="social-grid">${cards}${town}</div>`;
}
function renderLocalMaps(){
 $('local-map').innerHTML=localMapMarkup();$('sect-map').innerHTML=localMapMarkup(true);
 $('where-now').textContent=`${places[s.place].dir} / ${places[s.place].name} / ${sites[s.site].name}`;
}
function handleLocalMap(e){
 const b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.site)moveSite(b.dataset.site);
 else if(b.dataset.encounter)encounter(b.dataset.encounter,b.dataset.npc);
 else if(b.dataset.duel)duel(b.dataset.duel,b.dataset.mode);
 else if(b.dataset.local)localAction(b.dataset.local);
}
