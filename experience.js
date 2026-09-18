// Independent, scroll-linked scenes. All text remains ordinary accessible HTML.
import {clamp, storyBlend, constellation} from './experience-geometry.js';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const coarse = matchMedia('(pointer: coarse)');
const root = document.documentElement;
const toggle = document.getElementById('motion-toggle');
const hero = document.querySelector('.masthead');
const flow = document.querySelector('.knowledge-flow');
const coast = document.querySelector('.nature-break');
const stories = [...document.querySelectorAll('[data-work]')];
const workVisual = document.querySelector('.work-visual');
workVisual.hidden = false;
const entries = [...document.querySelectorAll('.entry')];
const fleet = document.getElementById('fleet-links');
const fleetCaption = document.getElementById('fleet-caption-detail');
const scenes = [...document.querySelectorAll('canvas[data-scene]')].map(canvas => ({canvas, ctx: canvas.getContext('2d'), name: canvas.dataset.scene})).filter(x => x.ctx);
let paused = false, queued = 0, pointer = 0, selectedPoint = -1, lastScroll = scrollY;
let workIndex = 0, workProgress = 0, workBlend = 0;
const names = ['Holocron', 'Jedi Archives', 'Autotests Portal', 'Customer Chatbot'];
const descriptions = ['Source knowledge → relevant context', 'Documentation → answers with sources', 'Generate → run → inspect → repeat', 'Product knowledge → customer answers'];
const progressRail = document.createElement('div');
progressRail.className = 'reading-progress'; progressRail.setAttribute('aria-hidden', 'true'); document.body.append(progressRail);

// Each constellation point is a real, keyboard-accessible link to one project.
const constellationPoints = constellation(entries.length);
const points = entries.map((entry, i) => {
  const p = constellationPoints[i];
  const a = document.createElement('a'); a.href = '#' + entry.id; a.className = 'fleet-point';
  a.setAttribute('aria-label', entry.querySelector('.name').textContent);
  a.title = entry.querySelector('.name').textContent;
  a.style.left = `${p.x * 100}%`; a.style.top = `${p.y * 100}%`;
  a.addEventListener('pointerenter', () => { selectedPoint = i; fleetCaption.textContent = a.title; schedule(); });
  a.addEventListener('focus', () => { selectedPoint = i; fleetCaption.textContent = a.title; schedule(); });
  const clear = () => { selectedPoint = -1; fleetCaption.textContent = 'Explore the connections.'; schedule(); };
  a.addEventListener('pointerleave', clear); a.addEventListener('blur', clear);
  fleet.append(a); return {...p, a, entry};
});
fleet.closest('.fleet-visual').hidden = false;
function prepare(s) {
  const r = s.canvas.getBoundingClientRect();
  if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) return null;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  if (s.canvas.width !== Math.round(r.width * dpr) || s.canvas.height !== Math.round(r.height * dpr)) {
    s.canvas.width = Math.round(r.width * dpr); s.canvas.height = Math.round(r.height * dpr);
  }
  s.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); s.ctx.clearRect(0, 0, r.width, r.height);
  return {c: s.ctx, w: r.width, h: r.height};
}
function line(c, pts, color = '#83c7ef66', width = 1) {
  c.strokeStyle = color; c.lineWidth = width; c.beginPath();
  pts.forEach((p, i) => i ? c.lineTo(p[0],p[1]) : c.moveTo(p[0],p[1])); c.stroke();
}
function dot(c,x,y,r=2,color='#bde6ff') { c.fillStyle=color; c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill(); }
function text(c,word,x,y,size=14,color='#b9ddf2') { c.fillStyle=color;c.font=`${size}px Arial`;c.fillText(word,x,y); }
function box(c,x,y,w,h,label) {
  c.fillStyle='#1c2a35';c.strokeStyle='#6b9fb977';c.lineWidth=1;c.fillRect(x,y,w,h);c.strokeRect(x,y,w,h);
  if(label)text(c,label,x+12,y+22,12);
}
function drawHero({c,w,h}, p) {
  // A sparse, curved data current across the photograph, not a replacement for it.
  for(let lane=0;lane<9;lane++) {
    const pts=[];
    for(let i=0;i<=80;i++) { const x=i/80; pts.push([x*w, h*(.45+Math.sin(x*5+p*2+lane*.2)*.13+lane*.025)]); }
    line(c,pts,`rgba(174,220,248,${.1+lane*.014})`,.8);
    for(let j=0;j<4;j++){const t=(j*.23+lane*.037+p*.25)%1;const at=pts[Math.floor(t*80)];dot(c,at[0],at[1],lane%3===0?2:1);}
  }
}
function drawWork({c,w,h}, idx, p) {
  // Diagram-like illustrations, not dashboards or claims of live production state.
  const mobile = w < 500 && h < 300;
  c.save();
  if(mobile){c.translate(w*.42,0);c.scale(w*.58/600,h/500);}
  else {c.scale(w/600,h/750);}
  const cy=mobile?235:310, drift=(p-.5)*22;
  c.translate(pointer*8,drift);
  for(let i=0;i<45;i++)dot(c,40+(i*83)%520,80+(i*97)%(mobile?330:410),.7,'#7399ad55');
  if(idx===0) {
    // Source fragments fan into a retrieval core and become context.
    for(let j=0;j<5;j++) {
      const y=cy-145+j*66;box(c,35,y,115,48,'SOURCE '+String(j+1).padStart(2,'0'));
      line(c,[[150,y+24],[210,y+24],[255,cy]],'#81c5ed70');
      const t=(p*1.5+j*.17)%1;dot(c,150+t*105,(y+24)*(1-t)+cy*t,3);
    }
    c.strokeStyle='#a9dcf7';c.lineWidth=1.5;
    for(let ring=0;ring<4;ring++){c.beginPath();c.ellipse(305,cy,45+ring*12,45+ring*12,.35+p*.7,0,Math.PI*2);c.stroke();}
    text(c,'RETRIEVE',275,cy+5,12);line(c,[[380,cy],[440,cy]],'#9dd5f5');
    box(c,442,cy-55,120,110,'CONTEXT');for(let j=0;j<4;j++)line(c,[[454,cy-15+j*17],[540-(j%2)*18,cy-15+j*17]],'#b4dfff88');
  } else if(idx===1) {
    for(let j=0;j<6;j++) {
      const angle=j*Math.PI/3+p*.25;const x=300+Math.cos(angle)*175,y=cy+Math.sin(angle)*130;
      line(c,[[x,y],[300,cy]],'#73b9e855');box(c,x-47,y-36,94,72,['MANUAL','FAQ','GUIDE','ARTICLE','REFERENCE','HELP'][j]);
      for(let k=0;k<2;k++)line(c,[[x-34,y+k*12],[x+25,y+k*12]],'#b0dfff77');
    }
    c.fillStyle='#233d4f';c.beginPath();c.arc(300,cy,50,0,Math.PI*2);c.fill();
    c.strokeStyle='#bde6ff';c.lineWidth=2;c.beginPath();c.arc(295,cy-5,17,0,Math.PI*2);c.stroke();line(c,[[307,cy+8],[325,cy+26]],'#bde6ff',2);
  } else if(idx===2) {
    const labels=['AUTHOR','GENERATE','RUN','REVIEW'];
    labels.forEach((s,j)=>{const x=52+j*135;box(c,x,cy-55,100,85,s);if(j<3)line(c,[[x+100,cy-10],[x+135,cy-10]],'#92d1f2');dot(c,x+50,cy+3,6,j<=Math.floor(p*4)?'#bde6ff':'#405b6c');});
    line(c,[[507,cy+40],[507,cy+108],[102,cy+108],[102,cy+40]],'#75b7de88');
    text(c,'REPEATABLE VERIFICATION',176,cy+151,13);
    const t=p%1;dot(c,102+t*405,cy+108,4,'#f2683c');
  } else {
    box(c,52,cy-115,230,65,'CUSTOMER QUESTION');
    line(c,[[282,cy-82],[390,cy-82],[390,cy-20]],'#91cff1');
    box(c,310,cy-20,225,110,'GROUNDED ANSWER');
    for(let j=0;j<3;j++)line(c,[[326,cy+18+j*15],[505-j*17,cy+18+j*15]],'#b0dfff99');
    box(c,55,cy+40,180,92,'PRODUCT KNOWLEDGE');line(c,[[235,cy+84],[270,cy+84],[270,cy+40],[310,cy+40]],'#91cff1');
    text(c,'SOURCES INCLUDED',335,cy+120,12);dot(c,270,cy+84-p*44,4,'#bde6ff');
  }
  c.restore();
}
function drawFleet({c,w,h}) {
  const visible=points.filter(x=>!x.entry.hidden);
  visible.forEach((a,i)=>{
    const j=(i+7)%visible.length,b=visible[j];if(!b)return;
    const active=selectedPoint>=0&&(points[selectedPoint]===a||points[selectedPoint]===b);
    line(c,[[a.x*w,a.y*(h-48)],[b.x*w,b.y*(h-48)]],active?'#f2683caa':'#7db8db25',active?1.5:.7);
  });
}
function drawContact({c,w,h},p) {
  for(let i=0;i<12;i++){c.strokeStyle='#5796c5';c.lineWidth=1;c.beginPath();c.ellipse(w*.83,h*.5,40+i*22,65+i*15,p*.5+i*.06,0,Math.PI*2);c.stroke();}
}
function update() {
  queued=0;
  const staticMode=paused||reduced.matches;
  if(!staticMode) lastScroll=scrollY;
  const y=lastScroll;
  if (!staticMode) {
    hero.style.setProperty('--photo-y',`${clamp(y*.19,0,120)}px`);
    const cr=coast.getBoundingClientRect();coast.style.setProperty('--coast-y',`${-8+clamp((innerHeight-cr.top)/(innerHeight+cr.height))*12}%`);
    const fr=flow.getBoundingClientRect();const fp=clamp((innerHeight-fr.top)/Math.max(1,innerHeight*.75));
    flow.style.setProperty('--flow',String(fp));
    flow.querySelectorAll('.flow-node').forEach((node,i)=>node.style.setProperty('--node-lift',`${(1-clamp(fp*1.6-i*.18))*32}px`));
  }
  if(reduced.matches){hero.style.removeProperty('--photo-y');coast.style.removeProperty('--coast-y');flow.style.setProperty('--flow','1');flow.querySelectorAll('.flow-node').forEach(x=>x.style.removeProperty('--node-lift'));}
  // Crossfade illustrations at story boundaries; scroll back to reverse them.
  if(reduced.matches) { workBlend=0;workIndex=0;workProgress=.5; }
  else if(!paused) {
    workBlend=storyBlend(stories.map(el=>el.getBoundingClientRect().top),innerHeight);
    workIndex=Math.round(workBlend);
    const r=stories[workIndex].getBoundingClientRect();workProgress=reduced.matches ? .5 : clamp((innerHeight*.7-r.top)/(r.height+innerHeight*.25));
  }
  document.getElementById('work-label').textContent=names[workIndex];
  document.getElementById('work-description').textContent=descriptions[workIndex];
  document.getElementById('work-counter').textContent=`0${workIndex+1} / 04`;
  workVisual.dataset.scene=String(workIndex);
  document.querySelectorAll('.work-dots i').forEach((el,i)=>el.classList.toggle('active',i===workIndex));
  points.forEach(p=>p.a.hidden=p.entry.hidden);
  scenes.forEach(s=>{const v=prepare(s);if(!v)return;
    if(s.name==='hero')drawHero(v,reduced.matches ? .4 : y/800);
    if(s.name==='work'){
      const base=Math.floor(workBlend), fraction=workBlend-base;
      v.c.globalAlpha=1-fraction;drawWork(v,base,workProgress);
      if(fraction>0){v.c.globalAlpha=fraction;drawWork(v,Math.min(3,base+1),workProgress);}
      v.c.globalAlpha=1;
    }
    if(s.name==='fleet')drawFleet(v);
    if(s.name==='contact')drawContact(v,reduced.matches ? .5 : y/2000);
  });
  progressRail.style.transform=`scaleX(${clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;
}
function schedule(){if(!queued&&!document.hidden)queued=requestAnimationFrame(update);}
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
document.addEventListener('visibilitychange',schedule);document.addEventListener('toggle',schedule,true);
document.getElementById('filters')?.addEventListener('click',schedule);
new ResizeObserver(schedule).observe(document.querySelector('main'));
workVisual.addEventListener('pointermove',e=>{if(paused||reduced.matches||coarse.matches)return;const r=workVisual.getBoundingClientRect();pointer=(e.clientX-r.left)/r.width-.5;schedule();});
workVisual.addEventListener('pointerleave',()=>{pointer=0;schedule();});
reduced.addEventListener('change',schedule);
toggle.hidden=false;
toggle.addEventListener('click',()=>{paused=!paused;root.dataset.motion=paused?'paused':'running';toggle.textContent=paused?'Resume motion':'Pause motion';toggle.setAttribute('aria-pressed',String(paused));schedule();});
update();
