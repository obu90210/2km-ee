import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../style.css',import.meta.url),'utf8');
function values(pattern) {
  const match=css.match(pattern);assert.ok(match,'Theme block exists');
  return Object.fromEntries([...match[1].matchAll(/(--[a-z-]+):\s*(#[0-9a-f]{6});/g)].map(m=>[m[1],m[2]]));
}
const light=values(/:root\s*\{([\s\S]*?)\}/);
const dark={...light,...values(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\}/)};
const systemDark={...light,...values(/:root:not\(\[data-theme="light"\]\)\s*\{([\s\S]*?)\}/)};
assert.deepEqual(systemDark,dark,'System dark and selected dark use the same colour roles');
const lum=hex=>{const rgb=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
for(const [theme,tokens]of Object.entries({light,dark})){
  for(const role of ['--action','--action-ink','--focus'])assert.ok(tokens[role],theme+' needs '+role);
  let minimum=Infinity;
  for(const surface of ['--paper','--paper-raise'])for(const ink of ['--ink','--muted','--faint','--accent','--live','--warn','--blocked']){
    const contrast=ratio(tokens[ink],tokens[surface]);minimum=Math.min(minimum,contrast);
    assert.ok(contrast>=4.5,`${theme} ${ink}/${surface}: ${contrast.toFixed(2)}`);
  }
  assert.ok(ratio(tokens['--action'],tokens['--action-ink'])>=4.5,theme+' action text');
  for(const surface of ['--paper','--paper-raise']){
    assert.ok(ratio(tokens['--hair'],tokens[surface])>=3,theme+' visible control border');
    assert.ok(ratio(tokens['--focus'],tokens[surface])>=3,theme+' focus visibility');
  }
  assert.ok(tokens['--scene-focus'],'Dark scenes need a dedicated focus role');
  assert.ok(ratio(tokens['--scene-focus'],tokens['--scene-bg'])>=3,theme+' scene focus visibility');
  console.log(`PASS: ${theme} text/status contrast minimum ${minimum.toFixed(2)}:1, readable action/control/focus roles`);
}
const og=readFileSync(new URL('../og-image.png',import.meta.url));
assert.deepEqual([...og.subarray(0,8)],[137,80,78,71,13,10,26,10],'Social PNG must contain actual PNG data');
assert.equal(og.readUInt32BE(16),1200);assert.equal(og.readUInt32BE(20),630);
