export const isEqualTwoArrays = (
  firstArr: Record<string, any>[],
  secondArr: Record<string, any>[]
): boolean => {
  if (secondArr.length !== firstArr.length) {
    return false;
  }
  for (let i = 0; i <= secondArr.length; i++) {
    if (JSON.stringify(secondArr[i]) !== JSON.stringify(firstArr[i])) {
      return false;
    }
  }
  return true;
};
