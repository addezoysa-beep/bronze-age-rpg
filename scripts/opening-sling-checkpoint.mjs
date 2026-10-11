export const slingLessonRuntime = `
function grantSlingLesson60(n){
 ensurePolish();
 if(['intro','wool'].includes(opening25().stage))return say(n.name,['Help Lykos finish the shearing first, shepherd boy. I will keep a sling ready for you.']);
 if(G.trainingTask&&G.trainingTask!=='sling'){
  if(G.trainingProg>=3){G.training[G.trainingTask]=1;G.trainingTask=G.trainingLoan=null;G.trainingProg=0;}
  else return say(n.name,['Your '+G.trainingTask+' lesson is unfinished. You may return to it later; the sling will help you on the road to Pan.'],null,[
   {t:'Set that drill aside and learn the sling',go:()=>{G.trainingTask=G.trainingLoan=null;G.trainingProg=0;grantSlingLesson60(n);}},
   {t:'Continue my current lesson',go:()=>lessonTalk26Before(n)}
  ]);
 }
 if(G.trainingTask==='sling'&&G.trainingProg>=3){
  G.training.sling=1;G.trainingTask=G.trainingLoan=null;G.trainingProg=0;hudAll();hudQuest();save();
  return say(n.name,['Three clean hits. Keep the sling, Aris. Search the captain’s stores in the Cave of Pan, and bring what you find back into the light.']);
 }
 const certified=G.training.sling||0,existing=G.own.sling>0;
 const held=Object.keys(G.inv).find(k=>k.startsWith('sling_')&&G.inv[k]>0);
 const key=held||('sling_'+(existing?(G.weaponMaterials?.sling||'wood'):'wood')),mat=key.slice(6);
 if(!held)G.inv[key]=1;
 G.own.sling=Math.max(1,G.own.sling||0);G.weaponMaterials||={};G.weaponMaterials.sling=mat;
 if(!certified){if(G.trainingTask!=='sling')G.trainingProg=0;G.trainingTask=G.trainingLoan='sling';}
 if(!G.slingLessonStones){G.inv.stone=(G.inv.stone||0)+12;G.slingLessonStones=true;}
 equipHand(key,'right');G.training.sling=certified;hudAll();hudQuest();save();
 return say(n.name,[certified?'Keep your distance and load deliberately. You already know the rhythm.':'This wooden sling is yours. Hold it in your right hand and load one stone at a time.',
  certified?'Follow the king’s trail into Pan; watch for the captain’s stores.':'Land three sling hits on the straw range targets or a real enemy, then return to me. You have '+(G.trainingProg||0)+'/3 clean hits.',
  'Your first pouch holds twelve stones. Gather loose stones or buy another pouch when it runs dry.']);
}
let slingCredit60=false;
const slingTraining60Before=trainingProgress;trainingProgress=function(kind){
 if(kind==='sling'&&!slingCredit60)return;
 return slingTraining60Before(kind);
};
function creditSlingHit60(){const before=slingCredit60;slingCredit60=true;try{trainingProgress('sling');}finally{slingCredit60=before;}}
function slingProjectileDamage60(e,p,kb){
 const hp=e.hp,alive=e.alive;dmgEnemy(e,p.dmg,p.vx,p.vz,kb);
 if(p.kind==='stone'&&p.from==='p'&&alive&&(e.trainingDummy||e.hp<hp))creditSlingHit60();
}
function slingRangeHit60(p){
 if(p.kind!=='stone'||p.from!=='p'||p.area!=='over')return false;
 const t=TARGETS30.find(t=>Math.hypot(t.x-p.x,t.y-p.y,t.z-p.z)<.72);
 if(!t)return false;
 contactFx14(t.x,t.y,t.z,'wood',4);localSfx('targetHit',t.x,t.z,6,28);creditSlingHit60();return true;
}
`;
export function applyOpeningSlingCheckpoint(html){
 const anchor='const tutorial35Before=tutorialTalk2;tutorialTalk2=function(n)';
 if(html.split(anchor).length!==2)throw Error('Expected final Phocas menu');
 html=html.replace(anchor,slingLessonRuntime+'\n'+anchor);
 const menu="{t:'Learn the sling / finish a weapon lesson',go:()=>lessonTalk26Before(n)}";
 if(html.split(menu).length!==2)throw Error('Expected sling choice');
 html=html.replace(menu,"{t:G.training.sling?'Review sling technique':G.trainingTask==='sling'?'Continue / finish the sling lesson':'Receive a sling and learn to use it',go:()=>grantSlingLesson60(n)}");
 const outer="[{t:'Other matters / quests',go:()=>old(n)},...(['trade','craft','guard','warrior'].includes(n.role)||trainer?";
 if(html.split(outer).length!==2)throw Error('Expected teacher outer menu');
 html=html.replace(outer,"[...(/Phokas|Phocas/.test(n.name)?[{t:G.training.sling?'Review sling technique':'Receive a sling / continue its lesson',go:()=>grantSlingLesson60(n)}]:[]),{t:'Other matters / quests',go:()=>old(n)},...(['trade','craft','guard','warrior'].includes(n.role)||trainer?");
 const projectile="if(!end&&p.from==='p'&&AREA==='over'){const a=attackableAnimals()";
 if(html.split(projectile).length!==2)throw Error('Expected stone projectile collision');
 html=html.replace(projectile,"if(!end&&slingRangeHit60(p))end=true;\n  "+projectile);
 const stoneDamage='else dmgEnemy(e,p.dmg,p.vx,p.vz,e.d.ship?0:3);';
 if(html.split(stoneDamage).length!==2)throw Error('Expected player stone damage route');
 html=html.replace(stoneDamage,'else slingProjectileDamage60(e,p,e.d.ship?0:3);');
 const base="b.cyl(a.x,y+.70,a.z,.055,.075,1.40,10,K.woodD);";
 if(html.split(base).length!==2)throw Error('Expected straw target support');
 return html.replace(base,"b.box(a.x,y+.09,a.z,.90,.18,.70,K.woodD);"+base);
}
