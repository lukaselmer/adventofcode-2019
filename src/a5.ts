import { times } from 'lodash'
import { input2Examples, input2Star1, input5, input5Examples } from './inputs'
import { assertEquals } from './shared/testing'

function main(input: string, positionsToReplace: [number, number]) {
  console.log(calculate(input, { positionsToReplace }))
}

function calculate(
  program: string,
  options: {
    positionsToReplace?: [number, number]
    outputRegister?: number
    inputs?: number[]
    debug?: boolean
  } = {}
) {
  const { positionsToReplace, outputRegister = 0, inputs = [], debug = false } = options
  const codes = program.split(',').map((el) => parseInt(el, 10))
  if (positionsToReplace) {
    codes[1] = positionsToReplace[0]
    codes[2] = positionsToReplace[1]
  }

  let currentPosition = 0

  while (codes[currentPosition] !== 99) {
    const instruction = parseInstruction(codes, currentPosition)
    if (debug) {
      console.log(instruction)
      console.log(codes.slice(0, 10).join(','))
    }

    if (instruction.name == 'nop') {
      /* pass */
    } else if (instruction.numParams === 2) {
      const p1 = codes[currentPosition + 1]
      const p2 = codes[currentPosition + 2]
      codes[codes[currentPosition + 3]] = instruction.operation(
        instruction.modeP1 === 'position' ? codes[p1] : p1,
        instruction.modeP2 === 'position' ? codes[p2] : p2
      )
    } else if (instruction.name === 'input') {
      const input = inputs.shift()
      if (input === undefined) exit('No remaining inputs', codes)
      codes[codes[currentPosition + 1]] = input
    } else if (instruction.name === 'output') {
      console.log('--- output ---', codes[codes[currentPosition + 1]])
    }
    currentPosition += 2 + instruction.numParams
  }

  return codes[outputRegister]
}

function parseInstruction(codes: number[], currentPosition: number) {
  const code = codes[currentPosition]

  if (code === undefined) exit('Program did not halt', codes)

  const parsed = parseCodeAndModes(code)
  const { opcode } = parsed
  if (opcode === 1)
    return {
      name: 'add',
      operation: (p1: number, p2: number) => p1 + p2,
      numParams: 2,
      ...parsed,
    } as const
  if (opcode === 2)
    return {
      name: 'mul',
      operation: (p1: number, p2: number) => p1 * p2,
      numParams: 2,
      ...parsed,
    } as const
  if (opcode === 3)
    return {
      name: 'input',
      numParams: 0,
      ...parsed,
    } as const
  if (opcode === 4)
    return {
      name: 'output',
      numParams: 0,
      ...parsed,
    } as const
  return { name: 'nop', operation: () => null, numParams: 2, ...parsed } as const
}

function parseCodeAndModes(code: number) {
  let remaining = code
  const opcode = remaining % 100
  remaining = (remaining - opcode) / 100
  const c = remaining % 10
  remaining = (remaining - c) / 10
  const b = remaining % 10
  remaining = (remaining - b) / 10
  const a = remaining % 10
  return { opcode, modeP1: mode(c), modeP2: mode(b), modeP3: mode(a) } as const
}

function mode(rawMode: number) {
  return rawMode === 0 ? 'position' : 'immediate'
}

function exit(message: string, codes: number[]): never {
  console.error('--- exiting ---')
  console.error(message)
  console.error('Current state:')
  console.error(codes.join(','))
  throw new Error(message)
}

assertEquals(calculate(input2Examples[0]), 3500)
assertEquals(calculate(input2Examples[1]), 2)
assertEquals(calculate(input2Examples[2]), 2)
assertEquals(calculate(input2Examples[3]), 2)
assertEquals(calculate(input2Examples[4]), 30)
assertEquals(calculate(input2Star1, { positionsToReplace: [65, 77] }), 19690720)

assertEquals(calculate(input5Examples[0], { outputRegister: 4 }), 99)

console.log(calculate(input5, { inputs: [1] }))
