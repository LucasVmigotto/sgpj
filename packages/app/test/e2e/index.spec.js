import { resolve } from 'path'
import test from 'ava'
import { Nuxt, Builder } from 'nuxt'

let nuxt = null

test.before(async () => {
  const config = {
    dev: false,
    rootDir: resolve(__dirname, '../../')
  }
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.server.listen(4000, 'localhost')
}, 30000)

test('Route / exits and render HTML', async (t) => {
  const { html } = await nuxt.renderRoute('/', {})
  t.true(html.includes('Sistema Gerenciador de Processos Juridícos'))
})

test.after('Closing server and nuxt.js', (t) => {
  nuxt.close()
})
