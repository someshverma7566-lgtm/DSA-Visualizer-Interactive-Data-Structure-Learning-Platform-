/*
 * LRU Cache Implementation
 * Uses Doubly Linked List + Hash Map (unordered_map)
 * DSA Learning Platform
 * 
 * Demonstrates: Linked List operations, Hashing,
 *               Cache eviction policy, OOP design
 */

#include <iostream>
#include <unordered_map>
#include <string>
using namespace std;

// ========== Node for Doubly Linked List ==========
class Node {
public:
    int key;
    int value;
    Node* prev;
    Node* next;

    Node(int k, int v) : key(k), value(v), prev(nullptr), next(nullptr) {}
};

// ========== LRU Cache Class ==========
class LRUCache {
private:
    int capacity;
    int size;
    Node* head;  // Dummy head (most recently used)
    Node* tail;  // Dummy tail (least recently used)
    unordered_map<int, Node*> cache;  // Hash map for O(1) lookup

    // Add node right after head (most recently used position)
    void addToFront(Node* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }

    // Remove a node from the list
    void removeNode(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    // Move existing node to front (mark as recently used)
    void moveToFront(Node* node) {
        removeNode(node);
        addToFront(node);
    }

    // Remove the least recently used node (node before tail)
    Node* removeLRU() {
        Node* lru = tail->prev;
        removeNode(lru);
        return lru;
    }

public:
    // Constructor
    LRUCache(int cap) : capacity(cap), size(0) {
        head = new Node(0, 0);  // Dummy head
        tail = new Node(0, 0);  // Dummy tail
        head->next = tail;
        tail->prev = head;
        cout << "LRU Cache created with capacity: " << capacity << "\n\n";
    }

    // Destructor - free all nodes
    ~LRUCache() {
        Node* current = head;
        while (current) {
            Node* next = current->next;
            delete current;
            current = next;
        }
    }

    // Get value by key
    int get(int key) {
        cout << "GET(" << key << "): ";

        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            moveToFront(node);
            cout << "HIT! Value = " << node->value << "\n";
            displayCache();
            return node->value;
        }

        cout << "MISS! Key not found.\n";
        displayCache();
        return -1;
    }

    // Put key-value pair
    void put(int key, int value) {
        cout << "PUT(" << key << ", " << value << "): ";

        // If key exists, update value and move to front
        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            node->value = value;
            moveToFront(node);
            cout << "Updated existing key.\n";
        } else {
            // Create new node
            Node* newNode = new Node(key, value);

            // If at capacity, evict LRU
            if (size >= capacity) {
                Node* lru = removeLRU();
                cout << "Cache full! Evicted key " << lru->key << ". ";
                cache.erase(lru->key);
                delete lru;
                size--;
            }

            // Add new node to front
            addToFront(newNode);
            cache[key] = newNode;
            size++;
            cout << "Inserted.\n";
        }

        displayCache();
    }

    // Display current cache state
    void displayCache() {
        cout << "  Cache [MRU -> LRU]: ";
        Node* current = head->next;
        while (current != tail) {
            cout << "(" << current->key << ":" << current->value << ")";
            if (current->next != tail) cout << " <-> ";
            current = current->next;
        }
        cout << "  [Size: " << size << "/" << capacity << "]\n\n";
    }
};

int main() {
    int capacity;
    int choice;

    cout << "========================================\n";
    cout << "   LRU Cache (Linked List + HashMap)    \n";
    cout << "========================================\n";

    cout << "\nEnter cache capacity: ";
    cin >> capacity;

    LRUCache cache(capacity);

    do {
        cout << "1. PUT (key, value)\n";
        cout << "2. GET (key)\n";
        cout << "3. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;

        if (choice == 1) {
            int key, value;
            cout << "Enter key: ";
            cin >> key;
            cout << "Enter value: ";
            cin >> value;
            cache.put(key, value);
        } else if (choice == 2) {
            int key;
            cout << "Enter key: ";
            cin >> key;
            cache.get(key);
        }
    } while (choice != 3);

    cout << "Thank you!\n";
    return 0;
}
