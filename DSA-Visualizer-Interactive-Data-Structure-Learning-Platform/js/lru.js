/**
 * LRU Cache Simulator
 * Interactive cache with hit/miss/eviction tracking
 */

// LRU Cache implementation in JS (mirrors the C++ logic)
class LRUCacheNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCacheSimulator {
    constructor(capacity) {
        this.capacity = capacity;
        this.size = 0;
        this.cache = new Map();
        // Dummy head and tail
        this.head = new LRUCacheNode(0, 0);
        this.tail = new LRUCacheNode(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        // Stats
        this.hits = 0;
        this.misses = 0;
        this.evictions = 0;
    }

    addToFront(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    moveToFront(node) {
        this.removeNode(node);
        this.addToFront(node);
    }

    get(key) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            this.moveToFront(node);
            this.hits++;
            return { value: node.value, hit: true };
        }
        this.misses++;
        return { value: -1, hit: false };
    }

    put(key, value) {
        let evictedKey = null;

        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            node.value = value;
            this.moveToFront(node);
            return { evictedKey: null, updated: true };
        }

        if (this.size >= this.capacity) {
            const lru = this.tail.prev;
            evictedKey = lru.key;
            this.removeNode(lru);
            this.cache.delete(lru.key);
            this.size--;
            this.evictions++;
        }

        const newNode = new LRUCacheNode(key, value);
        this.addToFront(newNode);
        this.cache.set(key, newNode);
        this.size++;

        return { evictedKey, updated: false };
    }

    // Get ordered list from MRU to LRU
    getOrderedList() {
        const list = [];
        let node = this.head.next;
        while (node !== this.tail) {
            list.push({ key: node.key, value: node.value });
            node = node.next;
        }
        return list;
    }
}

let lruCache = null;

function toggleValueField() {
    const op = document.getElementById('opType').value;
    document.getElementById('valueGroup').style.display = op === 'get' ? 'none' : 'block';
}

function initCache() {
    const capacity = parseInt(document.getElementById('capacityInput').value);
    if (isNaN(capacity) || capacity < 1) {
        alert('Capacity must be at least 1');
        return;
    }

    lruCache = new LRUCacheSimulator(capacity);
    document.getElementById('opLog').innerHTML = '';
    addLog(`Cache initialized with capacity ${capacity}`);
    renderCache();
    updateStats();
}

function executeOp() {
    if (!lruCache) {
        alert('Please initialize the cache first!');
        return;
    }

    const op = document.getElementById('opType').value;
    const key = parseInt(document.getElementById('keyInput').value);

    if (isNaN(key)) {
        alert('Please enter a valid key!');
        return;
    }

    if (op === 'put') {
        const value = parseInt(document.getElementById('valueInput').value);
        if (isNaN(value)) {
            alert('Please enter a valid value!');
            return;
        }

        const result = lruCache.put(key, value);

        if (result.updated) {
            addLog(`PUT(${key}, ${value}): Updated existing key`);
            showStatus(`Updated key ${key}`, 'var(--accent-blue)');
        } else if (result.evictedKey !== null) {
            addLog(`PUT(${key}, ${value}): Evicted key ${result.evictedKey}, inserted`);
            showStatus(`Evicted key ${result.evictedKey} → Inserted (${key}:${value})`, 'var(--accent-amber)');
        } else {
            addLog(`PUT(${key}, ${value}): Inserted`);
            showStatus(`Inserted (${key}:${value})`, 'var(--accent-emerald)');
        }
    } else {
        const result = lruCache.get(key);
        if (result.hit) {
            addLog(`GET(${key}): HIT! Value = ${result.value}`);
            showStatus(`HIT! Value = ${result.value}`, 'var(--accent-emerald)');
        } else {
            addLog(`GET(${key}): MISS!`);
            showStatus(`MISS! Key ${key} not found`, 'var(--accent-rose)');
        }
    }

    renderCache(op === 'get' ? key : null);
    updateStats();
}

function renderCache(highlightKey = null) {
    const container = document.getElementById('cacheViz');
    const llViz = document.getElementById('linkedListViz');

    if (!lruCache || lruCache.size === 0) {
        container.innerHTML = '<div style="color:var(--text-muted);font-size:13px;">Cache is empty</div>';
        llViz.innerHTML = '<span style="color:var(--text-muted);">HEAD ↔ TAIL</span>';
        return;
    }

    const ordered = lruCache.getOrderedList();

    // Render cache blocks
    container.innerHTML = '';
    ordered.forEach((item, idx) => {
        const block = document.createElement('div');
        block.className = 'cache-block new-entry';
        if (highlightKey !== null && item.key === highlightKey) {
            const lastResult = lruCache.cache.has(highlightKey);
            block.classList.add(lastResult ? 'hit' : 'miss');
        }
        block.innerHTML = `
            <div class="cache-key">Key: ${item.key}</div>
            <div class="cache-value">${item.value}</div>
        `;
        container.appendChild(block);
    });

    // Render linked list
    llViz.innerHTML = '';
    const headSpan = document.createElement('span');
    headSpan.style.cssText = 'color:var(--accent-purple);font-weight:700;';
    headSpan.textContent = 'HEAD';
    llViz.appendChild(headSpan);

    ordered.forEach((item, idx) => {
        const arrow = document.createElement('span');
        arrow.style.color = 'var(--text-muted)';
        arrow.textContent = ' ↔ ';
        llViz.appendChild(arrow);

        const node = document.createElement('span');
        node.style.cssText = 'padding:4px 10px;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:6px;';
        if (idx === 0) node.style.borderColor = 'var(--accent-emerald)';
        if (idx === ordered.length - 1) node.style.borderColor = 'var(--accent-rose)';
        node.textContent = `${item.key}:${item.value}`;
        llViz.appendChild(node);
    });

    const tailArrow = document.createElement('span');
    tailArrow.style.color = 'var(--text-muted)';
    tailArrow.textContent = ' ↔ ';
    llViz.appendChild(tailArrow);

    const tailSpan = document.createElement('span');
    tailSpan.style.cssText = 'color:var(--accent-purple);font-weight:700;';
    tailSpan.textContent = 'TAIL';
    llViz.appendChild(tailSpan);

    // Labels
    if (ordered.length > 0) {
        const labelDiv = document.createElement('div');
        labelDiv.style.cssText = 'width:100%;display:flex;justify-content:space-between;font-size:11px;margin-top:8px;padding:0 40px;';
        labelDiv.innerHTML = '<span style="color:var(--accent-emerald);">← MRU</span><span style="color:var(--accent-rose);">LRU →</span>';
        llViz.appendChild(labelDiv);
    }
}

function updateStats() {
    if (!lruCache) return;
    document.getElementById('hitCount').textContent = lruCache.hits;
    document.getElementById('missCount').textContent = lruCache.misses;
    document.getElementById('evictCount').textContent = lruCache.evictions;
}

function addLog(text) {
    const log = document.getElementById('opLog');
    const step = document.createElement('div');
    step.className = 'step';
    step.textContent = text;
    log.appendChild(step);
    log.scrollTop = log.scrollHeight;
}

function showStatus(text, color) {
    document.getElementById('statusBox').style.display = 'block';
    const el = document.getElementById('statusText');
    el.textContent = text;
    el.style.color = color;
}
