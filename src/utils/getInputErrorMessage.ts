const MIN_SYMBOLS_VALUE = 2;
const MAX_SYMBOLS_VALUE = 64;

export const getInputErrorMessage = (inputValue: string): string => {
  const valueNoSpaces = inputValue.trim();

  switch (true) {
    case valueNoSpaces.length === 0:
      return "Поле не может быть пустым";
    case valueNoSpaces.length < MIN_SYMBOLS_VALUE:
      return "Длина менее 2 символов";
    case valueNoSpaces.length > MAX_SYMBOLS_VALUE:
      return "Длина более 64 символов";
    default:
      return "";
  }
};
