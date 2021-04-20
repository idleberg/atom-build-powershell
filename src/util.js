import { platform } from 'os';

export function defaultCustomArguments() {
  if (platform() === 'win32') {
    return '-NoLogo -NonInteractive -NoProfile -ExecutionPolicy Unrestricted -File {FILE_ACTIVE}';
  }

  return '-NoLogo -NonInteractive -NoProfile -File {FILE_ACTIVE}';
}

export function which() {
  return (platform() === 'win32') ? 'where' : 'which';
}
