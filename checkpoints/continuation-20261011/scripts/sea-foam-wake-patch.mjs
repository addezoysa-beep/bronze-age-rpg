export const seaFoamWakePatch=String.raw`
/* SEA_FOAM_WAKE_165: narrow, short sea-foam streaks; one bounded reusable mesh. */
(function(){
 const cap=24,vertices=12,positions=new Float32Array(cap*vertices*3),alphas=new Float32Array(cap*vertices),slots=Array.from({length:cap},()=>({life:0}));let at=0,mesh=null,geometry=null,last=new WeakMap();
 function init165(){if(mesh)return;geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('foamAlpha165',new THREE.BufferAttribute(alphas,1));
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,vertexShader:'attribute float foamAlpha165; varying float foam165; void main(){foam165=foamAlpha165;gl_Position=projectionMatrix*viewMatrix*vec4(position,1.);}',fragmentShader:'varying float foam165; void main(){gl_FragColor=vec4(0.75,0.91,0.86,foam165);}',polygonOffset:true,polygonOffsetFactor:-1});mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;mesh.userData.seaFoamWake165=true;scene.add(mesh);}
 wakeFx=function(B){if(!B||AREA!=='over'||!Number.isFinite(B.x+B.z+B.yaw+B.sp)||Math.abs(B.sp)<=3)return;const prior=last.get(B);if(prior&&T_NOW-prior.time<.065)return;last.set(B,{time:T_NOW});init165();const q=slots[at++%cap],direction=B.sp<0?-1:1;q.life=q.max=.85;q.x=B.x-Math.sin(B.yaw)*4.1*direction;q.z=B.z-Math.cos(B.yaw)*4.1*direction;q.yaw=B.yaw+(direction<0?Math.PI:0);q.speed=Math.min(14,Math.abs(B.sp));};
 function foamTick165(dt){if(!mesh)return;dt=Math.max(0,Math.min(.10,Number(dt)||0));const vfx=typeof vfxIntensity166==='function'?vfxIntensity166():1;let any=false;for(let i=0;i<cap;i++){const q=slots[i];q.life=Math.max(0,q.life-dt);const alpha=q.life/q.max*.40*vfx||0;if(!q.life){alphas.fill(0,i*vertices,(i+1)*vertices);continue;}any=true;const age=q.max-q.life,width=.65+age*.65,length=1.0+q.speed*.08+age*.6,sin=Math.sin(q.yaw),cos=Math.cos(q.yaw),thick=.10+age*.035;
   // Two narrow angled ribbons form a small V behind the stern, not discs.
   let vertex=0;for(const side of[-1,1])for(const [u,v]of[[0,0],[1,0],[0,1],[0,1],[1,0],[1,1]]){const lx=side*(.22+u*width)+(v-.5)*thick,lz=-u*length,base=(i*vertices+vertex)*3,x=q.x+lx*cos+lz*sin,z=q.z-lx*sin+lz*cos;positions[base]=x;positions[base+1]=waveH(x,z,T_NOW)+.045;positions[base+2]=z;alphas[i*vertices+vertex++]=alpha;}
  }mesh.visible=any&&AREA==='over';geometry.attributes.position.needsUpdate=true;geometry.attributes.foamAlpha165.needsUpdate=true;}
 const visual165Before=updVisuals;updVisuals=function(dt){const r=visual165Before.apply(this,arguments);foamTick165(dt);return r;};
 function reset165(){for(const q of slots)q.life=0;alphas.fill(0);last=new WeakMap();if(mesh)mesh.visible=false;}
 const new165Before=newGame;newGame=function(){reset165();return new165Before.apply(this,arguments);};const restore165Before=restoreLivingWorld;restoreLivingWorld=function(){reset165();return restore165Before.apply(this,arguments);};
 Object.assign(globalThis,{foamTick165,resetFoam165:reset165});
})();`;
