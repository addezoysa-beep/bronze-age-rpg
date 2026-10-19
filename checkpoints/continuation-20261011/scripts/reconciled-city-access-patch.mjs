// Reconcile the Library-backed city additions without replacing the master259 source.
export function repairCityAccess(source){
 const edits=[
  ["function ziggGeometry264(b,q){const B=10,heights=[4,4,3.8,3.5],widths=[66,52,39,27];let y=q.base;","function ziggGeometry264(b,q){q.obstacles||=[];const riseScale=(q.top-q.base)/15.15,heights=[4,4,3.8,3.5],widths=[66,52,39,27];let y=q.base;"],
  ["const h=heights[i],w=widths[i];b.box(q.zigX,y+h/2,q.zigZ,w,h,w*.78,i%2?K.mud:K.mudD);y+=h-.05;","const h=heights[i]*riseScale,w=widths[i];b.box(q.zigX,y+h/2,q.zigZ,w,h,w*.78,i%2?K.mud:K.mudD);y+=h-(i<3?.05*riseScale:0);"],
  ["const rise=(q.top-q.base)/q.steps,step=.52,zz=","const rise=(q.top-q.base)/q.steps,step=(q.startZ-q.endZ)/q.steps+.02,zz="],
  ["q.base+Math.ceil((q.top-q.base)*t*4)/4;","q.base+Math.ceil(t*q.steps)*(q.top-q.base)/q.steps;"],
  ["const q={...c,built:false};ziggGeometry264(b,q);c.built=true;c.obstacles=[];","const q=c;q.built=false;q.obstacles||=[];ziggGeometry264(b,q);c.built=true;"]
 ];
 for(const [from,to]of edits){if(source.split(from).length!==2)throw Error('City reconciliation anchor is not unique: '+from);source=source.replace(from,to);}
 return source;
}
