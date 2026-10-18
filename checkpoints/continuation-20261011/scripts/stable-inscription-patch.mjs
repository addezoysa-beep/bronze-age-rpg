export const stableInscriptionPatch=String.raw`
/* CONTINUATION_IKARIA_STABLE_INSCRIPTION_V1
   Replace the modern English placard with a physical horse-and-tally mark.
   The ordinary interaction prompt remains the accessible source of directions. */
(function(){
 const before=bindOpening84;
 function paintHorseTally96(canvas){
  const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  c.clearRect(0,0,w,h);
  const wood=c.createLinearGradient(0,0,0,h);wood.addColorStop(0,'#4a321e');wood.addColorStop(.52,'#2f2117');wood.addColorStop(1,'#1f160f');
  c.fillStyle=wood;c.fillRect(0,0,w,h);
  c.strokeStyle='rgba(255,220,151,.13)';c.lineWidth=3;
  for(let y=16;y<h;y+=22){c.beginPath();c.moveTo(8,y);c.quadraticCurveTo(w*.45,y+7,w-8,y-2);c.stroke();}
  c.strokeStyle='#e6c37c';c.fillStyle='#e6c37c';c.lineCap='round';c.lineJoin='round';c.lineWidth=10;
  // Incised horse profile: muzzle, jaw, neck, mane and ear.
  c.beginPath();c.moveTo(84,95);c.quadraticCurveTo(112,55,165,52);c.lineTo(206,68);c.lineTo(187,83);c.lineTo(152,80);c.quadraticCurveTo(134,96,130,128);c.stroke();
  c.beginPath();c.moveTo(158,52);c.lineTo(170,25);c.lineTo(184,57);c.moveTo(143,55);c.lineTo(137,32);c.lineTo(164,52);c.stroke();
  c.beginPath();c.arc(174,67,4,0,Math.PI*2);c.fill();
  // Keeper's tally and a simple divided-barley mark; no modern-language label.
  c.lineWidth=8;
  for(let x=282;x<=394;x+=28){c.beginPath();c.moveTo(x,43);c.lineTo(x-8,119);c.stroke();}
  c.beginPath();c.moveTo(265,82);c.lineTo(413,82);c.stroke();
  c.lineWidth=5;c.beginPath();c.moveTo(449,35);c.lineTo(449,124);c.moveTo(449,55);c.lineTo(425,43);c.moveTo(449,72);c.lineTo(474,58);c.moveTo(449,91);c.lineTo(425,105);c.moveTo(449,108);c.lineTo(474,121);c.stroke();
 }
 bindOpening84=function(){
  const known=new Set(OVER.children),out=before.apply(this,arguments),s=stableAnchor84();
  for(const o of OVER.children){
   if(known.has(o)||!o.isSprite||!o.material?.map?.image)continue;
   if(Math.hypot(o.position.x-(s.x+4),o.position.z-(s.z+16))>2)continue;
   const canvas=o.material.map.image;paintHorseTally96(canvas);o.material.map.needsUpdate=true;
   o.userData.stableInscription96='horse-and-tally';
  }
  return out;
 };
})();`;
