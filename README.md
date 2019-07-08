# build-powershell

[![apm](https://flat.badgen.net/apm/license/build-powershell)](https://atom.io/packages/build-powershell)
[![apm](https://flat.badgen.net/apm/v/build-powershell)](https://atom.io/packages/build-powershell)
[![apm](https://flat.badgen.net/apm/dl/build-powershell)](https://atom.io/packages/build-powershell)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/atom-build-powershell)](https://circleci.com/gh/idleberg/atom-build-powershell)
[![David](https://flat.badgen.net/david/dep/idleberg/atom-build-powershell)](https://david-dm.org/idleberg/atom-build-powershell)

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