const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:760}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await require('./three-local')(p);await p.goto('file://'+require('path').join(__dirname,'..','index.html'));await p.waitForTimeout(600);
for(const r of [1,5]){
await p.evaluate(r=>{S.run={zone:2,depth:6,hp:90,bag:{gold:0,list:[]},log:[],ph:'chest',chest:{r},plan:{}};TAB='exp';render();openChest()},r);
await p.waitForTimeout(900);await p.screenshot({path:require('path').join(__dirname,'captures',`c${r}a.png`)});
await p.click('#chBtn');await p.waitForTimeout(250);await p.screenshot({path:require('path').join(__dirname,'captures',`c${r}b.png`)});
await p.waitForTimeout(2600);await p.screenshot({path:require('path').join(__dirname,'captures',`c${r}c.png`)});
await p.click('#chSkip');await p.waitForTimeout(400);await p.screenshot({path:require('path').join(__dirname,'captures',`c${r}d.png`)});
await p.click('#chBtn');await p.waitForTimeout(300);
}
console.log(errs);await b.close()})();
