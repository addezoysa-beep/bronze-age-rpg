export const inventorIdentityPatch=String.raw`
/* INVENTOR_IDENTITY_122: Daedalus is a story craftsman, not a stable merchant. */
const inventorStable122Before=addRoyalStable;addRoyalStable=function(n){if(/^Daedalus(?: the Inventor)?$/.test(n?.name||''))return null;return inventorStable122Before(n);};
function bindInventor122(){for(const n of NPCS){if(!/^Daedalus(?: the Inventor)?$/.test(n.name))continue;n.role='craft';n.inventor122=true;n.stableKeeper20=false;if(n.workplace62){workplaceRelease62(n);n.workplace62=null;}n.talk=actor=>daedalusTalk(actor);const index=STABLE_KEEPERS20.indexOf(n);if(index>=0)STABLE_KEEPERS20.splice(index,1);}return NPCS.find(n=>n.inventor122);}
const inventorPopulate122Before=populate;populate=async function(){await inventorPopulate122Before();bindInventor122();INT_GRID16.count=-1;};
const inventorRestore122Before=restoreLivingWorld;restoreLivingWorld=function(...args){const r=inventorRestore122Before(...args);bindInventor122();return r;};
const inventorInts122Before=currentInts;currentInts=function(){const list=inventorInts122Before(),n=NPCS.find(n=>n.inventor122&&!n.dead&&!n.hostile&&(n.area||'over')===AREA&&hyp(n.x-P.x,n.z-P.z)<3);if(n)list.unshift({x:n.x,z:n.z,r:3,label:()=> 'Speak to Daedalus about the cargo tablet',act:()=>daedalusTalk(n)});return list;};
const inventorObjective122Before=mainObjective13;mainObjective13=function(){if(F().cave&&!F().daedalus&&panReturnState117().reported){const n=NPCS.find(n=>n.inventor122&&!n.dead);if(n)return{t:'Sail to Crete and show the cargo tablet to Daedalus the Inventor',x:n.x,z:n.z};}return inventorObjective122Before();};
`;
