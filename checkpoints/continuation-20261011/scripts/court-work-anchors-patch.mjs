export const courtWorkAnchorsPatch=String.raw`
/* COURT_WORK_ANCHORS_139: actual garden/hearth approaches for existing palace staff. */
function courtWorkRole139(n){if(!n.court29||n.outside29)return null;return /^Garden Keeper · /.test(n.name)?'garden':/^Cook · /.test(n.name)&&n.stir48?'cook':null;}
function courtWorkActive139(n,role){if(n.dead||n.hostile||n._party||n.spar22||n.enemyFlee119>T_NOW)return false;const h=G.time;if(role==='garden')return h>=6&&h<18;const shift=h<6||h>=22?2:h<14?0:1;return n.shift29===shift;}
function courtWorkAnchor139(dg,n,role){
 const saved=n.courtAnchor139;if(saved?.id===dg.id&&saved.role===role&&saved.until>T_NOW)return saved.point?saved:null;
 const anchor=role==='garden'?courtPoint49(dg,'garden'):n.stir48;
 const offsets=role==='garden'?[[4.3,0],[0,4.3],[-4.3,0],[0,-4.3]]:[[0,1.75],[1.75,0],[-1.75,0],[0,-1.75]];
 dg.workClaims139||=new Map();
 for(const[dx,dz]of offsets){const point={x:anchor.x+dx,z:anchor.z+dz},key=role+':'+point.x.toFixed(2)+','+point.z.toFixed(2),owner=dg.workClaims139.get(key);
  if(owner&&owner!==n&&!owner.dead&&!owner._party)continue;
  const route=tavernRoute138(dg,n,point);if(!route.points.length)continue;
  if(saved?.key&&dg.workClaims139.get(saved.key)===n)dg.workClaims139.delete(saved.key);
  dg.workClaims139.set(key,n);return n.courtAnchor139={id:dg.id,role,anchor,point,key,until:T_NOW+30};
 }
 n.courtAnchor139={id:dg.id,role,point:null,until:T_NOW+2};return null;
}
const courtSchedule139Before=npcSchedule;npcSchedule=function(n){
 const role=courtWorkRole139(n),dg=DG;
 if(role&&dg?.def.layout49&&n.area===dg.id&&AREA===dg.id&&courtWorkActive139(n,role)){
  const at=courtWorkAnchor139(dg,n,role);if(at){n.work=at.point;return{target:at.point,action:role==='garden'?'tending the palace garden':'cooking at the household hearth',court139:role};}
 }
 return courtSchedule139Before(n);
};
const courtMove139Before=courtMove29;courtMove29=function(n,dt){
 if(STATE!=='play')return;
 const role=courtWorkRole139(n);if(!role||!DG?.def.layout49||n.area!==DG.id||AREA!==DG.id||!courtWorkActive139(n,role)||n.sleep35||n.wasSleeping29)return courtMove139Before(n,dt);
 const s=npcSchedule(n),at=n.courtAnchor139;if(!s.court139||!at?.point)return courtMove139Before(n,dt);
 n.action=s.action;n.seated29=false;const x=n.x,z=n.z,moving=tavernStep118(n,s.target,dt);n.speed29=moving?hyp(n.x-x,n.z-z)/Math.max(dt,.001):0;
 n.y=dungeonFloor(n.x,n.z,n);
 if(hyp(n.x-s.target.x,n.z-s.target.z)<.35){n.speed29=0;n.yaw=Math.atan2(at.anchor.x-n.x,at.anchor.z-n.z);}
};
const courtPath139Before=interiorPath29;interiorPath29=function(dg,n,target){
 if(!n.court29||n.palace16||DG!==dg||AREA!==dg.id)return courtPath139Before(dg,n,target);
 const route=tavernRoute138(dg,n,target);if(route.points.length)return route;
 // Legacy callers require at least one point. Hold the actual current position,
 // never append an unreachable destination or chase a stale cached hold point.
 route.hold139||={points:[{x:n.x,z:n.z}],i:0,blocked139:true};
 route.hold139.points[0].x=n.x;route.hold139.points[0].z=n.z;return route.hold139;
};
`;
