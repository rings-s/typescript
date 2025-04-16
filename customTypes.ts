// ============================================================================
// TypeScript Custom Types with Best Practices & Interview Insights
// ============================================================================

// ----- TYPE ALIASES -----

// Type Alias - create a new name for any type (simple or complex)
// Best Practice: Use PascalCase for type names
type UserID = string;
let currentUser: UserID = "user_123";
// Interview Tip: Type aliases don't create new types - they create new names for existing types

// Object Type Alias - define structure of objects
// Best Practice: Use for complex objects that won't need inheritance
type Point = {
  x: number;
  y: number;
  describe(): string;
};

let point: Point = {
  x: 10,
  y: 20,
  describe() {
    return `(${this.x}, ${this.y})`;
  },
};
// Interview Tip: Unlike interfaces, type aliases can also define unions, tuples, and primitives

// Union Types - allow a value to be one of several types
// Best Practice: Use for values that could be different types
type StringOrNumber = string | number;
function printId(id: StringOrNumber) {
  console.log(`ID: ${id}`);
}
// Interview Tip: You can only use methods that are available on ALL types in the union
// without first narrowing the type

// Intersection Types - combine multiple types into one
// Best Practice: Use to merge properties of multiple types
type Employee = {
  id: number;
  name: string;
};

type Manager = {
  employees: Employee[];
  department: string;
};

type ManagerWithEmployeeProps = Employee & Manager;
// Interview Tip: The resulting type has ALL properties from ALL constituent types

// ----- INTERFACES -----

// Interface - define the structure that objects must follow
// Best Practice: Use for objects that may be extended or implemented by classes
interface User {
  id: string;
  name: string;
  email: string;
}
// Interview Tip: Interfaces can be extended and implemented by classes, making them
// ideal for defining contract-like structures

// Interface Extension - inherit properties from other interfaces
// Best Practice: Use to build hierarchies of types
interface BasicAddress {
  street: string;
  city: string;
}

interface AddressWithPostalCode extends BasicAddress {
  postalCode: string;
}
// Interview Tip: A class that implements an extended interface must implement
// all properties from both the base and extended interfaces

// Declaration Merging - interfaces with the same name get merged
// Best Practice: Use to extend library definitions without modifying source
interface Window {
  customProperty: string;
}
// Now the global Window interface includes your custom property
// Interview Tip: This doesn't work with type aliases - only interfaces can be merged

// ----- LITERAL TYPES -----

// String Literal Types - exact string values
// Best Practice: Use for values limited to specific strings
type Direction = "North" | "South" | "East" | "West";
let currentDirection: Direction = "North";
// currentDirection = "Up"; // Error: Type '"Up"' is not assignable to type 'Direction'
// Interview Tip: String literals combine well with unions to create enum-like types with better type safety

// Numeric Literal Types - exact numeric values
// Best Practice: Use for values limited to specific numbers
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}
// Interview Tip: Numeric literals are useful for configuration values that must be one of several numbers

// ----- MAPPED TYPES -----

// Mapped Types - transform properties of an existing type
// Best Practice: Use to create variations of existing types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

interface Person {
  name: string;
  age: number;
}

// Makes all properties readonly
type ReadonlyPerson = Readonly<Person>;
// Makes all properties optional
type OptionalPerson = Optional<Person>;
// Interview Tip: TypeScript includes utility mapped types like Partial<T>, Required<T>, etc.

// ----- CONDITIONAL TYPES -----

// Conditional Types - types that depend on other types
// Best Practice: Use for advanced type manipulation
type NonNullable<T> = T extends null | undefined ? never : T;

type EmailAddress = string | null;
type ValidEmail = NonNullable<EmailAddress>; // Result: string
// Interview Tip: Conditional types are powerful for creating utility types and type-level programming

// ----- GENERICS -----

// Generic Types - types that work with a variety of data types
// Best Practice: Use single uppercase letters for simple generic parameters
interface Box<T> {
  value: T;
}

let numberBox: Box<number> = { value: 10 };
let stringBox: Box<string> = { value: "hello" };
// Interview Tip: Generics allow you to write reusable, type-safe code without sacrificing flexibility

// Generic Functions - functions that work with generic types
// Best Practice: Infer type parameters when possible rather than specifying them explicitly
function identity<T>(arg: T): T {
  return arg;
}
let output = identity("myString"); // Type is automatically inferred as string
// Interview Tip: TypeScript can often infer generic types from context, making code cleaner

// Generic Constraints - limit generic types to those with specific properties
// Best Practice: Use to ensure generic types have required properties
interface Lengthwise {
  length: number;
}

function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length;
}
// Interview Tip: Constraints help you work with properties that you know must exist

// ----- UTILITY TYPES -----

// Partial<T> - makes all properties optional
// Best Practice: Use for update functions where only some properties may change
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo {
  return { ...todo, ...fieldsToUpdate };
}
// Interview Tip: Utility types like Partial save you from having to write common type transformations

// Pick<T, K> - pick a subset of properties from T
// Best Practice: Use to create types with only the properties you need
type TodoPreview = Pick<Todo, "title" | "completed">;
// Interview Tip: Pick is useful when you want to extract a specific subset of an interface

// Omit<T, K> - remove specific properties from T
// Best Practice: Use to create types without certain properties
type TodoWithoutDescription = Omit<Todo, "description">;
// Interview Tip: Omit is the logical opposite of Pick and lets you exclude specific properties

// Record<K, T> - create a type with properties of type K and values of type T
// Best Practice: Use for dictionaries and lookup objects
type CityDatabase = Record<string, number>;
let populations: CityDatabase = {
  "New York": 8419000,
  "Los Angeles": 3980000,
};
// Interview Tip: Record is perfect for key-value stores where all values have the same type

// ----- TYPE GUARDS -----

// Type Guards - runtime checks that guarantee the type in a certain scope
// Best Practice: Create custom type guards for complex types
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

// User-defined type guard
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function getRandomPet(): Fish | Bird {
  return Math.random() > 0.5
    ? { swim: () => {}, layEggs: () => {} }
    : { fly: () => {}, layEggs: () => {} };
}

let pet = getRandomPet();
if (isFish(pet)) {
  pet.swim(); // TypeScript knows pet is Fish inside this block
} else {
  pet.fly(); // TypeScript knows pet is Bird inside this block
}
// Interview Tip: Type guards are crucial for working safely with union types
