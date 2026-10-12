// Preserve story completion and ordinary mouse/keyboard access without save migration.
export function applyInteractionCheckpoint(html) {
 const edits = [
  ["get(){return function(...args){if(sleepingNPC48(n))return sleepReply48(n);return fn?.apply(n,args);};}", "get(){const talk=fn;return function(...args){if(sleepingNPC48(n))return sleepReply48(n);return talk?.apply(n,args);};}"],
  ["if(choices){try{document.exitPointerLock()}catch(e){}}}", "try{document.exitPointerLock?.()}catch(e){}mouse.l=mouse.r=false;for(const k in keys)keys[k]=false;}"],
  ["if(n&&!n.sleep35&&!n.sleeping&&!/sleep/.test(n.action||'')&&art?.length){choices=", "if(n&&typeof done!=='function'&&!n.sleep35&&!n.sleeping&&!/sleep/.test(n.action||'')&&art?.length){choices="],
  ["/^Digit[1-4]$/.test(c)&&DLG.choices", "/^(Digit|Numpad)[1-9]$/.test(c)&&DLG.choices"],
  ["DLG.choices[+c[5]-1]", "DLG.choices[+c.slice(-1)-1]"],
  ["width:min(820px,94vw);display:none;z-index:20;cursor:pointer", "width:min(820px,94vw);max-height:85vh;overflow-y:auto;display:none;z-index:20;cursor:pointer"]
 ];
 for (const [before,after] of edits) {
  if(html.split(before).length!==2)throw new Error('Interaction fix requires exactly one source match: '+before);
  html=html.replace(before,after);
 }
 return html;
}
