export function repairDialogueChoiceContext(source){
 const list='if(last&&DLG.choices){DLG.choices.forEach((ch,i)=>{',click='b.onclick=e=>{e.stopPropagation();closeDlg();ch.go()};';
 if(source.split(list).length!==2||source.split(click).length!==2)throw Error('Native dialogue-choice anchor changed');
 return source.replace(list,'/* DIALOGUE_CHOICE_CONTEXT_278 */ if(last&&DLG.choices){const lines278=DLG.lines,choices278=DLG.choices,index278=DLG.i,game278=G;DLG.choices.forEach((ch,i)=>{let used278=false;').replace(click,"b.onclick=e=>{e.stopPropagation();if(used278||G!==game278||STATE!=='talk'||DLG.lines!==lines278||DLG.choices!==choices278||DLG.i!==index278)return false;used278=true;closeDlg();ch.go()};");
}
