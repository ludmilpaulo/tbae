export function classNames(...xs: ReadonlyArray<string | undefined | false>): string {
  return xs.filter(Boolean).join(' ')
}
