/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
  __,
  allPass,
  anyPass,
  equals,
  filter,
  gte,
  length,
  not,
  pipe,
  prop,
  values,
  whereEq,
} from 'ramda';

const getCountByColor = (color) => {
  const isColor = equals(color);
  const filterByColor = filter(isColor);

  return pipe(values, filterByColor, length);
};

const isAllShapesTheSameColor = (color) =>
  whereEq({ circle: color, square: color, triangle: color, star: color });

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => {
  const validate = whereEq({
    circle: 'white',
    square: 'green',
    triangle: 'white',
    star: 'red',
  });

  return validate(shapes);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
  const isGte2 = gte(__, 2);
  const getGreenCount = getCountByColor('green');

  const validate = pipe(getGreenCount, isGte2);

  return validate(shapes);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
  const getRedCount = getCountByColor('red');
  const getBlueCount = getCountByColor('blue');

  return equals(getRedCount(shapes), getBlueCount(shapes));
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (shapes) => {
  const validate = whereEq({
    circle: 'blue',
    square: 'orange',
    star: 'red',
  });

  return validate(shapes);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
  const isGte3 = gte(__, 3);
  const isColorGte3 = (color) => pipe(getCountByColor(color), isGte3);
  const isRedGte3 = isColorGte3('red');
  const isBlueGte3 = isColorGte3('blue');
  const isGreenGte3 = isColorGte3('green');
  const isOrangeGte3 = isColorGte3('orange');

  const validate = anyPass([isRedGte3, isBlueGte3, isGreenGte3, isOrangeGte3]);

  return validate(shapes);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
  const isTriangleGreen = whereEq({ triangle: 'green' });
  const isEquals2 = equals(__, 2);
  const getGreenCount = getCountByColor('green');
  const isEquals1 = equals(__, 1);
  const getRedCount = getCountByColor('red');
  const isGreenEquals2 = pipe(getGreenCount, isEquals2);
  const isRedEquals1 = pipe(getRedCount, isEquals1);

  const validate = allPass([isTriangleGreen, isGreenEquals2, isRedEquals1]);

  return validate(shapes);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shapes) => {
  const validate = isAllShapesTheSameColor('orange');

  return validate(shapes);
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (shapes) => {
  const isStarRed = whereEq({ star: 'red' });
  const isStarWhite = whereEq({ star: 'white' });
  const starIsNotRed = pipe(isStarRed, not);
  const starIsNotWhite = pipe(isStarWhite, not);

  const validate = allPass([starIsNotRed, starIsNotWhite]);

  return validate(shapes);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shapes) => {
  const validate = isAllShapesTheSameColor('green');

  return validate(shapes);
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (shapes) => {
  const getSquareColor = prop('square');
  const getTriangleColor = prop('triangle');
  const isColorsEquals = (shapes) =>
    equals(getSquareColor(shapes), getTriangleColor(shapes));
  const isTriangleWhite = whereEq({ triangle: 'white' });
  const triangleIsNotWhite = pipe(isTriangleWhite, not);

  const validate = allPass([isColorsEquals, triangleIsNotWhite]);

  return validate(shapes);
};
