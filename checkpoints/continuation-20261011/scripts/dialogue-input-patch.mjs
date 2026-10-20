export const dialogueInput279=String.raw`
/* DIALOGUE_INPUT_279: mouse and number keys share one current-menu transaction. */
function dialogueEditable279(e){const selector='input,textarea,select,[contenteditable="true"],[role="textbox"]';return !!e?.target?.closest?.(selector);}
function chooseDialogue279(i,q=chooseDialogue279.current){
 if(!q||q!==chooseDialogue279.current||q.used||!Number.isSafeInteger(i)||i<0||i>=q.actions.length||G!==q.game||STATE!=='talk'||DLG.lines!==q.lines||DLG.choices!==q.choices||DLG.i!==q.index||DLG.i!==DLG.lines.length-1)return false;
 const action=q.actions[i];if(DLG.choices[i]!==action.ch||action.ch.go!==action.go||typeof action.go!=='function')return false;
 q.used=true;closeDlg();return action.go.call(action.ch);
}
`;
export function repairDialogueInput(source){
 const old=source.split('\n').filter(l=>l.includes('/* DIALOGUE_CHOICE_CONTEXT_278 */'));if(old.length!==1||!old[0].includes('let used278=false;')||!old[0].includes('G!==game278'))throw Error('Guarded native choice renderer anchor changed');
 const next="  /* DIALOGUE_CHOICE_CONTEXT_278 */ if(last&&DLG.choices){const context279={game:G,lines:DLG.lines,choices:DLG.choices,index:DLG.i,used:false,actions:DLG.choices.map(ch=>({ch,go:ch.go}))};chooseDialogue279.current=context279;DLG.choices.forEach((ch,i)=>{const b=document.createElement('button');b.textContent=(i+1)+'. '+ch.t;b.onclick=e=>{e.stopPropagation();return chooseDialogue279(i,context279);};c.appendChild(b)});$('dhint').textContent=''}}";
 source=source.replace(old[0],next);
 const branch="else if(STATE==='talk'){if(c==='Escape')cancelDialogue();",direct="const ch=DLG.choices[+c.slice(-1)-1];if(ch){closeDlg();ch.go()}";
 if(source.split(branch).length!==2||source.split(direct).length!==2)throw Error('Native keyboard dialogue anchor changed');
 source=source.replace(branch,"else if(STATE==='talk'){if(c!=='Escape'&&dialogueEditable279(e)){delete once[c];return;}if(c==='Escape')cancelDialogue();").replace(direct,"chooseDialogue279(+c.slice(-1)-1)");
 const end=source.lastIndexOf('</script>');if(end<0)throw Error('Missing runtime script boundary');return source.slice(0,end)+dialogueInput279+source.slice(end);
}
