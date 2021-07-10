import { configSchema, getConfig } from './config';
import { EventEmitter } from 'events';
import { platform } from 'os';
import { satisfyDependencies } from 'atom-satisfy-dependencies';
import Logger from './log';
import { name } from '../package.json';
import which from 'which';

export { configSchema as config };

export function provideBuilder() {
  return class PowershellProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe(`${name}.customArguments`, () => this.emit('refresh'));
    }

    getNiceName() {
      return 'PowerShell';
    }

    isEligible() {
      if (getConfig('alwaysEligible')) {
        Logger.log('Always eligible');
        return true;
      }

      const whichOptions = {
        nothrow: true
      };

      if (Boolean(which.sync('powershell', whichOptions)) || Boolean(which.sync('pwsh', whichOptions))) {
        Logger.log('Build provider is eligible');
        return true;
      }

      Logger.error('Build provider isn\'t eligible');
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

export function activate() {
  Logger.log('Activating package');

  // This package depends on build, make sure it's installed
  if (getConfig('manageDependencies') === true) {
    satisfyDependencies(name);
  }
}

export function deactivate() {
  Logger.log('Deactivating package');
}
