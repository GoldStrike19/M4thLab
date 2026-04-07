// ===== PAGE NAVIGATION =====
function showPage(n, b) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function(x) { x.classList.remove('active'); });
  document.getElementById('page-' + n).classList.add('active');
  b.classList.add('active');
}

// ===== UTILITIES =====
function sr(id, msg, t) {
  var e = document.getElementById(id);
  e.textContent = msg;
  e.className = 'res show' + (t ? ' ' + t : '');
}

function r4(n) { return Math.round(n * 10000) / 10000; }

// ===== EQUATION SOLVER =====
function setEq(v) { document.getElementById('eq-input').value = v; solveEq(); }

function solveEq() {
  var raw = document.getElementById('eq-input').value.trim();
  if (!raw) return;
  try {
    if (/[xX]/.test(raw)) { sr('eq-res', solveLinear(raw)); return; }
    var e = raw
      .replace(/\^/g, '**')
      .replace(/sqrt\(([^)]+)\)/g, function(_, n) { return 'Math.sqrt(' + n + ')'; })
      .replace(/pi/gi, 'Math.PI');
    sr('eq-res', '= ' + r4(Function('"use strict"; return (' + e + ')')()));
  } catch(e) {
    sr('eq-res', 'Expression invalide', 'err');
  }
}

function solveLinear(eq) {
  var sq = eq.match(/x\^2\s*=\s*(-?\d+\.?\d*)/i);
  if (sq) {
    var n = parseFloat(sq[1]);
    if (n < 0) return 'Pas de solution reelle';
    var s = Math.sqrt(n);
    return n === 0 ? 'x = 0' : 'x = ' + r4(s) + '  ou  x = ' + r4(-s);
  }
  var sides = eq.split('=');
  if (sides.length !== 2) return 'Format: ax + b = cx + d';
  function parse(expr) {
    expr = expr.replace(/\s/g, '');
    var xC = 0, c = 0;
    (expr.match(/([+-]?[^+-]+)/g) || []).forEach(function(p) {
      if (/[xX]/.test(p)) {
        var v = p.replace(/[xX]/g, '').replace(/\*/g, '');
        if (v === '' || v === '+') v = '1';
        if (v === '-') v = '-1';
        xC += parseFloat(v) || 1;
      } else {
        c += parseFloat(p) || 0;
      }
    });
    return { xC: xC, c: c };
  }
  var L = parse(sides[0]), R = parse(sides[1]);
  var xN = L.xC - R.xC, cN = R.c - L.c;
  if (xN === 0) return cN === 0 ? 'Infinite de solutions' : 'Aucune solution';
  return 'x = ' + r4(cN / xN);
}

// ===== PYTHAGORE =====
function calcHyp() {
  var a = parseFloat(document.getElementById('pa').value);
  var b = parseFloat(document.getElementById('pb').value);
  if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { sr('pr1', 'Valeurs invalides', 'err'); return; }
  sr('pr1', 'c = sqrt(' + a + '^2 + ' + b + '^2) = sqrt(' + (a*a+b*b) + ') = ' + r4(Math.sqrt(a*a + b*b)));
}

function verifyRight() {
  var a = parseFloat(document.getElementById('pva').value);
  var b = parseFloat(document.getElementById('pvb').value);
  var c = parseFloat(document.getElementById('pvc').value);
  if ([a, b, c].some(function(x) { return isNaN(x) || x <= 0; })) { sr('pr2', 'Valeurs invalides', 'err'); return; }
  var s = [a, b, c].sort(function(x, y) { return x - y; });
  if (Math.abs(s[2]*s[2] - (s[0]*s[0] + s[1]*s[1])) < 0.001) {
    var v = Math.max(a,b,c) === c ? 'B' : Math.max(a,b,c) === b ? 'C' : 'A';
    sr('pr2', 'Le triangle est rectangle en ' + v, 'ok');
  } else {
    sr('pr2', "Ce triangle n'est pas rectangle", 'err');
  }
}

// ===== THALES =====
function calcThales() {
  var ab  = parseFloat(document.getElementById('tab').value);
  var ab2 = parseFloat(document.getElementById('tab2').value);
  var ac  = parseFloat(document.getElementById('tac').value);
  if ([ab, ab2, ac].some(function(x) { return isNaN(x) || x <= 0; })) {
    sr('tr', "Remplis AB, A'B' et AC", 'err'); return;
  }
  sr('tr', "A'C' = (A'B' x AC) / AB = (" + ab2 + ' x ' + ac + ') / ' + ab + ' = ' + r4((ab2 * ac) / ab));
}

function calcThalesRatio() {
  var ab  = parseFloat(document.getElementById('tab').value);
  var ab2 = parseFloat(document.getElementById('tab2').value);
  var ac  = parseFloat(document.getElementById('tac').value);
  var ac2 = parseFloat(document.getElementById('tac2').value);
  if ([ab, ab2, ac, ac2].some(function(x) { return isNaN(x) || x <= 0; })) {
    sr('tr', 'Remplis tous les champs', 'err'); return;
  }
  var r1 = r4(ab2 / ab), r2 = r4(ac2 / ac);
  if (Math.abs(r1 - r2) < 0.001)
    sr('tr', "Rapports egaux : A'B'/AB = " + r1 + "  et  A'C'/AC = " + r2 + " -> Thales verifie", 'ok');
  else
    sr('tr', "Rapports differents : " + r1 + " != " + r2 + " -> Thales non verifie", 'err');
}

// ===== AUTRES FORMULES =====
function calcCircle() {
  var r = parseFloat(document.getElementById('cr').value);
  if (isNaN(r) || r <= 0) { sr('cres', 'Rayon invalide', 'err'); return; }
  sr('cres', 'Perimetre = 2 x pi x ' + r + ' = ' + r4(2 * Math.PI * r) + '\nAire = pi x ' + r + '^2 = ' + r4(Math.PI * r * r));
}

function calcAreas() {
  var b = parseFloat(document.getElementById('ab2').value);
  var h = parseFloat(document.getElementById('ah').value);
  if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) { sr('ares', 'Valeurs invalides', 'err'); return; }
  sr('ares', 'Triangle : (' + b + ' x ' + h + ') / 2 = ' + r4(0.5 * b * h) + '\nRectangle : ' + b + ' x ' + h + ' = ' + (b * h));
}

function calcId() {
  var a = parseFloat(document.getElementById('ida').value);
  var b = parseFloat(document.getElementById('idb').value);
  if (isNaN(a) || isNaN(b)) { sr('idres', 'Valeurs invalides', 'err'); return; }
  sr('idres',
    '(' + a + '+' + b + ')^2 = ' + r4((a+b)**2) +
    '\n(' + a + '-' + b + ')^2 = ' + r4((a-b)**2) +
    '\n(' + a + '+' + b + ')(' + a + '-' + b + ') = ' + r4((a+b)*(a-b))
  );
}

// ===== EXERCICE 1 =====
function ex1() {
  var ab = parseFloat(document.getElementById('e1ab').value);
  var ac = parseFloat(document.getElementById('e1ac').value);
  var bc = parseFloat(document.getElementById('e1bc').value);
  if ([ab, ac, bc].some(function(x) { return isNaN(x) || x <= 0; })) { sr('r1', 'Saisis des valeurs positives', 'err'); return; }
  var s = [{v: ab, n: 'B'}, {v: ac, n: 'C'}, {v: bc, n: 'A'}].sort(function(a, b) { return a.v - b.v; });
  if (Math.abs(s[2].v * s[2].v - (s[0].v * s[0].v + s[1].v * s[1].v)) < 0.01 * s[2].v)
    sr('r1', 'Le triangle est rectangle en ' + s[2].n, 'ok');
  else
    sr('r1', "Le triangle n'est pas rectangle", 'err');
}

// ===== EXERCICE 2 =====
function ex2() {
  var a = parseFloat(document.getElementById('e2a').value);
  var b = parseFloat(document.getElementById('e2b').value);
  if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { sr('r2', 'Valeurs invalides', 'err'); return; }
  sr('r2', "L'hypotenuse mesure : " + r4(Math.sqrt(a*a + b*b)) + '  (sqrt(' + a + '^2 + ' + b + '^2) = sqrt(' + (a*a+b*b) + '))', 'ok');
}

// ===== EXERCICE 3 =====
function ex3() {
  var w = document.getElementById('e3w').value;
  if (!w.trim()) { sr('r3', 'Saisis un mot ou une phrase', 'err'); return; }
  var count = (w.match(/e/gi) || []).length;
  var pos = [];
  for (var i = 0; i < w.length; i++) if (w[i].toLowerCase() === 'e') pos.push(i + 1);
  if (count === 0)
    sr('r3', 'Aucun "e" dans "' + w + '"', 'err');
  else
    sr('r3', '"' + w + '" contient ' + count + ' lettre' + (count > 1 ? 's' : '') + ' "e"\n(positions : ' + pos.join(', ') + ')', 'ok');
}

// ===== EXERCICE 4 - JEU PLUS OU MOINS =====
var sN = null, att = 0, gs = [];

function gameReset() {
  sN = Math.floor(Math.random() * 100) + 1;
  att = 0;
  gs = [];
  document.getElementById('gdisp').textContent = '?';
  document.getElementById('ghist').textContent = '';
  document.getElementById('gatt').textContent = '';
  document.getElementById('ginput').value = '';
  document.getElementById('ginput').disabled = false;
  document.getElementById('r4').className = 'res';
}

function gameGuess() {
  if (!sN) gameReset();
  var v = parseInt(document.getElementById('ginput').value);
  if (isNaN(v) || v < 1 || v > 100) { sr('r4', 'Entre un nombre entre 1 et 100', 'err'); return; }
  att++;
  gs.push(v);
  document.getElementById('ginput').value = '';
  if (v === sN) {
    document.getElementById('gdisp').textContent = 'Gagne !';
    document.getElementById('ghist').textContent = 'Essais : ' + gs.join(' -> ');
    sr('r4', 'Bravo ! Le nombre etait ' + sN + '. Trouve en ' + att + ' essai' + (att > 1 ? 's' : '') + '!', 'ok');
    document.getElementById('ginput').disabled = true;
  } else if (v < sN) {
    document.getElementById('gdisp').textContent = v + '  -> PLUS GRAND';
    document.getElementById('ghist').textContent = 'Essais : ' + gs.join(' -> ');
    document.getElementById('gatt').textContent = att + ' essai' + (att > 1 ? 's' : '');
    sr('r4', "C'est plus grand ! (tu as propose " + v + ')');
  } else {
    document.getElementById('gdisp').textContent = v + '  -> PLUS PETIT';
    document.getElementById('ghist').textContent = 'Essais : ' + gs.join(' -> ');
    document.getElementById('gatt').textContent = att + ' essai' + (att > 1 ? 's' : '');
    sr('r4', "C'est plus petit ! (tu as propose " + v + ')');
  }
}

// ===== EXERCICE 5 - QCM =====
var qTF = null;

function setTF(v) {
  qTF = v;
  document.getElementById('qtrue').style.background  = v === 'true'  ? 'var(--accent)' : '';
  document.getElementById('qtrue').style.color       = v === 'true'  ? '#fff' : '';
  document.getElementById('qfalse').style.background = v === 'false' ? 'var(--accent)' : '';
  document.getElementById('qfalse').style.color      = v === 'false' ? '#fff' : '';
}

function validateQCM() {
  var sc = 0, fb = [];
  var q1 = document.getElementById('q1').value;
  if (q1 === 'c') { sc++; fb.push('Q1 - Correct ! A = pi x r^2'); }
  else fb.push('Q1 - Faux. La bonne reponse : A = pi x r^2');

  var q2 = parseFloat(document.getElementById('q2').value);
  if (q2 === 5) { sc++; fb.push('Q2 - Correct ! sqrt(9+16) = 5'); }
  else fb.push('Q2 - Faux. La reponse etait 5');

  if (qTF === 'false') { sc++; fb.push("Q3 - Correct ! Thales s'applique a tous les triangles"); }
  else if (!qTF) fb.push('Q3 - Non repondu');
  else fb.push('Q3 - Faux. Thales fonctionne pour tous les triangles');

  var r = document.getElementById('qres');
  r.innerHTML = '<strong>Score : ' + sc + ' / 3</strong><br><br>' + fb.join('<br>');
  r.className = 'qres show';
}

// ===== INIT =====
gameReset();