// Low is a rendering budget; preserve all combat simulation and save data.
export function applyLowGraphicsCheckpoint(html) {
 const before = "renderer.shadowMap.enabled=preset!=='verylow';";
 const after = "renderer.shadowMap.enabled=preset!=='verylow'&&preset!=='low';";
 if (html.split(before).length !== 2) throw new Error('Low graphics fix requires exactly one source match');
 return html.replace(before, after);
}
