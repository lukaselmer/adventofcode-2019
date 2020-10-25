import { input1 } from './inputs'

function main() {
  console.log(
    input1
      .split('\n')
      .map(calcSingleFuelRequirements)
      .reduce((sum, current) => sum + current, 0)
  )
}

function calcSingleFuelRequirements(el: string): number {
  const number = parseInt(el, 10)
  return Math.floor(number / 3) - 2
}

main()
