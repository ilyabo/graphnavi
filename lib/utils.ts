export function genRandomStr(length: number) {
  const rnd = Math.random;
  return Array.from(
    (function* () {
      for (let i = 0; i < length; i++) {
        const v = Math.floor(rnd() * (26 * 2 + 10));
        if (v < 26) {
          yield String.fromCharCode(v + 65); // 'A' - 'Z'
        } else if (v < 52) {
          yield String.fromCharCode(v + 71); // 'a' - 'z'
        } else {
          yield String.fromCharCode(v + 48); // '0' - '9'
        }
      }
    })(),
  ).join('');
}


export const NUMBER_FORMAT = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
});

export const formatNumber = NUMBER_FORMAT.format;
