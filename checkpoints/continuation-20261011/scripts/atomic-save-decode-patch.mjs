export const atomicSaveDecodePatch=String.raw`
/* ATOMIC_SAVE_DECODE_156: one decode, preserve exact legacy inventory semantics. */
loadGame=function(n){const before=G,slot=SAVE_SLOT;try{
 const selected=n||SAVE_SLOT,s=JSON.parse(localStorage.getItem(slotKey(selected)));
 if(!s||typeof s!=='object'||Array.isArray(s))return false;
 // Keep existing Object.assign behavior: an explicitly empty saved inventory
 // must not acquire the obsolete starter resources still present in G0.
 const g=G0(),next=Object.assign(g,s);next.own=Object.assign(g.own,s.own||{});next.inv=Object.assign(g.inv,s.inv||{});next.F=s.F||{};next.disc=s.disc||{};next.dg=s.dg||{};
 G=next;remedyState62();SAVE_SLOT=selected;return true;
 }catch(e){G=before;SAVE_SLOT=slot;return false;}};
`;
