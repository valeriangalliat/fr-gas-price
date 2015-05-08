# fr-gas-price [![npm version](http://img.shields.io/npm/v/fr-gas-price.svg?style=flat-square)](https://www.npmjs.org/package/fr-gas-price)

> Retrieve French gas price data from [government website].

[government website]: http://www.prix-carburants.gouv.fr/

Overview
--------

**fr-gas-price** is a library and a CLI tool to get the latest gas prices
by gas type and region, in France.

<!-- BEGIN USAGE -->

Usage
-----

```
fr-gas-price [options] <gas> <postcode>...
```

### Arguments

Name | Description
---- | -----------
`<gas>` | The gas type (name or ID, see below).
`<postcode>` | One or more postcodes to fetch prices for.

### Options

Name | Description
---- | -----------
`-p, --pretty` | Show a pretty table instead of raw output.

### Gas

Name | Description
---- | -----------
`diesel` | 1
`unleaded95` | 2
`e85` | 3
`gplc` | 4
`unleaded95e10` | 5
`unleaded98` | 6

<!-- END USAGE -->

### Node

```js
import { gas, gasPrice } from 'fr-gas-price'

const display = ({ city, name, brand, price, updated }) =>
  doStuffWith(city, name, brand, price, updated)

gasPrice(gas.unleaded95, ...[38100, 38200])
  .then(prices => prices.forEach(display))
```
