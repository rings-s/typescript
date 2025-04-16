// ============================================================================
// TypeScript Nested Object Types with Best Practices & Interview Insights
// ============================================================================

// ----- BASIC NESTED OBJECTS -----

// Simple Nested Object Type - objects containing other objects
// Best Practice: Break down complex nested structures into smaller, named types
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  address: Address; // Nested object
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    postalCode: "12345",
  },
};
// Interview Tip: Breaking down complex objects improves readability and reusability

// Inline Nested Object Type - defining nested structure directly
// Best Practice: Use inline types for simple, one-off nested structures
interface Product {
  id: string;
  name: string;
  price: number;
  manufacturer: {
    // Inline nested object type
    id: string;
    name: string;
    contact: {
      // Deeper nesting
      email: string;
      phone: string;
    };
  };
}
// Interview Tip: Inline types are convenient but limit reusability; consider separate interfaces
// for nested structures that appear in multiple places

// ----- OPTIONAL NESTED PROPERTIES -----

// Optional Nested Properties - may or may not exist
// Best Practice: Mark truly optional properties with '?' to avoid null checks
interface Customer {
  id: number;
  name: string;
  shippingAddress?: {
    // Optional nested object
    street: string;
    city: string;
    country: string;
  };
}

// Accessing optional nested properties safely
function getCity(customer: Customer): string | undefined {
  // Option 1: Optional chaining (recommended in TS 3.7+)
  return customer.shippingAddress?.city;

  // Option 2: Traditional null check
  // return customer.shippingAddress ? customer.shippingAddress.city : undefined;
}
// Interview Tip: Optional chaining (?.) is more concise than traditional null checking

// ----- NESTED ARRAYS OF OBJECTS -----

// Arrays of Objects - collections of structured data
// Best Practice: Define the array element type separately for clarity
interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  customerId: string;
  date: Date;
  items: OrderItem[]; // Array of objects
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

// Using type alias for array element type
type MenuItem = {
  id: string;
  name: string;
  price: number;
  options?: string[]; // Nested array of primitives
};

interface Menu {
  categories: {
    id: string;
    name: string;
    items: MenuItem[]; // Nested array of objects
  }[]; // Array of category objects
}
// Interview Tip: Carefully plan how deep your nesting goes; excessive nesting can lead to maintainability issues

// ----- RECURSIVE TYPES -----

// Recursive Types - types that refer to themselves
// Best Practice: Use for tree-like data structures
interface TreeNode<T> {
  value: T;
  children?: TreeNode<T>[]; // Self-referential type
}

// Example of a file system structure
type FileSystemItem = {
  name: string;
  size?: number; // Only files have size
  type: "file" | "directory";
  children?: FileSystemItem[]; // Only directories have children
};

const homeDirectory: FileSystemItem = {
  name: "home",
  type: "directory",
  children: [
    {
      name: "documents",
      type: "directory",
      children: [{ name: "resume.pdf", type: "file", size: 1024 }],
    },
    { name: "profile.jpg", type: "file", size: 2048 },
  ],
};
// Interview Tip: Recursive types are common in interview questions involving trees, graphs,
// or nested comment systems

// ----- INDEX SIGNATURES WITH NESTED OBJECTS -----

// Index Signatures - allow flexible property names with consistent value types
// Best Practice: Use when the property names aren't known ahead of time
interface Dictionary<T> {
  [key: string]: T;
}

// Nested objects with index signatures
interface NestedDictionary {
  [key: string]: {
    value: string;
    metadata: {
      created: Date;
      modified: Date;
    };
  };
}

const cache: NestedDictionary = {
  "user:1": {
    value: JSON.stringify({ name: "John" }),
    metadata: {
      created: new Date(),
      modified: new Date(),
    },
  },
  settings: {
    value: JSON.stringify({ theme: "dark" }),
    metadata: {
      created: new Date(),
      modified: new Date(),
    },
  },
};
// Interview Tip: Index signatures are useful for objects that act as maps or dictionaries

// ----- NESTED UNION AND INTERSECTION TYPES -----

// Union Types in Nested Objects - properties that can be multiple types
// Best Practice: Use for properties that genuinely could have different types
type ContactInfo =
  | {
      type: "email";
      address: string;
      preferred: boolean;
    }
  | {
      type: "phone";
      number: string;
      extension?: string;
      preferred: boolean;
    }
  | {
      type: "address";
      street: string;
      city: string;
      state: string;
      postalCode: string;
      preferred: boolean;
    };

interface Contact {
  id: string;
  name: string;
  contactInfo: ContactInfo[]; // Array of union type objects
}

// Type narrowing for nested union types
function formatContactInfo(info: ContactInfo): string {
  switch (info.type) {
    case "email":
      return `Email: ${info.address}`;
    case "phone":
      return `Phone: ${info.number}${info.extension ? ` ext. ${info.extension}` : ""}`;
    case "address":
      return `Address: ${info.street}, ${info.city}, ${info.state} ${info.postalCode}`;
  }
}
// Interview Tip: Discriminated unions (objects with a common "type" field) work well
// with switch statements for type narrowing

// ----- MAPPED TYPES WITH NESTED STRUCTURES -----

// Mapped Types - transform properties of an existing type
// Best Practice: Use utility types to transform nested structures
interface DeepNestedObject {
  a: {
    b: {
      c: string;
      d: number;
    };
    e: boolean;
  };
  f: string[];
}

// Make all properties deeply readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Usage of deep readonly
const config: DeepReadonly<DeepNestedObject> = {
  a: {
    b: {
      c: "value",
      d: 123,
    },
    e: true,
  },
  f: ["one", "two"],
};

// config.a.b.c = "new value"; // Error: Cannot assign to 'c' because it is a read-only property
// Interview Tip: Recursive mapped types are powerful for transforming deeply nested structures

// ----- COMPLEX NESTED OBJECT PATTERNS -----

// Combining Multiple Techniques - real-world complex object example
// Best Practice: Combine techniques appropriately for the data model
interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    pagination?: {
      currentPage: number;
      totalPages: number;
      perPage: number;
      totalItems: number;
    };
  };
  errors?: {
    code: string;
    message: string;
    details?: unknown; // Could be anything based on the error
  }[];
}

// User profile with nested objects, arrays, and optional properties
interface UserProfile {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    dateOfBirth?: string;
    addresses: {
      type: "home" | "work" | "other";
      primary: boolean;
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    }[];
  };
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      frequency: "immediate" | "daily" | "weekly";
    };
    privacy: {
      profileVisibility: "public" | "private" | "friends";
      [key: string]: string | boolean; // Additional privacy settings
    };
  };
  security: {
    mfaEnabled: boolean;
    lastPasswordChange: string;
    sessions: {
      id: string;
      device: string;
      lastActive: string;
      location?: {
        city?: string;
        country?: string;
        ip: string;
      };
    }[];
  };
}

// Usage in a function that handles API response of user profiles
function processUserProfiles(response: ApiResponse<UserProfile[]>): string[] {
  return response.data.map((user) => {
    const fullName = `${user.profile.firstName} ${user.profile.lastName}`;
    const primaryAddress = user.profile.addresses.find((addr) => addr.primary);
    return primaryAddress
      ? `${fullName} (${primaryAddress.city}, ${primaryAddress.country})`
      : fullName;
  });
}
// Interview Tip: Real-world applications often require complex nested structures;
// being able to design and work with them effectively is a valuable skill

// ----- BEST PRACTICES SUMMARY -----

// 1. Break down complex objects into smaller, reusable interfaces
// 2. Use optional properties (?) for truly optional fields
// 3. Consider flattening deeply nested structures when possible
// 4. Use type aliases to name complex nested types
// 5. Leverage utility types for transforming nested structures
// 6. Be mindful of TypeScript's depth limitations for type checking
// 7. Use discriminated unions for objects that can have different shapes
// 8. Implement proper type guards for safely working with complex structures
