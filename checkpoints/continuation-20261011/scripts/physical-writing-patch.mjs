export const physicalWritingPatch=String.raw`
/* PHYSICAL_WRITING_183 / SCRIPT_CONTEXT_184 / SCRIBE_TRANSACTIONS_185.
   Original schematic geometry, not copied font outlines or claimed facsimiles.
   Existing school positions, lesson costs, relic items and ward remain native. */
(function(){
 const SCRIPT_CONTEXT184={
  aegean:{sign:'𐀀',name:'Linear B sign B008: a',material:'A long clay account tablet rests beside a pointed stylus. Ruled lines separate the entries.',context:'Linear B records an early form of Greek, often in palace accounts. It is not the same script as Linear A, whose language remains undeciphered.',adaptation:'Historical note: this lesson selects Linear B, rather than claiming that Linear A can be translated. The sanctuary phrase is a fictional game gloss, not a translation of this single sign.'},
  egypt:{sign:'𓈗',name:'Three water ripples: water',material:'A wooden palette holds dark and red pigment. A reed rests beside a pale writing sheet; the stone example preserves the water ripples.',context:'Egyptian scribes used ink and writing palettes as well as inscriptions on stone. Monumental hieroglyphs and everyday cursive writing were not identical.',adaptation:'Historical note: this is a simplified recognition lesson, not a complete Egyptian language course. The practice clay is a reusable classroom exercise, not a claim that Egyptian records were all clay tablets.'},
  phoenicia:{sign:'𐤀',name:'Aleph: a consonant letter',material:'A cedar-coloured writing board and a narrow stylus lie beneath an inscribed stone. The letters run from right to left.',context:'Phoenician is a consonantal alphabet, not an Aegean syllabary. Aleph is a letter name; it is not simply the Greek vowel a.',adaptation:'Historical note: the familiar Phoenician alphabet belongs principally to the first millennium BCE. Its use here alongside Bronze Age palace scripts deliberately compresses different periods for the voyage; earlier Levantine alphabetic traditions were not identical.'},
  mesopotamia:{sign:'𒀀',name:'Sumerian sign A: water',material:'Wedge impressions cover a clay tablet. A cut reed stylus and a small cylinder seal lie beside it.',context:'Cuneiform is a writing system used for more than one language. Clay records could preserve accounts, letters and disputes, not just royal stories.',adaptation:'Historical note: A is used here with the Sumerian water gloss. That does not mean every cuneiform sign has one meaning in every language or period; the sanctuary phrase remains a fictional game gloss.'}
 };
 for(const[id,q]of Object.entries(SCRIPT_CONTEXT184))WRITING[id].glyphs=q.sign+' · '+q.name;
 function writingLines184(id){const q=SCRIPT_CONTEXT184[id];return[q.material,q.context,q.adaptation,'The raised marks are enlarged teaching diagrams, not facsimiles of a particular ancient document. The short final answers are game glosses, not whole inscriptions translated sign by sign.'];}
 // Paths are authored teaching diagrams. Their named Unicode exemplar is also
 // given as plain text, so the lesson never relies on recognising a font alone.
 function writingDiagram183(b,id,x,y,z,s=1){
  const stroke=(a,c)=>{const dx=c[0]-a[0],dy=c[1]-a[1],l=hyp(dx,dy);if(l)b.box(x+(a[0]+c[0])*s/2,y+(a[1]+c[1])*s/2,z,l*s,.023*s,.018,K.woodD,{rz:Math.atan2(dy,dx)});};
  const path=p=>{for(let i=1;i<p.length;i++)stroke(p[i-1],p[i]);};
  if(id==='egypt'){for(let r=0;r<3;r++){const p=[];for(let j=0;j<9;j++)p.push([-.46+j*.115,.22-r*.22+(j%2?.055:0)]);path(p);}}
  else if(id==='aegean'){const p=[];for(let i=0;i<=16;i++){const a=i/16*PI*2;p.push([Math.cos(a)*.19,.24+Math.sin(a)*.2]);}path(p);path([[0,.05],[0,-.48]]);path([[-.32,-.12],[.32,-.12]]);path([[-.28,-.31],[.28,-.31]]);}
  else if(id==='phoenicia'){path([[-.35,.4],[.3,-.35]]);path([[.22,.4],[-.32,.12],[.29,-.03]]);}
  else{for(let row=0;row<2;row++)for(let col=0;col<2;col++){const X=x+(-.28+col*.4)*s,Y=y+(.28-row*.34)*s;b.tri([X,Y,z],[X+.24*s,Y-.07*s,z],[X+.24*s,Y+.07*s,z],K.woodD);stroke([-.04+col*.4,.28-row*.34],[-.04+col*.4,.04-row*.34]);}}
 }
 engravedPanel=function(id,x,z,yaw=0){if(!SCRIPT_CONTEXT184[id])return null;const b=new Batch(),clay=id==='aegean'||id==='mesopotamia',back=clay?K.mud:K.stoneL;
  b.box(0,.16,0,2.45,.32,.95,K.stoneD).box(0,1.2,0,clay?2.7:2.4,clay?1.45:1.9,clay?.2:.26,back);
  if(clay){for(const yy of[.86,1.53])b.box(0,yy,.112,2.4,.018,.018,K.mudD);b.cyl(1.1,.43,.24,.018,.018,.62,6,K.reed||K.wood,{rz:.75});}
  if(id==='mesopotamia'){b.cyl(-.9,.43,.2,.08,.08,.2,10,K.stoneL,{rz:PI/2});for(let i=0;i<3;i++)b.box(-.96+i*.06,.51,.2,.015,.012,.1,K.woodD);}
  if(id==='egypt'){b.box(.8,.4,.25,.27,.06,.62,K.wood);for(const zz of[.08,.25])b.cyl(.8,.438,zz,.06,.06,.016,10,zz===.08?K.woodD:K.red);b.box(-.45,.36,.2,.75,.025,.43,K.cream).cyl(1,.42,.24,.014,.014,.66,6,K.wood,{rz:.2});}
  if(id==='phoenicia'){b.box(0,.38,.23,1.45,.08,.48,K.wood).box(0,.426,.23,1.28,.012,.33,K.woodD).box(.9,.47,.24,.025,.025,.57,K.wood,{rx:.1});}
  writingDiagram183(b,id,0,1.25,.145,1.15);
  const m=b.mesh();m.position.set(x,groundY(x,z),z);m.rotation.y=yaw;m.userData.writing183={script:id,schematic:true,exemplar:SCRIPT_CONTEXT184[id].name};OVER.add(m);return m;
 };
 let active185=null,dialogue185=null;
 function scribeReachable185(n){return !!n&&!!SCRIPT_CONTEXT184[n.script]&&SCRIPT_SCRIBES.includes(n)&&NPCS.includes(n)&&!n.dead&&!n.hostile&&!n._party&&!P.dead&&P.mode==='foot'&&(n.area||'over')===AREA&&Number.isFinite(n.x+n.z+P.x+P.z)&&hyp(n.x-P.x,n.z-P.z)<=3.4&&['play','talk'].includes(STATE);}
 function lessonStamp185(n){const q=literacyState()[n.script];return{game:G,q,stage:q.stage,accepted:q.accepted,fieldRead:q.fieldRead,relic:q.relic};}
 function lessonCurrent185(n,s){const q=literacyState()[n.script];return G===s.game&&q===s.q&&q.stage===s.stage&&q.accepted===s.accepted&&q.fieldRead===s.fieldRead&&q.relic===s.relic;}
 function invokeScribe185(n,action,stamp,root=false){if(!scribeReachable185(n))return toast('Approach the available scribe on foot to continue the lesson.');if(stamp&&!lessonCurrent185(n,stamp))return toast('The lesson has changed. Speak to the scribe again.');if(active185===n)return action();const oldSay=say,oldActive=active185;let first=root;active185=n;
  say=function(name,lines,done,choices){const snapshot=lessonStamp185(n),id=n.script;
   const fixed=lines.map(line=>typeof line==='string'?line.replace('The first sign in this exercise is glossed water.',id==='egypt'?'The three water ripples in this exercise are glossed water.':'The Sumerian sign A in this exercise is glossed water.').replace('You can now read '+WRITING[id].title+'.','You have completed these introductory '+WRITING[id].title+' exercises.').replace('I have given you two lumps of clay. Bring two fiber to bind a practice tablet.','I have given you two lumps of clay for a classroom practice tablet. Bring two fiber for its carrying tie; other regional records can use different materials.'):line);
   let list=choices;if(first){first=false;fixed.push('Ask about the writing materials for their uses and the historical setting.');list=[...(choices||[]),{t:'Examine the writing materials',go:()=>say(n.name,writingLines184(id),null,[{t:'Return to the current lesson',go:()=>scribeTalk(n)}])}];}
   const guarded=Array.isArray(list)?list.map(c=>({...c,go:typeof c.go==='function'?function(){const args=arguments;return invokeScribe185(n,()=>c.go.apply(this,args),snapshot);}:c.go})):list;
   return oldSay(name,fixed,typeof done==='function'?()=>invokeScribe185(n,done,snapshot):done,guarded);
  };try{return action();}finally{say=oldSay;active185=oldActive;}
 }
 const scribe185Before=scribeTalk;scribeTalk=function(n){return invokeScribe185(n,()=>scribe185Before.apply(this,arguments),null,true);};
 const line185Before=dlgLine;dlgLine=function(){const r=line185Before.apply(this,arguments);if(active185)dialogue185={n:active185,stamp:lessonStamp185(active185),lines:DLG.lines,choices:DLG.choices};const d=dialogue185;if(!d||d.lines!==DLG.lines||d.choices!==DLG.choices)return r;
  for(const b of $('dchoices').children){const click=b.onclick;if(typeof click!=='function')continue;b.onclick=function(event){if(STATE!=='talk'||DLG.lines!==d.lines||DLG.choices!==d.choices||!scribeReachable185(d.n)||!lessonCurrent185(d.n,d.stamp))return toast('This lesson is no longer available. Speak to the scribe again.');return click.call(this,event);};}return r;
 };
 // Native addScriptSchool captures the current function at creation. Existing
 // schools are wrapped once too, without changing identity/order or save keys.
 function bindScribes185(){for(const n of SCRIPT_SCRIBES){if(n.talk===scribeTalk||n.talk===n.scribeGuard185?.wrapped)continue;const original=n.talk;if(typeof original!=='function')continue;const wrapped=function(){const args=arguments;return invokeScribe185(n,()=>original.apply(this,args),null,true);};n.scribeGuard185={original,wrapped};n.talk=wrapped;}}
 const populate185Before=populate;populate=async function(){const r=await populate185Before.apply(this,arguments);bindScribes185();return r;};bindScribes185();
 Object.assign(globalThis,{SCRIPT_CONTEXT184,writingLines184,writingDiagram183,scribeReachable185,bindScribes185});
})();`;
