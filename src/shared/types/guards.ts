export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isObject(value: any): value is object {
  return typeof value === 'object';
}
