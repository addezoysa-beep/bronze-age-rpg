export const tavernResidenceGuardPatch=String.raw`
/* TAVERN_RESIDENCE_GUARD_145: dedicated indoor service owns these actors' positions. */
function dedicatedTavernResident145(n){
 const id=n?.counter118||n?.server118,dg=id&&DGS[id],s=dg?.service118;
 return !!s&&!n.dead&&!n.hostile&&!n._party&&(s.counter===n||s.server===n);
}
const tavernResidence145Before=householdTick;householdTick=function(...args){
 // The inspected legacy loop relocates every RESIDENTS member regardless of
 // current indoor service. Remove only valid dedicated staff for its duration;
 // do not impersonate a death/follower or rewrite their household/save identity.
 const removed=[];for(let i=RESIDENTS.length-1;i>=0;i--)if(dedicatedTavernResident145(RESIDENTS[i]))removed.push({i,n:RESIDENTS.splice(i,1)[0]});
 try{return tavernResidence145Before(...args);}finally{for(let i=removed.length-1;i>=0;i--){const a=removed[i];RESIDENTS.splice(a.i,0,a.n);}}
};
`;
