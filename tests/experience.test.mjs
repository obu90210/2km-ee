import assert from 'node:assert/strict';
import fs from 'node:fs';
import {clamp, storyBlend, constellation} from '../experience-geometry.js';
assert.equal(clamp(-2),0); assert.equal(clamp(2),1);
assert.equal(storyBlend([100,1000,2000,3000],1000),0);
assert.equal(storyBlend([-500,500,1500,2500],1000),.5);
assert.equal(storyBlend([-1000,0,1000,2000],1000),1);
assert.equal(storyBlend([-3000,-2000,-1000,0],1000),3);
const positions=[0,850,1700,2550];
let previous=0;
for(let scroll=0;scroll<=3500;scroll+=10){const tops=positions.map(p=>p-scroll);const state=storyBlend(tops,900);assert.ok(state>=previous&&state<=3);assert.equal(state,storyBlend(tops,900));previous=state;}
const points=constellation(31);assert.equal(points.length,31);assert.deepEqual(points,constellation(31));assert.ok(points.every(p=>p.x>.05&&p.x<.95&&p.y>.1&&p.y<.9));
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.equal((html.match(/data-scene=/g)||[]).length,4);
assert.equal((html.match(/data-work=/g)||[]).length,4);
assert.ok(!html.includes('data-journey'));
assert.ok(html.includes('/photo-credits.html'));
for(const name of ['experience.js','experience-geometry.js','experience.css','photo-credits.html','assets/viru-bog.jpg','assets/kasmu-coast.jpg']) assert.ok(fs.existsSync(new URL('../'+name,import.meta.url)));
console.log('PASS: scroll boundaries, reversible deterministic transitions, bounded 31-point constellation, scene markup and assets');
