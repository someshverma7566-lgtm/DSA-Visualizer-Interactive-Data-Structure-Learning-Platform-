/**
 * Expression Converter Visualizer
 * Infix → Postfix / Prefix with animated stack
 */

let isRunning = false;

function getSpeed() {
    return parseInt(document.getElementById('speedSlider').value);
}

function precedence(op) {
    if (op === '^') return 3;
    if (op === '*' || op === '/') return 2;
    if (op === '+' || op === '-') return 1;
    return 0;
}

function isOperator(ch) {
    return ['+', '-', '*', '/', '^'].includes(ch);
}

function isOperand(ch) {
    return /[A-Za-z0-9]/.test(ch);
}

async function updateStack(stack) {
    const viz = document.getElementById('stackViz');
    viz.innerHTML = '';
    if (stack.length === 0) {
        viz.innerHTML = '<div style="color:var(--text-muted);font-size:13px;">Empty</div>';
        return;
    }
    for (let i = 0; i < stack.length; i++) {
        const item = document.createElement('div');
        item.className = 'stack-item';
        item.textContent = stack[i];
        viz.appendChild(item);
    }
}

function addStep(text, type = '') {
    const log = document.getElementById('stepLog');
    const step = document.createElement('div');
    step.className = 'step ' + type;
    step.textContent = text;
    log.appendChild(step);
    log.scrollTop = log.scrollHeight;
}

function clearVisualization() {
    document.getElementById('stepLog').innerHTML = '';
    document.getElementById('stackViz').innerHTML = '<div style="color:var(--text-muted);font-size:13px;">Empty</div>';
    document.getElementById('outputDisplay').textContent = '-';
    document.getElementById('currentChar').textContent = '-';
    document.getElementById('resultBox').style.display = 'none';
}

async function runConversion() {
    if (isRunning) return;
    isRunning = true;

    const expression = document.getElementById('expressionInput').value.trim();
    const type = document.getElementById('conversionType').value;

    if (!expression) {
        alert('Please enter an expression!');
        isRunning = false;
        return;
    }

    clearVisualization();
    document.getElementById('runBtn').textContent = '⏳ Running...';
    document.getElementById('runBtn').disabled = true;

    if (type === 'postfix') {
        await infixToPostfix(expression);
    } else {
        await infixToPrefix(expression);
    }

    document.getElementById('runBtn').textContent = '▶ Run Conversion';
    document.getElementById('runBtn').disabled = false;
    isRunning = false;
}

async function infixToPostfix(infix) {
    const stack = [];
    let output = '';
    const speed = getSpeed();

    addStep('Starting Infix → Postfix conversion', 'active');
    addStep(`Expression: ${infix}`);
    await delay(speed);

    for (let i = 0; i < infix.length; i++) {
        const ch = infix[i];
        document.getElementById('currentChar').textContent = ch;

        if (isOperand(ch)) {
            output += ch;
            document.getElementById('outputDisplay').textContent = output;
            addStep(`Read '${ch}' (operand) → Add to output. Output: ${output}`, 'completed');
        } else if (ch === '(') {
            stack.push(ch);
            await updateStack(stack);
            addStep(`Read '(' → Push to stack`);
        } else if (ch === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                output += stack.pop();
                document.getElementById('outputDisplay').textContent = output;
                await updateStack(stack);
                await delay(speed / 2);
            }
            if (stack.length > 0) stack.pop(); // remove '('
            await updateStack(stack);
            addStep(`Read ')' → Pop until '('. Output: ${output}`, 'completed');
        } else if (isOperator(ch)) {
            while (stack.length > 0 && precedence(stack[stack.length - 1]) >= precedence(ch)) {
                output += stack.pop();
                document.getElementById('outputDisplay').textContent = output;
                await updateStack(stack);
                await delay(speed / 2);
            }
            stack.push(ch);
            await updateStack(stack);
            addStep(`Read '${ch}' (operator, prec=${precedence(ch)}) → Push to stack. Output: ${output}`);
        }

        await delay(speed);
    }

    // Pop remaining
    addStep('Pop remaining operators from stack...', 'active');
    while (stack.length > 0) {
        output += stack.pop();
        document.getElementById('outputDisplay').textContent = output;
        await updateStack(stack);
        await delay(speed / 2);
    }

    addStep(`✅ Final Postfix: ${output}`, 'completed');
    document.getElementById('currentChar').textContent = '✓';
    document.getElementById('resultBox').style.display = 'block';
    document.getElementById('resultText').textContent = output;
}

async function infixToPrefix(infix) {
    const speed = getSpeed();

    addStep('Starting Infix → Prefix conversion', 'active');
    addStep(`Expression: ${infix}`);
    await delay(speed);

    // Step 1: Reverse
    let reversed = infix.split('').reverse().join('');
    reversed = reversed.replace(/\(/g, 'TEMP').replace(/\)/g, '(').replace(/TEMP/g, ')');
    addStep(`Step 1: Reverse & swap brackets: ${reversed}`);
    await delay(speed);

    // Step 2: Postfix of reversed
    addStep('Step 2: Convert reversed to Postfix...', 'active');
    await delay(speed / 2);

    const stack = [];
    let output = '';

    for (let i = 0; i < reversed.length; i++) {
        const ch = reversed[i];
        document.getElementById('currentChar').textContent = ch;

        if (isOperand(ch)) {
            output += ch;
            document.getElementById('outputDisplay').textContent = output;
            addStep(`  Read '${ch}' (operand) → Output: ${output}`);
        } else if (ch === '(') {
            stack.push(ch);
            await updateStack(stack);
        } else if (ch === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                output += stack.pop();
                document.getElementById('outputDisplay').textContent = output;
                await updateStack(stack);
                await delay(speed / 2);
            }
            if (stack.length > 0) stack.pop();
            await updateStack(stack);
            addStep(`  Read ')' → Pop until '('. Output: ${output}`);
        } else if (isOperator(ch)) {
            while (stack.length > 0 && precedence(stack[stack.length - 1]) > precedence(ch)) {
                output += stack.pop();
                document.getElementById('outputDisplay').textContent = output;
                await updateStack(stack);
                await delay(speed / 2);
            }
            stack.push(ch);
            await updateStack(stack);
            addStep(`  Read '${ch}' (operator) → Stack updated`);
        }
        await delay(speed);
    }

    while (stack.length > 0) {
        output += stack.pop();
        document.getElementById('outputDisplay').textContent = output;
        await updateStack(stack);
        await delay(speed / 2);
    }

    addStep(`  Postfix of reversed: ${output}`);

    // Step 3: Reverse postfix
    const prefix = output.split('').reverse().join('');
    document.getElementById('outputDisplay').textContent = prefix;
    addStep(`Step 3: Reverse postfix → Prefix: ${prefix}`, 'completed');
    addStep(`✅ Final Prefix: ${prefix}`, 'completed');

    document.getElementById('currentChar').textContent = '✓';
    document.getElementById('resultBox').style.display = 'block';
    document.getElementById('resultText').textContent = prefix;
}
