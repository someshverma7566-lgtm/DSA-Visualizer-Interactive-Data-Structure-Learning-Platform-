/*
 * Expression Converter - Infix to Postfix and Prefix
 * Uses Stack data structure
 * DSA Learning Platform
 * 
 * Demonstrates: Stack operations, operator precedence,
 *               string manipulation, expression parsing
 */

#include <iostream>
#include <stack>
#include <string>
#include <algorithm>
using namespace std;

// Class to handle expression conversions using Stack
class ExpressionConverter {
private:
    // Returns precedence of operators
    int precedence(char op) {
        if (op == '^') return 3;
        if (op == '*' || op == '/') return 2;
        if (op == '+' || op == '-') return 1;
        return 0;
    }

    // Check if character is an operator
    bool isOperator(char ch) {
        return (ch == '+' || ch == '-' || ch == '*' || ch == '/' || ch == '^');
    }

    // Check if character is an operand
    bool isOperand(char ch) {
        return ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9'));
    }

public:
    // Convert Infix to Postfix expression
    string infixToPostfix(string infix) {
        stack<char> st;
        string postfix = "";

        cout << "\n--- Step-by-step Infix to Postfix ---\n";
        cout << "Expression: " << infix << "\n\n";

        for (int i = 0; i < infix.length(); i++) {
            char ch = infix[i];

            // If operand, add to output
            if (isOperand(ch)) {
                postfix += ch;
                cout << "Step " << i + 1 << ": Read '" << ch << "' (operand) -> Add to output. Output: " << postfix << "\n";
            }
            // If '(', push to stack
            else if (ch == '(') {
                st.push(ch);
                cout << "Step " << i + 1 << ": Read '(' -> Push to stack\n";
            }
            // If ')', pop until '('
            else if (ch == ')') {
                while (!st.empty() && st.top() != '(') {
                    postfix += st.top();
                    st.pop();
                }
                if (!st.empty()) st.pop(); // Remove '('
                cout << "Step " << i + 1 << ": Read ')' -> Pop until '('. Output: " << postfix << "\n";
            }
            // If operator
            else if (isOperator(ch)) {
                while (!st.empty() && precedence(st.top()) >= precedence(ch)) {
                    postfix += st.top();
                    st.pop();
                }
                st.push(ch);
                cout << "Step " << i + 1 << ": Read '" << ch << "' (operator) -> Push to stack. Output: " << postfix << "\n";
            }
        }

        // Pop remaining operators
        while (!st.empty()) {
            postfix += st.top();
            st.pop();
        }

        cout << "\nFinal Postfix: " << postfix << "\n";
        return postfix;
    }

    // Convert Infix to Prefix expression
    string infixToPrefix(string infix) {
        cout << "\n--- Step-by-step Infix to Prefix ---\n";
        cout << "Expression: " << infix << "\n\n";

        // Step 1: Reverse the expression
        string reversed = infix;
        reverse(reversed.begin(), reversed.end());

        // Step 2: Replace '(' with ')' and vice versa
        for (int i = 0; i < reversed.length(); i++) {
            if (reversed[i] == '(') reversed[i] = ')';
            else if (reversed[i] == ')') reversed[i] = '(';
        }

        cout << "Step 1: Reversed expression: " << reversed << "\n";

        // Step 3: Get postfix of reversed expression
        stack<char> st;
        string postfix = "";

        for (int i = 0; i < reversed.length(); i++) {
            char ch = reversed[i];

            if (isOperand(ch)) {
                postfix += ch;
            } else if (ch == '(') {
                st.push(ch);
            } else if (ch == ')') {
                while (!st.empty() && st.top() != '(') {
                    postfix += st.top();
                    st.pop();
                }
                if (!st.empty()) st.pop();
            } else if (isOperator(ch)) {
                while (!st.empty() && precedence(st.top()) > precedence(ch)) {
                    postfix += st.top();
                    st.pop();
                }
                st.push(ch);
            }
        }

        while (!st.empty()) {
            postfix += st.top();
            st.pop();
        }

        cout << "Step 2: Postfix of reversed: " << postfix << "\n";

        // Step 4: Reverse the postfix to get prefix
        reverse(postfix.begin(), postfix.end());

        cout << "Step 3: Reversed postfix = Prefix: " << postfix << "\n";
        return postfix;
    }
};

int main() {
    ExpressionConverter converter;
    int choice;
    string expression;

    cout << "========================================\n";
    cout << "   Expression Converter (Using Stack)   \n";
    cout << "========================================\n";

    do {
        cout << "\n1. Infix to Postfix\n";
        cout << "2. Infix to Prefix\n";
        cout << "3. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;

        if (choice == 1 || choice == 2) {
            cout << "Enter infix expression: ";
            cin >> expression;

            if (choice == 1) {
                string result = converter.infixToPostfix(expression);
                cout << "\nResult: " << result << endl;
            } else {
                string result = converter.infixToPrefix(expression);
                cout << "\nResult: " << result << endl;
            }
        }
    } while (choice != 3);

    cout << "Thank you!\n";
    return 0;
}
