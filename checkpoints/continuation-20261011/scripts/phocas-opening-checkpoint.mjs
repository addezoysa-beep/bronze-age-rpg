export const phocasOpeningRuntime = `
/* One opening trainer menu, with a physical sling and explicit equipment handoff. */
function phocasState69(){livingState();return G.world.phocas69||=( {slingGiven:false,progress:{}} );}
function phocasSling69(n){
 if(opening25().stage!=='done')return tutorialTalk2(n);
 if(CARRIED_JAR13)return say(n.name,['Set down that jar first; you will need your hands for the sling.'],()=>{});
 ensurePolish();const q=phocasState69();
 if(q.slingGiven&&!playerItems().sling_wood&&!G.own.sling)return say(n.name,['The sling I gave you is yours. Retrieve it if you set it down, or bring another sling before we practise.'],()=>{});
 if(G.trainingTask&&G.trainingTask!=='sling')q.progress[G.trainingTask]=G.trainingProg||0;
 if(!q.slingGiven){G.inv.sling_wood=Math.max(1,G.inv.sling_wood||0);G.own.sling=Math.max(1,G.own.sling||0);q.slingGiven=true;if(!G.slingLessonStones){G.inv.stone=(G.inv.stone||0)+12;G.slingLessonStones=true;}}
 const trained=G.training.sling===1,progress=G.trainingTask==='sling'?G.trainingProg||0:q.progress.sling||0;
 G.trainingTask=trained?null:'sling';G.trainingLoan=trained?null:'sling';G.trainingProg=trained?0:progress;
 G.peaceful16=false;G.stowed22=null;equipHand('sling_wood','right');G.training.sling=trained?1:0;
 hudAll();hudQuest();save();
 say(n.name,['Here—take this sling. The pouch holds one stone. Let the wolf come clear of the flock before you loose it.',trained?'Your sling is ready. Keep your distance and choose your throw.':'I have put it in your hand. Land three hits on the range target or a wolf, then return to me.'],()=>{},[{t:'Let me try',go:()=>closeDlg()}]);
}
function phocasFootwork69(n){say(n.name,['Holding your guard early blocks a blow. Raise it just before contact to parry, then answer while your opponent is staggered.'],()=>{},[{t:'Practise dodging',go:()=>startLesson26(n,'dodge')},{t:'Practise parrying',go:()=>startLesson26(n,'parry')},{t:'Back',go:()=>tutorialTalk2(n)}]);}
const phocasAdvanced69Before=tutorialTalk2;
tutorialTalk2=function(n){
 if(opening25().stage!=='done')return say(n.name,['Lykos needs you at the fold first. Bring his sheep safely home; then I will show you the sling.'],()=>{});
 ensurePolish();
 if(G.trainingTask&&G.trainingProg>=3){G.training[G.trainingTask]=1;G.trainingTask=G.trainingLoan=null;G.trainingProg=0;hudQuest();save();}
 const slingReady=G.training.sling===1;
 const options=[{t:slingReady?'Ready my sling':'Teach me the sling',go:()=>phocasSling69(n)},{t:'Practise my footwork',go:()=>phocasFootwork69(n)}];
 if(slingReady)options.push({t:'Other weapon lessons',go:()=>phocasAdvanced69Before(n)});
 options.push({t:'I must be going',go:()=>closeDlg()});
 return say(n.name,[slingReady?'Keep your distance, shepherd. What would you practise?':G.trainingTask==='sling'?'How goes your throwing? Three clean hits will show me your timing.':'A staff keeps a wolf at bay. A sling lets you reach it before it reaches the flock. Shall I show you?'],()=>{},options);
};
/* Bind after the market, sparring and supply wrappers, so quests need no nested menus. */
const phocasPopulate69Before=populate;populate=async function(){await phocasPopulate69Before();for(const n of NPCS)if(/Mentor Phokas|Phocas/.test(n.name))n.talk=tutorialTalk2;};
`;
export function applyPhocasOpeningCheckpoint(html){
 const marker='window.WDS_READY33=true;';
 if(html.includes('function phocasState69(')||html.split(marker).length!==2)throw new Error('Expected unpatched opening trainer source');
 return html.replace(marker,phocasOpeningRuntime+'\n'+marker);
}
