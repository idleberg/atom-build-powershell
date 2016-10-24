'use babel';

import { install } from 'atom-package-deps';
import { execSync } from 'child_process';
import os from 'os';
import { EventEmitter } from 'events';

// Package settings
import meta from '../package.json';

this.config = {
  customArguments: {
    title: 'Custom Arguments',
    description: 'Specify your preferred arguments for `powershell`, supports [replacement](https://github.com/noseglid/atom-build#replacement) placeholders',
    type: 'string',
    'default': '-NoLogo -NonInteractive -NoProfile -ExecutionPolicy Bypass -File {FILE_ACTIVE}',
    order: 0
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
}

export function provideBuilder() {
  return class PowershellProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe('build-powershell.customArguments', () => this.emit('refresh'));
    }

    getNiceName() {
      return 'PowerShell';
    }

    isEligible() {
      if (os.platform() === 'win32') {
        try {
          let stdout = execSync('where powershell');
          if (atom.inDevMode()) atom.notifications.addInfo(meta.name, { detail: stdout, dismissable: false });
          return true;
        } catch (error) {
          if (atom.inDevMode()) atom.notifications.addError(meta.name, { detail: error, dismissable: true });
          return false;
        }
      }
      return false;
    }

    settings() {
      const errorMatch = [
        '\\nAt (?<file>\\w{1}:[^:]+):(?<line>\\d+) char:(?<col>\\d+)'
      ];
      const args = [
        '-NoLogo',
        '-NonInteractive',
        '-NoProfile',
        '-ExecutionPolicy', 'Bypass',
        '-File',
        '{FILE_ACTIVE}'
      ];

      // User settings
      const customArguments = atom.config.get('build-powershell.customArguments').trim().split(' ');

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
