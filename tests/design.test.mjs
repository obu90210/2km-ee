import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const themeSource=readFileSync(new URL('../theme.js',import.meta.url),'utf8');
for(const saved of [null,'invalid','light','dark']){
  const document={documentElement:{dataset:{}}};
  runInNewContext(themeSource,{document,localStorage:{getItem:()=>saved},matchMedia:()=>({matches:true})});
  assert.equal(document.documentElement.dataset.theme,saved==='dark'?'dark':'light','Saved choice wins; otherwise light, even with a dark OS preference');
}
{
  const document={documentElement:{dataset:{}}};
  runInNewContext(themeSource,{document,localStorage:{getItem(){throw new Error('Storage blocked');}}});
  assert.equal(document.documentElement.dataset.theme,'light','Blocked storage defaults to light');
}
const scriptSource=readFileSync(new URL('../script.js',import.meta.url),'utf8');
for(const initial of [undefined,'light','dark']){
  const handlers={};const saved=[];
  const button={addEventListener:(name,handler)=>{handlers[name]=handler;}};
  const document={documentElement:{dataset:initial?{theme:initial}:{}},getElementById:id=>id==='theme-toggle'?button:null,querySelectorAll:()=>[],addEventListener(){}};
  runInNewContext(scriptSource,{document,window:{addEventListener(){}},location:{hash:''},matchMedia:()=>({matches:true}),localStorage:{setItem:(key,value)=>saved.push([key,value])}});
  assert.equal(button.textContent,initial==='dark'?'◐ LIGHT':'◑ DARK','Toggle label agrees with the light default');
  handlers.click();
  const next=initial==='dark'?'light':'dark';
  assert.equal(document.documentElement.dataset.theme,next,'Toggle still switches both ways');
  assert.deepEqual(saved,[['theme',next]],'Explicit theme choice is saved');
}
console.log('PASS: light default, saved choices, blocked storage and theme toggling');
const css = readFileSync(new URL('../style.css',import.meta.url),'utf8');
function values(pattern) {
  const match=css.match(pattern);assert.ok(match,'Theme block exists');
  return Object.fromEntries([...match[1].matchAll(/(--[a-z-]+):\s*(#[0-9a-f]{6});/g)].map(m=>[m[1],m[2]]));
}
const light=values(/:root\s*\{([\s\S]*?)\}/);
const dark={...light,...values(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\}/)};
assert.ok(!css.includes('prefers-color-scheme'),'Without JavaScript, the reading theme also defaults to light');
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
