const { camelizeKeys } = require('humps')
const { mountAddress } = require('.')
const {
  mailTemplateLawSuit, mailTemplateLawyerAdd
} = require('../templates/mailMessages')

const notifyLawSuit = async (transport, knex, lawSuitId) => {
  const [data] = await knex('law_suit')
    .select(
      'client.name AS client_name',
      'client.email AS client_email',
      'lawyer.name AS lawyer_name',
      'user.email AS lawyer_email'
    )
    .join('client', 'client.client_id', 'law_suit.client_id')
    .join('lawyer', 'lawyer.lawyer_id', 'client.lawyer_id')
    .join('user', 'user.lawyer_id', 'lawyer.lawyer_id')
    .where({ law_suit_id: lawSuitId })

  const {
    clientName,
    clientEmail,
    lawyerName,
    lawyerEmail
  } = camelizeKeys(data)

  const subject = `Themis - Início de Processo - ${clientName}`
  const html = mailTemplateLawSuit(clientName, lawyerName)

  transport.sendMail({
    from: mountAddress({
      name: lawyerName,
      email: lawyerEmail
    }),
    to: mountAddress({
      name: clientName,
      email: clientEmail
    }),
    subject,
    html
  })

  return {
    from: {
      name: lawyerName,
      email: lawyerEmail
    },
    to: {
      name: clientName,
      email: clientEmail
    },
    subject,
    message: html
  }
}

const notifyLawyer = async (transport, lawyerName, lawyerEmail) => {
  const subject = `Themis - Cadastro Realizado para ${lawyerName}`
  const html = mailTemplateLawyerAdd(lawyerName)

  transport.sendMail({
    from: mountAddress({
      name: 'Themis - SGPJ',
      email: 'no-reply@themis.com.br'
    }),
    to: mountAddress({
      name: lawyerName,
      email: lawyerEmail
    }),
    subject,
    html
  })

  return {
    from: {
      name: 'Themis - SGPJ',
      email: 'no-reply@themis.com.br'
    },
    to: {
      name: lawyerName,
      email: lawyerEmail
    },
    subject,
    message: html
  }
}

module.exports = {
  notifyLawSuit,
  notifyLawyer
}
