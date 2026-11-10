// Sert Three.js (et ses scripts de post-traitement) depuis node_modules (npm install) à la place des CDN, pour tester hors ligne.
const path=require('path'),root=path.dirname(require.resolve('three/package.json'));
module.exports=async p=>{await p.route('**/three.min.js',r=>r.fulfill({path:path.join(root,'build/three.min.js'),contentType:'application/javascript'}));
  await p.route('**/three@0.128.0/examples/js/**',r=>r.fulfill({path:path.join(root,'examples/js',r.request().url().split('/examples/js/')[1]),contentType:'application/javascript'}))};
