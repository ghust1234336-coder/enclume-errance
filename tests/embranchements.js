// Embranchements : vérifie l'apparition du choix de chemin et la résolution de chaque voie.
const {chromium}=require('playwright');const path=require('path');
const cap=n=>path.join(__dirname,'captures',n);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:1100}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+path.join(__dirname,'..','index.html'));await p.waitForTimeout(600);
// héros équipé d'une bonne épée, sans passer par la forge
await p.evaluate(()=>{const it=makeItem('epee',3,2,90,null,[]);it.atk*=4;S.items.push(it);S.equip.arme=it.id;S.potions=9;TAB='exp';render()});
const KEYS=['route','grotte','pont','camp','ruines','taniere','raccourci','sanctuaire'];
const out={};
for(const k of KEYS){
  await p.evaluate(()=>{S.run=null;closeModal();depart(0)});await p.waitForTimeout(1600);
  // force un embranchement à la profondeur suivante, avec la voie testée
  await p.evaluate(k=>{const r=S.run;r.ph='choice';r.enemy=null;r.depth=1;r.plan={2:'fork',3:'combat'};BUSY=false;walkThen(()=>{step();if(!S.run.fork.includes(k))S.run.fork[S.run.fork.length-1]=k;render()})},k);
  await p.waitForTimeout(1700);
  if(k==='route')await p.screenshot({path:cap('fork1.png')});
  const n=await p.$$eval('.fopt',x=>x.length);
  await p.click(`.fopt[data-v=${k}]`);await p.waitForTimeout(400);
  if(k==='grotte')await p.screenshot({path:cap('fork2.png')});
  // résout jusqu'au retour au choix
  for(let i=0;i<40;i++){
    const ph=await p.evaluate(()=>S.run&&S.run.ph);if(ph==='choice'||ph==null)break;
    const c=await p.$('[data-a=cact][data-v=atk]:not([disabled])');if(c){await c.click();await p.waitForTimeout(1300);continue}
    const m=await p.$('[data-a=mine]');if(m){await m.click();continue}
    const o=await p.$('[data-a=openchest]:not([disabled])');if(o){await o.click();await p.waitForTimeout(500);await p.evaluate(()=>{chestSkip();chestSkip()});await p.waitForTimeout(400);continue}
    await p.waitForTimeout(300);
  }
  out[k]={options:n,ph:await p.evaluate(()=>S.run&&S.run.ph),depth:await p.evaluate(()=>S.run&&S.run.depth),log:await p.evaluate(()=>S.run?S.run.log.slice(-4):[])};
}
// génération : statistiques sur 300 embranchements
const stat=await p.evaluate(()=>{const c={};for(let i=0;i<300;i++){S.run.depth=i%5===4?3:1;for(const k of genFork())c[k]=(c[k]||0)+1}return c});
// fréquence sur le sentier
const freq=await p.evaluate(()=>{let f=0;for(let i=0;i<200;i++){S.run.plan={};for(let d=1;d<=20;d++)if(planAt(d)==='fork')f++}return f/200});
console.log(JSON.stringify(out,null,1));console.log('options',stat,'embranchements par 20 profondeurs',freq);
console.log('ERR',errs);await b.close()})();
