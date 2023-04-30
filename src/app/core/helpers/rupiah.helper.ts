export function rupiahToNumber(input: string): number {
  const parts = input.split(',');
  parts[0] = parts[0].replace(/\./g, '');
  return parseFloat(parts.join('.'));
}

export function rupiahToStringNumber(input: string): string {
  const parts = input.split(',');
  parts[0] = parts[0].replace(/\./g, '');
  return parts.join('.');
}

export function numberToRupiah(input: number | string): string {
  const parts = (input + '').split('.');
  parts[0] = addThousandSeparator(parts[0]);
  return parts.join(',');
}

export function addThousandSeparator(input: string): string {
  return input.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
