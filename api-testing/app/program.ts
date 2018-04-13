import * as colors from 'colors';
import { SpecValidator } from './spec-validator';

const apiUrl = 'http://localhost:4040';
const openApiSpecPath = '../test.yaml';

console.log('\n');
console.log(colors.bgBlue(colors.bold('                             ')));
console.log(colors.bgBlue(colors.bold('==== OA3 API Testing CLI ====')));
console.log(colors.bgBlue(colors.bold('_____________________________')));
console.log('\n');

console.log(colors.bold(`API URL: ${apiUrl}\n`));

const validator: SpecValidator = new SpecValidator(openApiSpecPath, apiUrl);

validator.validateSpec();
