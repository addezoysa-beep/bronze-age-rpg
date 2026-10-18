export const healerReachGuardPatch=String.raw`
/* HEALER_REACH_GUARD_144: draft continuation, not in the frozen e699 candidate. */
function healerReachable144(n){return !!n&&!P.dead&&P.mode==='foot'&&!n.dead&&!n.hostile&&!n._party&&(n.area||'over')===AREA&&hyp(P.x-n.x,P.z-n.z)<=3;}
function healerInvoke144(n,action){
 if(!healerReachable144(n))return toast('Approach the healer on foot for treatment and supplies.');
 const old=say;say=function(name,lines,done,choices){
  // Each displayed/refreshed submenu retains its own guarded ordinary actions.
  if(name===n.name&&choices)choices=choices.map(o=>({...o,go:()=>healerInvoke144(n,o.go)}));
  return old(name,lines,done,choices);
 };try{return action();}finally{say=old;}
}
const healerTalk144Before=serviceTalk48;serviceTalk48=function(n){
 if(n?.service48!=='heal')return healerTalk144Before(n);
 return healerInvoke144(n,()=>healerTalk144Before(n));
};
`;
