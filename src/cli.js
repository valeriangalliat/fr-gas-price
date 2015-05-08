import { gas, gasPrice } from './'
import done from 'promise-done'
import moment from 'moment'
import Table from 'cli-table'

export async function main () {
  const prices = await gasPrice(gas.unleaded95, process.argv[2])

  const table = new Table({
    head: ['City', 'Name', 'Brand', 'Price', 'Updated'],
  })

  prices.forEach(item => {
    table.push([item.city, item.name, item.brand, item.price, moment(item.date).format('YYYY-MM-DD')])
  })

  console.log(table.toString())
}

if (require.main === module) {
  main().then(null, done)
}
