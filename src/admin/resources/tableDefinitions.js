export const TABLE_DEFINITIONS = {
  users: {
    primaryKey: 'id',
    properties: [
      { path: 'id', type: 'number', isId: true },
      { path: 'login', type: 'string' },
      { path: 'password_hash', type: 'password' },
      { path: 'full_name', type: 'string' },
      { path: 'email', type: 'string' },
      { path: 'email_verified', type: 'boolean' },
      { path: 'profile_picture', type: 'string' },
      { path: 'rating', type: 'number' },
      { path: 'role', type: 'string' },
      { path: 'created_at', type: 'datetime' },
      { path: 'updated_at', type: 'datetime' }
    ]
  },
  categories: {
    primaryKey: 'id',
    properties: [
      { path: 'id', type: 'number', isId: true },
      { path: 'name', type: 'string' },
      { path: 'slug', type: 'string' },
      { path: 'created_at', type: 'datetime' },
      { path: 'updated_at', type: 'datetime' }
    ]
  },
  posts: {
    primaryKey: 'id',
    properties: [
      { path: 'id', type: 'number', isId: true },
      { path: 'author_id', type: 'number' },
      { path: 'title', type: 'string' },
      { path: 'body', type: 'textarea' },
      { path: 'status', type: 'string' },
      { path: 'is_locked', type: 'boolean' },
      { path: 'published_at', type: 'datetime' },
      { path: 'created_at', type: 'datetime' },
      { path: 'updated_at', type: 'datetime' }
    ]
  },
  comments: {
    primaryKey: 'id',
    properties: [
      { path: 'id', type: 'number', isId: true },
      { path: 'post_id', type: 'number' },
      { path: 'author_id', type: 'number' },
      { path: 'body', type: 'textarea' },
      { path: 'status', type: 'string' },
      { path: 'is_locked', type: 'boolean' },
      { path: 'created_at', type: 'datetime' },
      { path: 'updated_at', type: 'datetime' }
    ]
  },
  likes: {
    primaryKey: 'id',
    properties: [
      { path: 'id', type: 'number', isId: true },
      { path: 'author_id', type: 'number' },
      { path: 'target_type', type: 'string' },
      { path: 'target_id', type: 'number' },
      { path: 'value', type: 'number' },
      { path: 'created_at', type: 'datetime' },
      { path: 'updated_at', type: 'datetime' }
    ]
  },
  password_reset_tokens: {
    primaryKey: 'id',
    properties: [
      { path: 'id', type: 'number', isId: true },
      { path: 'user_id', type: 'number' },
      { path: 'token', type: 'string' },
      { path: 'expires_at', type: 'datetime' },
      { path: 'created_at', type: 'datetime' }
    ]
  },
  email_verification_tokens: {
    primaryKey: 'id',
    properties: [
      { path: 'id', type: 'number', isId: true },
      { path: 'user_id', type: 'number' },
      { path: 'token', type: 'string' },
      { path: 'expires_at', type: 'datetime' },
      { path: 'created_at', type: 'datetime' }
    ]
  }
}
