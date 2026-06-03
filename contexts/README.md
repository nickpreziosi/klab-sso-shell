# Contexts layer

Business logic for the SSO shell, organized by bounded context. See [docs/architecture.md](../docs/architecture.md).

| Context | Path | Notes |
| --- | --- | --- |
| Shared | `contexts/shared/` | `DomainError`, `Result`, Firebase web app bootstrap |
| User management | `contexts/user-management/auth/` | Firebase auth gateway + session/sign-in services |

React providers live under `ui/`, not here. Application services should return `Result<T>` for new code; existing auth services throw domain errors until migrated.
