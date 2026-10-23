/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { ok: true, service: 'medoc-vibes-api', version: '0.1.0' }
})

/**
 * Public read API (OpenAPI / contracts) — base path /v1
 */
router
  .group(() => {
    router.get('feed/around', [controllers.Feed, 'around'])
    router.get('feed/around/count', [controllers.Feed, 'aroundCount'])
  })
  .prefix('/v1')

/**
 * Scaffold auth (starter kit) — kept under /api/v1; not part of OpenAPI read contracts.
 */
router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
