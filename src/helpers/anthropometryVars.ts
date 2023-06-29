interface varDetails { name: string; units: string; description: string; isAge?: boolean, icon?: string}

const anthropometryVars: Record<string, varDetails> = { 
  wt: {
		name: 'weight',
    units: 'kg',
    description: 'weight (in kg)',
    icon: 'mdi-weight-kilogram'
  }, 
  bsa: {
		name: 'bsa',
    units: 'm²',
    description: 'body surface area (in m²)',
    icon: 'mdi-tape-measure',
  },
  days: {
    isAge: true,
		name: 'days_old',
    units: 'days',
    description: 'days of age since birth',
  },
  yrs: {
    isAge: true,
		name: 'years_old',
    units: 'years',
    description: 'years of age, including fractional part (1.5 = 18 mths)',
  }, 
  ga: {
    isAge: true,
		name: 'gest@birth',
    units: 'weeks',
    description: 'gestational age (weeks gestation @ delivery)',
  },
  cga: {
    isAge: true,
		name: 'cga',
    units: 'weeks',
    description: 'corrected gestational age (current weeks gestation)'
  }
}

const allowedFormulaChars = '0-9.()<>=?:+*/%-'

export  { anthropometryVars, allowedFormulaChars }