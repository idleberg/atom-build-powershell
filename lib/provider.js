'use babel';

import {exec} from 'child_process';
import os from 'os';

// Package settings
import meta from '../package.json';
const debug = atom.config.get(`${meta.name}.debug`);
const notEligible = `**${meta.name}**: \`powershell\` is not in your PATH`;

// This package depends on build, make sure it's installed
export default {
  activate() {
    require('atom-package-deps').install(meta.name);
  },
};

export function provideBuilder() {
  return class PowershellProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'PowerShell';
    }

    isEligible() {
      if (os.platform() === 'win32') {
        exec('where powershell', function (error, stdout, stderr) {
          if (error !== null) {
            // No PowerShell installed
            if (debug === true) atom.notifications.addError(notEligible, { detail: error, dismissable: true });
            return false;
          }
          if (debug === true) atom.notifications.addInfo(`**${meta.name}**`, { detail: stdout, dismissable: false });
        });
        return true;
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

      return {
        name: 'PowerShell',
        exec: 'powershell',
        args: args,
        cwd: '{FILE_ACTIVE_PATH}',
        sh: false,
        atomCommandName: 'powershell:run-script',
        errorMatch: errorMatch
      };
    }
  };
}