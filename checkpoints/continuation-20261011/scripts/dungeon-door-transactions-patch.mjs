export const dungeonDoorTransactions271=String.raw`
/* DUNGEON_DOOR_TRANSACTION_271: held native callbacks spend at most one key nearby. */
function unlockDungeonDoor271(dg,dr){
 if(!dg||DG!==dg||DGS[dg.id]!==dg||DUN[dg.id]!==dg.def||AREA!==dg.id||STATE!=='play'||P.dead||P.mode!=='foot'||P.grounded===false||!Number.isFinite(P.x+P.y+P.z)||!dg.doors.includes(dr)||!dg.solids.includes(dr)||!Number.isInteger(dr.idx)||dr.idx<0)return false;
 const st=gstate(dg.id);
 const y=dg.terrain26?floorSample26(dg,dr.x,dr.z):0;
 if(!Number.isFinite(y)||Math.abs(P.y-y)>1.25||Math.hypot(P.x-dr.x,P.z-dr.z)>3.4||dr.open||st.doors[dr.idx])return false;
 if(!Number.isSafeInteger(G.keys)||G.keys<1){toast('The door is locked. Find a bronze key.');return false;}
 G.keys--;dr.open=true;st.doors[dr.idx]=1;sfx('boom');toast('The door swings open');hudAll();return true;
}
`;
export function repairDungeonDoorTransactions(source){
 const old="act:()=>{if(G.keys>0){G.keys--;dr.open=true;st.doors[idx]=1;sfx('boom');toast('The door swings open');hudAll()}else toast('The door is locked. Find a bronze key.')}";
 if(source.split(old).length!==2)throw Error('Native dungeon-door action anchor changed');
 const end=source.lastIndexOf('</script>');if(end<0)throw Error('Missing game script boundary');
 source=source.replace(old,'act:()=>unlockDungeonDoor271(dg,dr)');const at=source.lastIndexOf('</script>');return source.slice(0,at)+dungeonDoorTransactions271+source.slice(at);
}
