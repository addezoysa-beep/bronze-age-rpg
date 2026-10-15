export const continueSaveSafetyPatch=String.raw`
/* CONTINUE_SAVE_SAFETY_150: failed Continue never becomes explicit New. */
class SaveReadFailure150 extends Error {}
let continueIntent150=false,continueReading150=false;
function continueFailure150(){STATE='title';document.body.classList.remove('playing');$('title').classList.add('on');toast('Could not read this manual save. It has not been deleted. Choose another voyage or try again.');}
const hasSafe150Before=hasSave;hasSave=function(...args){const ok=hasSafe150Before.apply(this,args);if(!ok&&continueReading150)throw new SaveReadFailure150('Manual save is unavailable');return ok;};
const loadSafe150Before=loadGame;loadGame=function(...args){const ok=loadSafe150Before.apply(this,args);if(!ok)throw new SaveReadFailure150('Manual save could not be read');return ok;};
// The stream action encloses the legacy start function, whose failed-load else
// branch removes the slot. Catch only our read failure before that else runs.
const arrivalSafe150Before=streamArrival;streamArrival=function(x,z,action){const intent=continueIntent150;return arrivalSafe150Before.call(this,x,z,function(...args){const before=continueReading150;continueReading150=intent;try{return action.apply(this,args);}catch(e){if(!(e instanceof SaveReadFailure150))throw e;continueFailure150();}finally{continueReading150=before;}});};
const startSafe150Before=startGame;startGame=function(cont,slot){if(cont&&!hasSave(slot||SAVE_SLOT)){continueFailure150();return false;}const before=continueIntent150;continueIntent150=!!cont;try{return startSafe150Before.apply(this,arguments);}finally{continueIntent150=before;}};
`;
