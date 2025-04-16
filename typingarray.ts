// ============================================================================
// TypeScript Array Types with Best Practices & Interview Insights
// ============================================================================

// ----- BASIC ARRAY TYPES -----

// Array of Numbers - the most basic array type
// Best Practice: Use this concise syntax for simple arrays
let numbers: number[] = [1, 2, 3, 4, 5];
// Interview Tip: This is the most common syntax for arrays of primitive types

// Generic Array Type - alternative syntax using Array<T>
// Best Practice: Use this syntax when working with complex types for better readability
let strings: Array<string> = ["hello", "world"];
// Interview Tip: Both syntaxes are functionally identical; preference is often team-based

// Empty Arrays - type inference challenges
// Best Practice: Explicitly type empty arrays to avoid 'any[]' inference
let emptyArray = []; // Type inferred as any[]
let typedEmptyArray: string[] = []; // Explicitly typed as string[]
// Interview Tip: Without an explicit type, TypeScript infers empty arrays as any[], which loses type safety

// ----- ARRAY TYPE VARIATIONS -----

// ReadonlyArray - prevents modifications to array
// Best Practice: Use for arrays that shouldn't be modified after creation
let readonlyNumbers: ReadonlyArray<number> = [1, 2, 3];
// readonlyNumbers.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'
// readonlyNumbers[0] = 0;  // Error: Index signature in type 'readonly number[]' only permits reading
// Interview Tip: ReadonlyArray is a good way to ensure immutability in function parameters

// Readonly array shorthand syntax
// Best Practice: More concise and increasingly common in modern TypeScript
let fixedNumbers: readonly number[] = [1, 2, 3];
// Interview Tip: Both ReadonlyArray<T> and readonly T[] are equivalent

// Tuple Types - arrays with fixed length and element types
// Best Practice: Use tuples when each position has a specific meaning
let coordinate: [number, number] = [10, 20]; // x, y coordinate
// Interview Tip: Tuples are useful for representing fixed-position data like coordinates or key-value pairs

// Optional tuple elements - some elements may be omitted
// Best Practice: Use for tuple positions that might not always be present
let nameAndAge: [string, number?] = ["John"]; // Age is optional
// Interview Tip: Optional elements must come last in the tuple definition

// Rest elements in tuples - variable length with type safety
// Best Practice: Use when you need a minimum number of elements of specific types
let stringAndNumbers: [string, ...number[]] = ["hello", 1, 2, 3, 4];
// Interview Tip: Rest elements in tuples allow for flexible-length tuples with type safety

// ----- MULTI-DIMENSIONAL ARRAYS -----

// 2D Arrays - arrays of arrays
// Best Practice: Use appropriate syntax based on regularity
// For jagged arrays (rows of different lengths)
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5],
  [6, 7, 8, 9],
];

// For regular matrices (all rows same length)
let grid: Array<Array<boolean>> = [
  [true, false, true],
  [false, true, false],
  [true, true, true],
];
// Interview Tip: number[][] is equivalent to Array<Array<number>> but more concise

// 3D Arrays and beyond - deeper nesting
// Best Practice: Consider readability vs. conciseness
let cube: number[][][] = [
  [
    [1, 2],
    [3, 4],
  ],
  [
    [5, 6],
    [7, 8],
  ],
];
// Interview Tip: For deeply nested arrays, alternative data structures might be more appropriate

// ----- ARRAY METHODS WITH TYPE SAFETY -----

// Array.map() with proper return type
// Best Practice: TypeScript often infers these types, but explicit types can add clarity
function doubleNumbers(arr: number[]): number[] {
  return arr.map((n) => n * 2);
}
// Interview Tip: TypeScript infers the return type of map based on the callback's return type

// Array.filter() with type predicates
// Best Practice: Use type predicates for precise type narrowing in filters
function isString(val: any): val is string {
  return typeof val === "string";
}

function filterStrings(arr: any[]): string[] {
  return arr.filter(isString);
}
// Interview Tip: Type predicates (val is string) tell TypeScript what type remains after filtering

// ----- ADVANCED ARRAY TYPING -----

// Union type arrays - arrays with elements of multiple types
// Best Practice: Use union types when elements can be of different but specific types
let mixedArray: (string | number)[] = ["hello", 42, "world", 100];
// Interview Tip: The parentheses around the union type are important!

// Array of objects with specific structure
// Best Practice: Define the object structure separately for reusability
interface Product {
  id: string;
  name: string;
  price: number;
}

let inventory: Product[] = [
  { id: "p1", name: "Laptop", price: 1200 },
  { id: "p2", name: "Phone", price: 800 },
];
// Interview Tip: For arrays of objects, defining the object type separately improves readability

// Array of functions with specific signatures
// Best Practice: Define the function type for clarity
type Comparator = (a: number, b: number) => number;

let sortingFunctions: Comparator[] = [
  (a, b) => a - b, // Ascending
  (a, b) => b - a, // Descending
];
// Interview Tip: Arrays of functions with consistent signatures are common in callback patterns

// ----- GENERIC ARRAY FUNCTIONS -----

// Generic function for array operations
// Best Practice: Use generics for type-safe reusable array functions
function firstElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// Calling with different array types
const first1 = firstElement([1, 2, 3]); // Type: number | undefined
const first2 = firstElement(["a", "b", "c"]); // Type: string | undefined
const first3 = firstElement<boolean>([true, false]); // Explicitly specifying type
// Interview Tip: Generic functions allow you to create reusable, type-safe operations on arrays

// Constraining generic array types
// Best Practice: Use constraints to ensure arrays have required properties
interface HasId {
  id: string | number;
}

function getIds<T extends HasId>(items: T[]): Array<string | number> {
  return items.map((item) => item.id);
}
// Interview Tip: Constraints (T extends HasId) ensure all array elements have required properties

// ----- ARRAY UTILITY TYPES -----

// NonEmptyArray - ensure arrays have at least one element
// Best Practice: Create utility types for common array patterns
type NonEmptyArray<T> = [T, ...T[]];

function pickRandom<T>(arr: NonEmptyArray<T>): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

// Usage
const randomNumber = pickRandom([1, 2, 3]); // Safe to call
// const willError = pickRandom([]); // Error: Type '[]' is not assignable to type 'NonEmptyArray<never>'
// Interview Tip: Custom utility types can encode important invariants about your data structures

// ----- ARRAY DESTRUCTURING WITH TYPES -----

// Typed array destructuring - extract elements with types
// Best Practice: Use destructuring for cleaner code with type safety
function processCoordinate([x, y]: [number, number]): number {
  return Math.sqrt(x * x + y * y);
}

// Rest parameters in destructuring
function getFirstAndRest<T>([first, ...rest]: NonEmptyArray<T>): {
  first: T;
  rest: T[];
} {
  return { first, rest };
}
// Interview Tip: Combine TypeScript tuple types with destructuring for concise, type-safe code

// ----- READONLY ARRAYS VS CONST ASSERTIONS -----

// readonly arrays vs const assertions
// Best Practice: Use readonly for type-level immutability, const for value-level
const constArray = [1, 2, 3] as const; // Type: readonly [1, 2, 3]
const readonlyArray: readonly number[] = [1, 2, 3]; // Type: readonly number[]

// constArray[0] = 0; // Error: Cannot assign to '0' because it is a read-only property
// readonlyArray[0] = 0; // Error: Index signature in type 'readonly number[]' only permits reading

// Key difference
type ElementType1 = (typeof constArray)[number]; // Type: 1 | 2 | 3 (literal types)
type ElementType2 = (typeof readonlyArray)[number]; // Type: number (general number type)
// Interview Tip: 'as const' creates tuple with literal types; readonly preserves just the element type

// ----- PRACTICAL PATTERNS -----

// Type-safe reduce function
// Best Practice: Generics make reduce operations type-safe
function sum(numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

// More complex reduce with proper typing
function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const key = keyFn(item);
      result[key] = result[key] || [];
      result[key].push(item);
      return result;
    },
    {} as Record<K, T[]>,
  );
}
// Interview Tip: Properly typed reduce operations are common in coding interviews

// ----- ARRAY TYPE INFERENCE -----

// Array literals and inference
// Best Practice: Let TypeScript infer types when initializing with values
const inferred = [1, 2, 3]; // Inferred as number[]
const mixed = [1, "two", true]; // Inferred as (string | number | boolean)[]

// Inferring tuples needs help
const point = [10, 20] as const; // Type: readonly [10, 20]
// Interview Tip: Without 'as const', TypeScript infers array types instead of tuple types

// ----- ARRAY TYPE CHALLENGES -----

// Flatten type - convert nested arrays to flat arrays
// Best Practice: Use utility types for complex array type transformations
type Flatten<T> = T extends Array<infer U> ? U : T;

type NestedNumbers = number[][];
type FlatNumbers = Flatten<NestedNumbers>; // Type: number[]
// Interview Tip: Understanding how to manipulate array types is valuable for advanced TypeScript usage

// ----- BEST PRACTICES SUMMARY -----

// 1. Use number[] syntax for simple arrays, Array<T> for complex generic types
// 2. Always provide explicit types for empty arrays
// 3. Use readonly arrays for immutable data
// 4. Prefer tuples when each position has a specific meaning
// 5. Use type predicates with filter for precise typing
// 6. Define object interfaces separately from array declarations
// 7. Use generics for reusable array functions
// 8. Consider utility types for common array patterns
// 9. Use 'as const' for arrays with specific literal values
// 10. Let TypeScript infer types when initializing with values
