# build-powershell

[![apm](https://img.shields.io/apm/l/build-powershell.svg?style=flat-square)](https://atom.io/packages/build-powershell)
[![apm](https://img.shields.io/apm/v/build-powershell.svg?style=flat-square)](https://atom.io/packages/build-powershell)
[![apm](https://img.shields.io/apm/dm/build-powershell.svg?style=flat-square)](https://atom.io/packages/build-powershell)
[![Travis](https://img.shields.io/travis/idleberg/atom-build-powershell.svg?style=flat-square)](https://travis-ci.org/idleberg/atom-build-powershell)
[![David](https://img.shields.io/david//idleberg/atom-build-powershell.svg?style=flat-square)](https://david-dm.org/idleberg/atom-build-powershell)
[![David](https://img.shields.io/david/dev/idleberg/atom-build-powershell.svg?style=flat-square)](https://david-dm.org/idleberg/atom-build-powershell?type=dev)

[Atom Build](https://atombuild.github.io/) provider for Microsoft PowerShell, runs PowerShell scripts. Supports the [linter](https://atom.io/packages/linter) package for error highlighting.

## Installation

### apm

Install `build-powershell` from Atom's [Package Manager](http://flight-manual.atom.io/using-atom/sections/atom-packages/) or the command-line equivalent:

`$ apm install build-powershell`

### Using Git

Change to your Atom packages directory:

```bash
# Windows
$ cd %USERPROFILE%\.atom\packages

# Linux & macOS
$ cd ~/.atom/packages/
```

Clone repository as `build-powershell`:

```bash
$ git clone https://github.com/idleberg/atom-build-powershell build-powershell
```

Inside the cloned directory, install Node dependencies:

```bash
$ yarn || npm install
```

## Usage

### Build

Before you can build, select an active target with your preferred build option.

Available targets:

* `PowerShell` — runs PowerShell script
* `PowerShell (user)` — runs PowerShell script with custom arguments specified in the package settings

### Shortcuts

Here's a reminder of the default shortcuts you can use with this package:

**Choose target**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> or <kbd>F7</kbd>

**Toggle build panel**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>V</kbd> or <kbd>F8</kbd>

**Build script**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> or <kbd>F9</kbd>

## License

This work is licensed under the [The MIT License](LICENSE.md).

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/atom-build-powershell) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`