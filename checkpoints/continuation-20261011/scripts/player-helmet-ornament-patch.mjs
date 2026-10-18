export const playerHelmetOrnamentPatch=String.raw`
/* PLAYER_HELMET_ORNAMENT_136: equipped identity controls head-bone ornament. */
let PLAYER_CREST136=null,PLAYER_CREST_KEY136='';
function playerCrestStyle136(){
 const mat=G.gear?.helmet;if(!mat||mat==='none')return '';
 if(mat==='myrmidon')return 'myrmidon';
 const key=G.regionalGear48?.helmet,d=REGIONAL_ITEMS48[key];
 return d?.armor&&d.slot==='helmet'&&d.material===mat&&d.culture==='philistia'?'sea_people':'';
}
function updatePlayerCrest136(){
 const style=playerCrestStyle136();if(style===PLAYER_CREST_KEY136&&(!style||PLAYER_CREST136?.parent===PH.head))return;
 PLAYER_CREST_KEY136=style;
 if(PLAYER_CREST136){PLAYER_CREST136.parent?.remove(PLAYER_CREST136);PLAYER_CREST136.geometry?.dispose();PLAYER_CREST136=null;}
 if(!style||!PH.head)return;const b=new Batch(),trim=K.bronze,red=K.red;
 if(style==='myrmidon'){
  b.box(0,.24,-.04,.062,.055,.34,trim);
  // Curved narrow crest, with separate tapered locks rather than a solid block.
  for(let i=0;i<16;i++){const z=-.20+i*.022,top=.34+Math.sin(i/15*PI)*.15;
   for(const side of[-1,1]){const x=side*.026;
    b.dquad([x,.265,z-.015],[x,.265,z+.015],[side*.037,top,z+.012],[side*.034,top+.022,z-.006],red);
   }
  }
 }else{
  // Fan of pale feather blades; variation stays tied to the regional helmet.
  b.cyl(0,.19,-.025,.14,.15,.035,20,trim);
  for(let i=0;i<12;i++){const a=i*TAU/12,x=Math.sin(a)*.125,z=-.025+Math.cos(a)*.125;
   const dx=Math.sin(a)*.025,dz=Math.cos(a)*.025,tx=Math.cos(a)*.024,tz=-Math.sin(a)*.024,top=.40+(i%3)*.025;
   b.dquad([x-tx,.20,z-tz],[x+tx,.20,z+tz],[x+dx+tx*.55,top,z+dz+tz*.55],[x+dx,top+.04,z+dz],i%2?K.cream:K.linen);
  }
 }
 const m=b.mesh(ACTOR_MAT);m.userData.playerCrest136=style;m.position.y=.22;PH.head.add(m);PLAYER_CREST136=m;
}
const playerHelmetVisual136Before=modularArmorVisual;modularArmorVisual=function(){const r=playerHelmetVisual136Before.apply(this,arguments);updatePlayerCrest136();return r;};
const playerHelmetRefresh136Before=refreshWeapon;refreshWeapon=function(){const r=playerHelmetRefresh136Before.apply(this,arguments);updatePlayerCrest136();return r;};
const playerHelmetEquip136Before=equipRecoveredGear;equipRecoveredGear=function(k){
 if(/^helmet_/.test(k)&&!REGIONAL_ITEMS48[k]&&(G.inv?.[k]>0||G.gearOwned?.[k])){if(G.regionalGear48)delete G.regionalGear48.helmet;}
 const r=playerHelmetEquip136Before.apply(this,arguments);updatePlayerCrest136();return r;
};
`;
