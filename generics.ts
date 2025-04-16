// ============================================================================
// TypeScript Generics in Depth with Best Practices & Interview Insights
// ============================================================================

// ----- BASIC GENERICS -----

// Generic Functions - type variables for reusable, type-safe code
// Best Practice: Use generics when a function works with a variety of types in a similar way
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42); // Explicitly specifying type parameter
const str = identity("hello"); // Type parameter inferred as string
// Interview Tip: TypeScript can often infer generic types from arguments

// Multiple Type Parameters - using more than one type variable
// Best Practice: Use multiple type parameters when operations involve relationships between types
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p1 = pair(1, "hello"); // Type: [number, string]
const p2 = pair<boolean, string[]>(true, ["a", "b"]); // Type: [boolean, string[]]
// Interview Tip: Multiple type parameters allow for functions that relate different types

// Generic Arrays - working with arrays of a specific type
// Best Practice: Use generics with arrays to ensure type safety
function firstElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

const first1 = firstElement([1, 2, 3]); // Type: number | undefined
const first2 = firstElement(["a", "b", "c"]); // Type: string | undefined
const first3 = firstElement([]); // Type: undefined
// Interview Tip: Generic array functions are a common use case for generics

// ----- GENERIC CONSTRAINTS -----

// Generic Constraints - restricting type parameters
// Best Practice: Use constraints to ensure type parameters have required properties
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Safe because T extends Lengthwise
  return arg;
}

logLength("hello"); // Valid: string has .length
logLength([1, 2, 3]); // Valid: array has .length
logLength({ length: 10, value: 3 }); // Valid: object has .length property
// logLength(10); // Error: number doesn't have .length property
// Interview Tip: Constraints enable more useful operations on generic types

// Constraining with keyof - ensuring keys exist on an object
// Best Practice: Use keyof constraints for type-safe property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "John", age: 30 };
const name = getProperty(person, "name"); // Type: string
const age = getProperty(person, "age"); // Type: number
// const invalid = getProperty(person, "height"); // Error: "height" is not assignable to "name" | "age"
// Interview Tip: keyof with generics provides compile-time safety for property access

// Constraining with other type parameters
// Best Practice: Use relationships between type parameters for complex constraints
function copyFields<T extends U, U>(target: T, source: U): T {
  for (const id in source) {
    target[id] = source[id] as any;
  }
  return target;
}

const source = { a: 1, b: 2, c: 3 };
const target = { a: 10, b: 20, c: 30, d: 40 };
const result = copyFields(target, source);
// Interview Tip: Constraints between type parameters allow modeling relationships between arguments

// ----- GENERIC CLASSES -----

// Generic Classes - classes that work with a variety of types
// Best Practice: Use generic classes for containers or data structures
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const numberBox = new Box<number>(42);
const stringBox = new Box("hello");

console.log(numberBox.getValue()); // 42
stringBox.setValue("world");
console.log(stringBox.getValue()); // "world"
// Interview Tip: Generic classes allow type-safe container implementations

// Generic Constraints in Classes
// Best Practice: Use constraints in generic classes for specific behavior
class DataStore<T extends { id: string | number }> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  getItem(id: string | number): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}

const userStore = new DataStore<{ id: number; name: string }>();
userStore.addItem({ id: 1, name: "John" });
console.log(userStore.getItem(1)); // { id: 1, name: "John" }
// const invalidStore = new DataStore<string>(); // Error: string doesn't satisfy constraint
// Interview Tip: Constraints in generic classes ensure valid operations on the type parameter

// Static Members with Generics
// Best Practice: Understand limitations of static members with generics
class Container<T> {
  private static count = 0; // Shared across all Container instances
  private value: T;

  constructor(value: T) {
    this.value = value;
    Container.count++;
  }

  static getCount(): number {
    return Container.count;
  }

  // This won't work - static members can't reference type parameters
  // static defaultValue: T;
}

const c1 = new Container(42);
const c2 = new Container("hello");
console.log(Container.getCount()); // 2
// Interview Tip: Static members don't have access to class type parameters

// ----- GENERIC INTERFACES -----

// Generic Interfaces - interfaces that work with a variety of types
// Best Practice: Use generic interfaces to define type-safe contracts
interface Repository<T> {
  getById(id: string): T;
  getAll(): T[];
  create(item: T): void;
  update(id: string, item: T): void;
  delete(id: string): void;
}

// Implementation for a specific type
class UserRepository implements Repository<User> {
  private users: User[] = [];

  getById(id: string): User {
    return this.users.find((user) => user.id === id) as User;
  }

  getAll(): User[] {
    return this.users;
  }

  create(user: User): void {
    this.users.push(user);
  }

  update(id: string, user: User): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  delete(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

interface User {
  id: string;
  name: string;
}
// Interview Tip: Generic interfaces are widely used in frameworks and libraries

// Generic Interface with Multiple Type Parameters
// Best Practice: Use multiple type parameters in interfaces for complex relationships
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

function createPair<K, V>(key: K, value: V): KeyValuePair<K, V> {
  return { key, value };
}

const pair1 = createPair("name", "John"); // KeyValuePair<string, string>
const pair2 = createPair(1, true); // KeyValuePair<number, boolean>
// Interview Tip: Generic interfaces with multiple parameters model complex data structures

// ----- DEFAULT TYPE PARAMETERS -----

// Default Type Parameters - providing defaults for type parameters
// Best Practice: Use default type parameters to simplify common use cases
interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Using the default
function handleResponse(response: Response) {
  console.log(response.status, response.data);
}

// Specifying a type
function handleUserResponse(response: Response<User>) {
  console.log(response.data.name); // Safe - we know data is User
}
// Interview Tip: Default type parameters reduce verbosity for common cases

// Multiple Default Type Parameters
// Best Practice: Order type parameters so defaults come last
interface ConfigurableRequest<TData, TError = Error> {
  data?: TData;
  error?: TError;
  timeout?: number;
}

function fetchData<T, E = Error>(
  url: string,
  options?: { timeout?: number },
): Promise<ConfigurableRequest<T, E>> {
  // Implementation omitted
  return Promise.resolve({} as ConfigurableRequest<T, E>);
}

// Using default error type
const users = fetchData<User[]>("/api/users");
// Specifying custom error type
const posts = fetchData<Post[], ApiError>("/api/posts");

interface ApiError {
  code: string;
  message: string;
}

interface Post {
  id: string;
  title: string;
}
// Interview Tip: Default type parameters should follow non-default parameters

// ----- GENERIC TYPE ALIASES -----

// Generic Type Aliases - naming complex generic types
// Best Practice: Use type aliases to simplify complex generic types
type Nullable<T> = T | null;
type Pair<T> = [T, T];
type Tree<T> = {
  value: T;
  left?: Tree<T>;
  right?: Tree<T>;
};

// Using generic type aliases
let nullableNumber: Nullable<number> = 42;
nullableNumber = null; // Valid

const coordinates: Pair<number> = [10, 20];

const tree: Tree<string> = {
  value: "root",
  left: { value: "left" },
  right: { value: "right", right: { value: "right-right" } },
};
// Interview Tip: Generic type aliases help create reusable complex types

// Conditional Types with Generic Type Aliases
// Best Practice: Use conditional types for advanced type manipulation
type NonNullable<T> = T extends null | undefined ? never : T;
type Flatten<T> = T extends Array<infer U> ? U : T;

// Examples
type StringOrNull = string | null;
type JustString = NonNullable<StringOrNull>; // string

type NumberArray = number[];
type Number = Flatten<NumberArray>; // number
// Interview Tip: Conditional types enable powerful type transformations

// ----- GENERIC UTILITY TYPES -----

// Built-in Generic Utility Types - TypeScript's utility type library
// Best Practice: Learn and use TypeScript's built-in utility types
// Partial - makes all properties optional
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo {
  return { ...todo, ...fieldsToUpdate };
}

const todo: Todo = {
  title: "Learn TypeScript",
  description: "Study generics thoroughly",
  completed: false,
  dueDate: new Date(),
};

const updatedTodo = updateTodo(todo, { completed: true });
// Interview Tip: Partial<T> is one of the most commonly used utility types

// More Built-in Utility Types
// Best Practice: Familiarize yourself with common utility types
// Required - makes all properties required
type RequiredTodo = Required<Partial<Todo>>; // All properties required

// Pick - selects a subset of properties
type TodoPreview = Pick<Todo, "title" | "completed">; // Just title and completed

// Omit - removes specific properties
type TodoWithoutDate = Omit<Todo, "dueDate">; // No dueDate property

// Record - creates a type with properties of keys K and values of type T
type PageInfo = {
  title: string;
  url: string;
};
type Pages = Record<"home" | "about" | "contact", PageInfo>;
// Interview Tip: Understanding built-in utility types saves time and improves code quality

// ----- MAPPED TYPES WITH GENERICS -----

// Mapped Types - transforming properties of a type
// Best Practice: Use mapped types to create variations of existing types
type ReadonlyType<T> = {
  readonly [P in keyof T]: T[P];
};

type OptionalType<T> = {
  [P in keyof T]?: T[P];
};

type NullableType<T> = {
  [P in keyof T]: T[P] | null;
};

// Using mapped types
type ReadonlyTodo = ReadonlyType<Todo>;
// const readonlyTodo: ReadonlyTodo = { /* ... */ };
// readonlyTodo.completed = true; // Error: Cannot assign to 'completed' because it is a read-only property

type OptionalTodo = OptionalType<Todo>;
// All properties are optional
const partialTodo: OptionalTodo = { title: "Quick task" };
// Interview Tip: Mapped types with generics create powerful type transformations

// Advanced Mapped Type Modifiers
// Best Practice: Use modifiers to add or remove type features
type RequiredProps<T> = {
  [P in keyof T]-?: T[P]; // Remove optional modifier
};

type MutableProps<T> = {
  -readonly [P in keyof T]: T[P]; // Remove readonly modifier
};

// Adding modifiers
type ReadonlyOptional<T> = {
  readonly [P in keyof T]?: T[P]; // Both readonly and optional
};
// Interview Tip: With - and + modifiers, mapped types can add or remove type qualifiers

// ----- ADVANCED GENERIC PATTERNS -----

// Generic Type Inference - inferring types from arguments
// Best Practice: Design APIs that leverage TypeScript's inference capabilities
function createState<T>(initial: T) {
  let state: T = initial;

  function get(): T {
    return state;
  }

  function set(newState: T): void {
    state = newState;
  }

  return { get, set };
}

// Type is inferred from the initial value
const numberState = createState(42);
numberState.set(10); // Valid
// numberState.set("10"); // Error: Argument of type 'string' not assignable to parameter of type 'number'

const userState = createState({ name: "John", age: 30 });
userState.set({ name: "Jane", age: 25 }); // Valid
// userState.set({ name: "Bob" }); // Error: Property 'age' is missing
// Interview Tip: Well-designed generic APIs reduce the need for explicit type annotations

// Generic Type Parameters in Methods
// Best Practice: Use method-level generics for operations independent of class type
class Collection<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  // Method with its own generic parameter
  map<U>(fn: (item: T) => U): Collection<U> {
    const result = new Collection<U>();
    this.items.forEach((item) => result.add(fn(item)));
    return result;
  }

  filter(predicate: (item: T) => boolean): Collection<T> {
    const result = new Collection<T>();
    this.items.forEach((item) => {
      if (predicate(item)) {
        result.add(item);
      }
    });
    return result;
  }

  getAll(): T[] {
    return [...this.items];
  }
}

const numbers = new Collection<number>();
numbers.add(1);
numbers.add(2);
numbers.add(3);

// Method-level generic transforms numbers to strings
const stringified = numbers.map((n) => n.toString());
console.log(stringified.getAll()); // ["1", "2", "3"]
// Interview Tip: Method-level generics allow for flexible transformations

// Higher-Order Functions with Generics
// Best Practice: Use generics in higher-order functions for maximum flexibility
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a) => f(g(a));
}

const double = (x: number) => x * 2;
const toString = (x: number) => `${x}`;

const doubleAndStringify = compose(toString, double);
console.log(doubleAndStringify(5)); // "10"
// Interview Tip: Generics make higher-order functions truly reusable across types

// ----- BEST PRACTICES SUMMARY -----

// 1. Use descriptive but concise names for type parameters (T, U, K, V are common)
// 2. Apply constraints to type parameters when operations require specific capabilities
// 3. Use multiple type parameters when relationships between types are important
// 4. Leverage TypeScript's type inference to reduce explicit type annotations
// 5. Learn and use TypeScript's built-in utility types
// 6. Use generic interfaces and classes for reusable, type-safe components
// 7. Apply generics at function, method, and class levels as appropriate
// 8. Use default type parameters to simplify common use cases
// 9. Combine generics with mapped types for powerful type transformations
// 10. Remember that generics exist only at compile time - they have no runtime impact
