export const zigguratAccessPatch=String.raw`
/* ZIGGURAT_ACCESS_140: continuous stairs and summit sanctuary at existing Dur-Kurigalzu. */
const ZIGGURAT140={id:'sanctuary_ziggurat140',x:3800,z:335,startZ:378,endZ:344,top:20.6,half:3.3,built:false,obstacles:[]};
function zigguratSurface140(x,z){const q=ZIGGURAT140;if(!q.built||Math.abs(x-q.x)>q.half||z<341.4||z>q.startZ)return null;if(z<=q.endZ)return q.top;return 7+Math.min(68,Math.ceil((q.startZ-z)/.5))* .2;}
const ziggHeight140Before=heightAt;heightAt=function(x,z){const h=ziggHeight140Before(x,z),stair=zigguratSurface140(x,z);return stair==null?h:Math.max(h,stair);};
const ziggCollision140Before=colBlocked;colBlocked=function(x,z,r){
 const q=ZIGGURAT140,h=zigguratSurface140(x,z),actor=COLLISION_ACTOR15;
 if(AREA!=='over'||h==null||!actor||Math.abs(x-q.x)+r>q.half||actor.y<h-.65||actor.y>h+2.2)return ziggCollision140Before(x,z,r);
 // Permit only the identified solid monument body on the stair footprint.
 // Other buildings, props and gates still run through normal collision.
 for(const c of q.obstacles){c.ziggSoft140=c.soft15;c.soft15=true;}
 try{return ziggCollision140Before(x,z,r);}finally{for(const c of q.obstacles){c.soft15=c.ziggSoft140;delete c.ziggSoft140;}}
};
function enterZiggurat140(){const q=ZIGGURAT140;if(P.dead||P.mode!=='foot'||AREA!=='over'||hyp(P.x-q.x,P.z-342.7)>3||Math.abs(P.y-q.top)>.75)return toast('Reach the summit doorway on foot.');closeDlg();return enterDungeon(q.id,{x:q.x,z:342.7,yaw:Math.PI});}
function installZiggurat140(){
 const q=ZIGGURAT140;if(q.built||!IS.mesopotamia)return false;
 const seen=new Set();for(const list of CG.values())for(const c of list)if(!seen.has(c)){seen.add(c);if(c.x===3800&&c.z===335&&c.hw===33&&c.hd===27)q.obstacles.push(c);}
 // Fail closed if the active original monument collision signature changed.
 if(q.obstacles.length!==1){q.obstacles.length=0;return false;}
 const b=ibatch('mesopotamia');for(let i=0;i<68;i++){const top=7+(i+1)*.2;b.box(q.x,top-.14,q.startZ-(i+.5)*.5,q.half*2,.28,.52,K.stoneL);}
 b.box(q.x,q.top-.14,342.7,q.half*2,.28,2.6,K.stoneL);
 // Slim stair edging makes the ascent legible without claiming protective rails.
 for(const side of[-1,1])for(let i=0;i<68;i++){const top=7+(i+1)*.2;b.box(q.x+side*3.15,top+.12,q.startZ-(i+.5)*.5,.18,.24,.52,K.mud);}
 DUN[q.id]={name:'Enlil Summit Sanctuary',ox:88000,W:11,H:10,rects:[[1,1,9,8]],objs:[[5,8,'S'],[2,2,'i']],signs:['Clay impressions mark jars of barley and oil. Woven cloth lies beside the offering table.'],theme:{wall:K.mud,floor:K.stoneD,fog:[0x17120d,10,55],acc:[K.gold,K.ochre]},ziggurat140:true};
 q.built=true;INTS.push({x:q.x,z:342.7,r:2.5,vis:()=>AREA==='over'&&Math.abs(P.y-q.top)<1,label:()=> 'Enter the summit sanctuary',act:enterZiggurat140});INT_GRID16.count=-1;return true;
}
const ziggPopulate140Before=populate;populate=async function(){await ziggPopulate140Before();installZiggurat140();};
const ziggBuild140Before=buildDungeon;buildDungeon=function(id){const r=ziggBuild140Before(id),dg=DGS[id];if(id!==ZIGGURAT140.id||!dg||dg.sanctuary140)return r;dg.sanctuary140=true;
 const b=new Batch(),x=dg.ox+5.5*TS,z=dg.oz+3.5*TS;b.box(x,.65,z,3,1.3,1.8,K.stoneL);for(const side of[-1,1])b.cyl(x+side*1,.95,z+.1,.22,.3,.35,14,K.terra);dg.group.add(b.mesh(ACTOR_MAT));dg.solids.push({x,z,halfX:1.5,halfZ:.9,solid:true});
 for(const[i,name]of ['Sanctuary Priest','Offering Attendant'].entries()){const p={x:dg.ox+(i?8:3)*TS,z:dg.oz+4.5*TS},n=addNPC({name:name+' · Dur-Kurigalzu',...p,area:dg.id,group:dg.group,noInt:true,role:'priest',culture:'mesopotamia',look:{tunic:K.linen,kilt:i?K.ochre:K.gold},talk:n=>say(n.name,[i?'I receive the jars and keep the offering table in order.':'This sanctuary stands above the city. The temple scribe below helps those seeking the memorial tablets.'],null,[{t:'Leave the conversation',go:()=>closeDlg()}])});n.home=n.work=n.social={...p};n.y=0;dg.ints.push({x:p.x,z:p.z,r:2.8,label:()=> 'Speak to '+n.name,vis:()=>!n.dead&&n.area===AREA,act:()=>n.talk(n)});}
 return r;
};
`;
