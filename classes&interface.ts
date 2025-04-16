// ============================================================================
// TypeScript Classes & Interfaces with Best Practices & Interview Insights
// ============================================================================

// ----- BASIC CLASS SYNTAX -----

// Class Declaration - defining a class with properties and methods
// Best Practice: Use PascalCase for class names
class Person {
  // Properties with type annotations
  name: string;
  age: number;

  // Constructor for initialization
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // Method with return type
  greet(): string {
    return `Hello, my name is ${this.name} and I'm ${this.age} years old.`;
  }
}

const person = new Person("Alice", 30);
console.log(person.greet()); // "Hello, my name is Alice and I'm 30 years old."
// Interview Tip: Unlike JavaScript, TypeScript requires properties to be declared before use

// ----- ACCESS MODIFIERS -----

// Access Modifiers - controlling visibility of class members
// Best Practice: Use appropriate access modifiers to enforce encapsulation
class BankAccount {
  // Public members - accessible from anywhere (default)
  public accountNumber: string;

  // Private members - only accessible within the class
  private balance: number;

  // Protected members - accessible within class and subclasses
  protected ownerName: string;

  constructor(
    accountNumber: string,
    ownerName: string,
    initialBalance: number,
  ) {
    this.accountNumber = accountNumber;
    this.ownerName = ownerName;
    this.balance = initialBalance;
  }

  // Public method to access private data
  public getBalance(): number {
    return this.balance;
  }

  // Public method that modifies private data
  public deposit(amount: number): void {
    if (amount <= 0) throw new Error("Deposit amount must be positive");
    this.balance += amount;
  }

  // Protected method accessible by subclasses
  protected updateOwnerName(newName: string): void {
    this.ownerName = newName;
  }
}

const account = new BankAccount("123456789", "John Doe", 1000);
console.log(account.accountNumber); // Accessible: public
console.log(account.getBalance()); // Accessible: public method
// console.log(account.balance); // Error: Property 'balance' is private
// account.updateOwnerName("Jane Doe"); // Error: Property 'updateOwnerName' is protected
// Interview Tip: Access modifiers are enforced at compile-time only, not at runtime

// Parameter Properties - shorthand for declaring and assigning
// Best Practice: Use parameter properties to reduce boilerplate code
class User {
  // Constructor with parameter properties
  constructor(
    public username: string,
    private password: string,
    protected email: string,
  ) {
    // No need for extra assignments
  }

  validatePassword(input: string): boolean {
    return this.password === input;
  }
}

const user = new User("johndoe", "secret123", "john@example.com");
console.log(user.username); // Accessible: public
// console.log(user.password); // Error: Property 'password' is private
// Interview Tip: Parameter properties are a TypeScript-only feature that simplifies class declarations

// ----- INHERITANCE -----

// Class Inheritance - extending base classes
// Best Practice: Use inheritance for "is-a" relationships
class Animal {
  constructor(public name: string) {}

  makeSound(): string {
    return "Some generic sound";
  }
}

class Dog extends Animal {
  constructor(
    name: string,
    public breed: string,
  ) {
    super(name); // Must call super() first
  }

  // Override method from base class
  makeSound(): string {
    return "Woof!";
  }

  // Additional method
  fetch(): string {
    return `${this.name} is fetching!`;
  }
}

const dog = new Dog("Rex", "German Shepherd");
console.log(dog.name); // "Rex" - inherited from Animal
console.log(dog.breed); // "German Shepherd" - specific to Dog
console.log(dog.makeSound()); // "Woof!" - overridden method
console.log(dog.fetch()); // "Rex is fetching!" - Dog-specific method
// Interview Tip: TypeScript enforces calling super() before accessing 'this' in derived classes

// ----- ABSTRACT CLASSES -----

// Abstract Classes - base classes that cannot be instantiated directly
// Best Practice: Use abstract classes for incomplete base classes that require implementation
abstract class Shape {
  constructor(public color: string) {}

  // Abstract method must be implemented by derived classes
  abstract calculateArea(): number;

  // Concrete method available to all derived classes
  displayColor(): string {
    return `This shape is ${this.color}`;
  }
}

class Circle extends Shape {
  constructor(
    color: string,
    public radius: number,
  ) {
    super(color);
  }

  // Implementation of abstract method
  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(
    color: string,
    public width: number,
    public height: number,
  ) {
    super(color);
  }

  // Implementation of abstract method
  calculateArea(): number {
    return this.width * this.height;
  }
}

// const shape = new Shape("red"); // Error: Cannot instantiate abstract class
const circle = new Circle("blue", 5);
const rectangle = new Rectangle("green", 4, 6);

console.log(circle.calculateArea()); // ~78.54
console.log(circle.displayColor()); // "This shape is blue"
console.log(rectangle.calculateArea()); // 24
// Interview Tip: Abstract classes provide a balance between interfaces and concrete classes

// ----- BASIC INTERFACES -----

// Interface Declaration - defining a contract for objects
// Best Practice: Use interfaces to define object shapes
interface Vehicle {
  make: string;
  model: string;
  year: number;
  startEngine(): void;
}

// Object implementing an interface
const car: Vehicle = {
  make: "Toyota",
  model: "Corolla",
  year: 2020,
  startEngine() {
    console.log("Engine started!");
  },
};
// Interview Tip: Interfaces have zero runtime impact - they're purely for type checking

// Optional Properties - properties that may not exist
// Best Practice: Use optional properties for truly optional fields
interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio?: string; // Optional property
  website?: string; // Optional property
}

const profile: UserProfile = {
  id: 1,
  username: "johndoe",
  email: "john@example.com",
  // bio and website are optional
};
// Interview Tip: Optional properties help model real-world data that may be incomplete

// Readonly Properties - properties that cannot be changed after initialization
// Best Practice: Use readonly for properties that should not be modified
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 5; // Error: Cannot assign to 'x' because it is a read-only property
// Interview Tip: readonly is enforced at compile-time only, not at runtime

// ----- INTERFACES VS TYPE ALIASES -----

// Interface vs Type Alias - when to use each
// Best Practice: Use interfaces for object shapes that might be extended
// Type alias for a simple object
type Employee = {
  id: number;
  name: string;
  department: string;
};

// Interface for an extendable object
interface Customer {
  id: number;
  name: string;
  email: string;
}

// Extending an interface
interface PremiumCustomer extends Customer {
  membershipLevel: string;
  discountRate: number;
}

// Extending a type (using intersection)
type Manager = Employee & {
  reports: Employee[];
};

// Declaration merging (only works with interfaces)
interface Customer {
  phone?: string; // Add optional phone property
}

const customer: Customer = {
  id: 1,
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "555-1234", // Valid due to declaration merging
};
// Interview Tip: Interfaces can be merged and extended, making them better for public APIs

// ----- IMPLEMENTING INTERFACES -----

// Class implementing an interface - fulfilling a contract
// Best Practice: Use interfaces to define class contracts
interface Printable {
  print(): void;
  getContent(): string;
}

class Document implements Printable {
  constructor(private content: string) {}

  print(): void {
    console.log(this.content);
  }

  getContent(): string {
    return this.content;
  }
}

class Image implements Printable {
  constructor(
    private url: string,
    private caption: string,
  ) {}

  print(): void {
    console.log(`[Image: ${this.url}]`);
  }

  getContent(): string {
    return this.caption;
  }
}

function printContent(item: Printable): void {
  item.print();
}

const doc = new Document("Hello, world!");
const img = new Image("photo.jpg", "Vacation photo");

printContent(doc); // "Hello, world!"
printContent(img); // "[Image: photo.jpg]"
// Interview Tip: Classes can implement multiple interfaces, enforcing multiple contracts

// Multiple interfaces implementation
// Best Practice: Separate concerns into multiple interfaces
interface Identifiable {
  getId(): string | number;
}

interface Timestamped {
  getCreatedAt(): Date;
}

class Post implements Printable, Identifiable, Timestamped {
  constructor(
    private id: number,
    private title: string,
    private body: string,
    private createdAt: Date,
  ) {}

  print(): void {
    console.log(`${this.title}: ${this.body}`);
  }

  getContent(): string {
    return `${this.title}: ${this.body}`;
  }

  getId(): number {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
// Interview Tip: Multiple interface implementation supports composition over inheritance

// ----- STATIC MEMBERS -----

// Static Properties and Methods - shared across all instances
// Best Practice: Use static members for class-level functionality
class MathOperations {
  // Static property
  static PI: number = 3.14159;

  // Static method
  static square(x: number): number {
    return x * x;
  }

  // Static method using static property
  static calculateCircleArea(radius: number): number {
    return MathOperations.PI * MathOperations.square(radius);
  }

  // Instance method using static members
  calculateCircleCircumference(radius: number): number {
    return 2 * MathOperations.PI * radius;
  }
}

console.log(MathOperations.PI); // 3.14159
console.log(MathOperations.square(4)); // 16
console.log(MathOperations.calculateCircleArea(5)); // ~78.54

const math = new MathOperations();
console.log(math.calculateCircleCircumference(5)); // ~31.4159
// console.log(math.PI); // Error: Property 'PI' is a static member of type 'MathOperations'
// Interview Tip: Static members belong to the class itself, not to instances

// Static Blocks (TypeScript 4.4+)
// Best Practice: Use static blocks for complex static initialization
class Database {
  static host: string;
  static port: number;
  static isInitialized: boolean = false;

  // Static initialization block
  static {
    // Complex initialization logic
    const config = loadDatabaseConfig(); // Assume this function exists
    Database.host = config.host;
    Database.port = config.port;
    Database.isInitialized = true;

    function loadDatabaseConfig() {
      // Simulate loading configuration
      return { host: "localhost", port: 5432 };
    }
  }

  static connect(): void {
    console.log(`Connecting to ${Database.host}:${Database.port}`);
  }
}

console.log(Database.isInitialized); // true
Database.connect(); // "Connecting to localhost:5432"
// Interview Tip: Static blocks allow for complex initialization logic for static members

// ----- ADVANCED CLASS FEATURES -----

// Accessors - getters and setters for controlled property access
// Best Practice: Use accessors to control property access with logic
class Temperature {
  private _celsius: number = 0;

  // Getter - runs when property is accessed
  get celsius(): number {
    return this._celsius;
  }

  // Setter - runs when property is assigned
  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Temperature below absolute zero is not possible");
    }
    this._celsius = value;
  }

  // Derived getter
  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32;
  }

  // Derived setter
  set fahrenheit(value: number) {
    this.celsius = ((value - 32) * 5) / 9;
  }
}

const temp = new Temperature();
temp.celsius = 25; // Uses setter
console.log(temp.celsius); // 25 - Uses getter
console.log(temp.fahrenheit); // 77 - Uses derived getter
temp.fahrenheit = 68; // Uses derived setter
console.log(temp.celsius); // 20 - Value was updated through derived setter
// temp.celsius = -300; // Error: "Temperature below absolute zero is not possible"
// Interview Tip: Accessors allow for validation logic and derived properties

// Index Signatures in Classes - dynamic property names
// Best Practice: Use index signatures for classes with dynamic properties
class Dictionary {
  [key: string]: string | (() => string);

  constructor(initialEntries?: Record<string, string>) {
    if (initialEntries) {
      Object.assign(this, initialEntries);
    }
  }

  add(key: string, value: string): void {
    this[key] = value;
  }

  get(key: string): string | undefined {
    const value = this[key];
    return typeof value === "string" ? value : undefined;
  }

  // Methods must match the index signature
  getEntryCount(): string {
    return Object.keys(this)
      .filter((key) => typeof this[key] === "string")
      .length.toString();
  }
}

const dict = new Dictionary({ hello: "world", foo: "bar" });
dict.add("typescript", "awesome");
console.log(dict.get("hello")); // "world"
console.log(dict.getEntryCount()); // "3"
// Interview Tip: Index signatures make classes behave like dictionaries or maps

// ----- INTERFACES WITH INDEX SIGNATURES -----

// Index Signatures in Interfaces - flexible object shapes
// Best Practice: Use index signatures for objects with variable property names
interface StringMap {
  [key: string]: string;
}

interface NumberMap {
  [key: string]: number;
}

interface MixedMap {
  [key: string]: string | number;
  name: string; // Must match the index signature type
  // id: boolean; // Error: Property 'id' of type 'boolean' is not assignable to string index type 'string | number'
}

const stringMap: StringMap = {
  key1: "value1",
  key2: "value2",
};

const mixedMap: MixedMap = {
  name: "Required property",
  id: 123,
  status: "active",
};
// Interview Tip: Properties in an interface must be compatible with the index signature type

// ----- INTERFACES WITH FUNCTION TYPES -----

// Callable Interfaces - interfaces that describe functions with properties
// Best Practice: Use callable interfaces for functions with additional properties
interface SearchFunction {
  // Call signature
  (source: string, subString: string): boolean;
  // Properties
  caseSensitive: boolean;
  maxSearchDepth?: number;
}

// Creating a function that implements the interface
function createSearcher(caseSensitive: boolean): SearchFunction {
  const searcher = function (source: string, subString: string): boolean {
    if (!caseSensitive) {
      source = source.toLowerCase();
      subString = subString.toLowerCase();
    }
    return source.includes(subString);
  };

  searcher.caseSensitive = caseSensitive;

  return searcher;
}

const search = createSearcher(false);
console.log(search("Hello World", "world")); // true - case insensitive
console.log(search.caseSensitive); // false
// Interview Tip: Callable interfaces are useful for configurable functions like event handlers

// ----- BEST PRACTICES SUMMARY -----

// 1. Use classes for creating objects with both data and behavior
// 2. Use appropriate access modifiers (public, private, protected) to control visibility
// 3. Use parameter properties to reduce boilerplate in simple classes
// 4. Use inheritance for "is-a" relationships, interfaces for capabilities
// 5. Use abstract classes when shared behavior needs to be provided
// 6. Prefer interfaces over type aliases for object shapes that might be extended
// 7. Use accessors (getters/setters) to control property access with validation
// 8. Use static members for functionality that belongs to the class itself
// 9. Remember that TypeScript's type system is structural, not nominal
// 10. Interface names conventionally don't start with "I" in TypeScript (unlike C#/Java)
