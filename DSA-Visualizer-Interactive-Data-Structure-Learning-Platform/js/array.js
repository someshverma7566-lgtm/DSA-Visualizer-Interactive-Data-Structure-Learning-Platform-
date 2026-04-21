/**
 * Array Operations Visualizer
 * Linear Search, Binary Search, Duplicate Detection
 */

let isRunning = false;

function getSpeed() {
    return parseInt(document.getElementById('speedSlider').value);
}

function toggleTarget() {
    const op = document.getElementById('operation').value;
    document.getElementById('targetGroup').style.display = op === 'duplicates' ? 'none' : 'block';
}

function parseArray() {
    const input = document.getElementById('arrayInput').value.trim();
    return input.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
}

function renderBars(arr, highlights = {}) {
    const container = document.getElementById('arrayViz');
    container.innerHTML = '';
    const maxVal = Math.max(...arr);

    arr.forEach((val, idx) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        const height = Math.max(30, (val / maxVal) * 200);
        bar.style.height = height + 'px';
        bar.textContent = val;

        // Apply highlights
        if (highlights.found !== undefined && highlights.found === idx) {
            bar.classList.add('found');
        } else if (highlights.comparing !== undefined && highlights.comparing.includes(idx)) {
            bar.classList.add('comparing');
        }

        if (highlights.low === idx) bar.classList.add('low-ptr');
        if (highlights.mid === idx) bar.classList.add('mid-ptr');
        if (highlights.high === idx) bar.classList.add('high-ptr');
        if (highlights.duplicates && highlights.duplicates.includes(idx)) bar.classList.add('duplicate');

        container.appendChild(bar);
    });
}

function addStep(text, type = '') {
    const log = document.getElementById('stepLog');
    const step = document.createElement('div');
    step.className = 'step ' + type;
    step.textContent = text;
    log.appendChild(step);
    log.scrollTop = log.scrollHeight;
}

function clearViz() {
    document.getElementById('stepLog').innerHTML = '';
    document.getElementById('arrayViz').innerHTML = '';
    document.getElementById('resultBox').style.display = 'none';
}

async function runArrayOp() {
    if (isRunning) return;
    isRunning = true;
    clearViz();

    const arr = parseArray();
    const op = document.getElementById('operation').value;
    const target = parseInt(document.getElementById('targetInput').value);

    if (arr.length === 0) {
        alert('Please enter a valid array!');
        isRunning = false;
        return;
    }

    document.getElementById('runBtn').textContent = '⏳ Running...';
    document.getElementById('runBtn').disabled = true;

    if (op === 'linear') {
        await linearSearch(arr, target);
    } else if (op === 'binary') {
        await binarySearch([...arr].sort((a, b) => a - b), target);
    } else {
        await findDuplicates(arr);
    }

    document.getElementById('runBtn').textContent = '▶ Run';
    document.getElementById('runBtn').disabled = false;
    isRunning = false;
}

async function linearSearch(arr, target) {
    const speed = getSpeed();
    addStep(`Linear Search for ${target} in [${arr.join(', ')}]`, 'active');
    renderBars(arr);
    await delay(speed);

    for (let i = 0; i < arr.length; i++) {
        renderBars(arr, { comparing: [i] });
        addStep(`Step ${i + 1}: Compare arr[${i}] = ${arr[i]} with ${target}`);
        await delay(speed);

        if (arr[i] === target) {
            renderBars(arr, { found: i });
            addStep(`✅ Found ${target} at index ${i}!`, 'completed');
            showResult(`Found at index ${i}`, 'var(--accent-emerald)');
            return;
        }
    }

    renderBars(arr);
    addStep(`❌ ${target} not found in array.`, 'active');
    showResult('Not Found', 'var(--accent-rose)');
}

async function binarySearch(arr, target) {
    const speed = getSpeed();
    addStep(`Binary Search for ${target} (array sorted)`, 'active');
    addStep(`Sorted: [${arr.join(', ')}]`);
    renderBars(arr);
    await delay(speed);

    let low = 0, high = arr.length - 1;
    let step = 1;

    while (low <= high) {
        const mid = Math.floor(low + (high - low) / 2);
        renderBars(arr, { comparing: [mid], low, mid, high });
        addStep(`Step ${step++}: low=${low}, mid=${mid}, high=${high} | arr[mid]=${arr[mid]}`);
        await delay(speed);

        if (arr[mid] === target) {
            renderBars(arr, { found: mid });
            addStep(`✅ Found ${target} at index ${mid}!`, 'completed');
            showResult(`Found at index ${mid} (sorted)`, 'var(--accent-emerald)');
            return;
        } else if (arr[mid] < target) {
            addStep(`  ${arr[mid]} < ${target} → search RIGHT half`);
            low = mid + 1;
        } else {
            addStep(`  ${arr[mid]} > ${target} → search LEFT half`);
            high = mid - 1;
        }
        await delay(speed / 2);
    }

    renderBars(arr);
    addStep(`❌ ${target} not found.`, 'active');
    showResult('Not Found', 'var(--accent-rose)');
}

async function findDuplicates(arr) {
    const speed = getSpeed();
    addStep(`Finding duplicates in [${arr.join(', ')}]`, 'active');
    renderBars(arr);
    await delay(speed);

    const seen = new Set();
    const dupes = new Set();
    const dupeIndices = [];

    for (let i = 0; i < arr.length; i++) {
        renderBars(arr, { comparing: [i], duplicates: dupeIndices });
        await delay(speed);

        if (seen.has(arr[i])) {
            dupes.add(arr[i]);
            dupeIndices.push(i);
            // Also highlight first occurrence
            const firstIdx = arr.indexOf(arr[i]);
            if (!dupeIndices.includes(firstIdx)) dupeIndices.push(firstIdx);
            addStep(`Step ${i + 1}: arr[${i}] = ${arr[i]} → DUPLICATE!`, 'active');
        } else {
            seen.add(arr[i]);
            addStep(`Step ${i + 1}: arr[${i}] = ${arr[i]} → First occurrence`);
        }
    }

    renderBars(arr, { duplicates: dupeIndices });

    if (dupes.size === 0) {
        addStep('✅ No duplicates found.', 'completed');
        showResult('No duplicates', 'var(--accent-emerald)');
    } else {
        addStep(`✅ Duplicates: [${[...dupes].join(', ')}]`, 'completed');
        showResult(`Duplicates: ${[...dupes].join(', ')}`, 'var(--accent-amber)');
    }
}

function showResult(text, color) {
    document.getElementById('resultBox').style.display = 'block';
    const el = document.getElementById('resultText');
    el.textContent = text;
    el.style.color = color;
}
