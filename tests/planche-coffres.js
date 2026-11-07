const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:700}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await require('./three-local')(p);await p.goto('file://'+require('path').join(__dirname,'..','index.html'));await p.waitForTimeout(600);
await p.evaluate(()=>{const c=document.createElement('canvas');c.width=1300;c.height=620;c.id='sheet';document.body.prepend(c);const g=c.getContext('2d');g.fillStyle='#3b3a7a';g.fillRect(0,0,1300,620);G=g;
 for(let r=0;r<6;r++){for(const[o,yy]of[[0,240],[1,540]]){g.save();g.translate(80+r*205,yy);g.scale(1.25,1.25);drawChest3D(r,o,1);g.restore()}}
 c.style.cssText='position:absolute;left:0;top:0;z-index:999';});
await p.waitForTimeout(200);await (await p.$('#sheet')).screenshot({path:require('path').join(__dirname,'captures','chests.png')});console.log(errs);await b.close()})();
