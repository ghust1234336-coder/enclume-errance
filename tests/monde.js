// Monde : village (déplacement, bâtiments), île (rencontre, combat, coffre).
const {chromium}=require('playwright');const SP=require('path').join(__dirname,'captures');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await require('./three-local')(p);await p.goto('file://'+require('path').join(__dirname,'..','index.html'));await p.waitForTimeout(900);
await p.screenshot({path:SP+'/w1.png'});
// marcher vers la forge au clavier
await p.keyboard.down('ArrowLeft');await p.keyboard.down('ArrowUp');await p.waitForTimeout(1600);await p.keyboard.up('ArrowLeft');await p.keyboard.up('ArrowUp');
await p.screenshot({path:SP+'/w2.png'});
console.log('near',await p.evaluate(()=>HUB.near&&HUB.near.id));
await p.evaluate(()=>{const w=makeItem('epee',2,2,85,null,[]);S.items.push(w);S.equip.arme=w.id;const s=makeItem('bouclier',2,1,85,null,[]);S.items.push(s);S.equip.bouclier=s.id;S.potions=5;depart(1)});
await p.waitForTimeout(900);await p.screenshot({path:SP+'/w3.png'});
// téléporter près d'un ennemi
await p.evaluate(()=>{const m=isle();const e=m.ents.find(e=>e.type==='enemy'&&!e.boss);HUBI.x=e.x-20;HUBI.y=e.y;HUBI.grace=0;e.wx=e.x;e.wy=e.y});
await p.waitForTimeout(1500);console.log('ph',await p.evaluate(()=>S.run.ph));await p.screenshot({path:SP+'/w4.png'});
await p.evaluate(()=>{if(S.run.enemy)S.run.enemy.hp=1});
for(let i=0;i<10;i++){const c=await p.$('[data-a=cact][data-v=atk]:not([disabled])');if(c){await c.click();await p.waitForTimeout(1600)}if(await p.evaluate(()=>S.run.ph==='choice'))break;await p.waitForTimeout(300)}
await p.waitForTimeout(800);console.log('after',await p.evaluate(()=>[S.run.ph,Object.keys(S.run.done)]));
await p.evaluate(()=>{const m=isle();const e=m.ents.find(e=>e.type==='chest');HUBI.x=e.x;HUBI.y=e.y+20});await p.waitForTimeout(400);
await p.screenshot({path:SP+'/w5.png'});
await p.keyboard.press('KeyE');await p.waitForTimeout(500);console.log('chest ph',await p.evaluate(()=>S.run.ph));
console.log('ERR',errs);await b.close()})();
