interface ConditionalStep { logicalEvaluator: string; HTMLIfTrue: string; }

export function findCondition(steps: ConditionalStep[], args: object) {
  const ternary = steps.reduce((accum, current, indx) => 
      accum + `(${current.logicalEvaluator}) ? ${indx} : `,
      '') + 'null'
  const indx = execFormulaInScope(ternary, args) as number | null
  if (indx === null) { return null }
  return steps[indx].HTMLIfTrue
}

export function execFormulaInScope(formula: string, args: object) {
  const namedArgs = Object.keys(args).concat(`"use strict";return (${formula});`)
  const parsedFunc = Function(...namedArgs)
  return parsedFunc(...Object.values(args))
}

export function validateFunction(func: string, allowedArgs: object) {
  func = objectToKeys(allowedArgs).reduce((accum, current) => accum.replaceAll(current, ''), 
    func)
  return !/[^\d .&|()<>=?:+*/%-]/.test(func)
}

export function expandOperators(func: string) {
  return func.replace(/(?<!&)&(?!&)/g, '&&')
    .replace(/(?<!\|)\|(?!\|)/g, '||')
    .replace(/(?<!=)==?(?!=)/g, '===')
}

export function objectToKeys(obj: object): string[] {
  let returnVar = [] as string[]
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'object') {
      returnVar = returnVar.concat(objectToKeys(v).map(o => `${k}.${o}`))
    } else {
      returnVar.push(k)
    }
  }
  return returnVar
}
