const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:1300}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await require('./three-local')(p);await p.goto('file://'+require('path').join(__dirname,'..','index.html'));await p.waitForTimeout(500);
await p.evaluate(()=>{skXp('forge',400);skXp('escrime',60)});await p.waitForTimeout(400);
await p.click('[data-a=tab][data-v=skills]');await p.waitForTimeout(300);await p.screenshot({path:require('path').join(__dirname,'captures','sk.png')});
await p.evaluate(()=>{TAB='forge';render()});await p.click('[data-a=fbp][data-v=epee]');await p.click('[data-a=fore][data-v="1"]');await p.waitForTimeout(200);await p.screenshot({path:require('path').join(__dirname,'captures','sk2.png')});
console.log(errs);await b.close()})();
