'use babel';

import os from 'os';

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
        return true;
      }
      return false;
    }

    settings() {
      const cwdPath = '{FILE_ACTIVE_PATH}';
      const errorMatch = [
        null
      ];
      const args = [
        '-NoLogo',
        '-ExecutionPolicy', 'bypass',
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
