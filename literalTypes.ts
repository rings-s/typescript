// ============================================================================
// TypeScript Literal Types with Best Practices & Interview Insights
// ============================================================================

// ----- STRING LITERAL TYPES -----

// String Literal Type - exact string values only
// Best Practice: Use for values restricted to specific strings
type Direction = "North" | "South" | "East" | "West";

let playerDirection: Direction = "North"; // Valid
// let invalidDirection: Direction = "Up"; // Error: Type '"Up"' is not assignable to type 'Direction'
// Interview Tip: String literals create type-safe enums and prevent invalid string values

// String Literal in Function Parameters
// Best Practice: Use to restrict function arguments to specific strings
function move(direction: Direction, steps: number): void {
  console.log(`Moving ${steps} steps ${direction}`);
}

move("North", 3); // Valid
// move("Northwest", 3); // Error: Argument of type '"Northwest"' is not assignable to parameter of type 'Direction'
// Interview Tip: Using literal types for parameters prevents calling functions with invalid values

// ----- NUMERIC LITERAL TYPES -----

// Numeric Literal Type - exact number values only
// Best Practice: Use for values restricted to specific numbers
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

let roll: DiceRoll = 6; // Valid
// let invalidRoll: DiceRoll = 7; // Error: Type '7' is not assignable to type 'DiceRoll'
// Interview Tip: Numeric literals are perfect for values with a fixed set of allowed numbers

// Numeric Literals for Configuration
// Best Practice: Use for configuration values with specific allowed options
type HttpPort = 80 | 443 | 8080 | 8443;
type HttpProtocol = "http" | "https";

interface ServerConfig {
  protocol: HttpProtocol;
  port: HttpPort;
}

const config: ServerConfig = {
  protocol: "https",
  port: 443,
};
// Interview Tip: Combining literal types with interfaces creates strongly-typed configurations

// ----- BOOLEAN LITERAL TYPES -----

// Boolean Literal Type - true or false specifically
// Best Practice: Use when a value must be specifically true or false (not just boolean)
type True = true;
type False = false;

// Valid use cases for specific boolean literals
let debugMode: True = true;
// let debugMode: True = false; // Error: Type 'false' is not assignable to type 'true'

// Practical example - Feature flags with defaults
interface FeatureFlags {
  darkMode: boolean; // Can be true or false
  experimental: true; // Must be enabled (true)
  analytics: false; // Must be disabled (false)
}
// Interview Tip: Boolean literals are less common but useful for enforcing specific boolean values

// ----- LITERAL TYPES WITH UNIONS -----

// Union of Literal Types - combining multiple literal values
// Best Practice: Combine literals to create a set of allowed values
type Status = "pending" | "fulfilled" | "rejected";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type OddDigit = 1 | 3 | 5 | 7 | 9;

// Object property with literal type union
interface ApiRequest {
  url: string;
  method: HttpMethod;
  timeout?: number;
}

function fetchApi(request: ApiRequest) {
  console.log(`${request.method} request to ${request.url}`);
}

fetchApi({ url: "https://api.example.com", method: "GET" }); // Valid
// fetchApi({ url: "https://api.example.com", method: "CONNECT" }); // Error: Type '"CONNECT"' is not assignable to type 'HttpMethod'
// Interview Tip: Union of literals provides type-safety while allowing a specific set of values

// ----- LITERAL TYPES IN DISCRIMINATED UNIONS -----

// Discriminated Unions - union types with a common field that narrows the type
// Best Practice: Use literal type as the discriminant property
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "square"; size: number };

// Type narrowing with the discriminant field
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "square":
      return shape.size ** 2;
  }
}

const myCircle: Shape = { kind: "circle", radius: 5 };
const area = calculateArea(myCircle);
// Interview Tip: Discriminated unions with literal types are a powerful pattern for modeling different cases

// ----- TEMPLATE LITERAL TYPES -----

// Template Literal Types - create string literal types from combinations
// Best Practice: Use to create complex string patterns (TypeScript 4.1+)
type Color = "red" | "green" | "blue";
type Size = "small" | "medium" | "large";

// Combine literals to create new literal types
type ColorSize = `${Color}-${Size}`;
// Expands to: "red-small" | "red-medium" | "red-large" | "green-small" | ... | "blue-large"

let productVariant: ColorSize = "red-medium"; // Valid
// let invalidVariant: ColorSize = "yellow-small"; // Error: Type '"yellow-small"' is not assignable to type 'ColorSize'
// Interview Tip: Template literals create type-safe combinations of existing literal types

// Practical Example - CSS Properties
type CssProperty = "margin" | "padding";
type CssSide = "top" | "right" | "bottom" | "left";

type CssPropertyWithSide = `${CssProperty}${Capitalize<CssSide>}`;
// Expands to: "marginTop" | "marginRight" | ... | "paddingLeft"

interface Styles {
  [key: string]: string | number;
}

function createStyles(
  styles: Partial<Record<CssPropertyWithSide, string | number>>,
): Styles {
  return styles as Styles;
}

const elementStyles = createStyles({
  marginTop: "10px",
  paddingLeft: 20,
  // invalidProp: "10px" // Error: 'invalidProp' does not exist in type 'Partial<Record<CssPropertyWithSide, string | number>>'
});
// Interview Tip: Template literal types are great for typed APIs like CSS properties or event handlers

// ----- LITERAL INFERENCE -----

// Literal Type Inference - TypeScript might widen types from literals to general types
// Best Practice: Use 'as const' to preserve literal types
const direction1 = "North"; // Type widened to string
const direction2 = "North" as const; // Type preserved as "North"

// Without as const, types are widened in object literals
const point1 = { x: 10, y: 20 }; // Type: { x: number, y: number }
const point2 = { x: 10, y: 20 } as const; // Type: { readonly x: 10, readonly y: 20 }

// Example showing the difference in behavior
function goToPoint(x: 10 | 20 | 30, y: 10 | 20 | 30) {
  console.log(`Going to point (${x},${y})`);
}

// goToPoint(point1.x, point1.y); // Error: point1.x and point1.y are widened to number
goToPoint(point2.x, point2.y); // Valid: point2.x and point2.y are literal types 10 and 20
// Interview Tip: Without 'as const', TypeScript widens literal values to their base types

// ----- LITERAL TYPES WITH GENERICS -----

// Generic Functions with Literal Type Constraints
// Best Practice: Use generics with literal type constraints for flexible but type-safe APIs
function createLogger<T extends string>(namespace: T) {
  return {
    log: (message: string) => console.log(`[${namespace}] ${message}`),
    namespace,
  };
}

const logger = createLogger("auth"); // Type: { log: (message: string) => void, namespace: "auth" }
// Interview Tip: Generics with literal constraints preserve the literal type through the function

// ----- ADVANCED LITERAL TYPE TECHNIQUES -----

// Key Remapping with Template Literals
// Best Practice: Use to transform object types with literal property names
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// Expands to: { getName: () => string, getAge: () => number }
// Interview Tip: Combining mapped types with template literals enables powerful type transformations

// Narrowing with Literal Types in Type Guards
// Best Practice: Use literal types to create precise type guards
interface Success {
  status: "success";
  data: any;
}

interface Error {
  status: "error";
  message: string;
}

type ApiResponse = Success | Error;

function isSuccess(response: ApiResponse): response is Success {
  return response.status === "success";
}

function handleResponse(response: ApiResponse) {
  if (isSuccess(response)) {
    // TypeScript knows response is Success here
    console.log(response.data);
  } else {
    // TypeScript knows response is Error here
    console.log(response.message);
  }
}
// Interview Tip: Literal types work perfectly with type guards to enable precise type narrowing

// ----- PRACTICAL USES AND PATTERNS -----

// Enum Alternative with Literal Types
// Best Practice: Use literal types instead of enums for better type safety
// Traditional enum - can have unexpected behavior
enum ColorEnum {
  Red,
  Green,
  Blue,
}

// Literal type alternative - more predictable and type-safe
const Colors = {
  Red: "red",
  Green: "green",
  Blue: "blue",
} as const;

type Color = (typeof Colors)[keyof typeof Colors]; // Type: "red" | "green" | "blue"

function getColorName(color: Color): string {
  return color; // Returns the color name directly
}
// Interview Tip: Literal unions are often preferred over enums in modern TypeScript

// State Machines with Literal Types
// Best Practice: Model state transitions with discriminated unions and literal types
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: any }
  | { status: "error"; error: string };

type Action =
  | { type: "FETCH" }
  | { type: "RESOLVE"; data: any }
  | { type: "REJECT"; error: string }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH":
      return { status: "loading" };
    case "RESOLVE":
      return { status: "success", data: action.data };
    case "REJECT":
      return { status: "error", error: action.error };
    case "RESET":
      return { status: "idle" };
  }
}
// Interview Tip: Modeling state machines with literal types ensures all states and transitions are handled

// ----- BEST PRACTICES SUMMARY -----

// 1. Use string literal types to restrict values to specific strings
// 2. Use numeric literal types for values limited to specific numbers
// 3. Use 'as const' to preserve literal types when TypeScript would normally widen them
// 4. Use discriminated unions with literal type discriminants for type narrowing
// 5. Use template literal types to create type-safe string combinations
// 6. Prefer literal type unions over enums for most use cases
// 7. Use literal types in generics to preserve the specific values
// 8. Combine literal types with mapped types for advanced type transformations
// 9. Use literal types to model state machines and valid state transitions
// 10. Remember that literal types improve both type safety and code documentation
