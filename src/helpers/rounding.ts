enum precisionArguments { none, integer, number }
interface RoundingMethod {
  description: string, 
  explanation: string,
  requiresPrecision: precisionArguments,
  apply: (value: number, _precision?: number) => number | string,
}

const roundingMethods: Record<string, RoundingMethod> = {
  '': { 
    description: 'None', 
    explanation: 'No rounding is applied.',
    requiresPrecision: precisionArguments.none,
    apply: (value: number, _precision?: number) => value,
  },
  'p': {
    description: 'Fixed precision',
    explanation: 'The number of significant digits that a result will be rounded to.',
    requiresPrecision: precisionArguments.integer,
    apply: (value: number, _precision?: number) => value.toPrecision(_precision)
  },
  'f': {
    description: 'Fixed decimal places',
    explanation: 'The number of digits that are displayed after the decimal place.',
    requiresPrecision: precisionArguments.integer,
    apply: (value: number, _precision?: number) => value.toFixed(_precision),
  },
  's': {
    description: 'Syring rounding',
    explanation: 'Rounding of volume (in mls), if the appropriate size syringe is used.',
    requiresPrecision: precisionArguments.none,
    apply: (value: number, _precision?: number) => value,
  },
  'n': {
    description: 'Nearest',
    explanation: 'Rounded to the nearest multiple of the specified precision.',
    requiresPrecision: precisionArguments.number,
    apply: (value: number, _precision?: number) => value,
  }
}

function applyRounding(value: number, roundingCode = '') {
  const matches = /^([a-z])(\d)/.exec(roundingCode) || []
  const method = roundingMethods[matches[1] as keyof typeof roundingMethods || '']
  return method.apply(value, Number(matches[2]))
}

export { roundingMethods, precisionArguments, applyRounding }
