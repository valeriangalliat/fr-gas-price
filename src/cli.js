import { docopt } from 'docopt'
import * as gasPrice from './'
import done from 'promise-done'
import moment from 'moment'
import Table from 'cli-table'

const doc = `
Usage: fr-gas-price [options] <gas> <postcode>...

Arguments:
  <gas>       The gas type (name or ID, see below).
  <postcode>  One or more postcodes to fetch prices for.

Options:
  -p, --pretty  Show a pretty table instead of raw output.

Gas:
  diesel         1
  unleaded95     2
  e85            3
  gplc           4
  unleaded95e10  5
  unleaded98     6
`.trim()

const underscorify = x =>
  x.replace(/ /g, '_')

const raw = {
  table: {
    chars: {
      'top': '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      'bottom': '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      'left': '',
      'left-mid': '',
      'mid': '',
      'mid-mid': '',
      'right': '',
      'right-mid': '',
      'middle': ' ',
    },
    style: {
      'padding-left': 0,
      'padding-right': 0,
    },
  },

  format: item =>
    [item.city, item.name, item.brand, item.price, moment(item.date).format('YYYY-MM-DD')]
      .map(String)
      .map(underscorify),
}

const pretty = {
  table: {
    head: ['City', 'Name', 'Brand', 'Price', 'Updated'],
  },

  format: item =>
    [item.city, item.name, item.brand, item.price, moment(item.date).format('YYYY-MM-DD')],
}

export default async function main (argv) {
  const opts = docopt(doc, { argv })
  const gas = gasPrice.gas[opts['<gas>']] || opts['<gas>']

  const prices = await gasPrice.gasPrice(gas, ...opts['<postcode>'])
  const style = opts['--pretty'] ? pretty : raw
  const table = new Table(style.table)

  prices.forEach(item => {
    table.push(style.format(item))
  })

  console.log(table.toString())
}

if (require.main === module) {
  main(process.argv.slice(2)).then(null, done)
}
