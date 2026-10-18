export const tavernPulsesPatch=String.raw`
/* TAVERN_PULSES_171: actual recipe ingredient IDs at the ordinary kitchen counter. */
(function(){
 const stock=[{key:'lentils46',count:2,price:4},{key:'beans46',count:2,price:4},{key:'grain',count:2,price:3},{key:'herb',count:2,price:3}];
 function available171(dg,n){return !!dg&&DG===dg&&AREA===dg.id&&!P.dead&&n&&!n.dead&&!n.hostile&&!n._party&&n.area===AREA&&(dg.service118?.counter===n||dg.service118?.server===n)&&hyp(P.x-n.x,P.z-n.z)<=4;}
 function buyProvisions171(dg,n,key){if(!available171(dg,n))return false;const o=stock.find(o=>o.key===key);if(!o)return false;if(!Number.isFinite(G.silver)||G.silver<o.price){toast('You need '+o.price+' silver.');return false;}G.silver-=o.price;G.inv[key]=(G.inv[key]||0)+o.count;hudAll();save();provisions171(dg,n);return true;}
 function learnSoup171(dg,n,key){if(!available171(dg,n)||!['lentil_pot46','bean_pot46'].includes(key)||!RECIPES[key])return false;if(recipeKnown30(key)){toast('You already know this recipe.');return false;}if(!Number.isFinite(G.silver)||G.silver<8){toast('You need 8 silver.');return false;}G.silver-=8;learnPlans36([key]);hudAll();save();provisions171(dg,n);return true;}
 function provisions171(dg,n){if(!available171(dg,n))return false;say(n.name,['Dried lentils and beans keep well on the road. Put lentils and barley grain in the pot, or beans with herbs; both need a cooking fire.'],null,stock.map(o=>({t:'Buy '+itemLabel(o.key)+' × '+o.count+' · '+o.price+' silver',go:()=>buyProvisions171(dg,n,o.key)})).concat(['lentil_pot46','bean_pot46'].filter(k=>RECIPES[k]&&!recipeKnown30(k)).map(k=>({t:'Learn '+RECIPES[k].n+' · 8 silver',go:()=>learnSoup171(dg,n,k)})),[{t:'Back to meals and drinks',go:()=>tavernCounterTalk118(dg,n)},{t:'Leave the counter',go:()=>closeDlg()}]));return true;}
 const counter171Before=tavernCounterTalk118;tavernCounterTalk118=function(dg,n){const previous=say;say=function(name,lines,done,choices){return previous(name,lines,done,name===n?.name&&Array.isArray(choices)?choices.concat([{t:'Buy cooking ingredients or learn the two pulse soups',go:()=>provisions171(dg,n)}]):choices);};try{return counter171Before.apply(this,arguments);}finally{say=previous;}};
 // Existing Materials & ingredients tab retains both dry ingredient IDs.
 Object.assign(globalThis,{buyProvisions171,learnSoup171,provisions171});
})();`;
