const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+require('path').join(__dirname,'..','index.html'));await p.waitForTimeout(800);
await p.screenshot({path:require('path').join(__dirname,'captures','f0.png')});
await p.click('[data-a=fbp][data-v=epee]');await p.click('[data-a=fore][data-v="1"]');await p.click('[data-a=fpart]');
await p.click('[data-a=forge]');await p.waitForTimeout(1600);
for(let i=0;i<80;i++){if(await p.$('[data-a=equipNew]'))break;await p.keyboard.down('Space');await p.waitForTimeout(i%3==0?900:200);if(i==2)await p.screenshot({path:require('path').join(__dirname,'captures','f1.png')});if(i==20)await p.screenshot({path:require('path').join(__dirname,'captures','f2.png')});await p.keyboard.up('Space');await p.waitForTimeout(250)}
await p.waitForTimeout(1200);await p.screenshot({path:require('path').join(__dirname,'captures','f4.png')});
const eq=await p.$('[data-a=equipNew]');console.log('result?',!!eq);if(eq)await eq.click();
await p.click('[data-a=tab][data-v=exp]');await p.waitForTimeout(500);await p.screenshot({path:require('path').join(__dirname,'captures','m1.png')});
await p.click('[data-a=depart]');
let shot=0;
for(let k=0;k<60;k++){
  await p.waitForTimeout(250);
  if(await p.$('#modal:not([hidden]) [data-a=close]')){await p.click('#modal [data-a=close]');continue}
  const c=await p.$('[data-a=cact][data-v=atk]:not([disabled])');if(c){if(shot++===1)await p.screenshot({path:require('path').join(__dirname,'captures','e1.png')});await c.click();await p.waitForTimeout(1200);continue}
  const o=await p.$('[data-a=openchest]:not([disabled])');if(o){await o.click();await p.waitForTimeout(400);await p.screenshot({path:require('path').join(__dirname,'captures','e2.png')});await p.waitForTimeout(800);continue}
  const m=await p.$('[data-a=mine]');if(m){await m.click();continue}
  const n=await p.$('[data-a=continue]:not([disabled])');if(n){await n.click();await p.waitForTimeout(700);await p.screenshot({path:require('path').join(__dirname,'captures','e3.png')});continue}
  if(await p.$('#mapCv'))break;
}
await p.screenshot({path:require('path').join(__dirname,'captures','e4.png')});
await p.click('[data-a=tab][data-v=equip]').catch(()=>{});await p.waitForTimeout(400);await p.screenshot({path:require('path').join(__dirname,'captures','q1.png')});
console.log('ERR',errs);await b.close()})();
