const MIN_SYMBOLS_VALUE = 2;
const MAX_SYMBOLS_VALUE = 64;

export const getInputErrorMessage = (inputValue: string): string => {
  switch (true) {
    case inputValue.length === 0:
      return "Поле не может быть пустым";
    case inputValue.length < MIN_SYMBOLS_VALUE:
      return "Длина менее 2 символов";
    case inputValue.length > MAX_SYMBOLS_VALUE:
      return "Длина более 64 символов";
    default:
      return "";
  }
};