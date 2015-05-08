import cheerio from 'cheerio'
import fetchCookie from 'fetch-cookie'
import FormData from 'form-data'
import moment from 'moment'
import nodeFetch from 'node-fetch'
import * as qs from 'querystring'

const endpoint = 'http://www.prix-carburants.gouv.fr/'

// The different gas identifiers.
export const gas = {
  diesel: 1,
  unleaded95: 2,
  e85: 3,
  gplc: 4,
  unleaded95e10: 5,
  unleaded98: 6,
}

const fetchCheerio = fetch => async (...args) =>
  cheerio.load(await (await fetch(...args)).text())

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

async function gasPriceInner(gas, postcode) {
  // Create a new `fetchCookie` each time so we can parallel requests.
  // Won't work if this line is global to the module.
  const fetch = fetchCheerio(fetchCookie(nodeFetch))

  const token = getToken(await fetch(endpoint))
  const form = getForm(gas, postcode, token)

  const result = getTable(await fetch(endpoint, {
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  }))

  return getPrices(result)
}

export const gasPrice = async (gas, ...postcodes) =>
  [].concat(...(await Promise.all(
    postcodes.map(postcode => gasPriceInner(gas, postcode))
  )))
