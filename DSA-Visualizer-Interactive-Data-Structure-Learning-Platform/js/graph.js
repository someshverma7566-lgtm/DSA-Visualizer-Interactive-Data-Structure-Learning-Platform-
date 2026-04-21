/**
 * Graph Traversal Visualizer
 * Canvas-based graph with BFS/DFS animation + animated edge traversal lines
 */

let graphData = null;
let nodePositions = [];
let isRunning = false;
let traversedEdges = [];   // edges that have been animated [{from, to}]
let activeEdge = null;     // currently animating edge {from, to, progress: 0..1}
let animFrameId = null;

const NODE_COLORS = {
    unvisited: '#64748b',
    inQueue: '#f59e0b',
    visited: '#10b981',
    current: '#6366f1'
};

const EDGE_GLOW_COLOR = '#6366f1';
const EDGE_TRAVERSED_COLOR = '#10b981';

function getSpeed() {
    return parseInt(document.getElementById('speedSlider').value);
}

function addStep(text, type = '') {
    const log = document.getElementById('stepLog');
    const step = document.createElement('div');
    step.className = 'step ' + type;
    step.textContent = text;
    log.appendChild(step);
    log.scrollTop = log.scrollHeight;
}

function buildGraph() {
    const nodeCount = parseInt(document.getElementById('nodeCount').value);
    const edgeText = document.getElementById('edgeInput').value.trim();

    if (isNaN(nodeCount) || nodeCount < 2) {
        alert('Need at least 2 nodes!');
        return;
    }

    // Parse edges
    const adjList = Array.from({ length: nodeCount }, () => []);
    const edges = [];

    if (edgeText) {
        edgeText.split('\n').forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length === 2) {
                const u = parseInt(parts[0]);
                const v = parseInt(parts[1]);
                if (!isNaN(u) && !isNaN(v) && u < nodeCount && v < nodeCount) {
                    adjList[u].push(v);
                    adjList[v].push(u); // undirected
                    edges.push([u, v]);
                }
            }
        });
    }

    graphData = { nodeCount, adjList, edges };
    traversedEdges = [];
    activeEdge = null;

    // Generate node positions in circle layout
    generatePositions(nodeCount);

    // Display adjacency list
    const adjDiv = document.getElementById('adjListDisplay');
    adjDiv.innerHTML = '';
    for (let i = 0; i < nodeCount; i++) {
        const line = document.createElement('div');
        line.innerHTML = `<span style="color:var(--accent-blue);font-weight:700;">Vertex ${i}</span>: ${adjList[i].length > 0 ? adjList[i].join(' → ') : '(none)'}`;
        adjDiv.appendChild(line);
    }

    // Initial draw
    const nodeColors = Array(nodeCount).fill('unvisited');
    drawGraph(nodeColors);

    document.getElementById('stepLog').innerHTML = '';
    addStep(`Graph built: ${nodeCount} nodes, ${edges.length} edges`);
    document.getElementById('traversalOrder').textContent = '—';
}

function generatePositions(count) {
    const canvas = document.getElementById('graphCanvas');
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    nodePositions = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) - 50;

    for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i) / count - Math.PI / 2;
        nodePositions.push({
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle)
        });
    }
}

/**
 * Check if an edge matches (either direction for undirected)
 */
function edgeMatch(e, u, v) {
    return (e.from === u && e.to === v) || (e.from === v && e.to === u);
}

/**
 * Draw the entire graph scene
 */
function drawGraph(nodeColors, currentNode = -1) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!graphData) return;

    // 1. Draw all edges (base: dim)
    graphData.edges.forEach(([u, v]) => {
        const isTraversed = traversedEdges.some(e => edgeMatch(e, u, v));
        const isActive = activeEdge && edgeMatch(activeEdge, u, v);

        if (!isTraversed && !isActive) {
            // Untraversed edge: dim
            ctx.beginPath();
            ctx.moveTo(nodePositions[u].x, nodePositions[u].y);
            ctx.lineTo(nodePositions[v].x, nodePositions[v].y);
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    // 2. Draw traversed edges (green glow)
    traversedEdges.forEach(e => {
        const from = nodePositions[e.from];
        const to = nodePositions[e.to];

        // Glow layer
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = EDGE_TRAVERSED_COLOR + '55';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Core line
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = EDGE_TRAVERSED_COLOR;
        ctx.lineWidth = 2.5;
        ctx.stroke();
    });

    // 3. Draw active (animating) edge
    if (activeEdge && activeEdge.progress > 0) {
        const from = nodePositions[activeEdge.from];
        const to = nodePositions[activeEdge.to];
        const p = activeEdge.progress;

        const midX = from.x + (to.x - from.x) * p;
        const midY = from.y + (to.y - from.y) * p;

        // Glow trail
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(midX, midY);
        ctx.strokeStyle = EDGE_GLOW_COLOR + '66';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Core animated line
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(midX, midY);
        ctx.strokeStyle = EDGE_GLOW_COLOR;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Particle / head dot
        const gradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, 10);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.4, EDGE_GLOW_COLOR);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(midX, midY, 10, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // 4. Draw direction arrows on traversed edges
    traversedEdges.forEach(e => {
        drawArrowHead(ctx, nodePositions[e.from], nodePositions[e.to], EDGE_TRAVERSED_COLOR, 24);
    });

    // 5. Draw nodes (on top of edges)
    const nodeRadius = 24;
    for (let i = 0; i < graphData.nodeCount; i++) {
        const pos = nodePositions[i];
        const color = i === currentNode ? NODE_COLORS.current : NODE_COLORS[nodeColors[i]];

        // Glow effect for current/visited
        if (nodeColors[i] !== 'unvisited' || i === currentNode) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, nodeRadius + 8, 0, Math.PI * 2);
            ctx.fillStyle = color + '33';
            ctx.fill();
        }

        // Pulse ring for current node
        if (i === currentNode) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, nodeRadius + 14, 0, Math.PI * 2);
            ctx.strokeStyle = color + '44';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i.toString(), pos.x, pos.y);
    }
}

/**
 * Draw a small arrowhead along the edge at a point near the target node
 */
function drawArrowHead(ctx, from, to, color, nodeRadius) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    // Place arrow at ~60% along the edge
    const t = 0.6;
    const ax = from.x + (to.x - from.x) * t;
    const ay = from.y + (to.y - from.y) * t;
    const headLen = 10;

    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(
        ax - headLen * Math.cos(angle - Math.PI / 6),
        ay - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(ax, ay);
    ctx.lineTo(
        ax - headLen * Math.cos(angle + Math.PI / 6),
        ay - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
}

/**
 * Animate an edge from `fromNode` to `toNode` with a smooth line-drawing effect
 * Returns a promise that resolves when animation is complete
 */
function animateEdge(fromNode, toNode, nodeColors, currentNode, duration = 400) {
    return new Promise(resolve => {
        activeEdge = { from: fromNode, to: toNode, progress: 0 };
        const startTime = performance.now();

        function frame(now) {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            activeEdge.progress = 1 - Math.pow(1 - t, 3);

            drawGraph(nodeColors, currentNode);

            if (t < 1) {
                animFrameId = requestAnimationFrame(frame);
            } else {
                // Done — move to traversed edges, clear active
                traversedEdges.push({ from: fromNode, to: toNode });
                activeEdge = null;
                drawGraph(nodeColors, currentNode);
                resolve();
            }
        }
        animFrameId = requestAnimationFrame(frame);
    });
}

async function runTraversal() {
    if (isRunning || !graphData) {
        if (!graphData) alert('Build the graph first!');
        return;
    }
    isRunning = true;
    traversedEdges = [];
    activeEdge = null;

    const algo = document.getElementById('algorithm').value;
    const start = parseInt(document.getElementById('startNode').value);
    const speed = getSpeed();

    if (isNaN(start) || start >= graphData.nodeCount || start < 0) {
        alert(`Start node must be between 0 and ${graphData.nodeCount - 1}`);
        isRunning = false;
        return;
    }

    document.getElementById('runBtn').textContent = '⏳ Running...';
    document.getElementById('runBtn').disabled = true;
    document.getElementById('stepLog').innerHTML = '';
    document.getElementById('traversalOrder').textContent = '';

    const nodeColors = Array(graphData.nodeCount).fill('unvisited');

    if (algo === 'bfs') {
        await runBFS(start, nodeColors, speed);
    } else {
        await runDFS(start, nodeColors, speed);
    }

    document.getElementById('runBtn').textContent = '▶ Run Traversal';
    document.getElementById('runBtn').disabled = false;
    isRunning = false;
}

async function runBFS(start, nodeColors, speed) {
    addStep(`Starting BFS from vertex ${start}`, 'active');

    const visited = new Set();
    const queue = [start];
    const parent = {};  // track which node discovered which
    visited.add(start);
    nodeColors[start] = 'inQueue';
    drawGraph(nodeColors);
    addStep(`Enqueue ${start}`);
    await delay(speed);

    const order = [];

    while (queue.length > 0) {
        const current = queue.shift();
        nodeColors[current] = 'visited';
        order.push(current);

        // Animate edge from parent to current (if it has a parent)
        if (parent[current] !== undefined) {
            await animateEdge(parent[current], current, nodeColors, current, Math.min(speed, 500));
        }

        drawGraph(nodeColors, current);
        document.getElementById('traversalOrder').textContent = order.join(' → ');

        const neighbors = graphData.adjList[current];
        addStep(`Visit ${current} | Neighbors: [${neighbors.join(', ')}] | Queue: [${queue.join(', ')}]`, 'completed');
        await delay(speed * 0.6);

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                parent[neighbor] = current;
                nodeColors[neighbor] = 'inQueue';
                queue.push(neighbor);
                drawGraph(nodeColors, current);
                addStep(`  Enqueue ${neighbor}`);
                await delay(speed / 4);
            }
        }

        drawGraph(nodeColors);
        await delay(speed * 0.3);
    }

    addStep(`✅ BFS Complete! Order: ${order.join(' → ')}`, 'completed');
}

async function runDFS(start, nodeColors, speed) {
    addStep(`Starting DFS from vertex ${start}`, 'active');

    const visited = new Set();
    const stack = [start];
    const parent = {};
    nodeColors[start] = 'inQueue';
    drawGraph(nodeColors);
    addStep(`Push ${start} to stack`);
    await delay(speed);

    const order = [];

    while (stack.length > 0) {
        const current = stack.pop();

        if (visited.has(current)) continue;
        visited.add(current);
        nodeColors[current] = 'visited';
        order.push(current);

        // Animate edge from parent to current
        if (parent[current] !== undefined) {
            await animateEdge(parent[current], current, nodeColors, current, Math.min(speed, 500));
        }

        drawGraph(nodeColors, current);
        document.getElementById('traversalOrder').textContent = order.join(' → ');

        const neighbors = graphData.adjList[current];
        addStep(`Visit ${current} | Neighbors: [${neighbors.join(', ')}] | Stack: [${stack.join(', ')}]`, 'completed');
        await delay(speed * 0.6);

        // Push in reverse for correct order
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];
            if (!visited.has(neighbor)) {
                parent[neighbor] = current;
                nodeColors[neighbor] = 'inQueue';
                stack.push(neighbor);
                drawGraph(nodeColors, current);
                addStep(`  Push ${neighbor} to stack`);
                await delay(speed / 4);
            }
        }

        drawGraph(nodeColors);
        await delay(speed * 0.3);
    }

    addStep(`✅ DFS Complete! Order: ${order.join(' → ')}`, 'completed');
}

// Handle canvas resize
window.addEventListener('resize', () => {
    if (graphData) {
        generatePositions(graphData.nodeCount);
        const nodeColors = Array(graphData.nodeCount).fill('unvisited');
        traversedEdges = [];
        activeEdge = null;
        drawGraph(nodeColors);
    }
});
