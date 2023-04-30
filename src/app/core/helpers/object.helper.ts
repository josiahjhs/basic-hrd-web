export function removeEmptyObject(obj: object): object {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
    return (v !== null) && (v !== '');
  }));
}

export function decodeObjectValues(obj: any): any {
  const result: any = {};
  for (const key in obj) {
    result[key] = decodeURI(obj[key]);
  }
  return result;
}

export function getChangedKey(obj1: any, obj2: any): string[] {
  const changed: string[] = [];
  Object.keys(obj1).forEach(key => {
    if (obj1[key] !== obj2[key]) {
      changed.push(key);
    }
  });
  return changed;
}
