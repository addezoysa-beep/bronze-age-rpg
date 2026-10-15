export const landmarkTravelSafetyPatch=String.raw`
/* LANDMARK_TRAVEL_SAFETY_155: recheck actual arrival; no ghost mounted state. */
travelLandmark13=function(id){
 const d=DISC.find(d=>d.id===id);if(!d||!visitedLandmark60(d))return toast('Visit this place before returning by fast travel.');
 if(STREAM.building)return toast('Please wait for the current journey to finish.');
 if(!['play','map'].includes(STATE)||AREA!=='over'||P.dead)return toast('Fast travel needs a safe departure on land.');
 if(P.mode!=='foot')return toast('Dismount or step ashore before returning by fast travel.');
 if(nearbyThreats(P.x,P.z).some(e=>hyp(e.x-P.x,e.z-P.z)<24))return toast('Fast travel needs a safe departure on land.');
 const p=landmarkLanding60(d);if(!p)return toast('There is no clear landing here. Choose another visited place.');
 closeMap();return streamArrival(p.x,p.z,()=>{
  const y=groundY(p.x,p.z);if(P.dead||AREA!=='over'||P.mode!=='foot'||!visitedLandmark60(d)||!Number.isFinite(y)||y<2||!(heightAt(p.x,p.z)>2)||colBlocked(p.x,p.z,1.8)){STATE=P.dead?'dead':'play';toast('The landing is no longer safe. Choose another visited place.');return;}
  const before={x:P.x,y:P.y,z:P.z,mode:P.mode,vx:P.vx,vy:P.vy,vz:P.vz,rollT:P.rollT,crouch:P.crouch,rest:P.rest,inv:P.inv},time=G.time,had=Object.prototype.hasOwnProperty.call(G.disc,d.id),discovery=G.disc[d.id],dist=CAM.dist,ready=cameraReady;
  try{
   cancelBow27();cancelSling();resetCombatInput89();P.melee=P.mine=P.rest=null;P.at=-1;P.draw=P.guard=P.swing=0;
   P.mode='foot';P.x=p.x;P.z=p.z;P.y=y;P.vx=P.vz=P.vy=0;P.rollT=0;P.crouch=false;P.inv=2;
   G.time=(G.time+1)%24;G.disc[d.id]=1;CAM.dist=8;cameraReady=false;STATE='play';fadeFlash();showAreaTitle(d.name);save();
  }catch(e){Object.assign(P,before);G.time=time;if(had)G.disc[d.id]=discovery;else delete G.disc[d.id];CAM.dist=dist;cameraReady=ready;STATE=P.dead?'dead':'play';toast('The journey could not finish. You remain at your departure point.');console.error(e);}
 });
};
`;
