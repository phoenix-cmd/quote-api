// const Router = require('koa-router')
// const api = new Router()

// const method = require('../methods')

// const apiHandle = async (ctx) => {
//   const methodWithExt = ctx.params[0].match(/(.*).(png|webp)/)
//   if (methodWithExt) ctx.props.ext = methodWithExt[2]
//   ctx.result = await method(methodWithExt ? methodWithExt[1] : ctx.params[0], ctx.props)
// }

// api.post('/', apiHandle)

// module.exports = api
const Router = require('koa-router')
const api = new Router()

const method = require('../methods')

const apiHandle = async (ctx) => {
  const rawPath = ctx.path.replace(/^\//, '') // strip leading slash
  const methodMatch = rawPath.match(/(.*?)(\.(png|webp))?$/)

  const selectedMethod = methodMatch[1] || 'generate'  // fallback to "generate"
  const ext = methodMatch[3] || 'png'

  ctx.props = ctx.request.body || {}
  ctx.props.ext = ext

  ctx.result = await method(selectedMethod, ctx.props)
}

api.post('/', apiHandle)                 // supports JSON method dispatch
api.post('/:method', apiHandle)          // supports /generate.png and others

module.exports = api
