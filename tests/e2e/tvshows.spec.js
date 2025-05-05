const { test, expect } = require('../support')
const data = require('../support/fixtures/tvshows.json')
const { executeSQL } = require('../support/database')

test('deve cadastrar uma nova série', async ({ page }) => {
    const serie = data.create
    await executeSQL(`DELETE FROM tvshows WHERE title = '${serie.title}';`)
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(serie)
    await page.popup.haveText(`A série '${serie.title}' foi adicionada ao catálogo.`)
})
test('deve remover uma série', async ({ page, request }) => {
    const serie = data.to_remove
    await executeSQL(`DELETE FROM tvshows WHERE title = '${serie.title}';`)
    await request.api.postSerie(serie)
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.remove(serie.title)
    await page.popup.haveText('Série removida com sucesso.')
})
test('não deve cadastrar quando o título é duplicado', async ({ page, request }) => {
    const serie = data.duplicate
    await executeSQL(`DELETE FROM tvshows WHERE title = '${serie.title}';`)
    await request.api.postSerie(serie)
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(serie)
    await page.popup.haveText(
        `O título '${serie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
    )
})
test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goForm()
    await page.tvshows.submit()
    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])
})
test('deve realizar busca pelo termo zumbi', async ({ page, request }) => {
    const serie = data.search
    serie.data.forEach(async (s) => {
        await executeSQL(`DELETE FROM tvshows WHERE title = '${s.title}';`)
        await request.api.postSerie(s)
    })
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.search(serie.input)
    await page.tvshows.tableHave(serie.outputs)
})