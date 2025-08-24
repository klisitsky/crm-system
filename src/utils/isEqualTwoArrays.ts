export const isEqualTwoArrays = (
  prevProps: Record<string, any>[],
  props: Record<string, any>[]
): boolean => {
  if (prevProps.length !== props.length) {
    return false;
  }
  for (let i = 0; i <= prevProps.length; i++) {
    if (JSON.stringify(prevProps[i]) !== JSON.stringify(props[i])) {
      return false;
    }
  }
  return true;
};
