// Campaign foundation: held separate until departure/voyage and branch integration are ready.
export const trojanPrewarPatch=String.raw`
/* TROJAN_PREWAR_135: kings are still at home; ordinary visits secure commitments. */
const TROJAN_KINGS135=['Agamemnon','Menelaus','Odysseus'],TROJAN_HOME135={Agamemnon:'mycenae',Menelaus:'sparta',Odysseus:'ithaca',Achilles:'phthia'};
function trojanCampaign135(){
 G.world||={};if(G.world.trojanCampaign135)return G.world.trojanCampaign135;
 const old=expansionState(),phase=old.troyPath&&old.troyStage>0?'legacy_'+old.troyPath:'council';
 return G.world.trojanCampaign135={version:1,phase,pledges:{},entryPermit:false,helenReturn:false,events:{},departed:false};
}
function trojanVisit135(n){return !!n&&!n.dead&&!n.hostile&&!P.dead&&(n.area||'over')===AREA&&hyp(n.x-P.x,n.z-P.z)<=8;}
function trojanReady135(){const q=trojanCampaign135();return q.phase==='council'&&TROJAN_KINGS135.every(k=>q.pledges[k]);}
function pledgeTrojanKing135(n){
 const q=trojanCampaign135();if(q.phase!=='council'||!TROJAN_KINGS135.includes(n?.name)||!trojanVisit135(n))return false;
 const home=IS[TROJAN_HOME135[n.name]];
 if(!home||nearestIsle(n.x,n.z)!==home.id)return false;
 if(q.pledges[n.name])return false;q.pledges[n.name]=true;hudQuest();save();return true;
}
function prewarRoyalTalk135(n,old){
 const q=trojanCampaign135();if(q.phase!=='council')return old(n);
 if(n.name==='Achilles'){say(n.name,['My Myrmidons are here in Phthia. We have not sailed for Troy.','Patroclus stands with us. Seek the kings of Mycenae, Sparta and Ithaca if you mean to gather a fleet.'],null,[{t:'Train with Achilles',go:()=>{if(trojanVisit135(n))old(n);}},{t:'Leave the assembly',go:()=>closeDlg()}]);beginStoryCinema110(n,true);return;}
 const words={Agamemnon:'My ships remain in Argolid. I will not command an expedition that the other kings have not agreed to join.',Menelaus:'Helen is in Troy with Paris. My fleet is still in Sparta. I want her return; there is still time for an envoy to prevent a war.',Odysseus:'I have not sailed from Ithaca. Visit Agamemnon and Menelaus in their own courts; a coalition requires their consent.'};
 say(n.name,[words[n.name],q.pledges[n.name]?'My commitment is recorded. The ships await the coalition’s departure.':'Tell me why your proposed expedition deserves my men and ships.'],null,[
  {t:q.pledges[n.name]?'Your commitment is recorded':'Ask the king to join the expedition',go:()=>{if(!trojanVisit135(n))return toast('Return to the king to speak in person.');if(q.pledges[n.name])return toast('This king has already pledged his fleet.');if(pledgeTrojanKing135(n))say(n.name,['I give my word. We prepare here; we have not yet left.']);}},
  {t:'Seek Helen’s return without war',go:()=>{if(trojanVisit135(n))say(n.name,['Go to Troy as an envoy. Ask the gate captain for entry, speak with Helen, then seek Priam’s agreement. Until the fleet departs, this road remains open.']);}},
  {t:'Review the coalition’s commitments',go:()=>{if(trojanVisit135(n))say(n.name,['Still awaiting: '+TROJAN_KINGS135.filter(k=>!q.pledges[k]).join(', ')+'. No fleet has departed.']);}},
  {t:'Leave the court',go:()=>closeDlg()}
 ]);beginStoryCinema110(n,true);
}
function prewarEntry135(n){
 const q=trojanCampaign135();if(n?.name!=='Idaios of Troy'||q.phase!=='council'||!trojanVisit135(n))return false;
 q.entryPermit=true;commandTroyGate(true);hudQuest();save();return true;
}
function prewarHelen135(n){
 if(n?.name!=='Helen of Sparta'||!trojanVisit135(n)||trojanCampaign135().phase!=='council')return false;
 trojanCampaign135().helenReturn=true;hudQuest();save();return true;
}
function prewarPeace135(n){
 const q=trojanCampaign135();if(n?.name!=='King Priam'||!trojanVisit135(n)||q.phase!=='council'||!q.entryPermit||!q.helenReturn)return false;
 // No war/departure/raid flags are granted by this diplomatic resolution.
 q.phase='peace';q.events.helenReturned=true;const old=expansionState();old.troyPath='peace';old.troyStage=3;
 old.peaceVotes={...old.peaceVotes,Priam:true,Helen:true,Agamemnon:true,Menelaus:true};old.troyPaid=true;
 G.silver+=120;addXp(85);hudAll();hudQuest();save();return true;
}
function installTrojanPrewar135(){
 for(const n of NPCS){if(n.prewar135)continue;const old=n.talk;if(typeof old!=='function')continue;
  if(TROJAN_KINGS135.includes(n.name)||n.name==='Achilles')n.talk=()=>prewarRoyalTalk135(n,old);
  else if(n.name==='Idaios of Troy')n.talk=()=>{if(trojanCampaign135().phase!=='council')return old(n);say(n.name,['No Achaean fleet has arrived. If you come as an envoy, I can open the gates so you may speak to Helen and Priam.'],null,[{t:'Request peaceful entry',go:()=>{if(prewarEntry135(n))say(n.name,['Enter peacefully. The king will hear an envoy.']);}},{t:'Other matters',go:()=>old(n)}]);beginStoryCinema110(n,true);};
  else if(n.name==='Helen of Sparta')n.talk=()=>{if(trojanCampaign135().phase!=='council')return old(n);say(n.name,['I am here in Troy with Paris. Before armies sail, let the kings hear that I am willing to return under safe conduct.'],null,[{t:'Carry Helen’s wishes to Priam',go:()=>{if(prewarHelen135(n))say(n.name,['Ask Priam to agree to my departure.']);}},{t:'Other matters',go:()=>old(n)}]);beginStoryCinema110(n,true);};
  else if(n.name==='King Priam')n.talk=()=>{if(trojanCampaign135().phase!=='council')return old(n);say(n.name,['An envoy may still prevent the war. I will permit Helen’s return if you have spoken to her and she wishes it.'],null,[{t:'Agree to Helen’s peaceful return',go:()=>{if(prewarPeace135(n))say(n.name,['Helen may leave under my protection. No fleet need come against our walls.']);else toast('Enter as an envoy and speak with Helen before seeking her departure.');}},{t:'Other matters',go:()=>old(n)}]);beginStoryCinema110(n,true);};
  else continue;n.prewar135=true;
 }
 if(!NPCS.some(n=>n.name==='Patroclus')){const I=IS.phthia,p=freeLandNear(I.cx+9,I.cz+43,3);addNPC({name:'Patroclus',...p,role:'warrior',culture:'aegean',weapon:'spear',look:{tunic:K.dark,kilt:K.red,cape:K.red,helm:'bronze'},talk:n=>{const q=trojanCampaign135();say(n.name,[q.departed?'Keep close to our ships and watch the men on either flank.':'Achilles and I are still at home in Phthia. The Myrmidons prepare, but no expedition has departed.','A quarrel between commanders can cost the men who trust them.'],null,[{t:'Speak with Achilles',go:()=>npcMapHints13(n,{x:I.cx,z:I.cz+40},'Achilles in Phthia')},{t:'Leave',go:()=>closeDlg()}]);beginStoryCinema110(n,true);}});}
}
const prewarPopulate135Before=populate;populate=async function(){await prewarPopulate135Before.apply(this,arguments);installTrojanPrewar135();};
`;
