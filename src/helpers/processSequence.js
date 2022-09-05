/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
  allPass,
  andThen,
  ifElse,
  otherwise,
  pipe,
  prop,
  tap,
  test,
} from 'ramda';

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const isLengthBetween2And10 = test(/^.{3,10}$/);
  const isNumber = test(/^\d*\.?\d*$/);
  const isValidValue = allPass([isLengthBetween2And10, isNumber]);
  const makeConvertingQuery = (number) => ({ from: 10, to: 2, number });
  const fetchBinary = (query) =>
    api.get('https://api.tech/numbers/base', query);
  const handleErr = () => {
    handleError('ValidationError');
  };
  const handleConvertErr = () => {
    handleError('ConvetingError');
  };
  const getCharsCount = (str) => str.length;
  const squareNumber = (num) => num * num;
  const getId = (num) => num % 3;
  const fetchAnimal = (id) => api.get(`https://animals.tech/${id}`, {});
  const handleAnimalErr = () => {
    handleError('AnimalError');
  };
  const processAnimalResult = pipe(prop('result'), tap(handleSuccess));
  const processConvertingResult = pipe(
    prop('result'),
    tap(writeLog),
    getCharsCount,
    tap(writeLog),
    squareNumber,
    tap(writeLog),
    getId,
    fetchAnimal,
    andThen(processAnimalResult),
    otherwise(handleAnimalErr)
  );
  const processNum = pipe(
    Number,
    Math.round,
    tap(writeLog),
    makeConvertingQuery,
    fetchBinary,
    andThen(processConvertingResult),
    otherwise(handleConvertErr)
  );
  const validation = ifElse(isValidValue, processNum, handleErr);

  const process = pipe(tap(writeLog), validation);

  process(value);
};

export default processSequence;
