// Génération des îles : filons dans les zones rocheuses, coffres placés pour une raison, arène du gardien accessible et loin du navire.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await require('./three-local')(p);await p.goto('file://'+require('path').join(__dirname,'..','index.html'));await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{const o={iles:0,filons:0,filonsRoche:0,coffres:0,coffresGardes:0,raisons:{},grottes:0,arenesAccessibles:0,arenesLoin:0};
 for(let z=0;z<6;z++)for(let sd=1;sd<=20;sd++){const m=genIsland(z,sd*7919,sd%2);o.iles++;const bi=m.boss[1]*m.W+m.boss[0];if(m.dist[bi]>=0)o.arenesAccessibles++;if(m.dist[bi]>=m.maxD*.8)o.arenesLoin++;
  const en=m.ents.filter(e=>e.type==='enemy'&&!e.boss);
  for(const e of m.ents){const i=Math.floor(e.y/TS)*m.W+Math.floor(e.x/TS);if(e.type==='vein'){o.filons++;if(m.t[i]===3)o.filonsRoche++}
   if(e.type==='chest'){o.coffres++;o.raisons[e.why]=(o.raisons[e.why]||0)+1;if(en.some(g=>Math.hypot(g.x-e.x,g.y-e.y)<3.2*TS))o.coffresGardes++}
   if(e.type==='poi'&&e.k==='grotte')o.grottes++}}return o});
console.log(JSON.stringify(r));
const ok=r.filons===r.filonsRoche&&r.arenesAccessibles===r.iles&&r.arenesLoin>=r.iles*.85&&!r.raisons.undefined;
console.log(ok?'OK':'ÉCHEC');console.log('ERR',errs);await b.close();process.exit(ok?0:1)})();
