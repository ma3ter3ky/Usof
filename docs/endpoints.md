# Endpoint Access Matrix

| Endpoint                       | Method | Public | Auth | Admin | Status      |
| ------------------------------ | ------ | ------ | ---- | ----- | ----------- |
| /api/users                     | GET    | ❌     | ✅   | ❌    | Skeleton    |
| /api/users/:id                 | GET    | ❌     | ✅   | ❌    | Skeleton    |
| /api/users                     | POST   | ❌     | ✅   | ✅    | Skeleton    |
| /api/users/:id                 | PATCH  | ❌     | ✅   | ❌    | Skeleton    |
| /api/users/:id                 | DELETE | ❌     | ✅   | ✅    | Skeleton    |
| /api/users/avatar              | PATCH  | ❌     | ✅   | ❌    | Skeleton    |
| /api/categories                | GET    | ✅     | ❌   | ❌    | Skeleton    |
| /api/categories/:id            | GET    | ✅     | ❌   | ❌    | Skeleton    |
| /api/categories                | POST   | ❌     | ✅   | ✅    | Skeleton    |
| /api/categories/:id            | PATCH  | ❌     | ✅   | ✅    | Skeleton    |
| /api/categories/:id            | DELETE | ❌     | ✅   | ✅    | Skeleton    |
| /api/posts/:id/status          | PATCH  | ❌     | ✅   | ✅    | Implemented |
| /api/comments/:id/status       | PATCH  | ❌     | ✅   | ✅    | Implemented |
| /api/posts/:post_id/like       | GET    | ❌     | ✅   | ✅    | Implemented |
| /api/comments/:comment_id/like | GET    | ❌     | ✅   | ✅    | Implemented |
| /admin                         | GET    | ❌     | ✅   | ✅    | Mounted     |

## `/api/posts` list helpers

| Query param   | Type          | Description                                                                                      |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| `page`        | integer       | 1-based page index, defaults to 1.                                                               |
| `limit`       | integer       | Page size (max 100).                                                                             |
| `author_id`   | integer       | Return posts authored by the specified user.                                                     |
| `categories`  | string CSV    | Comma separated category ids; matches posts that belong to any of them.                          |
| `statuses`    | string CSV    | Comma separated list of statuses (`active`, `inactive`). Only admins may request inactive posts. |
| `from` / `to` | ISO date-time | Filter by `created_at` range (inclusive).                                                        |
| `sort`        | enum          | `date` (default) or `likes`. `likes` sorts by rating and then newest posts for ties.             |
| `direction`   | enum          | `asc` or `desc` for the selected sort column.                                                    |
