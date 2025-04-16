// ============================================================================
// TypeScript Type Guards & Narrowing with Best Practices & Interview Insights
// ============================================================================

// ----- BASIC TYPE GUARDS -----

// typeof Type Guard - narrowing primitive types
// Best Practice: Use typeof to check for primitive types
function padValue(value: string | number, padding: number): string {
  // Type guard using typeof
  if (typeof value === "string") {
    // TypeScript knows value is a string here
    return " ".repeat(padding) + value;
  } else {
    // TypeScript knows value is a number here
    return " ".repeat(padding) + value.toString();
  }
}

console.log(padValue("hello", 3));   // "   hello"
console.log(padValue(42, 3));        // "   42"
// Interview Tip: typeof only works reliably with primitive types: 'string', 'number', 'boolean', 'symbol', 'undefined', 'object', 'function'

// instanceof Type Guard - checking for class instances
// Best Practice: Use instanceof to check for class instances
class Customer {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  contact(): void {
    console.log(`Emailing ${this.name} at ${this.email}`);
  }
}

class Supplier {
  name: string;
  phone: string;

  constructor(name: string, phone: string) {
    this.name = name;
    this.phone = phone;
  }

  contact(): void {
    console.log(`Calling ${this.name} at ${this.phone}`);
  }
}

function contactBusinessPartner(partner: Customer | Supplier): void {
  // Type guard using instanceof
  if (partner instanceof Customer) {
    // TypeScript knows partner is a Customer here
    console.log(`Customer email: ${partner.email}`);
  } else {
    // TypeScript knows partner is a Supplier here
    console.log(`Supplier phone: ${partner.phone}`);
  }

  // Common properties and methods don't need narrowing
  partner.contact();
}
// Interview Tip: instanceof works with classes but not with interfaces (interfaces don't exist at runtime)

// ----- PROPERTY CHECKING TYPE GUARDS -----

// Property Presence Check - narrowing based on property existence
// Best Practice: Check for specific properties to narrow types
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish): void {
  // Type guard using property presence check
  if ("fly" in animal) {
    // TypeScript knows animal is a Bird here
    animal.fly();
  } else {
    // TypeScript knows animal is a Fish here
    animal.swim();
  }

  // Common methods don't need narrowing
  animal.layEggs();
}
// Interview Tip: 'in' operator checks if a property exists on an object, useful for interface discrimination

// Discriminated Unions - objects with a common field that identifies the type
// Best Practice: Use a common property as a "tag" to discriminate between union types
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "square"; size: number };

function calculateArea(shape: Shape): number {
  // Type guard using discriminant property
  switch (shape.kind) {
    case "circle":
      // TypeScript knows shape is { kind: "circle"; radius: number }
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      // TypeScript knows shape is { kind: "rectangle"; width: number; height: number }
      return shape.width * shape.height;
    case "square":
      // TypeScript knows shape is { kind: "square"; size: number }
      return shape.size ** 2;
  }
}
// Interview Tip: Discriminated unions are a powerful pattern in TypeScript, enabling precise type narrowing

// ----- USER-DEFINED TYPE GUARDS -----

// Type Predicates - custom functions that act as type guards
// Best Practice: Use type predicates for complex type narrowing logic
// Type predicate for Fish
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function careForPet(pet: Fish | Bird): void {
  if (isFish(pet)) {
    // TypeScript knows pet is Fish here
    pet.swim();
  } else {
    // TypeScript knows pet is Bird here
    pet.fly();
  }
}
// Interview Tip: The 'pet is Fish' syntax is a type predicate that tells TypeScript the return value indicates the type

// Type Predicates with Generic Types
// Best Practice: Use generic type predicates for reusable type guards
function isOfType<T>(value: any, property: keyof T): value is T {
  return value && property in value;
}

interface Car {
  make: string;
  model: string;
  drive(): void;
}

interface Boat {
  make: string;
  model: string;
  sail(): void;
}

function operate(vehicle: Car | Boat): void {
  if (isOfType<Car>(vehicle, "drive")) {
    // TypeScript knows vehicle is Car here
    vehicle.drive();
  } else {
    // TypeScript knows vehicle is Boat here
    vehicle.sail();
  }
}
// Interview Tip: Generic type predicates create reusable type guards across your codebase

// ----- ASSERTION FUNCTIONS -----

// Assertion Functions - functions that throw if condition isn't met
// Best Practice: Use assertion functions to guarantee types at runtime
// Non-null assertion function
function assertNonNull<T>(value: T | null | undefined, message: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

function processValue(value: string | null): string {
  assertNonNull(value, "Value cannot be null");
  // TypeScript knows value is string here
  return value.toUpperCase();
}

// Type assertion function
function assertIsString(value: any, message: string): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(message);
  }
}

function capitalizeInput(input: unknown): string {
  assertIsString(input, "Input must be a string");
  // TypeScript knows input is string here
  return input.toUpperCase();
}
// Interview Tip: Assertion functions are prefixed with 'asserts' and guarantee types after they're called

// ----- EXHAUSTIVENESS CHECKING -----

// Exhaustiveness Checking - ensuring all variants are handled
// Best Practice: Use exhaustiveness checking to catch missing cases at compile time
type Result<T> =
  | { status: "success"; value: T }
  | { status: "error"; error: Error }
  | { status: "loading" };

function handleResult<T>(result: Result<T>): T | string | null {
  switch (result.status) {
    case "success":
      return result.value;
    case "error":
      return `Error: ${result.error.message}`;
    case "loading":
      return null;
    default:
      // This code is unreachable if all cases are handled
      // TypeScript will error if new variants are added to Result<T> but not handled here
      const exhaustiveCheck: never = result;
      return exhaustiveCheck;
  }
}
// Interview Tip: The never type helps catch exhaustiveness issues at compile time

// Adding a new variant shows the power of exhaustiveness checking
type NewResult<T> =
  | { status: "success"; value: T }
  | { status: "error"; error: Error }
  | { status: "loading" }
  | { status: "cancelled" }; // New variant

// This would cause a compile error in the handleResult function
// because the default case would receive a { status: "cancelled" } object
// which is not assignable to 'never'

// ----- ADVANCED NARROWING TECHNIQUES -----

// Intersection Types and Type Guards
// Best Practice: Use type guards to narrow to intersection types
interface HasId {
  id: string;
}

interface HasName {
  name: string;
}

// Function that returns intersection type
function enrichWithName<T extends HasId>(obj: T, name: string): T & HasName {
  return { ...obj, name };
}

function processEntity(entity: HasId | (HasId & HasName)): string {
  // Check if entity has a name property
  if ("name" in entity) {
    // TypeScript knows entity is HasId & HasName here
    return `${entity.id}: ${entity.name}`;
  } else {
    // TypeScript knows entity is just HasId here
    return `${entity.id}: Unknown`;
  }
}
// Interview Tip: Combining intersection types with type guards enables sophisticated type flows

// Type Guards with Generic Constraints
// Best Practice: Combine generic constraints with type guards for flexible, type-safe code
interface Identified<ID> {
  id: ID;
}

interface Named {
  name: string;
}

// Generic type guard with constraint
function hasName<T extends Identified<any>>(obj: T): obj is T & Named {
  return "name" in obj;
}

function processIdentified<T extends Identified<any>>(entity: T): string {
  if (hasName(entity)) {
    // TypeScript knows entity has both id and name
    return `${entity.id}: ${entity.name}`;
  } else {
    // TypeScript knows entity only has id
    return `${entity.id}: Unnamed`;
  }
}
// Interview Tip: Generic constraints with type guards lead to highly reusable type-checking patterns

// ----- TYPE NARROWING WITH CONTROL FLOW -----

// Assignment Narrowing - narrowing types through assignment
// Best Practice: Use intermediate variables to narrow types
function example(value: string | number | boolean): string {
  let result: string;

  if (typeof value === "string") {
    result = value; // value is narrowed to string
  } else if (typeof value === "number") {
    result = value.toString(); // value is narrowed to number
  } else {
    result = value ? "Yes" : "No"; // value is narrowed to boolean
  }

  return result; // TypeScript knows result is string at all paths
}
// Interview Tip: TypeScript tracks narrowing through variable assignments

// Conditions with Type Narrowing Effects
// Best Practice: Use logical operators for concise narrowing
function printLength(value: string | null | undefined): void {
  // Narrowing with && operator
  value && console.log(value.length);

  // Equivalent to:
  if (value) {
    console.log(value.length);
  }
}

function ensureString(value: string | null): string {
  // Narrowing with || operator
  return value || "default";

  // Equivalent to:
  // if (value) {
  //   return value;
  // }
  // return "default";
}

function provideValue(value: string | number | null): string | number {
  // Narrowing with ?? operator (nullish coalescing)
  return value ?? 0;

  // Equivalent to:
  // if (value !== null && value !== undefined) {
  //   return value;
  // }
  // return 0;
}
// Interview Tip: Logical operators (&&, ||, ??) have built-in narrowing behavior in TypeScript

// ----- ADVANCED TYPE NARROWING PATTERNS -----

// Type Narrowing with Array Filter
// Best Practice: Use type predicates with filter for clean array transformations
// Type guard for non-null values
function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function filterAndProcess<T>(items: (T | null | undefined)[]): T[] {
  // Filter out null/undefined values with type guard
  return items.filter(isNonNull);
}

const mixedData = [1, null, 3, undefined, 5];
const numbers = filterAndProcess(mixedData);
// TypeScript knows numbers is number[] (not (number | null | undefined)[])
// Interview Tip: Combining type guards with array methods creates clean, type-safe transformations

// Type Narrowing with Map and Type Guards
// Best Practice: Use type narrowing for clean mapping operations
type Result<T> = { ok: true; value: T } | { ok: false; error: Error };

function processResults<T>(results: Result<T>[]): T[] {
  // Map and filter in one step with type narrowing
  return results
    .filter((result): result is { ok: true; value: T } => result.ok)
    .map(result => result.value);

  // Equivalent to:
  // return results
  //   .filter(result => result.ok)
  //   .map(result => (result as { ok: true; value: T }).value);
}
// Interview Tip: Type predicates can be used inline with array methods for cleaner code

// Narrowing with Tagged Template Literals
// Best Practice: Use literal types for precise narrowing
type Status = "pending" | "fulfilled" | "rejected";

function getStatusClass(status: Status): string {
  switch (status) {
    case "pending":
      return "bg-yellow";
    case "fulfilled":
      return "bg-green";
    case "rejected":
      return "bg-red";
  }
}

// Function accepting specific literals only
function createHttpClient(baseUrl: `https://${string}`) {
  // TypeScript ensures baseUrl starts with https://
  return {
    get<T>(endpoint: string): Promise<T> {
      return fetch(`${baseUrl}/${endpoint}`).then(res => res.json());
    }
  };
}

// Valid
const client = createHttpClient("https://api.example.com");
// Invalid - TypeScript error
// const insecureClient = createHttpClient("http://api.example.com");
// Interview Tip: Template literal types enable compile-time checks for string formats

// ----- TYPE NARROWING WITH NULLISH VALUES -----

// Non-null Assertion Operator - telling TypeScript a value isn't null/undefined
// Best Practice: Use type guards instead when possible
function processElement(id: string) {
  // ! operator tells TypeScript the element exists
  const element = document.getElementById(id)!;
  element.textContent = "Updated"; // No error about possible null

  // Better alternative with runtime check
  const saferElement = document.getElementById(id);
  if (saferElement) {
    saferElement.textContent = "Updated";
  }
}
// Interview Tip: The ! operator should be used sparingly, as it bypasses TypeScript's safety

// Optional Chaining - safe access to properties that might be undefined
// Best Practice: Use optional chaining for potentially undefined nested properties
interface User {
  name: string;
  address?: {
    street: string;
    city: string;
    zipCode?: string;
  };
}

function getUserCity(user: User): string | undefined {
  // Optional chaining
  return user.address?.city;

  // Equivalent to:
  // return user.address ? user.address.city : undefined;
}

function getZipCode(user: User): string | undefined {
  // Nested optional chaining
  return user.address?.zipCode;
}
// Interview Tip: Optional chaining (?.) stops evaluation if a property is null or undefined

// ----- TYPE NARROWING GOTCHAS AND BEST PRACTICES -----

// Type Widening - when TypeScript widens literal types
// Best Practice: Use const assertions to prevent widening
function printId(id: number | string) {
  console.log(`ID: ${id}`);
}

// These variables are widened to string type
let username = "admin"; // Type is string, not "admin"
printId(username); // OK

// Preventing widening with const assertions
const adminRole = "admin" as const; // Type is "admin", not string
type Role = typeof adminRole; // Type is "admin"

// Preventing widening in objects
const config = {
  environment: "production",
  debug: false,
  version: 1
} as const;
// All properties are read-only with their literal types
// Interview Tip: 'as const' is crucial for preserving literal types in objects and arrays

// Type Guards Don't Work Across Function Boundaries
// Best Practice: Return narrowed types or use assertion functions
function isString(value: unknown): boolean {
  return typeof value === "string";
}

function processValue(value: unknown) {
  // This doesn't work - isString returns boolean but doesn't narrow the type
  if (isString(value)) {
    // value still has type unknown here
    // value.toUpperCase(); // Error: 'value' is of type 'unknown'
  }

  // Solution 1: Use type assertion (less safe)
  if (isString(value)) {
    (value as string).toUpperCase(); // Works but not type-safe
  }

  // Solution 2: Use type predicate (better)
  if (isStringPredicate(value)) {
    value.toUpperCase(); // Works and type-safe
  }
}

// Type predicate version
function isStringPredicate(value: unknown): value is string {
  return typeof value === "string";
}
// Interview Tip: Regular boolean functions don't affect TypeScript's type narrowing across function boundaries

// Distributive Conditional Types - conditional types with unions
// Best Practice: Understand how conditional types distribute over unions
type ToArray<T> = T extends any ? T[] : never;
type NumberOrString = ToArray<number | string>; // number[] | string[]

type NonDistributive<T> = [T] extends [any] ? T[] : never;
type Combined = NonDistributive<number | string>; // (number | string)[]
// Interview Tip: Conditional types distribute over unions by default, which can be controlled with brackets

// ----- REAL-WORLD TYPE NARROWING PATTERNS -----

// Error Handling with Type Narrowing
// Best Practice: Use type narrowing for robust error handling
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: { message: string; code: number } };

function handleApiResponse<T>(response: ApiResponse<T>): T | null {
  if (response.status === "success") {
    return response.data;
  } else {
    console.error(`Error ${response.error.code}: ${response.error.message}`);
    return null;
  }
}

// Using the narrowed type
const userResponse: ApiResponse<User> = {
  status: "success",
  data: { name: "John" }
};

const user = handleApiResponse(userResponse);
if (user) {
  console.log(`Welcome, ${user.name}!`);
}
// Interview Tip: Discriminated unions provide type-safe error handling patterns

// Type Narrowing in React
// Best Practice: Use type narrowing for conditional rendering
interface LoadingState {
  status: "loading";
}

interface ErrorState {
  status: "error";
  error: Error;
}

interface SuccessState<T> {
  status: "success";
  data: T;
}

type State<T> = LoadingState | ErrorState | SuccessState<T>;

// React component pseudo-code with type narrowing
function DataComponent<T>(props: { state: State<T>; render: (data: T) => React.ReactNode }) {
  const { state, render } = props;

  switch (state.status) {
    case "loading":
      return <div>Loading...</div>;
    case "error":
      return <div>Error: {state.error.message}</div>;
    case "success":
      return <div>{render(state.data)}</div>;
  }
}
// Interview Tip: Type narrowing patterns are essential for type-safe conditional rendering in React

// ----- ADVANCED TYPE NARROWING WITH BRANDED TYPES -----

// Branded Types - using intersection with unique symbols
// Best Practice: Use branded types to distinguish between structurally identical types
// Creating branded types
type USD = number & { readonly brand: unique symbol };
type EUR = number & { readonly brand: unique symbol };

// Type-safe creation functions
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
// Interview Tip: Branded types create nominally-typed values from structurally-typed ones

// ----- BEST PRACTICES SUMMARY -----

// 1. Use typeof for primitive type narrowing
// 2. Use instanceof for class instance narrowing
// 3. Use property checks with 'in' for interface narrowing
// 4. Create custom type guards with predicates (value is Type) for complex checks
// 5. Use discriminated unions with a "tag" property for easy narrowing
// 6. Implement exhaustiveness checking with 'never' to catch missed cases
// 7. Use assertion functions for runtime type validation
// 8. Combine type guards with array methods like filter and map
// 9. Remember that type guards don't work across function boundaries
// 10. Use 'as const' to prevent literal type widening
// 11. Prefer optional chaining over nested null checks
// 12. Use branded types to distinguish between structurally identical types
