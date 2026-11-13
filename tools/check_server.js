// Fails when the game server would not start: syntax errors and names declared twice (run before every deploy)
const ts = require('typescript'); const f = 'supabase/functions/game/index.ts';
const opt = { noEmit: true, target: 99, module: 99, noLib: true, types: [], skipLibCheck: true };
const prog = ts.createProgram([f], opt, ts.createCompilerHost(opt));
const bad = prog.getSyntacticDiagnostics().concat(prog.getSemanticDiagnostics().filter(d => /redeclare|Duplicate|already been declared/i.test(ts.flattenDiagnosticMessageText(d.messageText, ' '))));
bad.forEach(d => console.log('line', d.file ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : '?', ts.flattenDiagnosticMessageText(d.messageText, ' ')));
process.exit(bad.length ? 1 : 0);
