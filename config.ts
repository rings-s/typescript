// ============================================================================
// TypeScript Configuration with Best Practices & Interview Insights
// ============================================================================

// ----- TSCONFIG.JSON BASICS -----

/*
  Basic tsconfig.json Structure
  Best Practice: Start with a basic configuration and expand as needed

  {
    "compilerOptions": {
      "target": "es2020",
      "module": "commonjs",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "outDir": "./dist"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.spec.ts"]
  }

  Interview Tip: Understanding how to configure TypeScript is essential for real-world projects
*/

// ----- COMPILER OPTIONS: BASIC -----

/*
  Target - JavaScript language version for compiled code
  Best Practice: Choose based on your runtime environment

  "target": "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "es2021" | "es2022" | "esnext"

  • "es5" - Wide browser compatibility
  • "es6"/"es2015" - Modern features like classes, arrow functions
  • "es2020" - Modern Node.js, recent browsers
  • "esnext" - Latest features, may need additional tooling

  Interview Tip: Older targets have wider runtime compatibility but fewer features
*/

/*
  Module - Module system for generated JavaScript
  Best Practice: Use appropriate module system for your environment

  "module": "none" | "commonjs" | "amd" | "system" | "umd" | "es2015" | "es2020" | "esnext"

  • "commonjs" - Node.js (require/exports)
  • "es2015"/"es2020"/"esnext" - Modern environments (import/export)
  • "umd" - Both browser and Node.js

  Interview Tip: "commonjs" is standard for Node.js; ESM modules are better for browser/modern environments
*/

/*
  Lib - Library declarations for runtime environment
  Best Practice: Include only what you need

  "lib": ["dom", "dom.iterable", "es2020", "scripthost"]

  • "es2020" - Standard built-ins for ES2020
  • "dom" - Browser DOM APIs
  • "webworker" - Web Worker APIs

  Interview Tip: TypeScript automatically includes libs based on your target, but you can override with this option
*/

/*
  Include/Exclude/Files - Control which files get compiled
  Best Practice: Use include/exclude patterns for project organization

  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts"],
  "files": ["global.d.ts"]

  • include - Glob patterns to include
  • exclude - Glob patterns to exclude (node_modules is excluded by default)
  • files - Specific files to include (useful for global types)

  Interview Tip: Path resolution is relative to the tsconfig.json location
*/

// ----- COMPILER OPTIONS: TYPE CHECKING -----

/*
  Strict Mode Options - Enable strict type checking
  Best Practice: Enable strict mode for maximum type safety

  "strict": true, // Enables all strict type-checking options

  Specific options under strict umbrella:

  "noImplicitAny": true,               // Raise error on expressions with implied 'any' type
  "strictNullChecks": true,            // Enable strict null checking
  "strictFunctionTypes": true,         // Enable strict checking of function types
  "strictBindCallApply": true,         // Enable strict 'bind', 'call', and 'apply' methods
  "strictPropertyInitialization": true, // Ensure non-undefined class properties are initialized
  "noImplicitThis": true,              // Raise error on 'this' expressions with implied 'any' type
  "alwaysStrict": true,                // Parse in strict mode and emit "use strict" for each source file

  Interview Tip: Enabling 'strict' mode catches many common errors at compile time
*/

/*
  Additional Type Checking Options - Fine-tune type checking
  Best Practice: Enable these for more robust code

  "noUnusedLocals": true,              // Report errors on unused locals
  "noUnusedParameters": true,          // Report errors on unused parameters
  "noImplicitReturns": true,           // Report error when not all code paths return a value
  "noFallthroughCasesInSwitch": true,  // Report errors for fallthrough cases in switch statements
  "noUncheckedIndexedAccess": true,    // Add 'undefined' to index signature results
  "noPropertyAccessFromIndexSignature": true, // Require using indexing for accessing properties declared using an index signature

  Interview Tip: These additional checks encourage better coding practices and find subtle bugs
*/

/*
  Type Acquisition Options - Control automatic type acquisition
  Best Practice: Configure based on project requirements

  "typeRoots": ["./node_modules/@types", "./src/types"],  // Locations to look for declaration files
  "types": ["node", "jest"],           // Type packages to include
  "allowSyntheticDefaultImports": true, // Allow default imports from modules with no default export
  "esModuleInterop": true,             // Enables interoperability between CommonJS and ES Modules

  Interview Tip: 'typeRoots' and 'types' control where TypeScript looks for type definitions
*/

// ----- COMPILER OPTIONS: MODULES AND PATHS -----

/*
  Module Resolution - How TypeScript resolves module imports
  Best Practice: Use "node" for Node.js projects, "bundler" for bundler workflows

  "moduleResolution": "node" | "classic" | "bundler",

  • "node" - Node.js-style resolution (node_modules)
  • "classic" - Legacy TypeScript resolution
  • "bundler" - For bundlers like webpack (TypeScript 4.7+)

  Interview Tip: "node" resolution is most common and works with most setups
*/

/*
  Path Mapping - Configure module path aliases
  Best Practice: Use path mapping for cleaner imports in large projects

  "baseUrl": "./src",
  "paths": {
    "@app/*": ["*"],
    "@components/*": ["components/*"],
    "@utils/*": ["utils/*"]
  },

  // Then you can import like this:
  // import { Button } from "@components/Button";
  // Instead of:
  // import { Button } from "../../components/Button";

  Interview Tip: Path mapping improves code organization but requires bundler/runtime support
*/

/*
  Source Maps - Generate source maps for debugging
  Best Practice: Enable for development, configure based on tooling

  "sourceMap": true,                  // Generate .map files
  "inlineSources": true,              // Include source code in source maps
  "sourceRoot": "/",                  // Path to source files in the source map
  "inlineSourceMap": false,           // Generate single inline source map

  Interview Tip: Source maps map compiled JavaScript back to original TypeScript for debugging
*/

// ----- COMPILER OPTIONS: OUTPUT -----

/*
  Output Options - Control generated JavaScript files
  Best Practice: Configure based on build requirements

  "outDir": "./dist",                 // Output directory for compiled files
  "rootDir": "./src",                 // Root directory of input files
  "declaration": true,                // Generate .d.ts files
  "declarationDir": "./types",        // Output directory for .d.ts files
  "removeComments": true,             // Remove comments in output files
  "newLine": "lf",                    // Line ending style (crlf or lf)

  Interview Tip: Proper output configuration is important for clean build pipelines
*/

/*
  Declaration Options - Generate declaration files
  Best Practice: Enable for libraries and shared code

  "declaration": true,                // Generate .d.ts declaration files
  "declarationMap": true,             // Generate source maps for declaration files
  "emitDeclarationOnly": false,       // Only emit declaration files

  Interview Tip: Declaration files are important for library authors and code that will be consumed by others
*/

/*
  Interoperability Options - Control JavaScript interoperability
  Best Practice: Enable for better interaction with JavaScript

  "allowJs": true,                    // Allow JavaScript files to be imported
  "checkJs": true,                    // Type check JavaScript files
  "esModuleInterop": true,            // Better interop between CommonJS and ES Modules
  "isolatedModules": true,            // Ensure each file can be safely transpiled

  Interview Tip: These options are important for gradual migration and mixed JS/TS projects
*/

// ----- COMPILER OPTIONS: ADVANCED -----

/*
  Experimental Options - Enable experimental features
  Best Practice: Enable decorators for frameworks that use them

  "experimentalDecorators": true,     // Enable experimental support for decorators
  "emitDecoratorMetadata": true,      // Emit design-type metadata for decorated declarations

  Interview Tip: Needed for Angular, TypeORM, and other decorator-based frameworks
*/

/*
  Advanced Type System Options - Fine-tune type inference
  Best Practice: Enable based on project complexity and team preferences

  "noImplicitOverride": true,         // Ensure overriding members are marked with 'override'
  "noUncheckedIndexedAccess": true,   // Add undefined to indexed accesses
  "exactOptionalPropertyTypes": true, // Interpret optional property types as written

  Interview Tip: These newer options make the type system more precise but potentially stricter
*/

/*
  Project References - Configure multi-project builds
  Best Practice: Use for large monorepos with interdependent packages

  "references": [
    { "path": "../common" },
    { "path": "../api" }
  ],
  "composite": true,                  // Enable project references

  Interview Tip: Project references help with large, multi-package TypeScript projects
*/

// ----- CONFIGURATION FOR COMMON FRAMEWORKS -----

/*
  React Configuration - TypeScript with React
  Best Practice: Include React-specific settings

  {
    "compilerOptions": {
      "target": "es2020",
      "lib": ["dom", "dom.iterable", "esnext"],
      "jsx": "react-jsx",             // For React 17+ (no import needed)
      "module": "esnext",
      "moduleResolution": "node",
      "esModuleInterop": true,
      "strict": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "allowJs": true,
      "isolatedModules": true,
      "noEmit": true                  // Let build tools handle emission
    },
    "include": ["src/**/*"]
  }

  Interview Tip: "jsx" option controls how JSX is transformed (react, react-jsx, preserve, etc.)
*/

/*
  Node.js Configuration - TypeScript for Node.js
  Best Practice: Configure for your Node.js version

  {
    "compilerOptions": {
      "target": "es2020",             // Match your Node.js version
      "module": "commonjs",
      "moduleResolution": "node",
      "outDir": "./dist",
      "rootDir": "./src",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.spec.ts"]
  }

  Interview Tip: For ESM in Node.js, use "module": "ESNext" and "type": "module" in package.json
*/

/*
  Library Configuration - TypeScript for publishable libraries
  Best Practice: Generate declaration files for consumers

  {
    "compilerOptions": {
      "target": "es2018",             // Target a widely compatible version
      "module": "esnext",
      "declaration": true,            // Generate .d.ts files
      "declarationMap": true,         // Include sourcemaps for declarations
      "sourceMap": true,
      "outDir": "./dist",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.spec.ts"]
  }

  Interview Tip: Libraries should generate declaration files for TypeScript consumers
*/

// ----- CONFIGURATION FILE TYPES -----

/*
  tsconfig.json vs jsconfig.json
  Best Practice: Use appropriate config for your project

  • tsconfig.json - For TypeScript projects (compiles .ts/.tsx files)
  • jsconfig.json - For JavaScript projects with TypeScript features (VS Code integration)

  Interview Tip: jsconfig.json is essentially tsconfig.json with allowJs:true and checkJs:true defaults
*/

/*
  Configuration File Extensions
  Best Practice: Use extended configs for shared settings

  // Base config (tsconfig.base.json)
  {
    "compilerOptions": {
      "strict": true,
      "target": "es2020",
      "module": "esnext"
    }
  }

  // Extended config (tsconfig.json)
  {
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
      "outDir": "./dist"
    },
    "include": ["src/**/*"]
  }

  Interview Tip: The "extends" feature allows for shareable configurations across projects
*/

/*
  Multiple Configuration Files
  Best Practice: Use separate configs for different build targets

  • tsconfig.json - Main configuration
  • tsconfig.app.json - Application-specific config
  • tsconfig.spec.json - Testing configuration

  Interview Tip: Specify config file when compiling: tsc -p tsconfig.app.json
*/

// ----- TYPESCRIPT AND BUILD TOOLS -----

/*
  TypeScript with Webpack
  Best Practice: Use ts-loader or babel-loader

  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    }
  };

  Interview Tip: ts-loader performs type checking; babel-loader is faster but skips type checking
*/

/*
  TypeScript with Babel
  Best Practice: Use Babel for transpilation, tsc for type checking

  // .babelrc
  {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-typescript"
    ]
  }

  // package.json
  {
    "scripts": {
      "type-check": "tsc --noEmit",
      "build": "babel src --extensions \".ts,.tsx\" --out-dir dist"
    }
  }

  Interview Tip: This approach separates type checking from transpilation for faster builds
*/

/*
  TypeScript with ESLint
  Best Practice: Use TypeScript-specific ESLint config

  // .eslintrc.js
  module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ]
  };

  Interview Tip: ESLint with TypeScript plugins provides more advanced linting than TSLint (deprecated)
*/

// ----- OPTIMIZING TYPESCRIPT BUILDS -----

/*
  Incremental Compilation - Speed up subsequent builds
  Best Practice: Enable for faster development builds

  "incremental": true,               // Enable incremental compilation
  "tsBuildInfoFile": "./buildcache", // Store incremental build information

  Interview Tip: Incremental builds are significantly faster for large projects
*/

/*
  Skipping Checks - Optimize build time
  Best Practice: Use selectively to improve performance

  "skipLibCheck": true,              // Skip type checking of declaration files
  "skipDefaultLibCheck": true,       // Skip type checking .d.ts files from default library

  Interview Tip: These options can significantly improve build times with minimal downside
*/

/*
  Project References - Build projects in the correct order
  Best Practice: Use for monorepos and large codebases

  // Root tsconfig.json
  {
    "files": [],
    "references": [
      { "path": "./packages/common" },
      { "path": "./packages/server" },
      { "path": "./packages/client" }
    ]
  }

  // Compile with: tsc --build

  Interview Tip: Project references enable faster incremental builds of multi-package projects
*/

// ----- BEST PRACTICES SUMMARY -----

/*
  1. Start with "strict": true and relax specific checks only if necessary
  2. Choose target and module settings based on your runtime environment
  3. Use path mapping for cleaner imports in large projects
  4. Enable incremental compilation for faster development builds
  5. Generate declaration files for libraries and shared code
  6. Use project references for large multi-package projects
  7. Customize configuration for specific frameworks (React, Node.js, etc.)
  8. Extend base configurations to share common settings
  9. Integrate with build tools like Webpack or Babel for optimal workflows
  10. Regularly update TypeScript to benefit from new features and improvements
*/
