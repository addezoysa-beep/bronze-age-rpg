export const keyQuantity276=String.raw`
/* KEY_QUANTITY_276: native giveItem(key:n) grants ONE, regardless of n. */
function collectKeyBatch276(n){const before=G.keys==null?0:G.keys;
 if(!Number.isSafeInteger(n)||n<1||!Number.isSafeInteger(before)||before<0||!Number.isSafeInteger(before+n))return false;
 G.keys=before;giveItem('key:1');G.keys=before+n;
 if(n>1)toast('Found '+n+' bronze keys');hudAll();return true;
}
`;
export function repairKeyQuantity(source){
 const at=source.indexOf('takeWorldLoot=function(id){const a=livingState().loot[id];if(!a||a.claimed)return false;if(a.y!=null'),end=source.indexOf('\n',at);if(at<0||end<at)throw Error('Native final world-loot override missing');
 const old=source.slice(at,end),anchor="if(a.reward15&&['sword','bow','shield','key','heart','ram','thread','bag','chart','giantcache','cyclopsCache','seaTrident','plainsArmor'].includes(k))";
 if(old.split(anchor).length!==2)throw Error('Native reward branch anchor changed');source=source.slice(0,at)+old.replace(anchor,"if(k==='key'){if(!collectKeyBatch276(n))return false;}else "+anchor)+source.slice(end);
 const boundary=source.lastIndexOf('</script>');if(boundary<0)throw Error('Missing game script boundary');return source.slice(0,boundary)+keyQuantity276+source.slice(boundary);
}
