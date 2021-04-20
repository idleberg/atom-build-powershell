import { configSchema } from './config';
import { defaultCustomArguments, which } from './util';
import { EventEmitter } from 'events';
import { platform } from 'os';
import { satisfyDependencies } from 'atom-satisfy-dependencies';
import { spawnSync } from 'child_process';
import meta from '../package.json';

export { configSchema as config };

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

    isEligible() {
      if (getConfig('alwaysEligible') === true) {
        return true;
      }

      const whichCmd = spawnSync(which(), ['powershell']);

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
      const customArguments = getConfig('customArguments').trim().split(' ');

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
  if (getConfig('manageDependencies') === true) {
    satisfyDependencies(meta.name);
  }
}
