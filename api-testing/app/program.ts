import * as colors from 'colors';
import { SpecValidator } from './spec-validator';
import * as commander from 'commander';

const getVersion = (): string => {
  return require('../package.json').version
    ? require('../package.json').version
    : 'nice';
};

const version = getVersion();

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
          'No --specPath argument specified, please pass this parameter'
        )
      );
      return;
    } else if (!cmd.url) {
      console.log(
        colors.red('No --url argument specified, please pass this parameter')
      );
      return;
    } else {
      new SpecValidator(cmd.specPath, cmd.url).validateSpec();
    }
  });

commander.parse(process.argv);
