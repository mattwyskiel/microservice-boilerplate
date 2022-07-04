import { program } from 'commander';
import { copySync } from 'fs-extra';
import { copyFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { runCLICommand } from './run-cli-command';

program
  .name('bootstrap-microservice')
  .description(
    'CLI to add opinionated common boilerplate to SST-generated TypeScript microservices'
  )
  .version('0.1.0');

program
  .command('boilerplate')
  .option(
    '-d, --dir <directory>',
    'directory to output folder "lib/" of boilerplate code files in (relative to current working directory)',
    './'
  )
  .option(
    '-p --project <directory>',
    'root project directory which contains package.json file',
    './'
  )
  .action(async options => {
    // console.log(`directory: ${options.dir}`);
    const fullPath = join(process.cwd(), options.dir, 'lib');
    // console.log(`full directory: ${fullPath}`);

    const pathToSrc = join(__dirname, '..', 'src', 'lib');
    copySync(pathToSrc, fullPath);

    // add code dependencies
    await runCLICommand(options.project, 'yarn', 'add', 'winston', '@middy/core');
    // add dev dependencies
    await runCLICommand(
      options.project,
      'yarn',
      'add',
      '--dev',
      '@types/aws-lambda',
      'json-schema-to-ts'
    );
  });

program
  .command('codeformat')
  .option(
    '-p --project <directory>',
    'root project directory which contains package.json file',
    './'
  )
  .action(async options => {
    await runCLICommand(
      options.project,
      'yarn',
      'add',
      '--dev',
      'eslint',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'prettier',
      'prettier-airbnb-config'
    );

    await writeFile(join(options.project, '.prettierrc'), '"prettier-airbnb-config"');
    await copyFile(
      join(__dirname, '..', 'resources', '.eslintrc.js'),
      join(process.cwd(), options.project, '.eslintrc.js')
    );
    await copyFile(
      join(__dirname, '..', 'resources', 'tsconfig.eslint.json'),
      join(process.cwd(), options.project, 'tsconfig.eslint.json')
    );
  });

program.parse();
