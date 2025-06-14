// const logger = require('koa-logger')
// const responseTime = require('koa-response-time')
// const bodyParser = require('koa-bodyparser')
// const ratelimit = require('koa-ratelimit')
// const Router = require('koa-router')
// const Koa = require('koa')

// const app = new Koa()

// app.use(logger())
// app.use(responseTime())
// app.use(bodyParser())

// const ratelimitВb = new Map()

// app.use(ratelimit({
//   driver: 'memory',
//   db: ratelimitВb,
//   duration: 1000 * 55,
//   errorMessage: {
//     ok: false,
//     error: {
//       code: 429,
//       message: 'Rate limit exceeded. See "Retry-After"'
//     }
//   },
//   id: (ctx) => ctx.ip,
//   headers: {
//     remaining: 'Rate-Limit-Remaining',
//     reset: 'Rate-Limit-Reset',
//     total: 'Rate-Limit-Total'
//   },
//   max: 20,
//   disableHeader: false,
//   whitelist: (ctx) => {
//     return ctx.query.botToken === process.env.BOT_TOKEN
//   },
//   blacklist: (ctx) => {
//   }
// }))

// app.use(require('./helpers').helpersApi)

// const route = new Router()

// const routes = require('./routes')

// route.use('/*', routes.routeApi.routes())

// app.use(route.routes())

// const port = process.env.PORT || 3000

// app.listen(port, () => {
//   console.log('Listening on localhost, port', port)
// })
require('dotenv').config({ path: './.env' })

const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const responseTime = require('koa-response-time')
const bodyParser = require('koa-bodyparser')
const ratelimit = require('koa-ratelimit')

const app = new Koa()

app.use(logger())
app.use(responseTime())
app.use(bodyParser())

const ratelimitDb = new Map()

app.use(ratelimit({
  driver: 'memory',
  db: ratelimitDb,
  duration: 1000 * 55,
  errorMessage: {
    ok: false,
    error: {
      code: 429,
      message: 'Rate limit exceeded. See "Retry-After"'
    }
  },
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 20,
  disableHeader: false,
  whitelist: (ctx) => ctx.query.botToken === process.env.BOT_TOKEN,
  blacklist: () => false
}))

// Your existing helpers middleware
app.use(require('./helpers').helpersApi)

// Your existing routes
const route = new Router()

const routes = require('./routes')

// Add a simple root route for health checks
route.get('/', ctx => {
  ctx.body = { ok: true, message: 'Quote API running' }
})

// Use your main API routes
route.use('/*', routes.routeApi.routes())

app.use(route.routes())

const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`)
})
