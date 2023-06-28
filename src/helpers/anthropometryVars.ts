const anthropometryVars = { 
  wt: {
		name: 'weight',
    units: 'kg',
    description: 'weight (in kg)',
  }, 
  bsa: {
		name: 'bsa',
    units: 'm²',
    description: 'body surface area (in m²)',
  },
  days: {
		name: 'days old',
    units: 'days',
    description: 'days of age since birth',
  },
  yrs: {
		name: 'years old',
    units: 'years',
    description: 'years of age, including fractional part (1.5 = 18 mths)',
  }, 
  ga: {
		name: 'gest @ birth',
    units: 'weeks',
    description: 'gestational age (weeks gestation @ delivery)',
  },
  cga: {
		name: 'cga',
    units: 'weeks',
    description: 'corrected gestational age (current weeks gestation)'
  }
}

const allowedFormulaChars = ' 0-9.()<>=?:+*/%-'

export  { anthropometryVars, allowedFormulaChars }