import { expect, test, describe } from 'vitest'
import {stepthruToTernary, ternaryToStepthru} from '../ternary'
import { execFormulaInScope, objectToKeys } from '../execFormulaInScope'
// Edit an assertion and save to see HMR in action

describe('ternary to and From conditional expression', () => {
  const steps = {
    defaultHTML: '<output>100</output><span class="units">mg</span>',
    steps: [{
      logicalEvaluator: 'ageMonths < 6',
      HTMLIfTrue: '<output formula="weight * 2"></output><span class="units">mg</span>'
    },
    {
      logicalEvaluator: 'weight < 50',
      HTMLIfTrue: '<output formula="weight * 1.5"></output><span class="units">mg</span>'
    }]
  }
  const condensedTernaryString = `(ageMonths < 6) ? "<output formula=\\"weight * 2\\"></output><span class=\\"units\\">mg</span>" : (weight < 50) ? "<output formula=\\"weight * 1.5\\"></output><span class=\\"units\\">mg</span>" : "<output>100</output><span class=\\"units\\">mg</span>"`
  // tabs as \t is to stop linting and editor exchanging tabs for double spaces
  const prettyTernaryString = `(ageMonths < 6)
\t? "<output formula=\\"weight * 2\\"></output><span class=\\"units\\">mg</span>"
\t: (weight < 50)
\t\t? "<output formula=\\"weight * 1.5\\"></output><span class=\\"units\\">mg</span>"
\t\t: "<output>100</output><span class=\\"units\\">mg</span>"`

  test('stepthruToTernary pretty=false', () => {
    const ternaryString = stepthruToTernary(steps)
    
    expect(ternaryString).toBe(condensedTernaryString)
  })

  test('stepthruToTernary pretty=true', () => {
    const ternaryString = stepthruToTernary(steps,true)
    
    expect(ternaryString).toBe(prettyTernaryString)
  })

  test('reverse', () => {
    let parsed = ternaryToStepthru(condensedTernaryString)
    expect(parsed).toEqual(steps)
    parsed = ternaryToStepthru(prettyTernaryString)
    expect(steps).toEqual(steps)
  })

  test('malicious injection', () => {
    function execString (formula: string) {
      const returnHTML = Function('badActor','weight',`return (${formula});`)(badActor, 20)
      expect(returnHTML).toBeTypeOf('string')
      function badActor() {
        throw new Error('malicious code wase injected')
      }
    }
    [
      "<p>'+badActor()+'</p>",
      "<p>\\'+badActor()+\\'</p>",
      '<p>"+badActor()+"</p>',
      '<p>\\"+badActor()+\\"</p>',
      '<p>${badActor()}</p>', 
      '<p>`${badActor()}`</p>', 
      '<p>\\`${badActor()}\\`</p>'
    ]
      .forEach(html => {
        let ternaryString = stepthruToTernary({
          defaultHTML: html,
          steps: []
        })
        execString(ternaryString)
        ternaryString = stepthruToTernary({
          defaultHTML: '<p>hello</p>',
          steps: [
            {
              logicalEvaluator: 'weight > 10',
              HTMLIfTrue: html
            }
          ]
        })
        execString(ternaryString)
      })
  })
})

describe('execute string functions in scope', () => {
  test('provides arguments', () => {
    const anthro = 
    {
       weight: 20,
       BSA: 0.8,
       age: {
          totalYears: 5
       }
    }
    const formula = 'age.totalYears < 12 ? BSA * 500 : weight * 10'
    let result = execFormulaInScope(formula, anthro)
    expect(result).toBe(400)
    anthro.age.totalYears = 13
    result = execFormulaInScope(formula, anthro)
    expect(result).toBe(200)
  })
  test('objectToKeys', () => {
    const anthro = 
    {
       weight: 20,
       BSA: 0.8,
       age: {
          totalYears: 5,
          totalMonths: 63
       }
    }
    var k = objectToKeys(anthro)
    expect(k).toEqual(['weight', 'BSA', 'age.totalYears', 'age.totalMonths'])
  })
})
