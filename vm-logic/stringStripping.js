const { VM } = require("vm2");

// for VM execution
const calculateFormulaStringInVM = (formulaString) =>
  new VM().run(formulaString);

// environment valueMap
const inputString =
  "#number_1-#number_3===#number_2?#string_1+\"asd #number_1\"===null?null:#formula_1:#string_2";
const valueMap = {
  string_1: "annotation là #string_1",
  string_2:
    "annotation là #string_2, \"\" '''''''' khác với #string_1 ở chỗ có thêm escape sign \\, và cả các escape quote \"'`",
  number_1: 12,
  number_2: 0,
  number_3: -0.5,
  formula_1: '"15" - -0.3 + "#number_3 + 1 - 1" + 2 + #formula_2',
  formula_2: '"#number_3 + 1 - 1 " ',
};

// pre-process string
const preProcessFormulaString = (string = inputString, map = valueMap) => {
  const regexString = /(["][^"]+["])|([`][^`]+[`])|(['][^']+['])/gi;
  const literalString = string.match(regexString);
  const parseString = string.replace(regexString, "[]");
  const type = ["number", "string", "formula"];

  const reduceString = parseString.match(/\w+|[^#]+/gi).reduce((a, b) => {
    let processString = b;
    let datatype = b.slice(0, b.length - 2);

    if (type.includes(datatype)) {
      processString = map[b];
      if (processString === undefined) throw new Error(`Undefined map value`);

      if (datatype === "string") {
        processString = `"${addslashes(processString)}"`;
      }

      if (datatype === "number") {
        processString = `(${processString})`;
      }

      if (datatype === "formula") {
        processString = preProcessFormulaString(processString, map);
        const evaluate = Function("return " + processString)();
        processString = `"${addslashes(evaluate)}"`;
      }

      return (a += processString);
    }

    return (a += processString);
  }, "");

  let returnedString = reduceString;
  if (literalString !== null) {
    literalString.forEach((string) => {
      returnedString = returnedString.replace("[]", string);
    });
  }

  console.log(returnedString);
  // returning value should be STRING
  return returnedString;
};

// correct result will be #string_2 = 'annotation là #string_2, khác với #string_1 ở chỗ có thêm escape sign \\, và cả các escape quote "\'`'
console.log(calculateFormulaStringInVM(preProcessFormulaString()));

function addslashes(str) {
  return (str + "").replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
}
