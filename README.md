### ✅Requirements

### Allowed stack

- **Language/Framework/DB:** JavaScript, **Node.js + Express**, **MySQL (relational)**.&#x20;

### Architecture & quality constraints

- **Architecture:** MVC; code in **OOP** style with **SOLID** principles.&#x20;
- **Admin panel:** must exist and be **accessible only to admins** (open-source panel allowed, e.g. AdminJS).&#x20;
- **Role-based access:** at least two roles — `user` and `admin`; endpoints must enforce permissions.&#x20;
- **Error handling:** responses must be **informative and useful**; follow HTTP status references (MDN).
- **Style guides to follow:** JavaScript conventions & best practices, Node.js best practices, SQL style guide (links in PDF).&#x20;

### Data & storage

- **Database lifecycle:** DB must be **created (and recreated if necessary) on initialization** of the solution.&#x20;
- **Seed data:** fill DB with **at least 5 records per table**.&#x20;
- **Files:** store user photos and other files in the **server’s local filesystem**.&#x20;

### Core functionality (Act: Basic)

- **Auth flows:** register, log in, log out, reset password. **Only users with confirmed email can sign in** (email must be verified and belong to the user; a **unique confirmation link** is suggested).
- **Users (admin panel + API):** admin can **create user/admin**, **see all profiles**, **update profile data**, **delete**.&#x20;
- **Posts:** create; **visibility** rules — users see **active posts of others** and **their own inactive**; admin sees **all**. Admin may **change category** or **set active/inactive**; **content is NOT editable by admin**. Delete allowed.&#x20;
- **Categories:** full CRUD.&#x20;
- **Comments:** create, see for a post, **change status active/inactive**; **content not editable by admin**; delete.&#x20;
- **Likes:** exactly **one like/dislike per user per target** (post or comment); view likes; delete own like.&#x20;
- **User rating:** **automatic** = likes minus dislikes across the user’s posts and comments.&#x20;

### Lists, sorting, filtering, pagination

- **Sorting (required):** by **number of likes** (default) and by **date**.&#x20;
- **Filtering (required):** by **categories**, **date interval**, **status**.&#x20;
- **Pagination:** implement for `/api/posts` when posts are many (page size is up to you).&#x20;

### Locking (must-have feature)

- Implement **locking for posts and comments** (locked items block interactions as appropriate).&#x20;

### Entities (minimum fields)

- **User:** login (unique), password (stored securely), full name (validate), email (verify it’s real & belongs to user), profile picture, **rating (auto)**, role (`user`/`admin`, admin can change).&#x20;
- **Post:** author, title, publish date, **status (active/inactive)**, content (images recommended), **categories (many-to-many)**.&#x20;
- **Category:** title, description.&#x20;
- **Comment:** author, publish date, content.&#x20;
- **Like:** author, publish date, **post/comment id**, **type (like|dislike)**.
- You **may add fields/entities** if needed — be ready to justify.&#x20;

### Endpoint expectations (reference structure)

- The PDF provides a **possible** endpoint map for **auth, users, posts, categories, comments**; you may adjust, but **be ready to explain**. Ensure `/api/posts` is public with pagination; **auth login requires confirmed email**; **post update is only by its creator**; likes endpoints for posts and comments; categories CRUD; comment CRUD incl. like sub-routes.&#x20;

### Documentation & assessment requirements

- Keep documentation during development; **README must include**: short description, **screenshots**, **requirements & dependencies**, **how to run** (clone → install → launch).&#x20;
- Provide fuller docs (format of your choice) describing **progress after each CBL stage** and the **algorithm/flow** of the program. Peers will assess this stage. Helpful links for README/Docs provided in PDF.&#x20;

### Creative features (optional, after Basic)

- TODO
