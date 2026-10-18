'use strict';
const weapons={wooden:{name:'กระบี่ไม้',power:3,price:0},iron:{name:'กระบี่เหล็ก',power:10,price:60},spear:{name:'ทวนเงิน',power:18,price:120},jade:{name:'กระบี่หยกเมฆา',power:30,price:220}};
const discipleNames=[['หลินเฟิง','เสี่ยวอวิ๋น','เฉินอี้','ชิงซาน'],['เยว่หลัน','ฮวาอิง','มู่หรงซิน','หลันฮวา'],['ซูชิง','ไป๋หลู','หลิวเหอ','จู๋หลิน'],['จ้าวเหยียน','อาเหยียน','ต้วนเฟิง','ฉางเฟิง']];
const disciples=discipleNames.flatMap((names,sect)=>names.map((name,i)=>({id:sect+'-'+i,name,sect,rank:[2,0,1,3][i],power:[42,12,25,75][i]+sect*3,weapon:['spear','wooden','iron','jade'][i]})));
function effectivePower(){return s.power+weapons[s.equipped].power;}
function npcPower(n){return n.power+weapons[n.weapon].power;}
function deference(n){return Math.max(0,Math.min(100,Math.round(35+(effectivePower()-npcPower(n))*.9+s.fame*.3+s.bonds[n.sect]*.2-s.grudges[n.id]*.5)));}
function regard(score){return score>=70?'ยำเกรง':score>=40?'ให้เกียรติ':score>=20?'ระวังตัว':'ไม่เกรงกลัว';}
function animateAction(type,text){
 const icons={train:'⚔',study:'書',work:'◈',rest:'茶',adventure:'山',break:'✧',travel:'➜',join:'門',mission:'旗',talk:'☏',gift:'❀',spar:'⚔',buy:'◈',medicine:'✚',manual:'書',tonic:'丹',weapon:'⚔',fight:'⚔',peace:'☯',social:'☯'};
 const box=$('action-feedback');box.textContent=(icons[type]||'✧')+' '+text;box.dataset.effect=type;
 for(const animation of box.getAnimations?.()||[])animation.cancel();
 if(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 const distance=({train:16,spar:16,fight:22,travel:40,weapon:12})[type]||0;
 box.animate?.([{opacity:.35,transform:`translate(${distance}px, ${distance?0:9}px) scale(.98)`},{opacity:1,transform:`translate(${-distance/3}px, 0) scale(1.02)`,offset:.65},{opacity:1,transform:'translate(0, 0) scale(1)'}],{duration:type==='break'?950:600,easing:'ease-out'});
}
function weaponAction(type,id){
 if(s.dead||!Object.hasOwn(weapons,id))return;
 const weapon=weapons[id];let text;
 if(type==='buy'){if(s.weapons.includes(id)||s.money<weapon.price)return;s.money-=weapon.price;s.weapons.push(id);text=`เจ้าซื้อ${weapon.name} ${weapon.price} เหรียญ`;}
 else if(type==='equip'){if(!s.weapons.includes(id)||s.equipped===id)return;s.equipped=id;text=`เจ้าสวมใส่${weapon.name} พลังอาวุธ +${weapon.power}`;}
 else return;
 record(text+' · ไม่เสียปี');save();render();animateAction('weapon',text);
}
function renderWeapons(){
 $('weapons').innerHTML=`<h3>คลังอาวุธ</h3><p class="inventory-note">สวมใส่ได้หนึ่งชิ้น · เพิ่มพลังต่อสู้ การผจญภัย และความเกรงใจ · ซื้อและเปลี่ยนไม่เสียปี</p><div class="social-grid">${Object.entries(weapons).map(([id,w])=>`<article class="social-card ${s.equipped===id?'member':''}"><h3>⚔ ${w.name}</h3><p>พลังอาวุธ +${w.power}</p><button data-weapon="${id}" data-weapon-action="${s.weapons.includes(id)?'equip':'buy'}" ${s.dead||s.equipped===id||(!s.weapons.includes(id)&&s.money<w.price)?'disabled':''}>${s.equipped===id?'กำลังสวมใส่':s.weapons.includes(id)?'สวมใส่':`ซื้อ ${w.price} เหรียญ`}</button></article>`).join('')}</div>`;
}
function renderDisciples(){
 $('disciples').innerHTML=`<h3>ทำเนียบศิษย์ · ${sects[s.place].name}</h3><p class="inventory-note">เดินทางเพื่อดูศิษย์สำนักอื่น · ความเกรงใจขึ้นกับพลังรวม ชื่อเสียง มิตรภาพ และความแค้น ผู้ที่ยำเกรงอาจยอมหลีกทางเมื่อท้าประลอง การโจมตีจะลดมิตรภาพและชื่อเสียง</p>${s.sect===s.place?`<p class="player-roster">เจ้า · ${sectRanks[rank()]} · พลังรวม ${effectivePower()} · ${weapons[s.equipped].name}</p>`:''}<div class="social-grid">${disciples.filter(n=>n.sect===s.place).map(n=>`<article class="social-card"><small>${sectRanks[n.rank]}</small><h3>${n.name}</h3><p>อยู่ที่: ${sites[npcSite(n)].name}</p><button data-visit="${n.id}" ${s.dead?'disabled':''}>ไปพบ · ไม่เสียปี</button><p>พลังรวม ${npcPower(n)} · ${weapons[n.weapon].name}</p><p>เขา${regard(deference(n))}เจ้า · ${deference(n)}/100<br>เจ้าประเมินศัตรู: ${effectivePower()>=npcPower(n)?'พลังของเจ้าเหนือกว่า':'คู่ต่อสู้แข็งแกร่งกว่า'}<br>ความแค้น ${s.grudges[n.id]}/100</p><button data-duel="${n.id}" data-mode="challenge" ${s.dead||!isNearby(n)?'disabled':''}>ท้าประลอง · 1 ปี</button><button class="danger" data-duel="${n.id}" data-mode="attack" ${s.dead||!isNearby(n)?'disabled':''}>โจมตี · 1 ปี</button></article>`).join('')}</div>`;
}
function duel(id,mode){
 const npc=disciples.find(n=>n.id===id);
 if(s.dead||!npc||!isNearby(npc)||!['challenge','attack'].includes(mode))return;
 if(mode==='attack'&&!confirm(`โจมตี${npc.name}? เสี่ยงเสียชีวิต มิตรภาพสำนัก -15 ชื่อเสียง -5 และความแค้น +25`))return;
 if(mode==='challenge'&&deference(npc)>=70&&s.grudges[id]<30){showBattle(npc,[],`${npc.name} ยำเกรงและยอมหลีกทาง ไม่มีผู้บาดเจ็บ`);finish(`${npc.name} คำนับและขอหลีกทาง เพราะยำเกรงบารมีของเจ้า`,'peace');return;}
 if(mode==='attack'){s.bonds[npc.sect]=Math.max(0,s.bonds[npc.sect]-15);s.fame=Math.max(0,s.fame-5);s.grudges[id]=Math.min(100,s.grudges[id]+25);}
 const friendly=mode==='challenge';let enemyHP=100;const rounds=[];
 for(let turn=1;turn<=8&&s.hp>0&&enemyHP>0;turn++){
  const dealt=roll(8,14)+Math.round(effectivePower()*.23),taken=roll(6,12)+Math.round(npcPower(npc)*.2),before=s.hp;
  enemyHP=Math.max(0,enemyHP-dealt);s.hp=Math.max(friendly?1:0,s.hp-taken);rounds.push({turn,dealt,taken:before-s.hp,hp:s.hp,enemyHP});
  if(friendly&&s.hp===1)break;
 }
 const won=enemyHP===0&&s.hp>(friendly?1:0),draw=enemyHP>0&&s.hp>1;
 let outcome=won?'เจ้าชนะการต่อสู้':draw?'ทั้งสองฝ่ายถอยออกจากการต่อสู้':s.hp===0?'เจ้าพ่ายแพ้และสิ้นชีวิต':'เจ้าพ่ายแพ้';
 s.exp+=won?20:8;
 if(friendly){s.bonds[npc.sect]=Math.min(100,s.bonds[npc.sect]+(won?5:2));if(won)s.fame+=4;}
 if(won&&s.sect===npc.sect&&friendly)s.merit+=5;
 outcome+=` · ค่าฝึกฝน +${won?20:8}`;
 showBattle(npc,rounds,outcome);finish(`${friendly?'ประลองกับ':'โจมตี'}${npc.name}: ${outcome} · พลังชีวิตเหลือ ${s.hp}`,'fight');
}
function showBattle(npc,rounds,outcome){
 const report=$('battle-report');report.hidden=false;
 report.innerHTML=`<h3>⚔ เจ้าปะทะ ${npc.name}</h3><p>${outcome}</p><div class="battle-rounds">${rounds.map((r,i)=>`<div class="battle-round" style="--delay:${i*.15}s"><span>ยก ${r.turn}</span><span class="strike">เจ้าโจมตี −${r.dealt}</span><span class="counter">ศัตรูตอบโต้ −${r.taken}</span><small>ชีวิตเจ้า ${r.hp} · ศัตรู ${r.enemyHP}</small></div>`).join('')}</div><small>ผลต่อสู้คำนวณครบแล้ว · ทั้งสองฝ่ายโจมตีพร้อมกันในแต่ละยก · ประลองหยุดที่ชีวิต 1 แต่การโจมตีอาจถึงตาย</small>`;
}
