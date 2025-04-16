// ============================================================================
// TypeScript Advanced Types with Best Practices & Interview Insights
// ============================================================================

// ----- CONDITIONAL TYPES -----

// Conditional Types - types that depend on type relationships
// Best Practice: Use conditional types to create flexible type definitions
type IsString<T> = T extends string ? true : false;

// Usage examples
type Result1 = IsString<string>; // true
type Result2 = IsString<number>; // false
type Result3 = IsString<"hello">; // true
type Result4 = IsString<string | null>; // boolean (true | false)
// Interview Tip: Conditional types are resolved when enough information is available

// Distributive Conditional Types - distribution over unions
// Best Practice: Understand how conditional types distribute over unions
type ToArray<T> = T extends any ? T[] : never;
type StringOrNumberArray = ToArray<string | number>; // string[] | number[]

// Preventing distribution
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Combined = ToArrayNonDist<string | number>; // (string | number)[]
// Interview Tip: Using tuple brackets [T] prevents distribution over unions

// infer Keyword - extracting types from other types
// Best Practice: Use infer to extract component types
type UnpackArray<T> = T extends Array<infer U> ? U : T;
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

// Usage examples
type NumberArray = number[];
type Number = UnpackArray<NumberArray>; // number

type StringPromise = Promise<string>;
type String = UnpackPromise<StringPromise>; // string
// Interview Tip: infer is powerful for extracting types from generics and complex types

// Multiple infer Locations - extracting multiple types
// Best Practice: Use multiple infer clauses to extract related types
type FunctionParams<T> = T extends (...args: infer P) => any ? P : never;
type FunctionReturn<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract both parameter types and return type
type FunctionInfo<T> = T extends (...args: infer P) => infer R
  ? { params: P; return: R }
  : never;

// Usage examples
function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

type GreetParams = FunctionParams<typeof greet>; // [string, number]
type GreetReturn = FunctionReturn<typeof greet>; // string
type GreetInfo = FunctionInfo<typeof greet>; // { params: [string, number]; return: string }
// Interview Tip: Multiple infer clauses can extract complex type relationships

// ----- MAPPED TYPES -----

// Basic Mapped Types - transforming properties of a type
// Best Practice: Use mapped types to systematically transform type properties
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Usage examples
interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type NullableUser = Nullable<User>;
// Interview Tip: Mapped types are powerful for creating variations of existing types

// Mapped Type Modifiers - adding or removing modifiers
// Best Practice: Use + and - prefixes to add or remove modifiers
type Required<T> = {
  [P in keyof T]-?: T[P]; // Remove optional modifier
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P]; // Remove readonly modifier
};

// Combine modifiers
type ReadonlyPartial<T> = {
  readonly [P in keyof T]?: T[P]; // Both readonly and optional
};
// Interview Tip: + is implicit and can be omitted; - explicitly removes modifiers

// Mapped Types with Key Remapping - transforming keys
// Best Practice: Use as clause to rename properties
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type Setters<T> = {
  [P in keyof T as `set${Capitalize<string & P>}`]: (value: T[P]) => void;
};

// Usage examples
interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

type PersonSetters = Setters<Person>;
// { setName: (value: string) => void; setAge: (value: number) => void; }
// Interview Tip: Key remapping creates new property names based on original ones

// Filtering Properties - keeping only certain properties
// Best Practice: Use never with key remapping to filter properties
type FilterByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

// Keep only methods
type Methods<T> = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};

// Keep only properties of a specific type
type StringProps<T> = FilterByType<T, string>;

// Usage examples
class Example {
  name: string = "example";
  count: number = 0;

  increment() {
    this.count++;
  }
}

type ExampleMethods = Methods<Example>; // { increment: () => void }
type ExampleStringProps = StringProps<Example>; // { name: string }
// Interview Tip: Filtering with never in mapped types creates powerful type transformations

// ----- TEMPLATE LITERAL TYPES -----

// Basic Template Literal Types - creating string patterns
// Best Practice: Use template literals for predictable string patterns
type EmailString = `${string}@${string}.${string}`;
type RGB = `rgb(${number}, ${number}, ${number})`;
type HTTPS_URL = `https://${string}`;

const email: EmailString = "user@example.com"; // Valid
const url: HTTPS_URL = "https://example.com"; // Valid
// const invalid: HTTPS_URL = "http://example.com"; // Error
// Interview Tip: Template literal types provide compile-time validation for string formats

// Template Literals with Unions - generating combinations
// Best Practice: Use union types within template literals for all variations
type Color = "red" | "green" | "blue";
type Size = "small" | "medium" | "large";

type ColorSize = `${Color}-${Size}`;
// "red-small" | "red-medium" | "red-large" | "green-small" | ... | "blue-large"

// CSS Properties Example
type CSSProperty = "margin" | "padding";
type CSSDirection = "top" | "right" | "bottom" | "left";

type CSSRule = `${CSSProperty}-${CSSDirection}`;
// "margin-top" | "margin-right" | ... | "padding-left"
// Interview Tip: Union types in template literals expand to all possible combinations

// Uppercase, Lowercase, Capitalize and Uncapitalize
// Best Practice: Use intrinsic string manipulation types for consistent casing
type Greeting = "hello";

type UppercaseGreeting = Uppercase<Greeting>; // "HELLO"
type LowercaseGreeting = Lowercase<"HELLO">; // "hello"
type CapitalizedGreeting = Capitalize<Greeting>; // "Hello"
type UncapitalizedGreeting = Uncapitalize<"Hello">; // "hello"

// Combined with unions
type Event = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<Event>}`; // "onClick" | "onFocus" | "onBlur"
// Interview Tip: String manipulation types are useful for consistent naming conventions

// Advanced Template Literal Application - typed URLs
// Best Practice: Use template literals for API route typing
type APIVersion = "v1" | "v2";
type ResourceType = "users" | "posts" | "comments";
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

type APIRoute = `/${APIVersion}/${ResourceType}`;
type APIEndpoint = `${HTTPMethod} ${APIRoute}`;

const getUsersEndpoint: APIEndpoint = "GET /v1/users"; // Valid
// const invalidEndpoint: APIEndpoint = "PATCH /v1/users"; // Error: 'PATCH' not in HTTPMethod
// Interview Tip: Template literals create strongly-typed string constants for APIs

// ----- UTILITY TYPES -----

// TypeScript's Built-in Utility Types
// Best Practice: Understand and use built-in utility types
// Partial<T> - all properties optional
interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate: Date;
}

function updateTask(task: Task, updates: Partial<Task>): Task {
  return { ...task, ...updates };
}

// Required<T> - all properties required
type RequiredTask = Required<Partial<Task>>;

// Pick<T, K> - subset of properties
type TaskPreview = Pick<Task, "id" | "title">;

// Omit<T, K> - all except certain properties
type TaskWithoutDates = Omit<Task, "dueDate">;

// Exclude<T, U> - exclude types
type Numbers = 1 | 2 | 3 | 4 | 5;
type EvenNumbers = Exclude<Numbers, 1 | 3 | 5>; // 2 | 4

// Extract<T, U> - extract types
type OddNumbers = Extract<Numbers, 1 | 3 | 5 | 7>; // 1 | 3 | 5

// NonNullable<T> - remove null and undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string

// ReturnType<T> - extract function return type
type GreetFunction = (name: string) => string;
type GreetReturn = ReturnType<GreetFunction>; // string

// InstanceType<T> - instance type from constructor
class Rectangle {
  constructor(
    public width: number,
    public height: number,
  ) {}
}
type RectangleInstance = InstanceType<typeof Rectangle>; // Rectangle
// Interview Tip: Built-in utility types cover many common type transformations

// Custom Utility Types - extending TypeScript's utilities
// Best Practice: Build your own utility types for project-specific needs
// DeepPartial - nested optional properties
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// DeepReadonly - nested readonly properties
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

// NonUndefined - remove undefined but keep null
type NonUndefined<T> = T extends undefined ? never : T;

// Dictionary - typed dictionary
type Dictionary<T> = {
  [key: string]: T;
};

// Tuple - fixed-length array
type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

// Usage examples
interface NestedObject {
  name: string;
  settings: {
    theme: string;
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
}

// All properties can be undefined at any depth
type PartialNestedObject = DeepPartial<NestedObject>;

// Make a tuple of specific length
type Triple<T> = Tuple<T, 3>;
const rgbColor: Triple<number> = [255, 128, 0]; // Valid
// Interview Tip: Custom utility types extend TypeScript's capabilities for specific needs

// ----- BRANDED TYPES -----

// Branded Types - adding nominal typing to structural types
// Best Practice: Use branded types to distinguish between structurally identical types
// Simple branded type using intersection
type Brand<K, T> = K & { __brand: T };

type USD = Brand<number, "USD">;
type EUR = Brand<number, "EUR">;

// Creating branded values
function createUSD(value: number): USD {
  return value as USD;
}

function createEUR(value: number): EUR {
  return value as EUR;
}

// Type-safe operations
function addUSD(a: USD, b: USD): USD {
  return (a + b) as USD;
}

const dollars = createUSD(10);
const euros = createEUR(10);

const moreDollars = addUSD(dollars, dollars); // Valid
// const mixed = addUSD(dollars, euros); // Error: EUR is not assignable to USD
// Interview Tip: Branded types add nominal typing to prevent mixing of semantically different types

// Unique Symbol Branding - more robust branding
// Best Practice: Use unique symbols for stronger type separation
// Creating symbols
declare const USDSymbol: unique symbol;
declare const EURSymbol: unique symbol;

// Branded types with symbols
type USDWithSymbol = number & { readonly [USDSymbol]: unique symbol };
type EURWithSymbol = number & { readonly [EURSymbol]: unique symbol };

// Interview Tip: Unique symbols provide stronger type differentiation than string literals

// ----- RECURSIVE TYPES -----

// Recursive Types - types that refer to themselves
// Best Practice: Use recursive types for tree-like or nested structures
// JSON value type
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

// Tree node
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

// Linked list
type LinkedList<T> = {
  value: T;
  next?: LinkedList<T>;
};

// File system item
type FileSystemItem = {
  name: string;
  size?: number; // Only files have size
  type: "file" | "directory";
  children?: FileSystemItem[]; // Only directories have children
};

// Usage examples
const numberTree: TreeNode<number> = {
  value: 1,
  children: [
    { value: 2 },
    {
      value: 3,
      children: [{ value: 4 }],
    },
  ],
};

const fileSystem: FileSystemItem = {
  name: "root",
  type: "directory",
  children: [
    { name: "file.txt", type: "file", size: 100 },
    {
      name: "folder",
      type: "directory",
      children: [{ name: "nested.txt", type: "file", size: 200 }],
    },
  ],
};
// Interview Tip: Recursive types elegantly model nested data structures

// ----- INDEX ACCESS TYPES -----

// Index Access Types - accessing property types by key
// Best Practice: Use index access to extract types from object properties
interface Person {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
    country: string;
  };
}

type Name = Person["name"]; // string
type Age = Person["age"]; // number
type Address = Person["address"]; // { street: string; city: string; country: string; }
type Street = Person["address"]["street"]; // string

// With unions
type PersonProperty = Person["name" | "age"]; // string | number

// With keyof
type AllProps = Person[keyof Person]; // string | number | { street: string; city: string; country: string; }
// Interview Tip: Index access types extract types from properties without repetition

// Using Index Access with Arrays and Tuples
// Best Practice: Use index access with arrays and tuples to get element types
const tuple = [1, "hello", true] as const;
type First = (typeof tuple)[0]; // 1
type Second = (typeof tuple)[1]; // 'hello'
type TupleLength = (typeof tuple)["length"]; // 3

type ArrayElement<T> = T extends Array<infer U> ? U : never;
type TupleElements = (typeof tuple)[number]; // 1 | 'hello' | true
type StringArray = string[];
type StringArrayElement = StringArray[number]; // string
// Interview Tip: [number] index access extracts the element type from arrays and tuples

// ----- keyof AND typeof OPERATORS -----

// keyof Operator - extracting property keys as a type
// Best Practice: Use keyof to work with object property names
type PersonKeys = keyof Person; // 'name' | 'age' | 'address'
type AddressKeys = keyof Person["address"]; // 'street' | 'city' | 'country'

// Type-safe property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person: Person = {
  name: "John",
  age: 30,
  address: {
    street: "Main St",
    city: "Metropolis",
    country: "USA",
  },
};

const name = getProperty(person, "name"); // string
const age = getProperty(person, "age"); // number
// const invalid = getProperty(person, 'invalid'); // Error: 'invalid' is not assignable to keyof Person
// Interview Tip: keyof creates a union of property names for type-safe property access

// typeof Operator - extracting types from values
// Best Practice: Use typeof to derive types from existing values
// Object literal
const config = {
  api: "https://api.example.com",
  timeout: 3000,
  retries: 3,
};

type Config = typeof config; // { api: string; timeout: number; retries: number; }

// Function
function multiply(a: number, b: number): number {
  return a * b;
}

type MultiplyFunc = typeof multiply; // (a: number, b: number) => number

// Using with as const to preserve literal types
const roles = ["admin", "user", "guest"] as const;
type Role = (typeof roles)[number]; // 'admin' | 'user' | 'guest'

const theme = {
  primary: "#007bff",
  secondary: "#6c757d",
  success: "#28a745",
} as const;

type ThemeColor = (typeof theme)[keyof typeof theme]; // '#007bff' | '#6c757d' | '#28a745'
// Interview Tip: typeof extracts types from values; combine with as const for literal types

// ----- TYPE PREDICATES AND ASSERTION FUNCTIONS -----

// Type Predicates - custom type guards with is
// Best Practice: Use type predicates for complex type checks
interface Dog {
  bark(): void;
}

interface Cat {
  meow(): void;
}

// Type predicate
function isDog(animal: Dog | Cat): animal is Dog {
  return "bark" in animal;
}

function makeSound(animal: Dog | Cat): void {
  if (isDog(animal)) {
    animal.bark(); // TypeScript knows animal is Dog
  } else {
    animal.meow(); // TypeScript knows animal is Cat
  }
}
// Interview Tip: Type predicates enable custom type narrowing logic

// Assertion Functions - runtime checks that guarantee types
// Best Practice: Use assertion functions for runtime type validation
// Assert function for non-null values
function assertNonNull<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

// Assert function for specific types
function assertIsString(
  value: unknown,
  message: string,
): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(message);
  }
}

// Usage
function processInput(input: unknown): string {
  assertIsString(input, "Input must be a string");
  // TypeScript knows input is string after the assertion
  return input.toUpperCase();
}
// Interview Tip: Assertion functions guarantee types after they're called

// ----- BEST PRACTICES SUMMARY -----

// 1. Use conditional types to create flexible, adaptable type definitions
// 2. Leverage infer to extract types from complex structures
// 3. Use mapped types for systematic property transformations
// 4. Understand how template literal types create type-safe string patterns
// 5. Master both built-in and custom utility types for common transformations
// 6. Use branded types to distinguish between structurally identical types
// 7. Apply recursive types to model nested data structures
// 8. Use index access to extract existing property types
// 9. Leverage keyof and typeof operators for type-safe code
// 10. Implement type predicates and assertion functions for runtime type checks
