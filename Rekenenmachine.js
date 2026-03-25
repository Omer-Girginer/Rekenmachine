'use strict';

const display = document.getElementById('display');
const expr = document.getElementById('expr');
const keysContainer = document.getElementById('keys');

let current = '0';
let prev = null;
let operator = null;
let justCalculated = false;

const opSymbol = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

// Format number — avoid floating point artifacts
const fmt = function (n) {
  const num = parseFloat(n);
  if (isNaN(num)) return 'Hata';
  if (!isFinite(num)) return 'Hata';
  if (Math.abs(num) > 1e12) return num.toExponential(4);
  return parseFloat(num.toPrecision(10)).toString();
};

const updateDisplay = function () {
  display.textContent = fmt(current);
};

const calculate = function (a, b, op) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return b === 0 ? NaN : a / b;
};

const handleKey = function (val) {
  // Clear
  if (val === 'AC') {
    current = '0';
    prev = null;
    operator = null;
    justCalculated = false;
    expr.textContent = '';

  // Toggle sign
  } else if (val === '+/-') {
    current = fmt(parseFloat(current) * -1);

  // Percentage
  } else if (val === '%') {
    current = fmt(parseFloat(current) / 100);

  // Operator
  } else if (['+', '-', '*', '/'].includes(val)) {
    if (operator && !justCalculated) {
      const result = calculate(parseFloat(prev), parseFloat(current), operator);
      current = fmt(result);
      prev = fmt(result);
    } else {
      prev = current;
    }
    operator = val;
    expr.textContent = fmt(prev) + ' ' + opSymbol[val];
    justCalculated = false;
    current = '0';

  // Equals
  } else if (val === '=') {
    if (operator && prev !== null) {
      const a = parseFloat(prev);
      const b = parseFloat(current);
      expr.textContent =
        fmt(prev) + ' ' + opSymbol[operator] + ' ' + fmt(current) + ' =';
      const result = calculate(a, b, operator);
      current = fmt(result);
      prev = null;
      operator = null;
      justCalculated = true;
    }

  // Decimal point
  } else if (val === '.') {
    if (justCalculated) { current = '0'; justCalculated = false; }
    if (!current.includes('.')) current += '.';

  // Number
  } else {
    if (justCalculated) { current = '0'; justCalculated = false; }
    if (current === '0') current = val;
    else if (current.length < 12) current += val;
  }

  updateDisplay();
};

// Click events — event delegation
keysContainer.addEventListener('click', function (e) {
  const btn = e.target.closest('.key');
  if (!btn) return;
  handleKey(btn.dataset.val);
});

// Keyboard support
document.addEventListener('keydown', function (e) {
  const keyMap = {
    Enter: '=',
    Escape: 'AC',
    Backspace: 'AC',
  };
  const val = keyMap[e.key] || e.key;
  const validKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','=','.','AC','%'];
  if (validKeys.includes(val)) {
    e.preventDefault();
    handleKey(val);
  }
});