// ============================================================================
// TypeScript Basic Types with Best Practices & Interview Insights
// ============================================================================

// ----- PRIMITIVE TYPES -----

// Boolean - true/false values
// Best Practice: Use boolean for flags and conditional logic
let isDone: boolean = false;
// Interview Tip: TypeScript treats 0, "", null, undefined as falsy; everything else as truthy

// Number - all numeric values (integers, floats, hex, binary, octal)
// Best Practice: TypeScript doesn't distinguish between integers and floats
let decimal: number = 6;
let hex: number = 0xf00d; // hexadecimal
let binary: number = 0b1010; // binary
let octal: number = 0o744; // octal
// Interview Tip: All numbers in TypeScript are floating-point values

// String - text values
// Best Practice: Use single or double quotes consistently in your codebase
let color: string = "blue";
// Template strings (backticks) allow embedded expressions
let fullName: string = `Bob Smith`;
let sentence: string = `Hello, my name is ${fullName}`;
// Interview Tip: Template strings can span multiple lines without special characters

// ----- COMPLEX TYPES -----

// Array - collection of values of the same type
// Best Practice: Use this syntax for simple arrays of a single type
let list: number[] = [1, 2, 3];
// Alternative generic syntax - functionally identical
let altList: Array<number> = [1, 2, 3];
// Interview Tip: Choose one syntax and be consistent; the first is more commonly used

// Tuple - fixed-length array with elements of specified types
// Best Practice: Use tuples when you know exactly how many elements the array will have
let tuple: [string, number] = ["hello", 10];
// tuple[2] = "world"; // Error: Tuple type '[string, number]' has no element at index '2'
// Interview Tip: TypeScript will enforce both the length and the types at each position

// ----- SPECIAL TYPES -----

// Any - opt out of type checking (use sparingly!)
// Best Practice: Avoid 'any' when possible as it defeats the purpose of TypeScript
let x: any = 4;
x = "hello"; // No error
x = true; // No error
// Interview Tip: 'any' is useful during migration from JavaScript to TypeScript,
// but should be gradually removed as you refine your types

// Unknown - type-safe counterpart of 'any'
// Best Practice: Prefer 'unknown' over 'any' when you don't know the type
let notSure: unknown = 4;
// notSure.toFixed(); // Error: Object is of type 'unknown'
// Interview Tip: 'unknown' is more type-safe than 'any' because it forces type checking
if (typeof notSure === "number") {
  notSure.toFixed(); // OK - TypeScript knows it's a number within this block
}

// Void - absence of a type, used for functions that don't return a value
// Best Practice: Modern TypeScript often infers void return type, but explicit is clearer
function log(message: string): void {
  console.log(message);
}
// Interview Tip: You can assign undefined to void variables, but not null without --strictNullChecks flag

// Undefined & Null - represent absence of value
// Best Practice: With --strictNullChecks, null and undefined are only assignable to unknown, any, and their respective types
let u: undefined = undefined;
let n: null = null;
// Interview Tip: Without --strictNullChecks, null and undefined can be assigned to any type,
// which can lead to runtime errors

// Never - represents values that never occur
// Best Practice: Use for functions that never return (throw errors or infinite loops)
function error(message: string): never {
  throw new Error(message);
}
// Function that never returns due to infinite loop
function infiniteLoop(): never {
  while (true) {}
}
// Interview Tip: 'never' is a subtype of every type, but no type is a subtype of 'never'

// ----- FUNCTION TYPES -----

// Function with parameter and return type annotations
// Best Practice: Always type your function parameters and return values
function add(x: number, y: number): number {
  return x + y;
}
// Interview Tip: TypeScript will infer return types, but explicit types serve as documentation

// Optional Parameters - append '?' to make parameters optional
// Best Practice: Place optional parameters after required ones
function buildName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}
// Interview Tip: Optional parameters are effectively the same as having a union with undefined
// Ex: lastName: string | undefined

// Default Parameters - provide default values for parameters
// Best Practice: Default parameters implicitly make the parameter optional
function greet(name: string = "Guest"): string {
  return `Hello, ${name}!`;
}
// Interview Tip: Unlike optional parameters, you can call the function without providing the parameter

// ----- TYPE ASSERTIONS -----

// Type assertions - tell the compiler to treat a value as a specific type
// Best Practice: Use only when you know more about a type than TypeScript can infer
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;
// Alternative syntax (not allowed in JSX)
let altStrLength: number = (<string>someValue).length;
// Interview Tip: Type assertions don't change the runtime type or perform type conversion;
// they're purely compile-time constructs

// ----- TYPE ALIASES & INTERFACES -----

// Type aliases - create a new name for a type
// Best Practice: Use for union types, tuples, or primitive types
type Point = {
  x: number;
  y: number;
};

// Interfaces - define structure of objects
// Best Practice: Use interfaces for object types that might be extended
interface Person {
  name: string;
  age: number;
}
// Interview Tip: Interfaces can be extended, merged, and implemented by classes;
// type aliases cannot be extended or implemented but are more flexible with unions and primitives
