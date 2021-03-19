import { EventEmitter } from 'events';
import { platform } from 'os';
import { satisfyDependencies } from 'atom-satisfy-dependencies';
import { spawn } from 'child_process';

// Package settings
import meta from '../package.json';

export function defaultCustomArguments() {
  if (platform() === 'win32') {
    return '-NoLogo -NonInteractive -NoProfile -ExecutionPolicy Unrestricted -File {FILE_ACTIVE}';
  }

  return '-NoLogo -NonInteractive -NoProfile -File {FILE_ACTIVE}';
}

export const config = {
  customArguments: {
    title: 'Custom Arguments',
    description: 'Specify your preferred arguments for `powershell`, supports [replacement](https://github.com/noseglid/atom-build#replacement) placeholders',
    type: 'string',
    default: defaultCustomArguments(),
    order: 0
  },
  manageDependencies: {
    title: 'Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 1
  },
  alwaysEligible: {
    title: 'Always Eligible',
    description: 'The build provider will be available in your project, even when not eligible',
    type: 'boolean',
    default: false,
    order: 2
  }
};

function spawnPromise(cmd, args) {
  return new Promise(function (resolve, reject) {
    const child = spawn(cmd, args);
    let stdOut;
    let stdErr;

    child.stdout.on('data', function (line) {
      stdOut += line.toString().trim();
    });

    child.stderr.on('data', function (line) {
      stdErr += line.toString().trim();
    });

    child.on('close', function (code) {
      if (code === 0) {
        resolve(stdOut);
      }

      reject(stdErr);
    });
  });
}

export function which() {
  return (platform() === 'win32') ? 'where' : 'which';
}

export function provideBuilder() {
  return class PowershellProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe(`${meta.name}.customArguments`, () => this.emit('refresh'));
    }

    getNiceName() {
      return 'PowerShell';
    }

    async isEligible() {
      if (atom.config.get(`${meta.name}.alwaysEligible`) === true) {
        return true;
      }

      const whichCmd = await spawnPromise(which(), ['powershell']);

      if (whichCmd.stdout && whichCmd.stdout.toString()) {
        return true;
      }

      return false;
    }

    settings() {
      const errorMatch = [
        // Unreliable since PowerShell wraps output after 80 characters
        '(?<message>.+)\\nAt (?<file>.+):(?<line>\\d+) char:(?<col>\\d+)'
      ];

      const args = [
        '-NoLogo',
        '-NonInteractive',
        '-NoProfile'
      ];

      // Only add ExecutionPolicy param on Windows
      if (platform() === 'win32') {
        args.push('-ExecutionPolicy');
        args.push('Unrestricted');
      }

      args.push('-File');
      args.push('{FILE_ACTIVE}');

      // User settings
      const customArguments = atom.config.get(`${meta.name}.customArguments`).trim().split(' ');

      return [
        {
          name: 'PowerShell',
          exec: 'powershell',
          args: args,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'powershell:run-script',
          errorMatch: errorMatch
        },
        {
          name: 'PowerShell (user)',
          exec: 'powershell',
          args: customArguments,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'powershell:run-script-with-user-settings',
          errorMatch: errorMatch
        }
      ];
    }
  };
}

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get(`${meta.name}.manageDependencies`) === true) {
    satisfyDependencies('build-powershell');
  }
}
