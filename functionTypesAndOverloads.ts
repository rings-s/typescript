// ============================================================================
// TypeScript Function Types & Overloads with Best Practices & Interview Insights
// ============================================================================

// ----- BASIC FUNCTION TYPES -----

// Function Type Expression - defining a function's signature
// Best Practice: Use function type expressions for function variables and parameters
type GreetFunction = (name: string) => string;

const greet: GreetFunction = (name) => `Hello, ${name}!`;
// Interview Tip: TypeScript infers parameter types from the function type expression

// Function with explicit parameter and return type annotations
// Best Practice: Always type parameters and return values for public API functions
function add(x: number, y: number): number {
  return x + y;
}
// Interview Tip: Return type annotations serve as documentation and catch errors

// Void Return Type - functions that don't return a value
// Best Practice: Use void for functions that don't return anything meaningful
function logMessage(message: string): void {
  console.log(message);
  // return "something"; // Error: Type 'string' is not assignable to type 'void'
}
// Interview Tip: A function with void return type can return undefined, but not other values

// Never Return Type - functions that never return normally
// Best Practice: Use never for functions that always throw or have infinite loops
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // do something
  }
}
// Interview Tip: never is assignable to every type, but no type is assignable to never (except never itself)

// ----- OPTIONAL AND DEFAULT PARAMETERS -----

// Optional Parameters - parameters that don't have to be provided
// Best Practice: Use optional parameters for truly optional values
function buildName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}

buildName("John"); // Valid
buildName("John", "Doe"); // Valid
// buildName("John", "Doe", "Mr."); // Error: Expected 1-2 arguments, but got 3
// Interview Tip: Optional parameters must come after required parameters

// Default Parameters - provide default values for parameters
// Best Practice: Use default parameters to avoid null/undefined checks
function greeting(name: string = "Guest"): string {
  return `Hello, ${name}!`;
}

greeting(); // Valid, uses default "Guest"
greeting("John"); // Valid, uses "John"
// Interview Tip: Parameters with default values are implicitly optional

// Rest Parameters - variable number of parameters
// Best Practice: Use rest parameters for functions that accept any number of arguments
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4); // Valid: 10
// Interview Tip: Rest parameters must be of array type and must be the last parameter

// ----- FUNCTION OVERLOADS -----

// Function Overloads - multiple function signatures for different parameter sets
// Best Practice: Use overloads when a function can handle different parameter types/counts
// Overload signatures
function process(x: number): number;
function process(x: string): string;
function process(x: boolean): boolean;
// Implementation signature (must be compatible with ALL overloads)
function process(x: number | string | boolean): number | string | boolean {
  if (typeof x === "number") {
    return x * 2;
  } else if (typeof x === "string") {
    return x.toUpperCase();
  } else {
    return !x;
  }
}

process(123); // Returns 246 (number)
process("hello"); // Returns "HELLO" (string)
process(true); // Returns false (boolean)
// Interview Tip: The implementation signature is not visible to callers - only the overload signatures

// Overloads with Different Parameter Counts
// Best Practice: Order overloads from most specific to least specific
function createElement(tag: string): Element;
function createElement(tag: string, className: string): Element;
function createElement(tag: string, className?: string): Element {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}
// Interview Tip: TypeScript selects the first matching overload, so order matters

// Method Overloads - overloads on class methods
// Best Practice: Use method overloads for polymorphic behavior in classes
class Calculator {
  // Overload signatures
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  // Implementation
  add(a: number | string, b: number | string): number | string {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    } else {
      return String(a) + String(b);
    }
  }
}

const calc = new Calculator();
calc.add(5, 3); // Returns 8 (number)
calc.add("Hello, ", "TypeScript"); // Returns "Hello, TypeScript" (string)
// Interview Tip: Method overloads follow the same rules as function overloads

// ----- THIS TYPING -----

// this Parameter in Functions - explicit type for 'this' inside functions
// Best Practice: Use 'this' parameter for functions that will be used as methods
function getPresentationString(this: { name: string; age: number }): string {
  return `My name is ${this.name} and I'm ${this.age} years old.`;
}

const person = { name: "John", age: 30, presentation: getPresentationString };
person.presentation(); // Valid, 'this' is type-safe
// getPresentationString(); // Error: 'this' context of type 'void' is not assignable
// Interview Tip: 'this' parameter is "erased" in JS, but enforces correct context in TS

// this Type in Callbacks - ensuring callback context
// Best Practice: Use 'this' type in callbacks that rely on specific context
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}

class Handler {
  info: string;

  constructor(info: string) {
    this.info = info;
  }

  // Error: 'this' in method will be 'UIElement', not 'Handler'
  // badMethod(element: UIElement) {
  //   element.addClickListener(function(e) {
  //     console.log(this.info);
  //   });
  // }

  // Correct: Use arrow function to preserve 'this'
  goodMethod(element: UIElement) {
    element.addClickListener((e) => {
      console.log(this.info);
    });
  }
}
// Interview Tip: Understanding 'this' binding differences between function expressions and
// arrow functions is crucial for TypeScript callback typing

// ----- FUNCTION TYPE COMPATIBILITY -----

// Parameter Bivariance - function parameter compatibility
// Best Practice: Understand TypeScript's structural typing for functions
type Animal = { name: string };
type Dog = { name: string; breed: string };

let animalFunc = (animal: Animal) => console.log(animal.name);
let dogFunc = (dog: Dog) => console.log(`${dog.name} is a ${dog.breed}`);

// In TypeScript, parameter types are bivariant
let func1: (animal: Animal) => void = dogFunc; // Error in strict mode, but works conceptually
// let func2: (dog: Dog) => void = animalFunc; // Error: Property 'breed' is missing
// Interview Tip: Function parameter types are contravariant in strict mode, bivariant otherwise

// Return Type Covariance - function return type compatibility
// Best Practice: Return more specific types than required when possible
function getAnimal(): Animal {
  return { name: "Some animal" };
}

function getDog(): Dog {
  return { name: "Rex", breed: "German Shepherd" };
}

let animalGetter: () => Animal = getAnimal;
animalGetter = getDog; // Valid: Dog is assignable to Animal for return types
// let dogGetter: () => Dog = getAnimal; // Error: Missing 'breed' property
// Interview Tip: Return types are covariant - you can return more specific types than required

// ----- CALLABLE INTERFACES -----

// Call Signatures - defining function types with interfaces
// Best Practice: Use call signatures for functions that also have properties
interface ClickHandler {
  // Call signature
  (event: MouseEvent): void;
  // Properties
  enabled: boolean;
}

function createHandler(): ClickHandler {
  const handler = function (event: MouseEvent) {
    console.log("Clicked at", event.clientX, event.clientY);
  };
  handler.enabled = true;
  return handler;
}

const clickHandler = createHandler();
clickHandler.enabled = false; // Access property
clickHandler(new MouseEvent("click")); // Call as function
// Interview Tip: Call signatures allow functions to have properties, like event handlers

// Construct Signatures - typing constructor functions
// Best Practice: Use construct signatures for functions that can be called with 'new'
interface PersonConstructor {
  new (name: string, age: number): { name: string; age: number };
}

function createPerson(ctor: PersonConstructor, name: string, age: number) {
  return new ctor(name, age);
}

class Employee {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const john = createPerson(Employee, "John", 30);
// Interview Tip: Construct signatures are essential for factory patterns in TypeScript

// ----- GENERIC FUNCTIONS -----

// Generic Function Type - functions that work with any type
// Best Practice: Use generics for functions that operate on a variety of types
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(123);
const str = identity("hello"); // Type inferred as string
// Interview Tip: TypeScript can often infer the generic type argument from the call context

// Constraining Type Parameters - ensuring properties exist on generic types
// Best Practice: Use type constraints to ensure generic types have required properties
interface Lengthwise {
  length: number;
}

function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length;
}

getLength("hello"); // Valid: string has length
getLength([1, 2, 3]); // Valid: array has length
// getLength(123); // Error: number doesn't have a length property
// Interview Tip: Constraints (T extends Interface) enable more useful operations on generic types

// ----- ADVANCED FUNCTION TYPES -----

// Typing Higher-Order Functions - functions that take or return functions
// Best Practice: Use function type expressions or interfaces for higher-order functions
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}

const numbers = [1, 2, 3, 4];
const squares = map(numbers, (x) => x * x); // Type: number[]
const words = map(numbers, (x) => x.toString()); // Type: string[]
// Interview Tip: Higher-order functions often use generics for type safety

// Function Type Inference - letting TypeScript infer complex function types
// Best Practice: Let TypeScript infer complex function types when possible
// Type inferred as <T>(x: T) => T
const identityFn = <T>(x: T) => x;

// Type inferred as <T, U>(items: T[], fn: (item: T) => U) => U[]
const mapFn = <T, U>(items: T[], fn: (item: T) => U) => items.map(fn);
// Interview Tip: TypeScript's type inference for functions is powerful but has limits

// ----- BEST PRACTICES SUMMARY -----

// 1. Always provide explicit return types for public API functions
// 2. Use function type expressions for callback parameters and function variables
// 3. Use optional parameters for truly optional values
// 4. Use function overloads for functions that can handle different parameter types
// 5. Order overloads from most specific to least specific
// 6. Use 'this' parameter type for functions that rely on a specific context
// 7. Prefer arrow functions for callbacks to preserve 'this' context
// 8. Use generics for functions that operate on a variety of types
// 9. Add constraints to generic type parameters when operations require specific properties
// 10. Understand function type compatibility for parameters and return types
