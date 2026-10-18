export const lionAnatomyPatch=String.raw`

/* Resume checkpoint 93: purpose-built lion silhouette, articulation and paws. */
makeLion=function(){
 const g=new THREE.Group(),body=new THREE.Group(),neck=new THREE.Group(),head=new THREE.Group(),jaw=new THREE.Group(),tail=new THREE.Group(),legs=[];
 const coat=hx(0xb98242),light=hx(0xd1a15d),mane=hx(0x5b3522),dark=hx(0x2c211b);
 g.userData.coat=coat.slice();g.userData.lion93=true;g.add(body,neck,tail);
 body.add(animalPart(b=>{
  anatomyLoft(b,[[0,1.02,-1.22,.26,.34],[0,1.14,-.88,.48,.53],[0,1.20,-.18,.53,.58],[0,1.26,.52,.58,.64],[0,1.34,.94,.42,.48]],'z',coat,24);
  anatomyLoft(b,[[0,1.22,.42,.47,.53],[0,1.48,.68,.42,.46],[0,1.67,.88,.31,.35]],'y',coat,20);
  for(const side of[-1,1])b.ball(side*.35,1.28,.66,.22,sh(coat,.92),null,.14,.25);
 }));
 neck.position.set(0,1.40,.76);neck.add(animalPart(b=>{
  anatomyLoft(b,[[0,-.23,-.10,.39,.42],[0,.10,.08,.51,.54],[0,.36,.30,.48,.50],[0,.54,.47,.35,.37]],'y',mane,24);
  for(let i=0;i<10;i++){const a=i/10*TAU;b.tri([sin(a)*.47,.18,cos(a)*.42],[sin(a+.22)*.58,-.10,cos(a+.22)*.52],[sin(a+.44)*.47,.34,cos(a+.44)*.42],sh(mane,.82+i%2*.16));}
 }));
 head.position.set(0,.43,.52);neck.add(head);head.add(animalPart(b=>{
  anatomyLoft(b,[[0,-.17,-.05,.29,.27],[0,.02,.08,.37,.34],[0,.20,.17,.32,.30],[0,.23,.43,.23,.22],[0,.10,.69,.17,.15]],'z',coat,22);
  anatomyLoft(b,[[0,.04,.40,.21,.17],[0,-.08,.62,.24,.17],[0,-.10,.83,.15,.12]],'z',light,18);
  for(const side of[-1,1]){earWedge(b,side*.24,.30,.15,.10,.25,mane,side*.06);b.ball(side*.16,.12,.45,.034,K.gold,null,.025,.018).ball(side*.16,.12,.474,.015,K.black);}
  b.ball(0,-.08,.88,.12,dark,null,.09,.055);
  for(const side of[-1,1])for(let i=0;i<3;i++)b.box(side*(.20+i*.045),-.09,.74+i*.015,.15,.008,.008,K.bone);
 }));
 jaw.position.set(0,-.13,.58);jaw.add(animalPart(b=>{anatomyLoft(b,[[0,0,0,.20,.13],[0,-.08,.20,.16,.10],[0,-.06,.38,.10,.075]],'z',light,16);for(const side of[-1,1])b.tri([side*.08,-.01,.24],[side*.045,-.14,.25],[side*.015,-.02,.27],K.bone);}));head.add(jaw);
 tail.position.set(0,1.22,-1.10);tail.add(animalPart(b=>{anatomyLoft(b,[[0,0,0,.10,.11],[0,.05,-.42,.085,.09],[0,-.13,-.86,.065,.07],[0,-.34,-1.20,.05,.055]],'z',coat,14);b.ball(0,-.37,-1.25,.15,mane,null,.10,.18);}));
 for(const[x,z]of[[-.36,.73],[.36,.73],[-.34,-.78],[.34,-.78]]){const leg=shapedLeg(x,1.17,z,1.16,.15,coat);leg.userData.knee.add(animalPart(b=>{b.ball(0,-.53,.12,.16,coat,null,.18,.10);for(let i=-2;i<=2;i++)b.tbox(i*.055,-.57,.23,.025,.025,.13,.018,.018,light);}));g.add(leg);legs.push(leg);}
 g.scale.set(1.16,1.16,1.16);return{g,body,spine:body,neck,head,jaw,tail,legs,kind:'lion',lion93:true};
};
const lionPose93Before=quadrupedPose;quadrupedPose=function(q,speed=0,clock=T_NOW,attack=null){
 lionPose93Before(q,speed,clock,attack);if(!q?.lion93)return;
 const pace=clamp(speed/8,0,1),phase=clock*(3.2+speed*.72),charge=attack?.phase==='charge',wind=attack?.phase==='wind';
 q.body.position.y=abs(sin(phase))*pace*.035;q.body.rotation.x=charge?-.10:sin(phase*2)*pace*.018;
 q.neck.rotation.x=wind?.18:charge?.30:.035+sin(clock*.8)*.02;q.head.rotation.x=wind?.16:charge?-.12:sin(clock*.65)*.018;
 q.jaw.rotation.x=charge?.34:wind?.12:0;q.tail.rotation.x=.18+sin(clock*1.5)*.10;q.tail.rotation.y=sin(clock*1.1)*.16;
};
`;
