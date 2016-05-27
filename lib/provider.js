'use babel';

import {exec} from 'child_process';
import os from 'os';

const debug = atom.config.get('build-powershell.debug');

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
            if (debug === true) console.log('[build-powershell] PowerShell is not installed');
            return false;
          }
          if (debug === true) console.log('[build-powershell]' + stdout);
        });
        return true;
      }
      return false;
    }

    settings() {
      const cwdPath = '{FILE_ACTIVE_PATH}';
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
        cwd: cwdPath,
        sh: false,
        atomCommandName: 'powershell:run-script',
        errorMatch: errorMatch
      };
    }
  };
}
