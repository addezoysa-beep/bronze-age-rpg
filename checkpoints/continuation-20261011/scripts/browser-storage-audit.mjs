// Diagnostic only: never repair, write a voyage, bypass a button, or swallow
// the original Storage exception. Do not log serialized player data.
export function installStorageAudit(){
 if(globalThis.__WDS_STORAGE_AUDIT_INSTALLED__)return;
 globalThis.__WDS_STORAGE_AUDIT_INSTALLED__=true;let count=0;
 const emit=(event)=>{try{if(count++<32)console.debug('[WDS_STORAGE_AUDIT]'+JSON.stringify(event));}catch{}};
 try{emit({operation:'document-start',url:location.href,saveKeys:Object.keys(localStorage).filter(k=>k.startsWith('wine-dark-sea-v2-slot-'))});}catch(e){emit({operation:'document-start-error',error:String(e)});}
 for(const operation of['setItem','removeItem','clear']){
  const original=Storage.prototype[operation];
  Storage.prototype[operation]=function(...args){
   const key=typeof args[0]==='string'?args[0]:null,record=operation==='clear'||key?.startsWith('wine-dark-sea-v2-slot-');
   if(record)emit({operation,key,bytes:operation==='setItem'&&typeof args[1]==='string'?args[1].length:null,stage:'before',stack:String(new Error().stack||'').split('\n').slice(1,5)});
   try{const result=Reflect.apply(original,this,args);if(record)emit({operation,key,stage:'returned'});return result;}
   catch(e){if(record)emit({operation,key,stage:'threw',error:String(e)});throw e;}
  };
 }
}
