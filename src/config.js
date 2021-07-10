import { platform } from 'os';
import { name } from '../package.json';

function defaultCustomArguments() {
  if (platform() === 'win32') {
    return '-NoLogo -NonInteractive -NoProfile -ExecutionPolicy Unrestricted -File {FILE_ACTIVE}';
  }

  return '-NoLogo -NonInteractive -NoProfile -File {FILE_ACTIVE}';
}

export const configSchema = {
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

export function getConfig(key) {
  return atom.config.get(`${name}.${key}`);
}
