// Preserve the weapon direction and finger anchor while limiting wrist articulation.
export function applyGripCheckpoint(html) {
 const old = html.split('\n').find(l=>l.startsWith('closeGrip23=function('));
 if(!old || html.split(old).length!==2) throw new Error('Expected one final anatomical grip override');
 const next=old.replace('wrist.quaternion.setFromUnitVectors(GRIP_X23,axis.normalize());',
  'const wanted=new THREE.Quaternion().setFromUnitVectors(GRIP_X23,axis.normalize()),neutral=new THREE.Quaternion(),angle=neutral.angleTo(wanted);wrist.quaternion.copy(neutral).slerp(wanted,angle>0?Math.min(1,(Math.PI*65/180)/angle):1).normalize();');
 if(next===old)throw new Error('Expected final wrist rotation assignment');
 return html.replace(old,next);
}
