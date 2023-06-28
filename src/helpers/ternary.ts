interface ConditionalStep { logicalEvaluator: string; HTMLIfTrue: string; }
interface ConditionalStepthru {
  defaultHTML: string | null;
  steps: ConditionalStep[];
}

export function stepthruToTernary(stepthru: ConditionalStepthru, pretty = false) {
  let returnVar = ''
  // below could be expression.replace(/\\?'/g, "\\'")
  const stringWrapHTML = (expression: string) => JSON.stringify(expression)
  if (pretty) {
    let indentChar = ''
    for (const step of stepthru.steps) {
      indentChar += '\t'
      returnVar += `(${step.logicalEvaluator})\n${indentChar}? ${stringWrapHTML(step.HTMLIfTrue)}\n${indentChar}: `
    }
  } else {
    for (const step of stepthru.steps) {
      returnVar += `(${step.logicalEvaluator}) ? ${stringWrapHTML(step.HTMLIfTrue)} : `
    }
  }
  returnVar += stepthru.defaultHTML
    ? stringWrapHTML(stepthru.defaultHTML)
    : 'null'
  return returnVar
}


export function ternaryToStepthru(ternaryExpression: string): ConditionalStepthru {
  const steps = [] as ConditionalStep[];
  const openers = [] as string[];
  const textDelimiters = [ '\'', '"',  '`'] as ReadonlyArray<string>
  let lastChunkStart = 0
  const getNextChunk = (match?:RegExpMatchArray) => {
    if (!match) { return ternaryExpression.substring(lastChunkStart).trim() }
    const priorStart = lastChunkStart
    lastChunkStart = match.index! + match[0].length
    return  ternaryExpression.substring(priorStart, lastChunkStart - 1).trim()
  }
  for (const match of ternaryExpression.matchAll(/[:?()'"`]/g)) {
    const lastOpener = openers.length 
      ? openers[openers.length - 1] 
      : ''
    // if in text block, everything irrelevant until close found
    if (textDelimiters.includes(lastOpener)) {
      if (lastOpener === match[0] && ternaryExpression[match.index! - 1] !== '\\') { 
        openers.pop() 
      } 
    } else if (match[0] === '(' || textDelimiters.includes(match[0])) {
      openers.push(match[0])
    } else if (match[0] === ')') {
      if (lastOpener !== '(') {
        throw Error('closing bracket without opening bracket')
      }
      openers.pop()
    } else if (match[0] === '?')  { // only ternary operators left
      openers.push('?')
      if (openers.length === 1) {
        steps.push({ logicalEvaluator: unwrapBrackets(getNextChunk(match)), HTMLIfTrue: ''})
      }
    } else { // if ':'
      if (lastOpener !== '?') {
        throw Error('unbalanced ternary expresssion')
      }
      openers.pop()
      if (!openers.length) {
        steps[steps.length - 1].HTMLIfTrue = JSON.parse(getNextChunk(match))
      }
    }
  }
  return {
    defaultHTML: JSON.parse(getNextChunk()),
    steps
  }
}

/**
 * Finds matching closing bracket ')'
 * @param inpt string to be searched
 * @param startPos [default 0] the position in the string to start searching. If this is not an opening bracket, function returns null
 * @returns if an empty string returns null. Otherwise the position of the first character after the closing bracket
 */
function findMatchingBracketPosition(inpt: string, startPos = 0) {
  if (!inpt.length || inpt[startPos] !== '(') { return null }
  const bracketRegex = /[()]/g
  let bracketCount = 1
  bracketRegex.lastIndex = startPos + 1
  let match: RegExpExecArray | null
  while ((match = bracketRegex.exec(inpt)) !== null) {
    bracketCount += match[0] === '('
      ? 1
      : -1
    if (bracketCount === 0) { return bracketRegex.lastIndex }
  }
  return -1
}

function unwrapBrackets(inpt: string) {
  const matchingBracket = findMatchingBracketPosition(inpt)
  if (matchingBracket === null) { return inpt }
  if (matchingBracket === inpt.length) { return inpt.substring(1, matchingBracket - 1) }
  if (matchingBracket === -1) { throw new Error("unmatched parentheses") }
  // matching bracket part way through string - we could test remainder of string for matching brackets
  return inpt
}
