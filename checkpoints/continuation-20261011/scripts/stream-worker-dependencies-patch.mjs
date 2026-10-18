export const streamWorkerDependenciesPatch=String.raw`
/* STREAM_WORKER_DEPENDENCIES_169: retain the active terrain-colour dependency chain in workers. */
startStreamWorker=function(){if(typeof Worker==='undefined')return;
 try{const names={riverlandsHeight,hash2,vnoise,fbm,landD,islandH,rawH,bridgeBlend,indexedHeight,ownerOf,tcol,sstep,lerp,clamp,angDiff,mixc,sh,streamKey,hx,terrainColor41Before,bankColor48Before,fertility41,riverCenter48};let code='const PI=Math.PI,TAU=PI*2,sin=Math.sin,cos=Math.cos,hyp=Math.hypot,abs=Math.abs,floor=Math.floor;\n';code+='const ISLES='+JSON.stringify(ISLES.map(({meshes,_meadow,...i})=>i))+';const IS=Object.fromEntries(ISLES.map(i=>[i.id,i]));const BRIDGES='+JSON.stringify(BRIDGES)+';const BIO='+JSON.stringify(BIO)+';const DEEPC='+JSON.stringify(DEEPC)+';const HEIGHT_CELL=128;const FLAT_INDEX=new Map('+JSON.stringify([...FLAT_INDEX])+');\n';for(const[name,fn]of Object.entries(names))code+='const '+name+'=('+fn.toString()+');\n';code+='const heightAt=indexedHeight;const streamChunk=('+streamChunk.toString()+');self.onmessage=function(e){const {key,ix,iz}=e.data;try{const g=streamChunk(ix,iz);let r;do{r=g.next()}while(!r.done);const data=r.value;self.postMessage({key,data},data?[data.p.buffer,data.n.buffer,data.c.buffer]:[])}catch(err){self.postMessage({key,error:String(err)})}}';
  const url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));const w=new Worker(url);URL.revokeObjectURL(url);STREAM.worker=w;
  w.onmessage=e=>{STREAM.inflight=Math.max(0,STREAM.inflight-1);if(e.data.error){streamWorkerFallback();return;}finishStreamTile(e.data.key,e.data.data);};w.onerror=()=>streamWorkerFallback();
 }catch(_){STREAM.worker=null;}
};
`;
