const { test, expect } = require('../support')
const { faker } = require('@faker-js/faker')

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.name.fullName()
  const leadEmail = faker.internet.email()
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(leadName, leadEmail)
  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await page.toast.containText(message)
})

test('não deve cadastrar quando o email já existe', async ({ page, request }) => {
  const leadName = faker.name.fullName()
  const leadEmail = faker.internet.email()
  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })
  expect(newLead.ok()).toBeTruthy()
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(leadName, leadEmail)
  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await page.toast.containText(message)
})
test('não deve cadastrar com email inválido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('Davi Correia', 'davigoogle.com.br')
  await page.landing.alertHaveText('Email incorreto')
})
test('não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('', 'davi@google.com.br')
  await page.landing.alertHaveText('Campo obrigatório')
})
test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('Davi Correia', '')
  await page.landing.alertHaveText('Campo obrigatório')
  //await page.waitForTimeout(5000)
})
test('não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('', '')
  await page.landing.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ])
  //await page.waitForTimeout(5000)
})