const cheerio = require('cheerio')
const fetchCookie = require('fetch-cookie')
const FormData = require('form-data')
const moment = require('moment')
const qs = require('querystring')
const Table = require('cli-table')
const tough = require('tough-cookie')

const endpoint = 'http://www.prix-carburants.gouv.fr/'
const unleaded95 = 2
const postcode = process.argv[2]

const fetchCheerio = fetch => async (...args) =>
  cheerio.load(await (await fetch(...args)).text())

const fetch = fetchCheerio(fetchCookie(require('node-fetch')))

const getToken = $ =>
  $('#recherche_recherchertype__token').val()

const getForm = (gas, postcode, token) =>
  qs.stringify({
    '_recherche_recherchertype[choix_carbu]': gas,
    '_recherche_recherchertype[localisation]': postcode,
    '_recherche_recherchertype[_token]': token,
  })

const getTable = $ =>
  $('#tab_resultat')

const getPrices = table =>
  table.find('tr.data').toArray()
    .map(row => {
      const tds = cheerio(row).find('td').toArray()
        .map(td => cheerio(td).text())

      return {
        city: tds[2],
        name: tds[3],
        brand: tds[4],
        price: parseFloat(tds[5]),
        updated: moment(tds[6], 'DD/MM/YY'),
      }
    })

async () => {
  const token = getToken(await fetch(endpoint))
  const form = getForm(unleaded95, postcode, token)

  const result = getTable(await fetch(endpoint, {
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  }))

  const prices = getPrices(result)

  const table = new Table({
    head: ['City', 'Name', 'Brand', 'Price', 'Updated'],
  })

  prices.forEach(item => {
    table.push([item.city, item.name, item.brand, item.price, moment(item.date).format('YYYY-MM-DD')])
  })

  console.log(table.toString())

}()
  .then(null, require('promise-done'))
