import { spawn } from 'child_process';

export async function runCLICommand(cwd: string, name: string, ...args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${name} ${args.join(' ')}`);
    const child = spawn(name, args, { cwd });
    child.on('error', err => {
      console.error(err);
      reject(err);
    });
    child.stdout.on('data', data => {
      console.log(data.toString('utf8'));
    });
    child.stderr.on('data', data => {
      console.error(data.toString('utf8'));
    });
    child.on('close', () => {
      resolve();
    });
  });
}
