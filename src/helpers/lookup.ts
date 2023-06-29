export function toLookup<T, U>(arr: Iterable<T>, delineator: (arg: T) => U): Map<U, T[]> {
  var returnVar = new Map<U, T[]>()
  for (var i of arr) {
    const res = delineator(i)
    let a = returnVar.get(res)
    if (a === undefined) { 
      a = [] 
      returnVar.set(res, a)
    }
    a.push(i)
  }
  return returnVar
}