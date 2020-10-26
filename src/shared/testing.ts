export function assertEquals<T>(a: T, b: T) {
  if (JSON.stringify(a) !== JSON.stringify(b)) console.log(`Expected ${a} == ${b}`)
}
