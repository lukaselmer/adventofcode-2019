import { input3 } from './inputs'

function main(start: number, end: number) {
  let currentPassword = start
  let matchingPasswords = 0
  while (currentPassword <= end) {
    if (matches(currentPassword)) matchingPasswords++
    currentPassword++
  }
  return matchingPasswords
}

function matches(password: number) {
  const digits = password.toString().split('')
  let atLeastOneDuplicate = false
  let previousDigit = ''
  for (const digit of digits) {
    if (previousDigit) {
      if (previousDigit === digit) atLeastOneDuplicate = true
      if (parseInt(previousDigit, 10) > parseInt(digit, 10)) return false
    }
    previousDigit = digit
  }
  return atLeastOneDuplicate
}

console.log(main(356261, 846303))
