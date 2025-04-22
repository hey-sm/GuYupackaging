export function uppercaseFirst(str: string) {
  return str.slice(0, 1).toLocaleUpperCase() + str.slice(1)
}

export function camel(str: string, separator = '_') {
  return str
    .split(separator)
    .map((v, i) => (i === 0 ? v : uppercaseFirst(v)))
    .join('')
}

export function pascal(str: string, separator = '_') {
  return str
    .split(separator)
    .map((v) => uppercaseFirst(v))
    .join('')
}
