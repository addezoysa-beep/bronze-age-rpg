export const tavernResidenceGuardPatch=String.raw`
/* TAVERN_RESIDENCE_GUARD_145: dedicated indoor service owns these actors' positions. */
function dedicatedTavernResident145(n){
 const id=n?.counter118||n?.server118,dg=id&&DGS[id],s=dg?.service118;
 return !!s&&!n.dead&&!n.hostile&&!n._party&&(s.counter===n||s.server===n);
}
function tavernOwnership145(before,args){
 // The inspected legacy loop relocates every RESIDENTS member regardless of
 // current indoor service. Remove only valid dedicated staff for its duration;
 // do not impersonate a death/follower or rewrite their household/save identity.
 // The older tavern shift and serving-route loops also iterate o.cast. Exclude
 // dedicated service from both legacy owners, while keeping all other shifts.
 const lists=[RESIDENTS];for(const o of TAVERNS15)if(o.cast&&!lists.includes(o.cast))lists.push(o.cast);
 const removed=[];for(const list of lists)for(let i=list.length-1;i>=0;i--)if(dedicatedTavernResident145(list[i]))removed.push({list,i,n:list.splice(i,1)[0]});
 try{return before(...args);}finally{for(let i=removed.length-1;i>=0;i--){const a=removed[i];a.list.splice(a.i,0,a.n);}}
}
const tavernResidence145Before=householdTick;householdTick=function(...args){return tavernOwnership145(tavernResidence145Before,args);};
const tavernLegacyRoute145Before=updNPCs;updNPCs=function(...args){return tavernOwnership145(tavernLegacyRoute145Before,args);};
`;
