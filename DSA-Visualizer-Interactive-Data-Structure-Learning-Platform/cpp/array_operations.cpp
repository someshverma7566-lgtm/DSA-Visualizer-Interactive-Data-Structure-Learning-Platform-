/*
 * Array Operations - Linear Search, Binary Search, Duplicate Detection
 * DSA Learning Platform
 * 
 * Demonstrates: OOP (Inheritance, Polymorphism),
 *               Searching algorithms, Array traversal
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <set>
using namespace std;

// ========== OOP: Base class for Search ==========
class SearchBase {
protected:
    vector<int> arr;

public:
    // Constructor
    SearchBase(vector<int> input) : arr(input) {}

    // Pure virtual function (Polymorphism)
    virtual int search(int target) = 0;

    // Virtual destructor
    virtual ~SearchBase() {}

    // Display array
    void display() {
        cout << "Array: [";
        for (int i = 0; i < arr.size(); i++) {
            cout << arr[i];
            if (i < arr.size() - 1) cout << ", ";
        }
        cout << "]\n";
    }
};

// ========== Linear Search (Inherits SearchBase) ==========
class LinearSearch : public SearchBase {
public:
    // Constructor - calls base class constructor
    LinearSearch(vector<int> input) : SearchBase(input) {}

    // Override search method (Polymorphism)
    int search(int target) override {
        cout << "\n--- Linear Search ---\n";
        cout << "Target: " << target << "\n\n";

        for (int i = 0; i < arr.size(); i++) {
            cout << "Step " << i + 1 << ": Comparing arr[" << i << "] = " << arr[i] << " with " << target;

            if (arr[i] == target) {
                cout << " -> FOUND at index " << i << "!\n";
                return i;
            }
            cout << " -> Not a match\n";
        }

        cout << "\nElement " << target << " not found in array.\n";
        return -1;
    }
};

// ========== Binary Search (Inherits SearchBase) ==========
class BinarySearch : public SearchBase {
public:
    // Constructor
    BinarySearch(vector<int> input) : SearchBase(input) {
        // Binary search requires sorted array
        sort(arr.begin(), arr.end());
        cout << "Array sorted for Binary Search.\n";
    }

    // Override search method (Polymorphism)
    int search(int target) override {
        cout << "\n--- Binary Search ---\n";
        cout << "Target: " << target << "\n";
        display();
        cout << "\n";

        int low = 0, high = arr.size() - 1;
        int step = 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            cout << "Step " << step++ << ": low=" << low << ", mid=" << mid << ", high=" << high;
            cout << " | arr[mid]=" << arr[mid];

            if (arr[mid] == target) {
                cout << " -> FOUND at index " << mid << "!\n";
                return mid;
            } else if (arr[mid] < target) {
                cout << " -> " << arr[mid] << " < " << target << ", search RIGHT half\n";
                low = mid + 1;
            } else {
                cout << " -> " << arr[mid] << " > " << target << ", search LEFT half\n";
                high = mid - 1;
            }
        }

        cout << "\nElement " << target << " not found.\n";
        return -1;
    }
};

// ========== Duplicate Detector ==========
class DuplicateDetector {
private:
    vector<int> arr;

public:
    DuplicateDetector(vector<int> input) : arr(input) {}

    // Find all duplicates in array
    vector<int> findDuplicates() {
        cout << "\n--- Finding Duplicates ---\n";
        cout << "Array: [";
        for (int i = 0; i < arr.size(); i++) {
            cout << arr[i];
            if (i < arr.size() - 1) cout << ", ";
        }
        cout << "]\n\n";

        set<int> seen;
        set<int> duplicates;

        for (int i = 0; i < arr.size(); i++) {
            if (seen.find(arr[i]) != seen.end()) {
                duplicates.insert(arr[i]);
                cout << "Step " << i + 1 << ": arr[" << i << "] = " << arr[i] << " -> DUPLICATE found!\n";
            } else {
                seen.insert(arr[i]);
                cout << "Step " << i + 1 << ": arr[" << i << "] = " << arr[i] << " -> First occurrence, added to set\n";
            }
        }

        vector<int> result(duplicates.begin(), duplicates.end());

        if (result.empty()) {
            cout << "\nNo duplicates found.\n";
        } else {
            cout << "\nDuplicates: [";
            for (int i = 0; i < result.size(); i++) {
                cout << result[i];
                if (i < result.size() - 1) cout << ", ";
            }
            cout << "]\n";
        }

        return result;
    }
};

int main() {
    int choice;

    cout << "========================================\n";
    cout << "         Array Operations (OOP)         \n";
    cout << "========================================\n";

    do {
        cout << "\n1. Linear Search\n";
        cout << "2. Binary Search\n";
        cout << "3. Find Duplicates\n";
        cout << "4. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;

        if (choice >= 1 && choice <= 3) {
            int n;
            cout << "Enter number of elements: ";
            cin >> n;

            vector<int> arr(n);
            cout << "Enter elements: ";
            for (int i = 0; i < n; i++) cin >> arr[i];

            if (choice == 1) {
                int target;
                cout << "Enter target: ";
                cin >> target;
                // Polymorphism: base pointer to derived class
                SearchBase* searcher = new LinearSearch(arr);
                searcher->display();
                searcher->search(target);
                delete searcher;
            } else if (choice == 2) {
                int target;
                cout << "Enter target: ";
                cin >> target;
                // Polymorphism: base pointer to derived class
                SearchBase* searcher = new BinarySearch(arr);
                searcher->search(target);
                delete searcher;
            } else {
                DuplicateDetector detector(arr);
                detector.findDuplicates();
            }
        }
    } while (choice != 4);

    cout << "Thank you!\n";
    return 0;
}
