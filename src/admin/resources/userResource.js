import { createResource } from './factory.js'

const HIDDEN_PASSWORD_VISIBILITY = {
  list: false,
  filter: false,
  show: false,
  edit: false
}

const READONLY_VISIBILITY = {
  list: true,
  filter: true,
  show: true,
  edit: false
}

export default function makeUserResource(knex) {
  const resource = createResource(knex, 'users')

  return {
    resource,
    options: {
      properties: {
        id: {
          isVisible: READONLY_VISIBILITY
        },
        password_hash: {
          isVisible: HIDDEN_PASSWORD_VISIBILITY
        },
        email_verified: {
          type: 'boolean'
        },
        created_at: {
          isVisible: READONLY_VISIBILITY
        },
        updated_at: {
          isVisible: READONLY_VISIBILITY
        }
      }
    }
  }
}
