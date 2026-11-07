// Sert Three.js depuis node_modules (npm install) à la place du CDN, pour tester hors ligne.
module.exports=async p=>{await p.route('**/three.min.js',r=>r.fulfill({path:require.resolve('three/build/three.min.js'),contentType:'application/javascript'}))};
