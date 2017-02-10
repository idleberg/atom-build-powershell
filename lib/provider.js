'use babel';

import { spawnSync } from 'child_process';
import { EventEmitter } from 'events';
import os from 'os';

// Package settings
import meta from '../package.json';

let defaultCustomArguments;
let which;
if (os.platform() === 'win32') {
  defaultCustomArguments = '-NoLogo -NonInteractive -NoProfile -ExecutionPolicy Unrestricted -File {FILE_ACTIVE}';
  which = 'where';
} else {
  defaultCustomArguments = '-NoLogo -NonInteractive -NoProfile -File {FILE_ACTIVE}';
  which = 'which';
}

this.config = {
  customArguments: {
    title: 'Custom Arguments',
    description: 'Specify your preferred arguments for `powershell`, supports [replacement](https://github.com/noseglid/atom-build#replacement) placeholders',
    type: 'string',
    'default': defaultCustomArguments,
    order: 0
  },
  manageDependencies: {
    title: 'Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 1
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get(meta.name + '.manageDependencies') && !atom.inSpecMode()) {
    this.satisfyDependencies();
  }
}

export function satisfyDependencies() {
  let k;
  let v;

  require('atom-package-deps').install(meta.name);

  const ref = meta['package-deps'];
  const results = [];

  for (k in ref) {
    if (typeof ref !== 'undefined' && ref !== null) {
      v = ref[k];
      if (atom.packages.isPackageDisabled(v)) {
        if (atom.inDevMode()) {
          console.log('Enabling package \'' + v + '\'');
        }
        results.push(atom.packages.enablePackage(v));
      } else {
        results.push(void 0);
      }
    }
  }
  return results;
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
      const cmd = spawnSync(which, ['powershell']);
      if (!cmd.stdout.toString()) {
        return false;
      }

      return true;
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
      if (os.platform() === 'win32') {
        args.push('-ExecutionPolicy');
        args.push('Unrestricted');
      }

      args.push('-File');
      args.push('{FILE_ACTIVE}');

      // User settings
      const customArguments = atom.config.get(meta.name + '.customArguments').trim().split(' ');

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
