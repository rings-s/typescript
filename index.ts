// Basic Types
let isDone: boolean = false; // Boolean - true/false values
let decimal: number = 6; // Number - all numeric values
let color: string = "blue"; // String - text values
let list: number[] = [1, 2, 3]; // Array of numbers
let tuple: [string, number] = ["hello", 10]; // Tuple - fixed-length array with defined types
let x: any = 4; // Any - opt out of type checking
let u: undefined = undefined; // Undefined - variable with no value assigned
let n: null = null; // Null - variable with null value

// Function with parameter and return type annotation
function add(x: number, y: number): number {
  return x + y;
}

// Void return type - function doesn't return a value
function log(message: string): void {
  console.log(message);
}

// The 'unknown' type is similar to 'any' but safer
// as it requires type checking before operations
let notSure: unknown = 4;
// notSure.toFixed(); // Error: Object is of type 'unknown'
if (typeof notSure === "number") {
  notSure.toFixed(); // OK
}

// Never type - for functions that never return or always throw exceptions
function error(message: string): never {
  throw new Error(message);
}
