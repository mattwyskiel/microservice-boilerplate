import { program } from 'commander';
import { copySync } from 'fs-extra';
import { join } from 'path';
import { runCLICommand } from './run-cli-command';

program
  .name('bootstrap-microservice')
  .description(
    'CLI to add opinionated common boilerplate to SST-generated TypeScript microservices'
  )
  .version('0.1.0');

program.option(
  '-d, --dir <directory>',
  'directory to output folder "lib/" of boilerplate code files in (relative to current working directory)',
  './'
);
program.option(
  '-p --project <directory>',
  'root project directory which contains package.json file',
  './'
);

program.parse();

const options = program.opts();

// console.log(`directory: ${options.dir}`);
const fullPath = join(process.cwd(), options.dir, 'lib');
// console.log(`full directory: ${fullPath}`);

const pathToSrc = join(__dirname, '..', 'src', 'lib');
copySync(pathToSrc, fullPath);

(async () => {
  await runCLICommand(options.project, 'yarn', 'add', 'winston', '@middy/core');
  await runCLICommand(
    options.project,
    'yarn',
    'add',
    '--dev',
    '@types/aws-lambda',
    'json-schema-to-ts'
  );
})();
