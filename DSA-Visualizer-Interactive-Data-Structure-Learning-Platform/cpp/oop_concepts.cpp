/*
 * OOP Concepts in C++
 * Demonstrates: Classes, Inheritance, Polymorphism,
 *               Encapsulation, Abstraction
 * DSA Learning Platform
 */

#include <iostream>
#include <string>
#include <cmath>
using namespace std;

// ========== ABSTRACTION & ENCAPSULATION ==========
// Abstract base class - cannot be instantiated directly
class Shape {
protected:
    string name;
    string color;

public:
    // Constructor
    Shape(string n, string c) : name(n), color(c) {
        cout << "[Shape Constructor] Created: " << name << " (" << color << ")\n";
    }

    // Pure virtual functions (Abstraction)
    virtual double area() = 0;
    virtual double perimeter() = 0;

    // Virtual function with default implementation
    virtual void display() {
        cout << "Shape: " << name << " | Color: " << color;
        cout << " | Area: " << area();
        cout << " | Perimeter: " << perimeter() << "\n";
    }

    // Getter (Encapsulation)
    string getName() { return name; }
    string getColor() { return color; }

    // Setter (Encapsulation)
    void setColor(string c) { color = c; }

    // Virtual destructor
    virtual ~Shape() {
        cout << "[Shape Destructor] Destroyed: " << name << "\n";
    }
};

// ========== INHERITANCE: Circle extends Shape ==========
class Circle : public Shape {
private:
    double radius;

public:
    // Constructor calls base class constructor
    Circle(double r, string c = "Red") : Shape("Circle", c), radius(r) {
        cout << "[Circle Constructor] Radius: " << radius << "\n";
    }

    // Override pure virtual functions (Polymorphism)
    double area() override {
        return M_PI * radius * radius;
    }

    double perimeter() override {
        return 2 * M_PI * radius;
    }

    // Override display
    void display() override {
        Shape::display();  // Call base class method
        cout << "  -> Radius: " << radius << "\n";
    }

    ~Circle() {
        cout << "[Circle Destructor]\n";
    }
};

// ========== INHERITANCE: Rectangle extends Shape ==========
class Rectangle : public Shape {
private:
    double length, width;

public:
    Rectangle(double l, double w, string c = "Blue")
        : Shape("Rectangle", c), length(l), width(w) {
        cout << "[Rectangle Constructor] " << length << " x " << width << "\n";
    }

    double area() override {
        return length * width;
    }

    double perimeter() override {
        return 2 * (length + width);
    }

    void display() override {
        Shape::display();
        cout << "  -> Dimensions: " << length << " x " << width << "\n";
    }

    ~Rectangle() {
        cout << "[Rectangle Destructor]\n";
    }
};

// ========== INHERITANCE: Triangle extends Shape ==========
class Triangle : public Shape {
private:
    double a, b, c_side;  // three sides

public:
    Triangle(double s1, double s2, double s3, string c = "Green")
        : Shape("Triangle", c), a(s1), b(s2), c_side(s3) {
        cout << "[Triangle Constructor] Sides: " << a << ", " << b << ", " << c_side << "\n";
    }

    double area() override {
        // Heron's formula
        double s = (a + b + c_side) / 2;
        return sqrt(s * (s - a) * (s - b) * (s - c_side));
    }

    double perimeter() override {
        return a + b + c_side;
    }

    void display() override {
        Shape::display();
        cout << "  -> Sides: " << a << ", " << b << ", " << c_side << "\n";
    }

    ~Triangle() {
        cout << "[Triangle Destructor]\n";
    }
};

// ========== POLYMORPHISM DEMONSTRATION ==========
void demonstratePolymorphism() {
    cout << "\n========================================\n";
    cout << "    Runtime Polymorphism Demo            \n";
    cout << "========================================\n\n";

    // Array of base class pointers pointing to derived objects
    Shape* shapes[3];
    shapes[0] = new Circle(5.0, "Red");
    cout << "\n";
    shapes[1] = new Rectangle(4.0, 6.0, "Blue");
    cout << "\n";
    shapes[2] = new Triangle(3.0, 4.0, 5.0, "Green");
    cout << "\n";

    cout << "\n--- Calling display() on each Shape pointer ---\n";
    cout << "(Same function call, different behavior = Polymorphism)\n\n";

    for (int i = 0; i < 3; i++) {
        shapes[i]->display();
        cout << "\n";
    }

    // Clean up
    cout << "--- Cleaning up (Destructors called) ---\n";
    for (int i = 0; i < 3; i++) {
        delete shapes[i];
        cout << "\n";
    }
}

int main() {
    int choice;

    cout << "========================================\n";
    cout << "       OOP Concepts in C++              \n";
    cout << "========================================\n";

    do {
        cout << "\n1. Create Circle\n";
        cout << "2. Create Rectangle\n";
        cout << "3. Create Triangle\n";
        cout << "4. Polymorphism Demo (All Shapes)\n";
        cout << "5. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;

        if (choice == 1) {
            double r;
            cout << "Enter radius: ";
            cin >> r;
            Circle c(r);
            cout << "\n";
            c.display();
        } else if (choice == 2) {
            double l, w;
            cout << "Enter length and width: ";
            cin >> l >> w;
            Rectangle rect(l, w);
            cout << "\n";
            rect.display();
        } else if (choice == 3) {
            double a, b, c;
            cout << "Enter 3 sides: ";
            cin >> a >> b >> c;
            Triangle t(a, b, c);
            cout << "\n";
            t.display();
        } else if (choice == 4) {
            demonstratePolymorphism();
        }

        cout << "\n";
    } while (choice != 5);

    cout << "Thank you!\n";
    return 0;
}
