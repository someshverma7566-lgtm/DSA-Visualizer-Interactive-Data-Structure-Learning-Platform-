/*
 * Graph Traversal - BFS and DFS
 * Uses Adjacency List representation
 * DSA Learning Platform
 * 
 * Demonstrates: Graph data structure, Queue (BFS),
 *               Stack/Recursion (DFS), Adjacency List
 */

#include <iostream>
#include <vector>
#include <queue>
#include <stack>
using namespace std;

// ========== Graph Class (Adjacency List) ==========
class Graph {
private:
    int vertices;
    vector<vector<int>> adjList;
    bool isDirected;

public:
    // Constructor
    Graph(int v, bool directed = false) : vertices(v), isDirected(directed) {
        adjList.resize(v);
        cout << "Graph created with " << v << " vertices";
        cout << (directed ? " (Directed)" : " (Undirected)") << "\n\n";
    }

    // Add edge
    void addEdge(int u, int v) {
        adjList[u].push_back(v);
        if (!isDirected) {
            adjList[v].push_back(u);
        }
        cout << "Edge added: " << u << " -> " << v;
        if (!isDirected) cout << " (and " << v << " -> " << u << ")";
        cout << "\n";
    }

    // Display adjacency list
    void displayGraph() {
        cout << "\n--- Adjacency List ---\n";
        for (int i = 0; i < vertices; i++) {
            cout << "Vertex " << i << ": ";
            for (int j = 0; j < adjList[i].size(); j++) {
                cout << adjList[i][j];
                if (j < adjList[i].size() - 1) cout << " -> ";
            }
            cout << "\n";
        }
        cout << "\n";
    }

    // Breadth-First Search (BFS)
    void bfs(int start) {
        cout << "--- BFS Traversal (Starting from vertex " << start << ") ---\n\n";

        vector<bool> visited(vertices, false);
        queue<int> q;

        visited[start] = true;
        q.push(start);
        int step = 1;

        cout << "Step 0: Start at vertex " << start << ", add to queue\n";
        cout << "  Queue: [" << start << "]\n\n";

        cout << "BFS Order: ";
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            cout << current << " ";

            cout << "\n  Step " << step++ << ": Visit vertex " << current;
            cout << " | Neighbors: [";

            bool first = true;
            for (int neighbor : adjList[current]) {
                if (!first) cout << ", ";
                cout << neighbor;
                first = false;

                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
            cout << "]";

            // Show queue state
            queue<int> temp = q;
            cout << " | Queue: [";
            first = true;
            while (!temp.empty()) {
                if (!first) cout << ", ";
                cout << temp.front();
                temp.pop();
                first = false;
            }
            cout << "]\n";
        }
        cout << "\n\nBFS Complete!\n\n";
    }

    // Depth-First Search (DFS) - Iterative using Stack
    void dfs(int start) {
        cout << "--- DFS Traversal (Starting from vertex " << start << ") ---\n\n";

        vector<bool> visited(vertices, false);
        stack<int> st;

        st.push(start);
        int step = 1;

        cout << "Step 0: Start at vertex " << start << ", push to stack\n";
        cout << "  Stack: [" << start << "]\n\n";

        cout << "DFS Order: ";
        while (!st.empty()) {
            int current = st.top();
            st.pop();

            if (visited[current]) continue;
            visited[current] = true;

            cout << current << " ";
            cout << "\n  Step " << step++ << ": Visit vertex " << current;
            cout << " | Neighbors: [";

            bool first = true;
            // Push neighbors in reverse order for correct DFS order
            for (int i = adjList[current].size() - 1; i >= 0; i--) {
                int neighbor = adjList[current][i];
                if (!visited[neighbor]) {
                    st.push(neighbor);
                }
            }

            // Display neighbors
            for (int i = 0; i < adjList[current].size(); i++) {
                if (!first) cout << ", ";
                cout << adjList[current][i];
                first = false;
            }
            cout << "]";

            // Show stack state
            stack<int> temp = st;
            vector<int> stackContents;
            while (!temp.empty()) {
                stackContents.push_back(temp.top());
                temp.pop();
            }
            cout << " | Stack: [";
            for (int i = stackContents.size() - 1; i >= 0; i--) {
                cout << stackContents[i];
                if (i > 0) cout << ", ";
            }
            cout << "]\n";
        }
        cout << "\n\nDFS Complete!\n\n";
    }
};

int main() {
    int vertices, edges, choice;
    bool directed;

    cout << "========================================\n";
    cout << "    Graph Traversal (BFS and DFS)       \n";
    cout << "========================================\n";

    cout << "\nEnter number of vertices: ";
    cin >> vertices;

    cout << "Directed graph? (1=Yes, 0=No): ";
    int dir;
    cin >> dir;
    directed = (dir == 1);

    Graph graph(vertices, directed);

    cout << "Enter number of edges: ";
    cin >> edges;

    cout << "Enter edges (u v):\n";
    for (int i = 0; i < edges; i++) {
        int u, v;
        cin >> u >> v;
        graph.addEdge(u, v);
    }

    graph.displayGraph();

    do {
        cout << "1. BFS Traversal\n";
        cout << "2. DFS Traversal\n";
        cout << "3. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;

        if (choice == 1 || choice == 2) {
            int start;
            cout << "Enter starting vertex: ";
            cin >> start;

            if (choice == 1) graph.bfs(start);
            else graph.dfs(start);
        }
    } while (choice != 3);

    cout << "Thank you!\n";
    return 0;
}
