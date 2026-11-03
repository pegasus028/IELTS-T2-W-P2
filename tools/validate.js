// node tools/validate.js  — fairness and structure checks on both question banks.
// Exit 1 on any failure. Run after every edit to prompts.json / prompts-b2.json.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ABS = /\b(all|every|always|never|only|nobody|everyone|completely|entirely|totally|outright|invariably)\b/i;
let fails = 0;
const fail = m => { console.log('  FAIL ' + m); fails++; };
for (const f of ['prompts.json', 'prompts-b2.json']) {
  const bank = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  if (bank.length !== 23) fail(f + ': expected 23 prompts, got ' + bank.length);
  let n = 0, lg = 0, sh = 0; const byPhaseL = Array(11).fill(0), byPhaseS = Array(11).fill(0);
  bank.forEach(p => {
    if (!p.id || !p.promptText || !Array.isArray(p.phases) || p.phases.length !== 11) return fail(f + ' ' + p.id + ': bad prompt shape');
    p.phases.forEach((ph, i) => {
      n++;
      if (typeof ph.correct !== 'string' || !Array.isArray(ph.distractors) || ph.distractors.length !== 3) return fail(f + ' ' + p.id + '/' + i + ': bad phase shape');
      const o = [ph.correct, ...ph.distractors];
      if (o.some(x => !x.trim())) fail(f + ' ' + p.id + '/' + i + ': empty option');
      if (new Set(o.map(x => x.trim().toLowerCase())).size < 4) fail(f + ' ' + p.id + '/' + i + ': duplicate options');
      const L = o.map(x => x.length), mx = Math.max(...L), mn = Math.min(...L);
      if (L[0] === mx && L.filter(x => x === mx).length === 1) { lg++; byPhaseL[i]++; }
      if (L[0] === mn && L.filter(x => x === mn).length === 1) { sh++; byPhaseS[i]++; }
      if (mx > 1.8 * mn) fail(f + ' ' + p.id + '/' + i + ': option lengths too uneven (' + L.join(',') + ')');
      if (!ABS.test(ph.correct) && ph.distractors.every(d => ABS.test(d))) fail(f + ' ' + p.id + '/' + i + ': key is the only option without an absolute word');
      if (o.some(x => /\byou\b|n't\b|'re\b|'ll\b/i.test(x))) fail(f + ' ' + p.id + '/' + i + ': informal register');
    });
  });
  const pct = x => (100 * x / n).toFixed(1) + '%';
  console.log(f + ': ' + n + ' items | key longest ' + lg + ' (' + pct(lg) + ') | key shortest ' + sh + ' (' + pct(sh) + ')');
  console.log('   longest by box : ' + byPhaseL.join(' ') + '\n   shortest by box: ' + byPhaseS.join(' '));
  if (lg / n > 0.30) fail(f + ': key is the longest option in more than 30% of items');
  if (sh / n > 0.30) fail(f + ': key is the shortest option in more than 30% of items');
  byPhaseL.forEach((c, i) => { if (c > 10) fail(f + ': box ' + (i + 1) + ' has the longest key in ' + c + '/23 prompts (predictable)'); });
  byPhaseS.forEach((c, i) => { if (c > 10) fail(f + ': box ' + (i + 1) + ' has the shortest key in ' + c + '/23 prompts (predictable)'); });
}
console.log(fails ? fails + ' failure(s)' : 'validate: OK');
process.exit(fails ? 1 : 0);
