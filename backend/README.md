# Backend

## Architecture Overview

This folder contains the backend code for our application. The architecture is organized to separate concerns and follow the principles of clean architecture.

![Snowpact architecture](clean-architecture-schema.jpg)

### Directory Structure

```bash
src/
├── application                    # Core business logic
│   ├── errors                  # Domain-specific error definitions
│   ├── services                # Business services (reusable logic)
│   └── useCases                # Use cases (specific application logic)
├── domain                    # Core business logic
│   ├── entities                # Domain entities and value objects
│   └── interfaces             # Interfaces and adapters
├── entrypoints             # Application entry points
│   ├── api                     # API and routes
│   └── ...                     # ... can be jobs, queues consumer, cli...
├── gateways                # Gateways interface adapter to interact with external services
│   ├── repositories            # Repositories for data persistence
│   ├── logger                  # Logging service
│   ├── cache                   # Cache database
│   └── helpers                 # Helpers for gateways and entrypoints
│      ├── database                 # Helpers for gateways and entrypoints
│      ├── mailer                  # Email sending service
│      └── ...                     # Can be other services
├── config          # Everything that wires the application, configuration
│   ├── config                  # Configuration files
│   ├── di                      # Dependency injection setup
│   ├── sdkGenerator            # SDK generation scripts
│   └── tests                   # Test helpers and configuration
└── utils                   # Utility tools and functions
```

## API Naming Convention

### Route and URL naming

For API routes and URLs, we use the following conventions:

| Description        | Route Name             | URL Path                   |
| ------------------ | ---------------------- | -------------------------- |
| Login request      | `authLogin`            | `/auth/login`              |
| Signup request     | `authSignup`           | `/auth/signup`             |
| Ask password reset | `authAskPasswordReset` | `/auth/ask-password-reset` |
| Update profile     | `userUpdateProfile`    | `/user/update-profile`     |
| Delete product     | `productDelete`        | `/product/delete`          |
| Get user profile   | `userGetProfile`       | `/user/profile`            |
| Create product     | `productCreate`        | `/product/create`          |
| List orders        | `orderList`            | `/order/list`              |
| Update settings    | `settingsUpdate`       | `/settings/update`         |

Route naming convention: `<logic><2-3 words description>`
URL path convention: `/<logic>/<action>`

### Route authorization

Routes are prefixed with one of the following authorization levels:

- `admin`: Only accessible by administrators
- `internal`: For internal system use only (auth withapi key, webhooks, ...)
- `protected`: Requires user authentication
- `public`: Accessible without authentication
