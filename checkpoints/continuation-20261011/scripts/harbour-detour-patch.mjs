// Modify the inspected230 closure, preserving the original boat, saved ramp,
// people/cursors, horn, ownership, frame budget and swept runtime collision.
const scan280=String.raw` function* route280(x,z,yaw,a,points){
  for(const p of points){const heading=hyp(p.x-x,p.z-z)>1e-8?Math.atan2(p.x-x,p.z-z):yaw,turn=angDiff(heading,yaw),turns=Math.max(1,Math.ceil(Math.abs(turn)/.04));
   for(let i=0;i<=turns;i++){const blocked=!inBounds(x,z)||boatBlockedAt(x,z,yaw+turn*i/turns);yield;if(blocked)return null;}
   yaw=heading;const distance=hyp(p.x-x,p.z-z),steps=Math.max(1,Math.ceil(distance/.5));
   for(let i=0;i<=steps;i++){const u=i/steps,X=x+(p.x-x)*u,Z=z+(p.z-z)*u,blocked=!inBounds(X,Z)||boatBlockedAt(X,Z,yaw);yield;if(blocked)return null;}x=p.x;z=p.z;
  }
  const turn=angDiff(a.yaw,yaw),turns=Math.max(1,Math.ceil(Math.abs(turn)/.04));for(let i=0;i<=turns;i++){const blocked=!inBounds(x,z)||boatBlockedAt(x,z,yaw+turn*i/turns);yield;if(blocked)return null;}return points;
 }
 function* scan230(x,z,yaw,a){
  /* HARBOUR_DETOUR_280: direct first, then six bounded two-leg alternatives.
     Every turn/leg is preflighted; at most16 probes advance per native tick. */
  const end={x:a.x,z:a.z,yaw:a.yaw},distance=hyp(a.x-x,a.z-z),direct=yield* route280(x,z,yaw,a,[end]);if(direct)return direct;if(distance<1)return null;
  const midX=(x+a.x)/2,midZ=(z+a.z)/2,nx=-(a.z-z)/distance,nz=(a.x-x)/distance;
  for(const offset of[12,-12,24,-24,36,-36]){const p={x:midX+nx*offset,z:midZ+nz*offset};if(hyp(p.x-x,p.z-z)+hyp(a.x-p.x,a.z-p.z)>180)continue;const route=yield* route280(x,z,yaw,a,[p,end]);if(route)return route;}return null;
 }
`;
function once(source,old,next){if(source.split(old).length!==2)throw Error('Harbour280 anchor changed: '+old.slice(0,80));return source.replace(old,next);}
export function repairHarbourDetour(source){
 const at=source.indexOf(' function* scan230('),end=source.indexOf(' function identity230(',at);if(at<0||end<at||source.indexOf(' function* scan230(',at+1)!==-1)throw Error('Harbour280 scan anchor changed');
 source=source.slice(0,at)+scan280+source.slice(end);
 source=once(source,"j.stage='turning';break;","j.points=step.value;j.point=0;j.stage='turning';break;");
 source=once(source,'const a=j.q.anchor,distance=hyp(a.x-BOAT.x,a.z-BOAT.z);','const a=j.points[j.point],distance=hyp(a.x-BOAT.x,a.z-BOAT.z);');
 source=once(source,"if(move===distance){x=a.x;z=a.z;j.stage='mooring';}","if(move===distance){x=a.x;z=a.z;if(j.point<j.points.length-1){j.point++;j.stage='turning';}else j.stage='mooring';}");
 source=once(source,'if(distance<1e-8&&hyp(BOAT.x-a.x,BOAT.z-a.z)<1e-8','if(j.point===j.points.length-1&&a===j.points[j.point]&&distance<1e-8&&hyp(BOAT.x-a.x,BOAT.z-a.z)<1e-8');
 source=once(source,'Checking a clear approach to the original saved ramp;','Checking a direct approach and short detours to the original saved ramp;');
 source=once(source,'through a clear approach within 120 paces. Sunken or obstructed-channel recovery is not available here.','through a checked direct approach or short detour within 120 paces. Sunken boats and channels without a safe checked route still need separate recovery.');
 return source;
}
