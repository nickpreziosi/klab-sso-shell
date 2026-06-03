# Frontend Architecture Guidelines

## Table of Contents

1. [Architectural Decision Framework](#architectural-decision-framework)
2. [Layer Responsibilities & When to Use](#layer-responsibilities--when-to-use)
3. [Design Pattern Decision Matrix](#design-pattern-decision-matrix)
4. [Component Creation Guidelines](#component-creation-guidelines)
5. [Dependency Injection Strategy](#dependency-injection-strategy)
6. [Naming Conventions & File Organization](#naming-conventions--file-organization)
7. [Data Flow Patterns](#data-flow-patterns)
8. [Error Handling Strategy](#error-handling-strategy)
9. [State Management Strategy](#state-management-strategy)
10. [Testing Strategy](#testing-strategy)
11. [Project Initialization](#project-initialization)
12. [Code Generation Guidelines](#code-generation-guidelines)

## Architectural Decision Framework

### When to Use Clean Architecture + Hexagonal Architecture for Frontend

**Use this architecture when**:

- Building complex business applications with rich domain logic
- Need to isolate business logic from UI concerns
- Require high testability and maintainability
- Multiple external integrations (APIs, Firebase, storage)
- Long-term projects with evolving requirements
- Complex business domains with multiple stakeholders
- Need to swap UI frameworks or libraries without affecting business logic

**This architecture provides**:

- Clear separation of concerns across layers
- High testability through dependency injection
- Technology independence in the domain layer
- Scalable and maintainable codebase structure
- Reusable business logic across different UI implementations

## Layer Responsibilities & When to Use

### Contexts Layer (Business Logic - Hexagonal Architecture)

The `contexts/` folder contains the core business logic organized by domain context, following hexagonal architecture principles.

#### Domain Layer Components

##### Model/Entity

- **Purpose**: Represents domain concepts and business entities
- **Characteristics**: Business identity, domain logic, validation rules
- **Location**: `contexts/{context}/domain/{entity}.model.ts`
- **Note**: Models can be interfaces or classes depending on complexity

##### Value Object

- **Purpose**: Type safety and validation for domain properties
- **Characteristics**: Immutable, represents concept by value, validation rules
- **Location**: `contexts/{context}/domain/valueObjects/` or `contexts/shared/domain/valueObject/`
- **Guideline**: Create value objects for domain properties that need validation or type safety

##### Domain Service

- **Purpose**: Encapsulate reusable business logic
- **Characteristics**: Stateless, pure business logic, called by application services
- **Location**: `contexts/{context}/domain/services/`
- **Use cases**: Cross-entity logic, reusable business operations, complex calculations, validation
- **Error Handling**: Throws domain-specific error classes (extending `DomainError`), not generic `Error`

##### Repository Interface

- **Purpose**: Define data access contracts
- **Characteristics**: Interface definition, technology-agnostic, domain-focused
- **Location**: `contexts/{context}/domain/{entity}.repository.ts`
- **Return Type**: Returns domain models directly (not Result), errors are thrown as exceptions
- **Note**: Repository interfaces define the contract; implementations live in infrastructure. Infrastructure layer handles error transformation to domain errors.

#### Application Layer Components

##### Service

- **Purpose**: Orchestrate business operations and coordinate between layers
- **Characteristics**: Single responsibility, coordinates domain and infrastructure, business operation boundary
- **Location**: `contexts/{context}/application/{entity}.service.ts`
- **Parameters**: Usually use domain model primitives rather than explicit DTOs
- **Return Type**: Always returns `Result<T>` for consistent error handling
- **Note**: Services orchestrate domain logic and repository operations, wrap all operations in Result pattern

#### Infrastructure Layer Components (Outbound)

##### Repository Implementation

- **Purpose**: Implement domain repository interfaces
- **Characteristics**: External data source integration, API calls, data mapping
- **Location**: `contexts/{context}/infrastructure/http/` or `contexts/{context}/infrastructure/firebase/`
- **Error Handling**: Transforms infrastructure errors (HTTP errors, network errors) to domain errors before throwing
- **Note**: Can have multiple implementations (HTTP, Firebase, Mock) for the same repository interface. Use centralized error handling helpers to avoid boilerplate.

##### Mapper

- **Purpose**: Transform data between external API format and domain models
- **Characteristics**: Data transformation, format conversion, type mapping
- **Location**: `contexts/{context}/infrastructure/mappers/`
- **Use when**: API response structure differs from domain model structure

### Presentation Layer

The `app/` and `ui/` folders contain the presentation layer, responsible for user interaction and UI rendering.

#### App Layer (`app/`)

##### Page

- **Purpose**: Next.js App Router page components
- **Characteristics**: Server components (default), route handlers, thin wrappers
- **Location**: `app/{route}/page.tsx`
- **CRITICAL RULE**: Pages in `/app` directory MUST NOT contain UI logic or components directly. They should ONLY act as thin wrappers that render Views from `/ui` directory.
- **Guideline**: Keep pages thin; delegate to client views for interactivity. Pages should only import and render View components from `ui/{context}/views/`.
- **Data Fetching**: Use server actions in separate files (`app/{route}/actions.ts`) for server-side data fetching. Pages should call server actions, not directly access services.
- **Error Handling**: Throw `PageError` for user-facing errors that should be caught by error boundaries
- **Note**: Pages should avoid server-side data fetching that causes network calls during prerender
- **Example Pattern**:

  ```typescript
  // ✅ CORRECT: Page is a thin wrapper
  import { DashboardView } from "@/ui/shared/views/Dashboard/DashboardView";

  export default function DashboardPage() {
    return <DashboardView />;
  }

  // ❌ WRONG: Page contains UI logic directly
  export default function DashboardPage() {
    return <div>...</div>; // DON'T DO THIS
  }
  ```

##### Layout

- **Purpose**: Define shared layout structure
- **Characteristics**: Wraps routes, provides shared UI structure
- **Location**: `app/layout.tsx`, `app/{route}/layout.tsx`

##### Template

- **Purpose**: Define route-specific templates with shared behavior
- **Characteristics**: Re-renders on navigation, handles route-level logic
- **Location**: `app/template.tsx`

##### Providers

- **Purpose**: Set up React context providers
- **Characteristics**: Wraps application with context providers
- **Location**: `app/providers.tsx`

#### UI Layer (`ui/`)

##### View

- **Purpose**: Page-level client components that compose containers and components
- **Characteristics**: Client component (`'use client'`), orchestrates UI, handles navigation
- **Location**: `ui/{context}/views/{viewName}/{viewName}View.tsx`
- **Guideline**: Views should be primarily presentational; business logic in hooks

##### Container

- **Purpose**: Feature-specific components with complex UI logic
- **Characteristics**: Client component, encapsulates related UI logic, may have local state
- **Location**: `ui/{context}/containers/{containerName}/`
- **Use when**: Complex UI logic that doesn't belong in views or shared components

##### Component

- **Purpose**: Reusable UI components specific to a feature
- **Characteristics**: Presentational, reusable within feature context
- **Location**: `ui/{context}/components/{componentName}/`
- **Note**: Feature-specific components; use `shared/components/` for cross-feature components

##### Hook

- **Purpose**: Connect UI to application services, manage component state
- **Characteristics**: React hook, uses dependency container, handles loading/error states
- **Location**: `ui/{context}/hooks/use{Feature}.tsx`
- **Service Access**: Always use `useMemo` to retrieve services from container (never module-level `container.get()`)
- **Error Handling**: Extract error messages from Result objects, handle domain errors appropriately
- **Guideline**: Hooks should use services from dependency container, not directly import repositories. Services should be retrieved inside hooks using `useMemo`, never at module level.

##### Server Actions

- **Purpose**: Next.js server actions for form submissions and mutations
- **Characteristics**: Server-side functions, called from client components
- **Location**: `ui/{context}/actions/{actionName}.ts` or `ui/{context}/actions/index.ts`
- **Note**: Used for server-side operations, form handling, and API mutations

##### Store

- **Purpose**: Local state management (Zustand, Context API, etc.)
- **Characteristics**: Client-side state, feature-specific caching
- **Location**: `ui/{context}/store/{storeName}.ts`
- **Use when**: Need to share state across multiple components in a feature

##### Shared Components

- **Purpose**: Reusable UI components across features
- **Characteristics**: Generic, reusable, well-documented
- **Location**: `ui/shared/components/{componentName}/`
- **Examples**: Button, Card, Modal, Badge

##### Shared Hooks

- **Purpose**: Reusable hooks across features
- **Characteristics**: Generic functionality, cross-feature utilities
- **Location**: `ui/shared/hooks/{hookName}.tsx`
- **Examples**: `useAuth`, `useInternationalization`, `useErrorNotification`

##### Shared Providers

- **Purpose**: React context providers for shared functionality
- **Characteristics**: Wraps application features, provides shared context
- **Location**: `ui/shared/providers/{providerName}.tsx`
- **Examples**: `InternationalizationProvider`, `AuthProvider`

##### Shared Containers

- **Purpose**: Shared layout containers
- **Characteristics**: Application-wide UI structure
- **Location**: `ui/shared/containers/{containerName}/`
- **Examples**: `AppBar`, `SideBar`

## Design Pattern Decision Matrix

| Pattern                       | When to Use                             | Key Characteristics                                      | Location                                     |
| ----------------------------- | --------------------------------------- | -------------------------------------------------------- | -------------------------------------------- |
| **Model**                     | Domain entities, business concepts      | Business identity, domain logic                          | `contexts/{context}/domain/`                 |
| **Value Object**              | Domain properties needing validation    | Immutable, validation, type safety                       | `contexts/{context}/domain/valueObjects/`    |
| **Domain Service**            | Cross-entity logic, reusable operations | Stateless, pure business logic                           | `contexts/{context}/domain/services/`        |
| **Application Service**       | Business operation orchestration        | Coordinates domain and infrastructure, returns Result<T> | `contexts/{context}/application/`            |
| **Repository Interface**      | Data access abstraction                 | Interface definition, technology-agnostic                | `contexts/{context}/domain/`                 |
| **Repository Implementation** | External data integration               | API calls, data mapping, error transformation            | `contexts/{context}/infrastructure/`         |
| **Mapper**                    | Data transformation                     | API format to domain model conversion                    | `contexts/{context}/infrastructure/mappers/` |
| **View**                      | Page-level UI composition               | Client component, orchestrates UI                        | `ui/{context}/views/`                        |
| **Container**                 | Complex feature-specific UI logic       | Encapsulates related UI logic                            | `ui/{context}/containers/`                   |
| **Component**                 | Reusable UI elements                    | Presentational, feature-specific                         | `ui/{context}/components/`                   |
| **Hook**                      | Connect UI to services                  | React hook, state management, uses useMemo for services  | `ui/{context}/hooks/`                        |
| **Server Actions**            | Server-side operations                  | Form submissions, mutations                              | `ui/{context}/actions/`                      |
| **Store**                     | Local state management                  | Client-side state, caching                               | `ui/{context}/store/`                        |

## Dependency Injection Strategy

### Service Registration Patterns

#### Naming Convention

**Format**: `{context}.{layer}.{ServiceName}` or `{context}.{ServiceName}`

- `invoice.service` - Application service
- `invoice.repository` - Repository interface token
- `authentication.service` - Application service
- `profile.service` - Application service

#### Dependency Container Structure

The dependency container is located in `contexts/shared/dependency-container/`:

```
contexts/shared/dependency-container/
├── container.ts                    # Main container implementation
├── container.models.ts            # Type definitions
├── container.errors.ts             # Error types
├── containerConfiguration.ts       # Configuration builder
├── contexts/
│   └── {context}/
│       ├── {context}.config.json   # Service configuration (JSON)
│       └── {context}.services.ts   # Service registration
└── shared/
    ├── shared.config.json
    └── shared.services.ts
```

#### Service Configuration Pattern

**JSON Configuration** (`{context}.config.json`):

```json
{
  "{context}.repository": {
    "main": "{Technology}{Entity}Repository",
    "args": []
  },
  "{context}.service": {
    "main": "{Entity}Service",
    "args": ["{context}.repository"]
  },
  "{context}.actions": {
    "main": "{Entity}Actions"
  }
}
```

**Service Registration** (`{context}.services.ts`):

```typescript
export const {context}Services: ContainerServices = {
  tokens: {
    "{context}.repository": token<{Entity}Repository>("{context}.repository"),
    "{context}.service": token<{Entity}Service>("{context}.service"),
    "{context}.actions": token<{Entity}Actions>("{context}.actions"),
  },
  implementations: {
    {Technology}{Entity}Repository,
    {Entity}Service,
    {Entity}Actions
  },
  services: config,
};
```

#### Service Lifecycle

| Lifecycle     | When to Use                                  | Examples                                      |
| ------------- | -------------------------------------------- | --------------------------------------------- |
| **Singleton** | Infrastructure services, expensive to create | HTTP clients, Firebase instances              |
| **Transient** | Application services, stateless services     | Business logic services                       |
| **Scoped**    | Request-scoped, user context                 | Currently handled via React context providers |

#### Configuration Hierarchy

1. **Shared services** (infrastructure, common utilities)
2. **Context services** (domain, application layer)

### DI Usage in Hooks

**CRITICAL**: Hooks MUST retrieve services using `useMemo`, never at module level or in `useEffect`.

```typescript
// ✅ CORRECT: Service retrieved in useMemo
import { container } from "@/contexts/shared/dependency-container/container";
import { InvoiceService } from "@/contexts/invoice/application/invoice.service";
import { useMemo } from "react";

export const useInvoiceList = () => {
  const invoiceService = useMemo(
    () => container.get<InvoiceService>("invoice.service"),
    []
  );

  // Use service in callbacks...
};
```

```typescript
// ❌ WRONG: Module-level service initialization
const invoiceService = container.get<InvoiceService>("invoice.service"); // DON'T DO THIS

// ❌ WRONG: Service in useEffect
useEffect(() => {
  const service = container.get<InvoiceService>("invoice.service"); // DON'T DO THIS
}, []);
```

**Why**: Module-level initialization breaks React's lifecycle, makes testing difficult, and can cause memory leaks. `useMemo` ensures services are properly scoped to component lifecycle.

## Naming Conventions & File Organization

### File Naming Patterns

| Pattern                      | Purpose                             | Example                                                          |
| ---------------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| `*.service.ts`               | Application services                | `invoice.service.ts`                                             |
| `*.model.ts`                 | Domain models/entities              | `invoice.model.ts`, `profile.model.ts`                           |
| `*.repository.ts`            | Repository interfaces               | `invoice.repository.ts`                                          |
| `*{Technology}Repository.ts` | Repository implementations          | `httpInvoice.repository.ts`, `firebaseFileStorage.repository.ts` |
| `*.valueObject.ts`           | Value objects                       | `userId.valueObject.ts`                                          |
| `*.error.ts`                 | Domain errors (extends DomainError) | `userNotFound.error.ts`, `invoiceValidation.error.ts`            |
| `*.mapper.ts`                | Data mappers                        | `invoiceResponse.mapper.ts`                                      |
| `*View.tsx`                  | Page-level views                    | `invoiceDashboardView.tsx`                                       |
| `*Container.tsx`             | Feature containers                  | `invoiceCreateFormCard.tsx`                                      |
| `*Component.tsx`             | UI components                       | `invoiceStatusBadge.tsx`                                         |
| `use*.tsx`                   | React hooks                         | `useInvoiceList.tsx`                                             |
| `*.actions.ts`               | Server actions                      | `invoiceActions.ts`                                              |
| `*.store.ts`                 | State stores                        | `profileStore.ts`                                                |
| `*.module.css`               | CSS Modules                         | `invoiceDashboardView.module.css`                                |

### Folder Structure Rules

#### Contexts Structure

```
contexts/
├── {context}/
│   ├── application/
│   │   └── {entity}.service.ts
│   ├── domain/
│   │   ├── {entity}.model.ts
│   │   ├── {entity}.repository.ts
│   │   ├── valueObjects/
│   │   ├── services/
│   │   ├── interfaces/
│   │   └── errors/
│   └── infrastructure/
│       ├── http/
│       ├── firebase/
│       └── mappers/
└── shared/
    ├── domain/
    │   ├── valueObject/
    │   ├── criteria/
    │   ├── error/
    │   └── services/
    ├── infrastructure/
    └── dependency-container/
```

#### Application Layer

- **Location**: `contexts/{context}/application/`
- **Files**: `{entity}.service.ts`
- **Purpose**: Business operation orchestration

#### Domain Layer

- **Location**: `contexts/{context}/domain/`
- **Files**: Models, repository interfaces, value objects, domain services
- **Purpose**: Core business logic, domain rules

#### Infrastructure Layer

- **Location**: `contexts/{context}/infrastructure/`
- **Subfolders**: `http/`, `firebase/`, `mappers/`
- **Purpose**: External integrations, data access implementations

#### UI Structure

```
ui/
├── {context}/
│   ├── views/
│   │   └── {viewName}/
│   │       ├── {viewName}View.tsx
│   │       └── {viewName}View.module.css
│   ├── containers/
│   │   └── {containerName}/
│   │       ├── {containerName}.tsx
│   │       └── {containerName}.module.css
│   ├── components/
│   │   └── {componentName}/
│   │       ├── {componentName}.tsx
│   │       └── {componentName}.module.css
│   ├── hooks/
│   │   └── use{Feature}.tsx
│   ├── actions/
│   │   └── {entity}Actions.ts
│   ├── store/
│   │   └── {entity}Store.ts
│   └── utils/
└── shared/
    ├── components/
    ├── containers/
    ├── hooks/
    ├── providers/
    └── templates/
```

#### App Structure

```
app/
├── layout.tsx
├── template.tsx
├── providers.tsx
├── page.tsx
└── {route}/
    ├── page.tsx
    └── layout.tsx
```

### Class Naming Conventions

| Component Type                    | Naming Pattern                   | Examples                                                      |
| --------------------------------- | -------------------------------- | ------------------------------------------------------------- |
| **Models**                        | `{DomainConcept}`                | `Invoice`, `Profile`, `AuthUser`                              |
| **Value Objects**                 | `{ConceptName}`                  | `UserId`, `Email`, `Status`                                   |
| **Services**                      | `{Entity}Service`                | `InvoiceService`, `ProfileService`                            |
| **Repositories (Interface)**      | `{Entity}Repository`             | `InvoiceRepository`, `ProfileRepository`                      |
| **Repositories (Implementation)** | `{Technology}{Entity}Repository` | `HttpInvoiceRepository`, `FirebaseFileStorageRepository`      |
| **Mappers**                       | `{Entity}{Direction}Mapper`      | `InvoiceResponseMapper`, `InvoiceRequestMapper`               |
| **Views**                         | `{Feature}{View}View`            | `InvoiceDashboardView`, `InvoiceCreateView`                   |
| **Containers**                    | `{Feature}{Container}`           | `InvoiceCreateFormCard`, `InvoiceCounterpartyInformationCard` |
| **Components**                    | `{Feature}{Component}`           | `InvoiceStatusBadge`, `FileStatusBadge`                       |
| **Hooks**                         | `use{Feature}`                   | `useInvoiceList`, `useProfile`, `useAuth`                     |
| **Server Actions**                | `{Entity}Actions`                | `InvoiceActions`                                              |
| **Stores**                        | `{Entity}Store`                  | `ProfileStore`                                                |

## Data Flow Patterns

### Standard Data Flow

```
User Interaction → View → Hook → Application Service → Repository → API/External Service
     ↓              ↓      ↓            ↓                ↓
   UI Update    State   Loading    Domain Logic    Data Mapping
```

**Flow Steps**:

1. **User Interaction** → View component receives user action
2. **View** → Calls custom hook method
3. **Hook** → Retrieves service from dependency container, calls service method
4. **Application Service** → Orchestrates business logic, may call domain services
5. **Repository** → Makes external API call or accesses external service
6. **Mapper** → Transforms external data format to domain model
7. **Response** → Flows back through layers
8. **State Update** → Hook updates component state
9. **UI Update** → View re-renders with new data

### Server Actions Flow (Next.js)

```
Form Submission → Server Action → Application Service → Repository → API
     ↓                 ↓                ↓                ↓
   Validation      Server-side      Domain Logic    Data Mapping
```

**Flow Steps**:

1. **Form Submission** → Client component calls server action
2. **Server Action** → Executes on server, validates input
3. **Application Service** → Orchestrates business logic
4. **Repository** → Makes external API call
5. **Response** → Returns result to client
6. **UI Update** → Client component updates based on result

### Page to View Flow

```
Next.js Route → Page (Server) → View (Client) → Hooks → Services
     ↓              ↓               ↓            ↓
  Routing      Thin Wrapper    UI Composition  Business Logic
```

**Flow Steps**:

1. **Route** → Next.js App Router matches URL
2. **Page** → Server component (thin wrapper), renders View
3. **View** → Client component, composes containers and components
4. **Hooks** → Connect View to business logic
5. **Services** → Execute business operations

### Provider Pattern Flow

```
App Layout → Providers → Context Providers → Hooks → Services
     ↓           ↓              ↓              ↓
  Setup      Wraps App    Provides Context  Uses Context
```

**Flow Steps**:

1. **App Layout** → Sets up providers
2. **Providers** → Wraps application with context providers
3. **Context Providers** → Provides shared state/functionality
4. **Hooks** → Consume context, access services
5. **Services** → Execute business operations

## Error Handling Strategy

### Error Type Classification

| Error Type                | When to Use               | Handling Strategy                                           | Examples                                      |
| ------------------------- | ------------------------- | ----------------------------------------------------------- | --------------------------------------------- |
| **Domain Errors**         | Business rule violations  | Extend `DomainError`, thrown by domain/application services | `InvoiceValidationError`, `UserNotFoundError` |
| **Infrastructure Errors** | External system failures  | Transformed to domain errors in repositories                | `HttpRequestError` → `InvoiceNotFoundError`   |
| **Validation Errors**     | Input validation failures | Domain errors with field information                        | `InvalidEmailError`, `RequiredFieldError`     |
| **System Errors**         | Unexpected failures       | Logged, wrapped in generic domain error                     | Unhandled exceptions → `SystemError`          |

### Error Handling Guidelines

#### Domain Error Creation

**MUST**: All domain errors extend `DomainError` base class

```typescript
// ✅ CORRECT: Domain-specific error
export class InvoiceValidationError extends DomainError {
  constructor(
    public readonly field: string,
    public readonly code: string,
    message: string
  ) {
    super(message);
  }
}

// ❌ WRONG: Generic Error
throw new Error("errors.validation.requiredFieldsMissing");
```

**Guidelines**:

- [ ] Extend `DomainError` from `contexts/shared/domain/error/domain.error.ts`
- [ ] Include localized message keys (e.g., `errors.invoice.validationFailed`)
- [ ] Include context information (field names, entity IDs, etc.)
- [ ] Thrown by domain services and application services
- [ ] Never throw generic `Error` in domain/application layers

#### Application Service Error Handling

**MUST**: All services return `Result<T>` pattern

```typescript
// ✅ CORRECT: Service returns Result
export class InvoiceService {
  async createInvoice(data: CreateInvoiceData): Promise<Result<Invoice>> {
    const result = new Result<Invoice>();

    try {
      // Validate using domain service (throws domain errors)
      this.validationService.validateInvoiceData(data);

      // Business logic
      const invoice = await this.repository.createInvoice(data);

      return result
        .setData(invoice)
        .addMessage("invoice.created")
        .setStatusCode(200);
    } catch (error) {
      // Map domain errors to Result
      if (error instanceof InvoiceValidationError) {
        return result.addError(error.code).setStatusCode(400);
      }

      // Map infrastructure errors
      if (error instanceof HttpRequestError) {
        return result
          .addError(`errors.api.${error.statusCode}`)
          .setStatusCode(error.statusCode);
      }

      // Unknown errors
      return result
        .addError("errors.invoice.creationFailed")
        .setStatusCode(500);
    }
  }
}
```

#### Repository Error Handling

**MUST**: Transform infrastructure errors to domain errors

```typescript
// ✅ CORRECT: Centralized error handling
export class HttpInvoiceRepository implements InvoiceRepository {
  async createInvoice(invoice: Invoice): Promise<Invoice> {
    const result = await this.httpClient.postWithResult<
      Invoice,
      CreateInvoiceData
    >(INVOICE_ENDPOINTS.CREATE_BY_BUYER, this.mapToApiFormat(invoice), {
      headers: INVOICE_HEADERS.JSON_CONTENT,
    });

    return this.handleResult(result, (data) => InvoiceMapper.toDomain(data));
  }

  private handleResult<T, R>(result: Result<T>, mapper: (data: T) => R): R {
    if (result.statusCode >= 200 && result.statusCode < 300 && result.data) {
      return mapper(result.data);
    }

    // Transform HTTP errors to domain errors
    if (result.statusCode === 404) {
      throw new InvoiceNotFoundError(result.message.join(", "));
    }

    if (result.statusCode === 400) {
      throw new InvoiceValidationError(
        "request",
        "errors.invoice.invalidRequest",
        result.message.join(", ")
      );
    }

    throw new HttpRequestError(
      result.statusCode,
      result.message.join(", "),
      result.data
    );
  }
}
```

#### Hook Error Handling

**MUST**: Extract errors from Result objects

```typescript
// ✅ CORRECT: Handle Result pattern
export const useInvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const invoiceService = useMemo(
    () => container.get<InvoiceService>("invoice.service"),
    []
  );

  const fetchInvoices = useCallback(
    async (criteria: Criteria) => {
      try {
        setLoading(true);
        setError(null);

        const result = await invoiceService.filter(criteria);

        if (
          result.statusCode >= 200 &&
          result.statusCode < 300 &&
          result.data
        ) {
          setInvoices(result.data);
        } else {
          // Extract error from Result
          const errorMessage =
            result.errors?.[0] || result.message[0] || "errors.api.fetchFailed";
          setError(errorMessage);
        }
      } catch (err) {
        // Handle thrown domain errors
        const errorMessage =
          err instanceof DomainError ? err.message : "errors.api.fetchFailed";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [invoiceService]
  );

  return { invoices, error, loading, refresh: fetchInvoices };
};
```

#### React Error Boundaries

**MUST**: Implement error boundaries for feature-level error recovery

```typescript
// ✅ CORRECT: Feature-level error boundary
export class InvoiceErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to monitoring service
    console.error("Invoice feature error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <InvoiceErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

**Usage**:

```typescript
// Wrap feature views in error boundary
<InvoiceErrorBoundary>
  <InvoiceDashboardView />
</InvoiceErrorBoundary>
```

### Localization Strategy

**Guideline**: ALL messages (success and error) MUST use localization

- Separate message files by language
- Service-based translation via `InternationalizationService`
- Context-aware error messages
- Fallback to default language
- Use translation keys (e.g., `errors.invoice.notFound`)

## State Management Strategy

### State Management Patterns

| Pattern                     | When to Use                    | Location              | Examples                         |
| --------------------------- | ------------------------------ | --------------------- | -------------------------------- |
| **React State**             | Component-local state          | Component/Hook        | Form inputs, UI toggles          |
| **React Context**           | Shared state across components | Provider              | Auth state, internationalization |
| **Custom Hooks**            | Reusable stateful logic        | `ui/{context}/hooks/` | `useInvoiceList`, `useProfile`   |
| **Store (Zustand/Context)** | Feature-specific caching       | `ui/{context}/store/` | `ProfileStore`                   |
| **Server State**            | Data from API                  | Service + Hook        | Invoice data, profile data       |

### State Management Guidelines

#### Component State

- Use `useState` for local component state
- Use `useReducer` for complex local state logic
- Keep state as close to where it's used as possible

#### Shared State via Context

- Use React Context for application-wide state (auth, i18n)
- Create providers in `ui/shared/providers/`
- Consume via custom hooks (e.g., `useAuth`, `useInternationalization`)

#### Feature State via Store

- Use stores (Zustand, Context API) for feature-specific state
- Store in `ui/{context}/store/`
- Use for caching and cross-component state sharing within a feature

#### Server State

- **Recommended**: Use React Query or SWR for server state management
- Fetch data via services in hooks
- Manage loading/error states in hooks
- Cache handled by React Query/SWR
- Only use stores for complex client-side state that needs persistence

**Example with React Query**:

```typescript
export const useInvoiceList = (criteria: Criteria) => {
  const invoiceService = useMemo(
    () => container.get<InvoiceService>("invoice.service"),
    []
  );

  return useQuery({
    queryKey: ["invoices", criteria],
    queryFn: async () => {
      const result = await invoiceService.filter(criteria);
      if (result.statusCode >= 200 && result.statusCode < 300 && result.data) {
        return result.data;
      }
      throw new Error(result.errors?.[0] || "Failed to fetch invoices");
    },
    staleTime: 30000,
  });
};
```

## Testing Strategy

### Unit Testing Guidelines

**Focus**: Domain logic, value objects, business rules, validation, services
**Tools**: Jest, React Testing Library

**Key Principles**:

- Test domain logic in isolation
- Mock external dependencies (repositories, APIs)
- Test business rules and invariants
- Cover edge cases and error conditions
- Fast execution

### Component Testing Guidelines

**Focus**: UI components, user interactions, rendering
**Tools**: Jest, React Testing Library

**Key Principles**:

- Test user interactions
- Test rendering with different props
- Test error states
- Test loading states
- Use accessibility queries

### Integration Testing Guidelines

**Focus**: Hook + Service integration, data flow
**Tools**: Jest, React Testing Library

**Key Principles**:

- Test hooks with mocked services
- Test data flow through layers
- Test error propagation
- Test state updates

## Project Initialization

### Quick Start Checklist

Before implementing features, ensure your project has the following foundation:

1. **Initialize Next.js Project**

   - Create Next.js project with TypeScript and App Router
   - Configure path aliases (`@/` mapping)
   - Set up environment variables

2. **Install Core Dependencies**

   - Next.js, React, TypeScript
   - React Query for server state management
   - Testing tools (Jest, React Testing Library)
   - Linting tools (ESLint, Prettier)

3. **Set Up Core Infrastructure**

   - Copy core infrastructure from template (see [PROJECT_SETUP.md](./PROJECT_SETUP.md))
   - Implement `Result<T>` class
   - Implement `DomainError` base class and error types
   - Set up dependency injection container
   - Configure HTTP client

4. **Configure Development Environment**

   - Set up ESLint and Prettier
   - Configure TypeScript paths
   - Create environment variable templates

5. **Set Up Application Structure**

   - Create `app/` structure (layout, providers, pages)
   - Create `contexts/` structure (shared domain, infrastructure)
   - Create `ui/` structure (shared providers, components)

6. **Verify Setup**
   - Test dependency container registration
   - Verify HTTP client configuration
   - Test error handling flow

**For detailed step-by-step instructions, see [PROJECT_SETUP.md](./PROJECT_SETUP.md).**

**For working implementations of all core infrastructure, see the [template/](../template/) folder.**

### Core Infrastructure Requirements

The following shared components must be implemented before building features:

#### Domain Layer (`contexts/shared/domain/`)

- **Result<T>** (`result.ts`)

  - Generic result wrapper for service responses
  - Methods: `setData()`, `addMessage()`, `addError()`, `setStatusCode()`
  - Properties: `data`, `message[]`, `errors[]`, `statusCode`

- **DomainError** (`error/domain.error.ts`)

  - Base class for all domain errors
  - Extends `Error` with support for error codes and context
  - All domain errors must extend this class

- **Error Types** (`error/`)

  - `HttpRequestError`: HTTP-specific errors
  - `PageError`: Page-level errors for error boundaries
  - Additional domain-specific errors as needed

- **Criteria** (`criteria/criteria.ts`)
  - Interface/class for filtering and pagination
  - Used for query building in repositories

#### Infrastructure Layer (`contexts/shared/infrastructure/`)

- **HttpClient** (`http/httpClient.ts`)
  - HTTP client interface and implementation
  - Methods: `getWithResult()`, `postWithResult()`, `putWithResult()`, `deleteWithResult()`
  - Returns `Result<T>` for all operations
  - Handles error transformation

#### Dependency Injection (`contexts/shared/dependency-container/`)

- **Container** (`container.ts`)

  - Main dependency injection container
  - Methods: `get<T>()`, `register()`, `configure()`
  - Supports singleton and transient lifecycles

- **Configuration** (`containerConfiguration.ts`, `*.config.json`)
  - Service configuration builder
  - JSON-based service registration
  - Service registration files per context

### Implementation Notes

- All core infrastructure implementations are available in the [template/](../template/) folder
- Copy implementations from template rather than creating from scratch
- Follow the patterns defined in this architecture document
- Ensure all implementations follow TypeScript strict mode
- Include proper error handling and type safety

### Next Steps

After setting up core infrastructure:

1. Review [Code Generation Guidelines](#code-generation-guidelines) for implementation patterns
2. Create your first context following the folder structure guidelines
3. Implement a simple feature to validate the architecture setup
4. Refer to templates in this document and the template folder for working examples

## Code Generation Guidelines

**Note**: For working implementations of all patterns described below, see the [template/](../template/) folder. The templates in this section serve as reference patterns for code generation.

### Implementation Templates

#### Application Service Template

```typescript
import { {Entity}Repository } from "../domain/{entity}.repository";
import { {Entity} } from "../domain/{entity}.model";
import { Result } from "../../shared/domain/result";
import { DomainError } from "../../shared/domain/error/domain.error";

export class {Entity}Service {
  constructor(private readonly {entity}Repository: {Entity}Repository) {}

  async {operation}(params: {ParamsType}): Promise<Result<{ReturnType}>> {
    const result = new Result<{ReturnType}>();

    try {
      // 1. Validate input using domain services (throws domain errors)
      // this.validationService.validate(params);

      // 2. Execute business logic
      const data = await this.{entity}Repository.{method}(params);

      // 3. Return success result
      return result
        .setData(data)
        .addMessage('{entity}.{operation}.success')
        .setStatusCode(200);
    } catch (error) {
      // 4. Map errors to Result
      if (error instanceof DomainError) {
        return result
          .addError(error.message)
          .setStatusCode(400);
      }

      // Infrastructure errors
      return result
        .addError('errors.{entity}.{operation}Failed')
        .setStatusCode(500);
    }
  }
}
```

#### Repository Interface Template

```typescript
import { {Entity} } from "./{entity}.model";

export interface {Entity}Repository {
  {method}(params: {ParamsType}): Promise<{ReturnType}>;
  // ... other methods
}
```

#### Repository Implementation Template

```typescript
import { {Entity}Repository } from "../domain/{entity}.repository";
import { {Entity} } from "../domain/{entity}.model";
import { {Entity}Mapper } from "./mappers/{entity}Mapper";
import { Result } from "../../../shared/domain/result";
import { HttpRequestError } from "../../../shared/domain/error/httpRequestError.error";
import { {Entity}NotFoundError } from "../domain/errors/{entity}NotFound.error";

export class Http{Entity}Repository implements {Entity}Repository {
  constructor(private readonly httpClient: HttpClient) {}

  async {method}(params: {ParamsType}): Promise<{ReturnType}> {
    const result = await this.httpClient.getWithResult<{ApiType}>('/api/{entity}', {
      params: this.mapToApiParams(params)
    });

    return this.handleResult(result, (data) =>
      {Entity}Mapper.toDomain(data)
    );
  }

  private handleResult<T, R>(
    result: Result<T>,
    mapper: (data: T) => R
  ): R {
    if (result.statusCode >= 200 && result.statusCode < 300 && result.data) {
      return mapper(result.data);
    }

    // Transform HTTP errors to domain errors
    if (result.statusCode === 404) {
      throw new {Entity}NotFoundError(result.message.join(', '));
    }

    if (result.statusCode === 400) {
      throw new {Entity}ValidationError('request', 'errors.{entity}.invalidRequest', result.message.join(', '));
    }

    throw new HttpRequestError(result.statusCode, result.message.join(', '), result.data);
  }

  private mapToApiParams(params: {ParamsType}): Record<string, any> {
    // Map domain params to API format
    return params;
  }
}
```

#### Hook Template

```typescript
"use client"
import { useState, useCallback, useMemo } from 'react';
import { container } from '@/contexts/shared/dependency-container/container';
import { {Entity}Service } from '@/contexts/{context}/application/{entity}.service';
import { {Entity} } from '@/contexts/{context}/domain/{entity}.model';
import { DomainError } from '@/contexts/shared/domain/error/domain.error';

interface Use{Entity}{Operation}Return {
  data: {Entity} | null;
  loading: boolean;
  error: string | null;
  {operation}: (params: {ParamsType}) => Promise<void>;
}

export const use{Entity}{Operation} = (): Use{Entity}{Operation}Return => {
  const [data, setData] = useState<{Entity} | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ CORRECT: Service retrieved in useMemo
  const {entity}Service = useMemo(() => (
    container.get<{Entity}Service>('{context}.service')
  ), []);

  const {operation} = useCallback(async (params: {ParamsType}) => {
    try {
      setLoading(true);
      setError(null);

      // Service returns Result<T>
      const result = await {entity}Service.{operation}(params);

      // Extract data from Result
      if (result.statusCode >= 200 && result.statusCode < 300 && result.data) {
        setData(result.data);
      } else {
        // Extract error from Result
        const errorMessage = result.errors?.[0] || result.message[0] || 'errors.{context}.{operation}Failed';
        setError(errorMessage);
      }
    } catch (err) {
      // Handle thrown domain errors
      const errorMessage = err instanceof DomainError
        ? err.message
        : 'errors.{context}.{operation}Failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [{entity}Service]);

  return { data, loading, error, {operation} };
};
```

#### View Template

```typescript
"use client";

import { use{Entity}{Operation} } from '../hooks/use{Entity}{Operation}';
import { useInternationalizationContext } from '@/ui/shared/providers/internationalizationProvider';
import styles from './{viewName}View.module.css';

export const {Entity}{View}View = () => {
  const { t } = useInternationalizationContext();
  const { data, loading, error, {operation} } = use{Entity}{Operation}();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{t(error, 'errors')}</div>;
  }

  return (
    <div className={styles.container}>
      {/* View content */}
    </div>
  );
};
```

#### Page Template

```typescript
// ✅ CORRECT: Page calls server action, not service directly
import { {Entity}{View}View } from '@/ui/{context}/views/{viewName}/{viewName}View';
import { get{Entity}Detail } from './actions';

type PageProps = { params: { id: string } };

export default async function {Entity}Page({ params }: PageProps) {
  // Call server action for data fetching
  const {entity} = await get{Entity}Detail(params.id);

  return <{Entity}{View}View {entity}={entity} />;
}
```

#### Server Actions Template

```typescript
// app/{route}/actions.ts
"use server";

import { container } from '@/contexts/shared/dependency-container/container';
import { {Entity}Service } from '@/contexts/{context}/application/{entity}.service';
import { PageError } from '@/contexts/shared/domain/error/pageError.error';

export async function get{Entity}Detail(id: string) {
  const {entity}Service = container.get<{Entity}Service>('{context}.service');

  try {
    const result = await {entity}Service.findDetailById(id);

    if (result.statusCode >= 200 && result.statusCode < 300 && result.data) {
      return result.data;
    }

    throw new PageError('{Entity} not found');
  } catch (error) {
    // Transform to PageError for error boundary
    if (error instanceof PageError) {
      throw error;
    }
    throw new PageError('Failed to load {entity}');
  }
}
```

#### Container Template

```typescript
"use client";

import styles from './{containerName}.module.css';

interface {Container}Props {
  // Props definition
}

export const {Container} = ({ ...props }: {Container}Props) => {
  // Container logic

  return (
    <div className={styles.container}>
      {/* Container content */}
    </div>
  );
};
```

#### Component Template

```typescript
"use client";

import styles from './{componentName}.module.css';

interface {Component}Props {
  // Props definition
}

export const {Component} = ({ ...props }: {Component}Props) => {
  return (
    <div className={styles.component}>
      {/* Component content */}
    </div>
  );
};
```

---

This documentation provides comprehensive architectural guidelines for building maintainable, scalable Next.js frontend applications using Clean Architecture and Hexagonal Architecture patterns. It serves as a reference for AI development tools and human developers to make informed architectural decisions.
