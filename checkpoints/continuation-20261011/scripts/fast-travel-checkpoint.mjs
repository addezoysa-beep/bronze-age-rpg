// Repair the active landmark path without changing paid ferry/wagon services.
export const fastTravelRuntime = `
function visitedLandmark60(d){return !!(G.disc?.[d.id]||G.disc?.[d.name]);}
function landmarkLanding60(d){
 const p=freeLandNear(d.x,d.z,2);
 return Number.isFinite(p?.x)&&Number.isFinite(p?.z)&&heightAt(p.x,p.z)>2&&!colBlocked(p.x,p.z,1.8)?p:null;
}
function travelLandmark13(id){
 const d=DISC.find(d=>d.id===id);
 if(!d||!visitedLandmark60(d))return toast('Visit this place before returning by fast travel.');
 if(STREAM.building)return toast('Please wait for the current journey to finish.');
 if(AREA!=='over'||P.dead||P.mode==='swim'||nearbyThreats(P.x,P.z).some(e=>hyp(e.x-P.x,e.z-P.z)<24))return toast('Fast travel needs a safe departure on land.');
 const p=landmarkLanding60(d);
 if(!p)return toast('There is no clear landing here. Choose another visited place.');
 closeMap();
 return streamArrival(p.x,p.z,()=>{
  P.mode='foot';P.x=p.x;P.z=p.z;P.y=groundY(p.x,p.z);
  P.vx=P.vz=P.vy=0;P.rollT=0;P.crouch=false;P.rest=null;P.inv=2;
  G.time=(G.time+1)%24;G.disc[d.id]=1;CAM.dist=8;cameraReady=false;
  STATE='play';fadeFlash();showAreaTitle(d.name);save();
 });
}
`;
export function applyFastTravelCheckpoint(html){
 const before=html.match(/^function travelLandmark13\(id\).*$/m)?.[0];
 if(!before||!before.includes("P.rest=null;G.time="))throw new Error('Expected original landmark travel contract');
 html=html.replace(before,fastTravelRuntime.trim());
 const active="marks=DISC.filter(d=>G.disc[d.id]&&heightAt(d.x,d.z)>1&&d.name.toLowerCase().includes(query.toLowerCase()))";
 if(html.split(active).length!==2)throw new Error('Expected final chart menu once');
 return html.replace(active,"marks=DISC.filter(d=>visitedLandmark60(d)&&heightAt(d.x,d.z)>1&&d.name.toLowerCase().includes(query.toLowerCase()))");
}
