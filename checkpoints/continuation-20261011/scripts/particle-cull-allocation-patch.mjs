// Copy only inspected active functions, fail closed if the seed contract changes.
export function particleCullAllocationPatch(source){
 const rows=source.split('\n'),find=p=>{const r=rows.find(l=>l.startsWith(p));if(!r)throw Error('Missing allocation anchor: '+p);return r;};
 const fx=find('function fxTick22('),cull=find('const cull28Before=cullIslands;');
 const position='FX_POS22.set([p.x,p.y,p.z],i*3);',attributes="for(const key of['position','color','alpha','size'])FX_GEO22.attributes[key].needsUpdate=any;",animals='for(const a of [...SHEEP,...PASTORAL])if(hyp(a.x-P.x,a.z-P.z)>70)a.g.visible=false;';
 for(const [body,anchor]of[[fx,position],[fx,attributes],[cull,animals]])if(body.split(anchor).length!==2)throw Error('Ambiguous allocation anchor: '+anchor);
 const patchedFx=fx.replace('function fxTick22(', 'fxTick22=function(').replace(position,'const k=i*3;FX_POS22[k]=p.x;FX_POS22[k+1]=p.y;FX_POS22[k+2]=p.z;').replace(attributes,'FX_GEO22.attributes.position.needsUpdate=any;FX_GEO22.attributes.color.needsUpdate=any;FX_GEO22.attributes.alpha.needsUpdate=any;FX_GEO22.attributes.size.needsUpdate=any;');
 const patchedCull=cull.slice(cull.indexOf('cullIslands=function()')).replace(animals,'for(const a of SHEEP)if(hyp(a.x-P.x,a.z-P.z)>70)a.g.visible=false;for(const a of PASTORAL)if(hyp(a.x-P.x,a.z-P.z)>70)a.g.visible=false;');
 return '\n/* PARTICLE_CULL_ALLOCATION_174: exact writes/order without per-frame temporary arrays. */\n'+patchedFx+';\n'+patchedCull+'\n';
}
