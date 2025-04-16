// ============================================================================
// TypeScript Error Handling with Types with Best Practices & Interview Insights
// ============================================================================

// ----- ERROR HANDLING FUNDAMENTALS -----

// Traditional Error Handling - try/catch blocks
// Best Practice: Use for synchronous code that may throw errors
function parseJSON(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch (error) {
    // Type of error is 'any' (or 'unknown' in strict mode with TypeScript 4.4+)
    console.error("Failed to parse JSON:", error);
    return null;
  }
}
// Interview Tip: In TypeScript 4.4+, catch clause variables are typed as 'unknown' in strict mode

// Error Type Guards - narrowing error types
// Best Practice: Use instanceof to check for specific error types
function processFile(path: string): string {
  try {
    // Read file and process it
    return "File processed successfully";
  } catch (error) {
    // Narrow error type with type guard
    if (error instanceof Error) {
      console.error("Error processing file:", error.message);
      // Access Error properties safely
      return `Error: ${error.message}`;
    } else {
      // Handle non-Error objects
      console.error("Unknown error:", error);
      return "An unknown error occurred";
    }
  }
}
// Interview Tip: Always use type guards with catch clauses to safely access properties

// Custom Error Classes - creating specific error types
// Best Practice: Extend Error class for domain-specific errors
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    // Fix prototype chain in TypeScript
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code: number,
  ) {
    super(message);
    this.name = "DatabaseError";
    // Fix prototype chain in TypeScript
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

// Using custom errors
function validateUser(user: unknown): void {
  if (typeof user !== "object" || user === null) {
    throw new ValidationError("User must be an object");
  }

  // More validation...
}

function saveUser(user: unknown): void {
  try {
    validateUser(user);
    // Save to database...
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error("Validation failed:", error.message);
    } else if (error instanceof DatabaseError) {
      console.error(`Database error ${error.code}:`, error.message);
    } else {
      console.error("Unknown error:", error);
    }
  }
}
// Interview Tip: Custom error classes improve error handling clarity and type safety

// ----- UNION TYPES FOR ERROR HANDLING -----

// Result Union Type - returning success or error
// Best Practice: Use discriminated unions for function results
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return {
      success: false,
      error: new Error("Division by zero"),
    };
  }

  return {
    success: true,
    value: a / b,
  };
}

// Using the Result type
function performDivision(a: number, b: number): number | null {
  const result = divide(a, b);

  // Type narrowing with discriminated union
  if (result.success) {
    // TypeScript knows result.value exists here
    return result.value;
  } else {
    // TypeScript knows result.error exists here
    console.error(result.error.message);
    return null;
  }
}
// Interview Tip: Result types make error handling explicit in the function signature

// Rich Error Types - detailed error information
// Best Practice: Use specific error types for different scenarios
type NetworkError = {
  kind: "network";
  status: number;
  message: string;
};

type ValidationError2 = {
  kind: "validation";
  field: string;
  message: string;
};

type TimeoutError = {
  kind: "timeout";
  duration: number;
  message: string;
};

type ApiError = NetworkError | ValidationError2 | TimeoutError;

// Function returning rich error types
type ApiResult<T> = Result<T, ApiError>;

function fetchUser(id: string): ApiResult<User> {
  try {
    // Simulated API call
    if (id === "invalid") {
      return {
        success: false,
        error: {
          kind: "validation",
          field: "id",
          message: "Invalid user ID format",
        },
      };
    }

    return {
      success: true,
      value: { id, name: "John Doe", email: "john@example.com" },
    };
  } catch (error) {
    // Network error simulation
    return {
      success: false,
      error: {
        kind: "network",
        status: 500,
        message: "Failed to fetch user",
      },
    };
  }
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Handling rich error types
function displayUser(id: string): void {
  const result = fetchUser(id);

  if (result.success) {
    console.log(`User: ${result.value.name} (${result.value.email})`);
  } else {
    // Type narrowing on error kind
    switch (result.error.kind) {
      case "network":
        console.error(
          `Network error (${result.error.status}):`,
          result.error.message,
        );
        break;
      case "validation":
        console.error(
          `Validation error (${result.error.field}):`,
          result.error.message,
        );
        break;
      case "timeout":
        console.error(
          `Timeout after ${result.error.duration}ms:`,
          result.error.message,
        );
        break;
    }
  }
}
// Interview Tip: Discriminated unions enable exhaustive error handling with compile-time checks

// ----- NULLABILITY AND OPTIONALS -----

// Nullability - using null to indicate failures
// Best Practice: Use null/undefined consistently for absent values
function findUser(id: string): User | null {
  const users = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@example.com" },
  ];

  const user = users.find((user) => user.id === id);
  return user || null;
}

// Optional Chaining - safely accessing potentially null properties
// Best Practice: Use optional chaining for concise null checking
function getUserEmail(id: string): string | null {
  const user = findUser(id);
  return user?.email ?? null;
}
// Interview Tip: Optional chaining (?.) and nullish coalescing (??) make null handling concise

// ----- ASYNC ERROR HANDLING -----

// Promises and Error Handling - dealing with async errors
// Best Practice: Prefer async/await with try/catch for readability
async function fetchData(url: string): Promise<unknown> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch data:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error; // Re-throw for caller to handle
  }
}
// Interview Tip: Try/catch with async/await provides synchronous-like error handling

// Async Result Types - combining async with Result
// Best Practice: Use Result types with async functions for explicit error handling
async function fetchUserAsync(id: string): Promise<Result<User, ApiError>> {
  try {
    // Simulated API call
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      return {
        success: false,
        error: {
          kind: "network",
          status: response.status,
          message: `HTTP error ${response.status}`,
        },
      };
    }

    const user = await response.json();
    return { success: true, value: user };
  } catch (error) {
    return {
      success: false,
      error: {
        kind: "network",
        status: 0,
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

// Using async Result type
async function displayUserAsync(id: string): Promise<void> {
  const result = await fetchUserAsync(id);

  if (result.success) {
    console.log(`User: ${result.value.name} (${result.value.email})`);
  } else {
    // Handle error based on type
    if (result.error.kind === "network") {
      console.error(
        `Network error (${result.error.status}):`,
        result.error.message,
      );
    }
  }
}
// Interview Tip: Combining Result types with async functions provides type-safe error handling

// ----- FUNCTIONAL ERROR HANDLING PATTERNS -----

// Option Type - representing presence or absence
// Best Practice: Use for values that might not exist
type Option<T> = Some<T> | None;

interface Some<T> {
  tag: "some";
  value: T;
}

interface None {
  tag: "none";
}

// Helper functions
function some<T>(value: T): Option<T> {
  return { tag: "some", value };
}

function none<T>(): Option<T> {
  return { tag: "none" };
}

// Using Option type
function findUserOption(id: string): Option<User> {
  const users = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@example.com" },
  ];

  const user = users.find((user) => user.id === id);
  return user ? some(user) : none();
}

// Mapping over Option
function map<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
  return option.tag === "some" ? some(fn(option.value)) : none();
}

// Using Option with mapping
const userId = "1";
const nameOption = map(findUserOption(userId), (user) => user.name);

// Pattern matching on Option
function match<T, U>(
  option: Option<T>,
  pattern: { some: (value: T) => U; none: () => U },
): U {
  return option.tag === "some" ? pattern.some(option.value) : pattern.none();
}

const userName = match(nameOption, {
  some: (name) => `User: ${name}`,
  none: () => "User not found",
});
// Interview Tip: Functional patterns like Option provide a structured way to handle absence

// Either Type - representing success or failure
// Best Practice: Use for operations that can fail with specific errors
type Either<L, R> = Left<L> | Right<R>;

interface Left<L> {
  tag: "left";
  error: L;
}

interface Right<R> {
  tag: "right";
  value: R;
}

// Helper functions
function left<L, R>(error: L): Either<L, R> {
  return { tag: "left", error };
}

function right<L, R>(value: R): Either<L, R> {
  return { tag: "right", value };
}

// Using Either for division
function divideEither(a: number, b: number): Either<string, number> {
  if (b === 0) {
    return left("Division by zero");
  }
  return right(a / b);
}

// Pattern matching on Either
function matchEither<L, R, U>(
  either: Either<L, R>,
  pattern: { left: (error: L) => U; right: (value: R) => U },
): U {
  return either.tag === "left"
    ? pattern.left(either.error)
    : pattern.right(either.value);
}

// Using Either
const divisionResult = divideEither(10, 2);
const resultMessage = matchEither(divisionResult, {
  left: (error) => `Error: ${error}`,
  right: (value) => `Result: ${value}`,
});
// Interview Tip: Either type is similar to Result but follows functional programming conventions

// ----- TYPE-SAFE EXCEPTION HANDLING -----

// Type-safe error throwing with never
// Best Practice: Use never for functions that always throw
function fail(message: string): never {
  throw new Error(message);
}

function assertNonEmpty<T>(
  value: T[] | null | undefined,
  message: string,
): T[] {
  if (!value || value.length === 0) {
    return fail(`${message} (got empty or null array)`);
  }
  return value;
}

// Type assertions with user-defined guard functions
// Best Practice: Use assertion functions to guarantee types
function assertIsString(
  value: unknown,
  message: string,
): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`${message} (expected string, got ${typeof value})`);
  }
}

function processInput(input: unknown): string {
  assertIsString(input, "Input must be a string");
  // TypeScript knows input is a string here
  return input.toUpperCase();
}
// Interview Tip: Assertion functions guarantee types after they're called, improving type safety

// ----- ERROR HANDLING PATTERNS IN PRACTICAL SCENARIOS -----

// API Error Handling - dealing with network errors
// Best Practice: Create a consistent error handling strategy
interface ApiErrorResponse {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Unified API error type
class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  // Factory method from response
  static async fromResponse(response: Response): Promise<ApiError> {
    let payload: Partial<ApiErrorResponse> = {};

    try {
      payload = await response.json();
    } catch {
      // Failed to parse JSON, use defaults
    }

    return new ApiError(
      response.status,
      payload.code || "UNKNOWN_ERROR",
      payload.message || `HTTP error ${response.status}`,
      payload.details,
    );
  }
}

// API client with consistent error handling
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw await ApiError.fromResponse(response);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      // Re-throw API errors as they're already properly formatted
      throw error;
    }

    // Convert other errors to ApiError format
    throw new ApiError(
      0, // 0 indicates client-side error
      "CLIENT_ERROR",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

// Using the API client
async function fetchUserProfile(userId: string): Promise<User> {
  try {
    return await apiRequest<User>(`/api/users/${userId}`);
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle specific API errors
      if (error.status === 404) {
        console.error(`User ${userId} not found`);
      } else if (error.status === 403) {
        console.error("Permission denied");
      } else {
        console.error(`API error (${error.code}):`, error.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }

    // Provide a fallback or re-throw
    throw error;
  }
}
// Interview Tip: Structured error handling improves debugging and user experience

// Form Validation Errors - handling user input errors
// Best Practice: Use typed validation errors for form handling
type FieldError = {
  field: string;
  message: string;
  code: string;
};

type ValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; errors: FieldError[] };

// Validate a user form
interface UserForm {
  username: string;
  email: string;
  age: number;
}

function validateUserForm(form: unknown): ValidationResult<UserForm> {
  const errors: FieldError[] = [];

  // Type guard to check if form is an object
  if (typeof form !== "object" || form === null) {
    errors.push({
      field: "_form",
      message: "Form data must be an object",
      code: "INVALID_FORM",
    });
    return { valid: false, errors };
  }

  // Cast to any to check individual properties
  const data = form as any;

  // Validate username
  if (!data.username || typeof data.username !== "string") {
    errors.push({
      field: "username",
      message: "Username is required and must be a string",
      code: "INVALID_USERNAME",
    });
  } else if (data.username.length < 3) {
    errors.push({
      field: "username",
      message: "Username must be at least 3 characters",
      code: "USERNAME_TOO_SHORT",
    });
  }

  // Validate email
  if (!data.email || typeof data.email !== "string") {
    errors.push({
      field: "email",
      message: "Email is required and must be a string",
      code: "INVALID_EMAIL",
    });
  } else if (!data.email.includes("@")) {
    errors.push({
      field: "email",
      message: "Email must be a valid email address",
      code: "INVALID_EMAIL_FORMAT",
    });
  }

  // Validate age
  if (data.age === undefined || typeof data.age !== "number") {
    errors.push({
      field: "age",
      message: "Age is required and must be a number",
      code: "INVALID_AGE",
    });
  } else if (data.age < 18) {
    errors.push({
      field: "age",
      message: "You must be at least 18 years old",
      code: "AGE_TOO_YOUNG",
    });
  }

  // Return validation result
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      username: data.username,
      email: data.email,
      age: data.age,
    },
  };
}

// Using the form validation
function processUserForm(formData: unknown): UserForm | null {
  const result = validateUserForm(formData);

  if (result.valid) {
    // Process the valid data
    return result.data;
  } else {
    // Display validation errors
    for (const error of result.errors) {
      console.error(`${error.field}: ${error.message} (${error.code})`);
    }
    return null;
  }
}
// Interview Tip: Structured validation results provide detailed error information

// ----- THIRD-PARTY LIBRARIES FOR ERROR HANDLING -----

// zod - Type-safe schema validation
// Best Practice: Use schema validation libraries for complex data
/*
import { z } from "zod";

// Define schema
const UserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(18)
});

type ValidatedUser = z.infer<typeof UserSchema>;

function validateWithZod(data: unknown): ValidationResult<ValidatedUser> {
  try {
    const validated = UserSchema.parse(data);
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert Zod errors to our format
      const fieldErrors = error.errors.map(err => ({
        field: err.path.join('.') || "_form",
        message: err.message,
        code: err.code
      }));
      return { valid: false, errors: fieldErrors };
    }

    // Unexpected error
    return {
      valid: false,
      errors: [{
        field: "_form",
        message: "Validation failed",
        code: "UNKNOWN_ERROR"
      }]
    };
  }
}
*/
// Interview Tip: Libraries like zod, yup, and io-ts provide robust validation with TypeScript integration

// fp-ts - Functional error handling
// Best Practice: Use functional libraries for pure error handling
/*
import { pipe } from "fp-ts/function";
import { either, Either } from "fp-ts/Either";
import { task, Task } from "fp-ts/Task";
import { taskEither, TaskEither } from "fp-ts/TaskEither";

// Define error type
type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "NetworkError"; status: number; message: string }
  | { type: "UnknownError"; error: unknown };

// Function returning Either
function validateEmail(email: string): Either<AppError, string> {
  return email.includes("@")
    ? either.right(email)
    : either.left({ type: "ValidationError", message: "Invalid email format" });
}

// Async function returning TaskEither
function fetchUserByEmail(email: string): TaskEither<AppError, User> {
  return taskEither.tryCatch(
    () => fetch(`/api/users?email=${email}`).then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res.json();
    }),
    (error): AppError => {
      if (error instanceof Error) {
        return { type: "NetworkError", status: 500, message: error.message };
      }
      return { type: "UnknownError", error };
    }
  );
}

// Composing operations
function getUser(email: string): TaskEither<AppError, User> {
  return pipe(
    validateEmail(email),
    either.map(validEmail => fetchUserByEmail(validEmail)),
    taskEither.fromEither,
    taskEither.chain(identity)
  );
}

// Using the result
function displayUserFunctional(email: string): Task<void> {
  return pipe(
    getUser(email),
    taskEither.fold(
      (error) => () => {
        switch (error.type) {
          case "ValidationError":
            console.error("Validation error:", error.message);
            break;
          case "NetworkError":
            console.error(`Network error (${error.status}):`, error.message);
            break;
          case "UnknownError":
            console.error("Unknown error:", error.error);
            break;
        }
      },
      (user) => () => {
        console.log(`User: ${user.name} (${user.email})`);
      }
    )
  );
}
*/
// Interview Tip: Functional programming patterns provide composable error handling

// ----- ADVANCED ERROR HANDLING TECHNIQUES -----

// Error Boundaries - isolating error effects
// Best Practice: Create boundaries to prevent errors from cascading
class ErrorBoundary {
  private errorHandler: (error: Error) => void;

  constructor(errorHandler: (error: Error) => void) {
    this.errorHandler = errorHandler;
  }

  async run<T>(fn: () => Promise<T>): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Error) {
        this.errorHandler(error);
      } else {
        this.errorHandler(new Error(`Unknown error: ${String(error)}`));
      }
      return null;
    }
  }
}

// Using an error boundary
const boundary = new ErrorBoundary((error) => {
  console.error("Error caught by boundary:", error.message);
  // Log to monitoring service, display user-friendly message, etc.
});

async function runWithBoundary(): Promise<void> {
  const result = await boundary.run(async () => {
    // Potentially error-prone code
    const data = await fetchData("https://api.example.com/data");
    return data;
  });

  if (result) {
    // Process result
    console.log("Got result:", result);
  } else {
    // Handle null result (error occurred)
    console.log("Operation failed, using fallback");
  }
}
// Interview Tip: Error boundaries isolate the effects of errors to specific subsystems

// Error Recovery Strategies - handling errors with grace
// Best Practice: Implement recovery strategies for different error scenarios
type RetryOptions = {
  maxRetries: number;
  delay: number;
  backoffFactor: number;
};

async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = { maxRetries: 3, delay: 300, backoffFactor: 2 },
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry based on error type
      if (error instanceof ApiError && error.status >= 500) {
        // Server errors are retryable
        const retryDelay =
          options.delay * Math.pow(options.backoffFactor, attempt);
        console.log(
          `Retrying after ${retryDelay}ms (attempt ${attempt + 1}/${options.maxRetries})`,
        );

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      // Non-retryable error
      throw error;
    }
  }

  throw lastError;
}

// Using retry strategy
async function fetchUserWithRetry(userId: string): Promise<User> {
  return withRetry(() => apiRequest<User>(`/api/users/${userId}`), {
    maxRetries: 3,
    delay: 500,
    backoffFactor: 1.5,
  });
}
// Interview Tip: Recovery strategies like retries make systems more resilient to transient failures

// ----- BEST PRACTICES SUMMARY -----

// 1. Always narrow error types with type guards before accessing properties
// 2. Use custom error classes for domain-specific errors
// 3. Consider Result/Either types for explicit error handling in function signatures
// 4. Use discriminated unions for rich, type-safe error information
// 5. Implement assertion functions for runtime type validation
// 6. Prefer async/await with try/catch for asynchronous error handling
// 7. Use functional patterns like Option for values that might not exist
// 8. Create consistent error handling strategies for external APIs
// 9. Consider using libraries like zod for complex validation
// 10. Implement error boundaries and recovery strategies for resilient systems
