# Backend

## Architecture Overview

This folder contains the backend code for our application. The architecture is organized to separate concerns and follow the principles of hexagonal architecture.

### Directory Structure

```bash
backend/
├── src/
│ ├── application/      # Application logic
│ │ ├── entities/           # Entities and value objects
│ │ ├── errors/             # Error handling
│ │ ├── serializers/        # Data serializers
│ │ ├── services/           # Business service implementations
│ │ └── useCases/           # Use case implementations
│ ├── infrastructure/   # Infrastructure and technical details
│ │ ├── config/             # Configuration files
│ │ ├── database/           # Database-related code (schema, migrations)
│ │ ├── di/                 # Dependency injection setup
│ │ ├── http/               # HTTP routes, middlewares, schemas
│ │ ├── repositories/       # Repository implementations
│ │ └── services/           # Infrastructure services (e.g., email, logging)
│ ├── utils/            # Utility tools
│ └── tests/            # Test helpers and setup
```


## API Naming Convention

For API routes, we use the following naming convention:

`<business><2-3 words description>`

### Examples:

1. **Login request**: `authLogin`
2. **Signup request**: `authSignup`
3. **Ask password reset**: `authAskPasswordReset`
4. **Update profile**: `userUpdateProfile`
5. **Delete product**: `productDelete`
