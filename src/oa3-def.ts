#!/usr/bin/env node

import * as colors from 'colors';
import { SpecValidator } from './spec-validator';
import * as commander from 'commander';

const getVersion = (): string => {
  return require('../package.json').version
    ? require('../package.json').version
    : 'No version found!';
};

const version = getVersion();

console.log('\n');
console.log(colors.bgBlue(colors.red('         @ten-group          ')));
console.log(colors.bgBlue(colors.bold('====  OA3 API Defender   ====')));
console.log(colors.bgBlue(colors.bold('_____________________________')));
console.log(colors.bold(`v${version}`));
console.log('\n');

commander.version(version).description("@ten-group's Open API 3 Defender!");

commander
  .command('validate')
  .option('--specPath <string>', 'Absolute path to a valid OA3 Specification')
  .option('--url <string>', 'Fully qualified URL of the API to interrogate')
  .description('Validate an API versus an OA3 Spec')
  .action((cmd: { specPath: string; url: string }) => {
    if (!cmd.specPath) {
      console.log(
        colors.red(
          'No --specPath argument specified, please pass this parameter',
        ),
      );
      return;
    } else if (!cmd.url) {
      console.log(
        colors.red('No --url argument specified, please pass this parameter'),
      );
      return;
    } else {
      new SpecValidator(cmd.specPath, cmd.url).validateSpec();
    }
  });

commander.parse(process.argv);
