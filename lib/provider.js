'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var os = require('os');
var events = require('events');
var child_process = require('child_process');
var fs = require('fs');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var os__default$1 = /*#__PURE__*/_interopDefaultLegacy(os);
var child_process__default = /*#__PURE__*/_interopDefaultLegacy(child_process);
var fs__default$1 = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default$1 = /*#__PURE__*/_interopDefaultLegacy(path);

var name = "build-powershell";
var version = "0.13.0";
var description = "Atom Build provider for Microsoft PowerShell, runs PowerShell scripts";
var repository = {
	type: "git",
	url: "https://github.com/idleberg/atom-build-powershell.git"
};
var scripts = {
	build: "npm run clean && rollup --config",
	clean: "rimraf ./lib",
	dev: "npm run start",
	"lint:md": "remark . --quiet --frail --ignore-path .gitignore",
	"lint:js": "eslint ./src --ignore-path .gitignore",
	lint: "npm-run-all --parallel lint:*",
	start: "rollup --watch --config",
	test: "npm run lint"
};
var license = "MIT";
var keywords = [
	"buildprovider",
	"powershell",
	"ps1",
	"ps",
	"linter"
];
var main = "lib/provider.js";
var engines = {
	atom: ">=1.0.0 <2.0.0"
};
var activationHooks = [
	"core:loaded-shell-environment"
];
var providedServices = {
	builder: {
		description: "Runs PowerShell scripts",
		versions: {
			"2.0.0": "provideBuilder"
		}
	}
};
var dependencies = {
	"@atxm/developer-console": "^0.5.0",
	"atom-package-deps": "^7.2.2",
	"atom-satisfy-dependencies": "^0.3.0",
	which: "^2.0.2"
};
var devDependencies = {
	"@babel/core": "^7.13.16",
	"@babel/eslint-parser": "^7.13.10",
	"@babel/plugin-proposal-optional-chaining": "^7.13.8",
	"@rollup/plugin-babel": "^5.3.0",
	"@rollup/plugin-commonjs": "^17.1.0",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^11.2.0",
	eslint: "^7.2.2",
	"eslint-plugin-json": "^2.1.2",
	husky: ">=4 <5",
	"lint-staged": "^10.5.4",
	"npm-run-all": "^4.1.5",
	"remark-cli": "^9.0.0",
	rimraf: "^3.0.2",
	rollup: "^2.42.0",
	"rollup-plugin-terser": "^7.0.2"
};
var husky = {
	hooks: {
		"pre-commit": "lint-staged"
	}
};
var meta = {
	name: name,
	version: version,
	description: description,
	repository: repository,
	scripts: scripts,
	license: license,
	keywords: keywords,
	main: main,
	engines: engines,
	activationHooks: activationHooks,
	providedServices: providedServices,
	"package-deps": [
	[
		{
			name: "buildium"
		},
		{
			name: "build"
		}
	]
],
	dependencies: dependencies,
	devDependencies: devDependencies,
	husky: husky,
	"lint-staged": {
	"*.js": "eslint --cache --fix"
}
};

function defaultCustomArguments() {
  if (os.platform() === 'win32') {
    return '-NoLogo -NonInteractive -NoProfile -ExecutionPolicy Unrestricted -File {FILE_ACTIVE}';
  }

  return '-NoLogo -NonInteractive -NoProfile -File {FILE_ACTIVE}';
}

const configSchema = {
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
function getConfig(key) {
  return atom.config.get(`${meta.name}.${key}`);
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

function _interopDefaultLegacy$1(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var os__default = /*#__PURE__*/_interopDefaultLegacy$1(os__default$1['default']);

var fs__default = /*#__PURE__*/_interopDefaultLegacy$1(fs__default$1['default']);

var path__default = /*#__PURE__*/_interopDefaultLegacy$1(path__default$1['default']);

var indentString = (string, count = 1, options) => {
  options = {
    indent: ' ',
    includeEmptyLines: false,
    ...options
  };

  if (typeof string !== 'string') {
    throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof string}\``);
  }

  if (typeof count !== 'number') {
    throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof count}\``);
  }

  if (typeof options.indent !== 'string') {
    throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``);
  }

  if (count === 0) {
    return string;
  }

  const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
  return string.replace(regex, options.indent.repeat(count));
};

const extractPathRegex = /\s+at.*(?:\(|\s)(.*)\)?/;
const pathRegex = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)\.js:\d+:\d+)|native)/;
const homeDir = typeof os__default['default'].homedir === 'undefined' ? '' : os__default['default'].homedir();

var cleanStack = (stack, options) => {
  options = Object.assign({
    pretty: false
  }, options);
  return stack.replace(/\\/g, '/').split('\n').filter(line => {
    const pathMatches = line.match(extractPathRegex);

    if (pathMatches === null || !pathMatches[1]) {
      return true;
    }

    const match = pathMatches[1]; // Electron

    if (match.includes('.app/Contents/Resources/electron.asar') || match.includes('.app/Contents/Resources/default_app.asar')) {
      return false;
    }

    return !pathRegex.test(match);
  }).filter(line => line.trim() !== '').map(line => {
    if (options.pretty) {
      return line.replace(extractPathRegex, (m, p1) => m.replace(p1, p1.replace(homeDir, '~')));
    }

    return line;
  }).join('\n');
};

const cleanInternalStack = stack => stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, '');

class AggregateError extends Error {
  constructor(errors) {
    if (!Array.isArray(errors)) {
      throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
    }

    errors = [...errors].map(error => {
      if (error instanceof Error) {
        return error;
      }

      if (error !== null && typeof error === 'object') {
        // Handle plain error objects with message property and/or possibly other metadata
        return Object.assign(new Error(error.message), error);
      }

      return new Error(error);
    });
    let message = errors.map(error => {
      // The `stack` property is not standardized, so we can't assume it exists
      return typeof error.stack === 'string' ? cleanInternalStack(cleanStack(error.stack)) : String(error);
    }).join('\n');
    message = '\n' + indentString(message, 4);
    super(message);
    this.name = 'AggregateError';
    Object.defineProperty(this, '_errors', {
      value: errors
    });
  }

  *[Symbol.iterator]() {
    for (const error of this._errors) {
      yield error;
    }
  }

}

var aggregateError = AggregateError;

var pMap = async (iterable, mapper, {
  concurrency = Infinity,
  stopOnError = true
} = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof mapper !== 'function') {
      throw new TypeError('Mapper function is required');
    }

    if (!((Number.isSafeInteger(concurrency) || concurrency === Infinity) && concurrency >= 1)) {
      throw new TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${concurrency}\` (${typeof concurrency})`);
    }

    const result = [];
    const errors = [];
    const iterator = iterable[Symbol.iterator]();
    let isRejected = false;
    let isIterableDone = false;
    let resolvingCount = 0;
    let currentIndex = 0;

    const next = () => {
      if (isRejected) {
        return;
      }

      const nextItem = iterator.next();
      const index = currentIndex;
      currentIndex++;

      if (nextItem.done) {
        isIterableDone = true;

        if (resolvingCount === 0) {
          if (!stopOnError && errors.length !== 0) {
            reject(new aggregateError(errors));
          } else {
            resolve(result);
          }
        }

        return;
      }

      resolvingCount++;

      (async () => {
        try {
          const element = await nextItem.value;
          result[index] = await mapper(element, index);
          resolvingCount--;
          next();
        } catch (error) {
          if (stopOnError) {
            isRejected = true;
            reject(error);
          } else {
            errors.push(error);
            resolvingCount--;
            next();
          }
        }
      })();
    };

    for (let i = 0; i < concurrency; i++) {
      next();

      if (isIterableDone) {
        break;
      }
    }
  });
};

const pMap$1 = (iterable, mapper, options) => new Promise((resolve, reject) => {
  options = Object.assign({
    concurrency: Infinity
  }, options);

  if (typeof mapper !== 'function') {
    throw new TypeError('Mapper function is required');
  }

  const {
    concurrency
  } = options;

  if (!(typeof concurrency === 'number' && concurrency >= 1)) {
    throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${concurrency}\` (${typeof concurrency})`);
  }

  const ret = [];
  const iterator = iterable[Symbol.iterator]();
  let isRejected = false;
  let isIterableDone = false;
  let resolvingCount = 0;
  let currentIndex = 0;

  const next = () => {
    if (isRejected) {
      return;
    }

    const nextItem = iterator.next();
    const i = currentIndex;
    currentIndex++;

    if (nextItem.done) {
      isIterableDone = true;

      if (resolvingCount === 0) {
        resolve(ret);
      }

      return;
    }

    resolvingCount++;
    Promise.resolve(nextItem.value).then(element => mapper(element, i)).then(value => {
      ret[i] = value;
      resolvingCount--;
      next();
    }, error => {
      isRejected = true;
      reject(error);
    });
  };

  for (let i = 0; i < concurrency; i++) {
    next();

    if (isIterableDone) {
      break;
    }
  }
});

var pMap_1 = pMap$1; // TODO: Remove this for the next major release

var _default$1 = pMap$1;
pMap_1.default = _default$1;

const pFilter = async (iterable, filterer, options) => {
  const values = await pMap_1(iterable, (element, index) => Promise.all([filterer(element, index), element]), options);
  return values.filter(value => Boolean(value[0])).map(value => value[1]);
};

var pFilter_1 = pFilter; // TODO: Remove this for the next major release

var _default$1$1 = pFilter;
pFilter_1.default = _default$1$1;
const IS_ATOM = typeof atom !== 'undefined';
const IS_DEV = typeof atom !== 'undefined' && (atom.inDevMode() || atom.inSpecMode());
const IGNORED_CONFIG_NAME = 'atom-package-deps.ignored';
/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */

/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;
/**
 * Module exports.
 * @public
 */

var escapeHtml_1 = escapeHtml;
/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        // "
        escape = '&quot;';
        break;

      case 38:
        // &
        escape = '&amp;';
        break;

      case 39:
        // '
        escape = '&#39;';
        break;

      case 60:
        // <
        escape = '&lt;';
        break;

      case 62:
        // >
        escape = '&gt;';
        break;

      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

async function spawnInternal(command, args, options) {
  const spawnedProcess = child_process__default['default'].spawn(command, args, options);
  const promise = new Promise((resolve, reject) => {
    const output = {
      stdout: spawnedProcess.stdout ? [] : null,
      stderr: spawnedProcess.stderr ? [] : null
    };
    spawnedProcess.on('error', reject);

    if (spawnedProcess.stdout) {
      spawnedProcess.stdout.on('data', function (chunk) {
        output.stdout.push(chunk);

        if (options.handleStdout) {
          options.handleStdout(chunk);
        }
      });
    }

    if (spawnedProcess.stderr) {
      spawnedProcess.stderr.on('data', function (chunk) {
        output.stderr.push(chunk);

        if (options.handleStderr) {
          options.handleStderr(chunk);
        }
      });
    }

    spawnedProcess.on('close', code => {
      let outputStdout = null;

      if (output.stdout != null) {
        outputStdout = options.encoding === null || options.encoding === 'buffer' ? Buffer.concat(output.stdout) : output.stdout.join('');
      }

      let outputStderr = null;

      if (output.stderr != null) {
        outputStderr = options.encoding === null || options.encoding === 'buffer' ? Buffer.concat(output.stderr) : output.stderr.join('');
      }

      resolve({
        exitCode: code,
        stdout: outputStdout,
        stderr: outputStderr
      });
    });
  });
  options.handleChildProcess(spawnedProcess);
  return promise;
}

function spawn(command, args, options) {
  let spawnedProcess;
  const promise = spawnInternal(command, args, { ...options,

    handleChildProcess(_spawnedProcess) {
      spawnedProcess = _spawnedProcess;
    }

  });

  promise.kill = function (signal) {
    // TODO: kill all subprocesses on windows with wmic?
    return spawnedProcess.kill(signal);
  };

  return promise;
}

var semverCompare = function cmp(a, b) {
  var pa = a.split('.');
  var pb = b.split('.');

  for (var i = 0; i < 3; i++) {
    var na = Number(pa[i]);
    var nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }

  return 0;
};

async function getDependencies(packageName) {
  const packageModule = atom.packages.getLoadedPackage(packageName);
  const packageDependencies = packageModule && packageModule.metadata['package-deps'];
  return Array.isArray(packageDependencies) ? packageDependencies : [];
}

async function resolveDependencyPath(packageName) {
  return atom.packages.resolvePackagePath(packageName);
}

async function getInstalledDependencyVersion(dependency) {
  var _packageModule$metada;

  const packageModule = atom.packages.getLoadedPackage(dependency.name);
  return packageModule == null ? null : (_packageModule$metada = packageModule.metadata.version) !== null && _packageModule$metada !== void 0 ? _packageModule$metada : null;
}

async function getDependencies$1(packageName) {
  let packageStats = null;

  try {
    packageStats = await fs__default['default'].promises.stat(packageName);
  } catch (_) {// No Op
  }

  if (packageStats == null || !packageStats.isDirectory()) {
    throw new Error(`[Package-Deps] Expected packageName to be a readable directory in Node.js invocation`);
  }

  let parsed = null;

  try {
    const contents = await fs__default['default'].promises.readFile(path__default['default'].join(packageName, 'package.json'), 'utf8');
    parsed = JSON.parse(contents);
  } catch (_) {// Ignore JSON read errors and such
  }

  const packageDependencies = parsed == null || typeof parsed !== 'object' ? [] : parsed['package-deps'];
  return Array.isArray(packageDependencies) ? packageDependencies : [];
}

async function resolveDependencyPath$1(packageName) {
  var _process$env$ATOM_HOM;

  const packageDirectory = path__default['default'].join((_process$env$ATOM_HOM = process.env.ATOM_HOME) !== null && _process$env$ATOM_HOM !== void 0 ? _process$env$ATOM_HOM : path__default['default'].join(os__default['default'].homedir(), '.atom'), 'packages', packageName);

  try {
    await fs__default['default'].promises.access(packageDirectory, fs__default['default'].constants.R_OK);
    return packageDirectory;
  } catch (_) {
    return null;
  }
}

async function getInstalledDependencyVersion$1(dependency) {
  var _manifest$version, _manifest;

  const {
    directory
  } = dependency;

  if (directory == null) {
    // Not possible to get version without resolved directory in Node.js version
    return null;
  }

  let manifest = null;

  try {
    manifest = JSON.parse(await fs__default['default'].promises.readFile(path__default['default'].join(directory, 'package.json'), 'utf8'));
  } catch (_) {
    return null;
  }

  return (_manifest$version = (_manifest = manifest) === null || _manifest === void 0 ? void 0 : _manifest.version) !== null && _manifest$version !== void 0 ? _manifest$version : null;
}
/**
 * Internal helpers
 */


async function getInstalledDependencyVersion$2(dependency) {
  if (IS_ATOM) {
    const atomPackageVersion = await getInstalledDependencyVersion(dependency);

    if (atomPackageVersion) {
      return atomPackageVersion;
    } // If the package isn't activated, it won't be loaded, so fallback to reading manifest file instead

  }

  return getInstalledDependencyVersion$1(dependency);
}
/**
 * Exported helpers
 */


const resolveDependencyPath$2 = IS_ATOM ? resolveDependencyPath : resolveDependencyPath$1;

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message !== null && message !== void 0 ? message : 'Invariant violation');
  }
}

async function getDependencies$2(name) {
  const dependencies = await (IS_ATOM ? getDependencies(name) : getDependencies$1(name));

  if (IS_DEV) {
    invariant(Array.isArray(dependencies), `Dependencies for ${name} are not a valid array`);
    dependencies.forEach((item, index) => {
      if (Array.isArray(item)) {
        item.forEach((subitem, subindex) => {
          const invalidMessage = `Dependency#${index}#${subindex} for ${name} is invalid`;
          invariant(typeof subitem.name === 'string' && subitem.name.length > 0, invalidMessage);
          invariant(subitem.minimumVersion == null || typeof subitem.minimumVersion === 'string' && subitem.minimumVersion.length > 0, invalidMessage);
        });
        invariant(item.length > 0, `Dependency#${index} for ${name} has no group items`);
      } else {
        const invalidMessage = `Dependency#${index} for ${name} is invalid`;
        invariant(typeof item.name === 'string' && item.name.length > 0, invalidMessage);
        invariant(item.minimumVersion == null || typeof item.minimumVersion === 'string' && item.minimumVersion.length > 0, invalidMessage);
      }
    });
  }

  return dependencies;
}

async function shouldInstallDependency(dependency) {
  if (dependency.directory == null) {
    // Not installed, so install
    return true;
  }

  if (dependency.minimumVersion == null) {
    // Already installed and no version defined, so skip
    return false;
  }

  const version = await getInstalledDependencyVersion$2(dependency);

  if (version == null) {
    // Unable to get current version, so install
    return true;
  }

  return semverCompare(dependency.minimumVersion, version) === 1;
}

function isPackageIgnored(name) {
  var _atom$config$get;

  if (!IS_ATOM) {
    // Never ignored in CLI
    return false;
  }

  const ignoredPackages = (_atom$config$get = atom.config.get(IGNORED_CONFIG_NAME)) !== null && _atom$config$get !== void 0 ? _atom$config$get : [];

  if (ignoredPackages.includes(name)) {
    return true;
  }

  return false;
}

function markPackageAsIgnored(name) {
  var _atom$config$get2;

  if (!IS_ATOM) {
    // No op in CLI
    return;
  }

  const ignoredPackages = new Set((_atom$config$get2 = atom.config.get(IGNORED_CONFIG_NAME)) !== null && _atom$config$get2 !== void 0 ? _atom$config$get2 : []);
  ignoredPackages.add(name);
  atom.config.set(IGNORED_CONFIG_NAME, Array.from(ignoredPackages));
}

const INSTALL_VALID_TICKS = new Set(['✓', 'done']);
const INSTALL_VALIDATION_REGEXP = /(?:Installing|Moving) (.*?) to .* (.*)/; // Example success output: Uninstalling linter-ui-default ✓

async function installPackage(dependency) {
  const apmPath = IS_ATOM ? `"${atom.packages.getApmPath()}"` : 'apm';
  const {
    stdout,
    stderr
  } = await spawn(apmPath, ['install', dependency.name, '--production', '--color', 'false'], {
    shell: true
  });
  const match = INSTALL_VALIDATION_REGEXP.exec(stdout.trim());

  if (match != null && INSTALL_VALID_TICKS.has(match[2])) {
    // Installation complete and verified
    return;
  }

  const error = new Error(`Error installing dependency: ${dependency.name}`);
  error.stack = stderr.trim();
  throw error;
}

async function getResolvedDependency(item) {
  // string entry
  if (typeof item === 'string') {
    return {
      name: item,
      directory: await resolveDependencyPath$2(item)
    };
  }

  if ('name' in item) {
    return { ...item,
      directory: await resolveDependencyPath$2(item.name)
    };
  }

  console.error(`This package-deps entry is not valid. Please see https://github.com/steelbrain/package-deps#how-it-works`, {
    entry: item
  });
  throw Error(`The package-deps entry is not valid. Please see https://github.com/steelbrain/package-deps#how-it-works`);
}

let showResetInstruction = true;

function confirmPackagesToInstall({
  packageName,
  dependencies
}) {
  return new Promise(resolve => {
    const ungroupedDependencies = dependencies.filter(item => !Array.isArray(item));
    const groupedDependencies = dependencies.filter(item => Array.isArray(item));
    const skipGroups = groupedDependencies.length === 0;
    const detail = skipGroups ? ungroupedDependencies.map(item => item.name).join(', ') : 'Something went wrong. Check your developer console';
    const groupChoices = groupedDependencies.map(item => item[0]); // If Atom "notifications" package is disabled output a warning in case no other notifications package is installed.

    if (atom.packages.isPackageDisabled('notifications')) {
      console.warn(`Enable notifications to install dependencies for ${packageName}`);
    }

    const notification = atom.notifications.addInfo(`${packageName} needs to install dependencies`, {
      dismissable: true,
      icon: 'cloud-download',
      detail,
      description: `Install dependenc${dependencies.length === 1 ? 'y' : 'ies'}?`,
      buttons: [{
        text: 'Yes',
        onDidClick: () => {
          if (skipGroups) {
            resolve([]);
          } else {
            resolve(ungroupedDependencies.concat(groupChoices));
          }

          notification.dismiss();
        }
      }, {
        text: 'No Thanks',
        onDidClick: () => {
          notification.dismiss();
        }
      }, {
        text: 'Never',
        onDidClick: () => {
          markPackageAsIgnored(packageName);

          if (showResetInstruction) {
            showResetInstruction = false;
            atom.notifications.addInfo('How to reset package-deps memory', {
              dismissable: true,
              description: "To modify the list of ignored files invoke 'Application: Open Your Config' and change the 'atom-package-deps' section"
            });
          }

          notification.dismiss();
        }
      }]
    });
    notification.onDidDismiss(() => resolve([]));

    if (skipGroups) {
      return;
    } // Handle groups


    try {
      var _notificationView$ele;

      const notificationView = atom.views.getView(notification);
      const notificationElement = (_notificationView$ele = notificationView === null || notificationView === void 0 ? void 0 : notificationView.element) !== null && _notificationView$ele !== void 0 ? _notificationView$ele : null;

      if (notificationElement == null) {
        throw new Error('Unable to get notification element from view');
      }

      const notificationContent = notificationElement.querySelector('.detail-content');

      if (notificationContent == null) {
        throw new Error('Content detail container not found inside the notification');
      } // Clear the contents and add some skel


      notificationContent.innerHTML = ''; // Add list of ungroup dependencies to the top of the notification

      if (ungroupedDependencies.length > 0) {
        const ungroupedLine = document.createElement('div');
        ungroupedLine.innerHTML = `Packages without choices: <br /><ul><li>${ungroupedDependencies.map(item => escapeHtml_1(item.name)).join('</li><li>')}</li></ul>`;
        notificationContent.appendChild(ungroupedLine);
      } // Create a label line for groups


      const groupLabelLine = document.createElement('div');
      groupLabelLine.innerHTML = `Packages with choices:`;
      notificationContent.appendChild(groupLabelLine); // Create one line per group with a select inside

      const groupedList = document.createElement('ul');
      groupedDependencies.forEach((item, index) => {
        const listItem = document.createElement('li');
        const select = document.createElement('select');
        select.innerHTML = item.map(subitem => `<option>${escapeHtml_1(subitem.name)}</option>`).join('\n');
        select.addEventListener('change', () => {
          // Change the selected value for this index for resolve to use
          const subitem = item.find(entry => entry.name === select.value);

          if (subitem != null) {
            groupChoices[index] = subitem;
          }
        });
        listItem.style.marginTop = '5px';
        listItem.appendChild(select);
        groupedList.appendChild(listItem);
      });
      notificationContent.appendChild(groupedList);
    } catch (err) {
      console.error('[Package-Deps] Error during showing package choices to user', err);
    }
  });
}

function getView({
  packageName,
  dependencies
}) {
  const failed = [];
  const notification = atom.notifications.addInfo(`Installing ${packageName} dependencies`, {
    detail: `Installing ${dependencies.map(item => item.name).join(', ')}`,
    dismissable: true
  });
  const progress = document.createElement('progress');
  progress.max = dependencies.length;
  progress.style.width = '100%';

  try {
    var _notificationView$ele2;

    const notificationView = atom.views.getView(notification);
    const notificationElement = (_notificationView$ele2 = notificationView === null || notificationView === void 0 ? void 0 : notificationView.element) !== null && _notificationView$ele2 !== void 0 ? _notificationView$ele2 : null;

    if (notificationElement == null) {
      throw new Error('Unable to get notification element from view');
    }

    const notificationContent = notificationElement.querySelector('.detail-content');

    if (notificationContent == null) {
      throw new Error('Content detail container not found inside the notification');
    }

    notificationContent.appendChild(progress);
  } catch (err) {
    console.error('[Package-Deps] Error during showing installation progress to user', err);
  }

  return {
    handleFailure({
      dependency,
      error
    }) {
      var _error$stack;

      failed.push(dependency.name);
      progress.value += 1;
      console.error(`[Package-Deps] Unable to install ${dependency.name}, Error:`, (_error$stack = error === null || error === void 0 ? void 0 : error.stack) !== null && _error$stack !== void 0 ? _error$stack : error);
    },

    handleDependencyInstalled(dependency) {
      progress.value += 1;
    },

    handleComplete() {
      notification.dismiss();

      if (failed.length > 0) {
        atom.notifications.addWarning(`Failed to install ${packageName} dependencies`, {
          detail: `These packages were not installed, check your console\nfor more info.\n${failed.join('\n')}`,
          dismissable: true
        });
      } else {
        atom.notifications.addSuccess(`Installed ${packageName} dependencies`, {
          detail: `Installed ${dependencies.map(item => item.name).join(', ')}`
        });
      }

      Promise.all(dependencies.map(item => {
        if (!failed.includes(item.name)) {
          return atom.packages.activatePackage(item.name);
        }

        return null;
      })).catch(err => {
        console.error(`[Package-Deps] Error activating installed packages for ${packageName}`, err);
      });
    }

  };
}

async function confirmPackagesToInstall$1({
  dependencies
}) {
  // No user interaction on the CLI. Install the first (aka "default" choice) package
  return dependencies.map(item => Array.isArray(item) ? item[0] : item);
}

function getView$1({
  dependencies
}) {
  let failed = false;
  console.log(`Installing dependencies:\n${dependencies.map(item => `  - ${item.name}`).join('\n')}`);
  return {
    handleFailure({
      dependency,
      error
    }) {
      var _error$stack;

      failed = true;
      console.error(`Unable to install ${dependency.name}, Error:`, (_error$stack = error === null || error === void 0 ? void 0 : error.stack) !== null && _error$stack !== void 0 ? _error$stack : error);
    },

    handleDependencyInstalled(dependency) {
      console.log('Successfully installed', dependency.name);
    },

    handleComplete() {
      console.log('Installation complete');

      if (failed) {
        // Fail the invocation
        process.exitCode = 1;
      }
    }

  };
}

const getView$2 = IS_ATOM ? getView : getView$1;
const confirmPackagesToInstall$2 = IS_ATOM ? confirmPackagesToInstall : confirmPackagesToInstall$1;

async function install(packageName, hideUserPrompt = false) {
  invariant(typeof packageName === 'string' && packageName.length > 0, '[Package-Deps] Package name is required');

  if (isPackageIgnored(packageName)) {
    // User ignored this package
    return;
  } // Get list of relevant dependencies


  const dependencies = await getDependencies$2(packageName);

  if (dependencies.length === 0) {
    // Short-circuit
    return;
  } // Resolve directories of relevant dependencies


  const resolvedDependencies = await Promise.all(dependencies.map(async item => {
    if (Array.isArray(item)) {
      return Promise.all(item.map(getResolvedDependency));
    }

    return getResolvedDependency(item);
  })); // Filter out already installed, in range dependencies
  // If one dependency from a group is already installed, whole group is ignored

  const dependenciesToInstall = await pFilter_1(resolvedDependencies, async function (item) {
    if (Array.isArray(item)) {
      return (await Promise.all(item.map(subitem => shouldInstallDependency(subitem)))).every(Boolean);
    }

    return shouldInstallDependency(item);
  });

  if (dependenciesToInstall.length === 0) {
    // Short-circuit if all have been skipped
    return;
  }

  let chosenDependencies;

  if (!hideUserPrompt) {
    chosenDependencies = await confirmPackagesToInstall$2({
      packageName,
      dependencies: dependenciesToInstall
    });
  } else {
    // prompt-less installation
    chosenDependencies = dependenciesToInstall.map(dep => {
      if (Array.isArray(dep)) {
        return dep[0];
      }

      return dep;
    });
  }

  if (chosenDependencies.length === 0) {
    // Short-circuit if user interaction cancelled all
    return;
  }

  const view = getView$2({
    packageName,
    dependencies: chosenDependencies
  });
  await pMap(chosenDependencies, async function (dependency) {
    try {
      await installPackage(dependency);
      view.handleDependencyInstalled(dependency);
    } catch (err) {
      view.handleFailure({
        dependency,
        error: err
      });
    }
  }, {
    concurrency: 2
  });
  view.handleComplete();
}

var install_1 = install;

var lib$2 = /*#__PURE__*/Object.defineProperty({
	install: install_1
}, '__esModule', {value: true});

const callsites = () => {
  const _prepareStackTrace = Error.prepareStackTrace;

  Error.prepareStackTrace = (_, stack) => stack;

  const stack = new Error().stack.slice(1);
  Error.prepareStackTrace = _prepareStackTrace;
  return stack;
};

var callsites_1 = callsites; // TODO: Remove this for the next major release

var _default = callsites;
callsites_1.default = _default;

var callerCallsite = ({
  depth = 0
} = {}) => {
  const callers = [];
  const callerFileSet = new Set();

  for (const callsite of callsites_1()) {
    const fileName = callsite.getFileName();
    const hasReceiver = callsite.getTypeName() !== null && fileName !== null;

    if (!callerFileSet.has(fileName)) {
      callerFileSet.add(fileName);
      callers.unshift(callsite);
    }

    if (hasReceiver) {
      return callers[depth];
    }
  }
};

var lib$1 = createCommonjsModule(function (module, exports) {

var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = commonjsGlobal && commonjsGlobal.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readManifestSync = exports.readManifest = void 0;

var resolve = path__default$1['default'].resolve,
    sep = path__default$1['default'].sep;

var fs = fs__default$1['default'].promises,
    readFileSync = fs__default$1['default'].readFileSync;



function readManifest(packageName) {
  if (packageName === void 0) {
    packageName = '';
  }

  return __awaiter(this, void 0, void 0, function () {
    var filePath, fileContents;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          filePath = resolveFilePath(packageName);
          _a.label = 1;

        case 1:
          _a.trys.push([1, 3,, 4]);

          return [4
          /*yield*/
          , fs.readFile(filePath, 'utf8')];

        case 2:
          fileContents = _a.sent();
          return [2
          /*return*/
          , JSON.parse(fileContents)];

        case 3:
          _a.sent();
          return [2
          /*return*/
          , null];

        case 4:
          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.readManifest = readManifest;

function readManifestSync(packageName) {
  if (packageName === void 0) {
    packageName = '';
  }

  var filePath = resolveFilePath(packageName);

  try {
    var fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (err) {
    return null;
  }
}

exports.readManifestSync = readManifestSync;

function resolveFilePath(packageName) {
  packageName = (packageName === null || packageName === void 0 ? void 0 : packageName.length) ? packageName : getPackageName();
  var packagePath = atom.packages.resolvePackagePath(packageName);
  var filePath = resolve(packagePath, 'package.json');
  return filePath;
}

function getPackageName() {
  var callerPath = callerCallsite().getFileName();
  var packageDirPaths = atom.packages.getPackageDirPaths();
  var intersection = packageDirPaths.filter(function (packageDirPath) {
    return callerPath.startsWith(packageDirPath);
  });

  if (intersection === null || intersection === void 0 ? void 0 : intersection.length) {
    return callerPath.replace(intersection[0], '').split(sep).filter(function (fragment) {
      return fragment;
    })[0] || '';
  }

  return '';
}
});

var lib = createCommonjsModule(function (module, exports) {

var __assign = commonjsGlobal && commonjsGlobal.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = commonjsGlobal && commonjsGlobal.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.satisfyDependencies = void 0;





var defaultOptions = {
  logger: console.log
};
/**
 * Installs and optionally enables package dependencies
 * @param {string} identifier
 * @param {Object} options
 */

function satisfyDependencies(identifier, userOptions) {
  if (userOptions === void 0) {
    userOptions = {};
  }

  return __awaiter(this, void 0, void 0, function () {
    var options, manifest;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          options = __assign(__assign({}, defaultOptions), userOptions);
          return [4
          /*yield*/
          , lib$1.readManifest(identifier)];

        case 1:
          manifest = _a.sent();
          return [4
          /*yield*/
          , lib$2.install(manifest['name'])];

        case 2:
          _a.sent();

          enableDependencies(manifest['package-deps'], options);
          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.satisfyDependencies = satisfyDependencies;
/**
 * Enables packages dependencies
 * @param {Object} manifest
 * @param {Object} options
 */

function enableDependencies(manifest, options) {
  if (options.enableDependencies) {
    manifest['package-deps'].map(function (packageDependency) {
      if (atom.packages.isPackageDisabled(packageDependency)) {
        if (atom.inDevMode()) {
          options.logger("[" + manifest.name + "] Enabling package dependency '" + packageDependency + "'");
        }

        atom.packages.enablePackage(packageDependency);
      }
    });
  }
}
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __spreadArray(to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
}

var DeveloperConsole =
/** @class */
function () {
  function DeveloperConsole(options) {
    if (options === void 0) {
      options = {};
    }

    this.name = options.name;
    this.styleSheet = "\n      background-color: " + (options.backgroundColor || 'darkgrey') + ";\n      border-radius: 2px;\n      color: " + (options.color || 'white') + ";\n      line-height: 1.5;\n      padding: 1px 4px;\n      text-shadow: 0 1px 0px rgba(0, 0, 0, 0.2);\n    ";
  }

  DeveloperConsole.prototype.__console__ = function (type) {
    var _a;

    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    if (!(atom === null || atom === void 0 ? void 0 : atom.inDevMode())) return;
    args.unshift("%c" + this.name + "%c", this.styleSheet, '');

    (_a = window.console)[type].apply(_a, args);
  };

  DeveloperConsole.prototype.debug = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.__console__.apply(this, __spreadArray(['debug'], data));
  };

  DeveloperConsole.prototype.error = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.__console__.apply(this, __spreadArray(['error'], data));
  };

  DeveloperConsole.prototype.info = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.__console__.apply(this, __spreadArray(['info'], data));
  };

  DeveloperConsole.prototype.log = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.__console__.apply(this, __spreadArray(['log'], data));
  };

  DeveloperConsole.prototype.trace = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.__console__.apply(this, __spreadArray(['trace'], data));
  };

  DeveloperConsole.prototype.warn = function () {
    var data = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }

    this.__console__.apply(this, __spreadArray(['warn'], data));
  };

  return DeveloperConsole;
}();

var Logger = new DeveloperConsole({
  name: meta.name,
  backgroundColor: 'rosybrown'
});

var windows = isexe$2;
isexe$2.sync = sync$2;



function checkPathExt(path, options) {
  var pathext = options.pathExt !== undefined ? options.pathExt : process.env.PATHEXT;

  if (!pathext) {
    return true;
  }

  pathext = pathext.split(';');

  if (pathext.indexOf('') !== -1) {
    return true;
  }

  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase();

    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true;
    }
  }

  return false;
}

function checkStat$1(stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false;
  }

  return checkPathExt(path, options);
}

function isexe$2(path, options, cb) {
  fs__default$1['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat$1(stat, path, options));
  });
}

function sync$2(path, options) {
  return checkStat$1(fs__default$1['default'].statSync(path), path, options);
}

var mode = isexe$1;
isexe$1.sync = sync$1;



function isexe$1(path, options, cb) {
  fs__default$1['default'].stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options));
  });
}

function sync$1(path, options) {
  return checkStat(fs__default$1['default'].statSync(path), options);
}

function checkStat(stat, options) {
  return stat.isFile() && checkMode(stat, options);
}

function checkMode(stat, options) {
  var mod = stat.mode;
  var uid = stat.uid;
  var gid = stat.gid;
  var myUid = options.uid !== undefined ? options.uid : process.getuid && process.getuid();
  var myGid = options.gid !== undefined ? options.gid : process.getgid && process.getgid();
  var u = parseInt('100', 8);
  var g = parseInt('010', 8);
  var o = parseInt('001', 8);
  var ug = u | g;
  var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
  return ret;
}

var core;

if (process.platform === 'win32' || commonjsGlobal.TESTING_WINDOWS) {
  core = windows;
} else {
  core = mode;
}

var isexe_1 = isexe;
isexe.sync = sync;

function isexe(path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided');
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er);
        } else {
          resolve(is);
        }
      });
    });
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null;
        is = false;
      }
    }

    cb(er, is);
  });
}

function sync(path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {});
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false;
    } else {
      throw er;
    }
  }
}

const isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';



const COLON = isWindows ? ';' : ':';



const getNotFoundError = cmd => Object.assign(new Error(`not found: ${cmd}`), {
  code: 'ENOENT'
});

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON; // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.

  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [''] : [// windows always checks the cwd first
  ...(isWindows ? [process.cwd()] : []), ...(opt.path || process.env.PATH ||
  /* istanbul ignore next: very unusual */
  '').split(colon)];
  const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM' : '';
  const pathExt = isWindows ? pathExtExe.split(colon) : [''];

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '') pathExt.unshift('');
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe
  };
};

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }

  if (!opt) opt = {};
  const {
    pathEnv,
    pathExt,
    pathExtExe
  } = getPathInfo(cmd, opt);
  const found = [];

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length) return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
    const pCmd = path__default$1['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
    resolve(subStep(p, i, 0));
  });

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length) return resolve(step(i + 1));
    const ext = pathExt[ii];
    isexe_1(p + ext, {
      pathExt: pathExtExe
    }, (er, is) => {
      if (!er && is) {
        if (opt.all) found.push(p + ext);else return resolve(p + ext);
      }

      return resolve(subStep(p, i, ii + 1));
    });
  });

  return cb ? step(0).then(res => cb(null, res), cb) : step(0);
};

const whichSync = (cmd, opt) => {
  opt = opt || {};
  const {
    pathEnv,
    pathExt,
    pathExtExe
  } = getPathInfo(cmd, opt);
  const found = [];

  for (let i = 0; i < pathEnv.length; i++) {
    const ppRaw = pathEnv[i];
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
    const pCmd = path__default$1['default'].join(pathPart, cmd);
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;

    for (let j = 0; j < pathExt.length; j++) {
      const cur = p + pathExt[j];

      try {
        const is = isexe_1.sync(cur, {
          pathExt: pathExtExe
        });

        if (is) {
          if (opt.all) found.push(cur);else return cur;
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length) return found;
  if (opt.nothrow) return null;
  throw getNotFoundError(cmd);
};

var which_1 = which;
which.sync = whichSync;

function provideBuilder() {
  return class PowershellProvider extends events.EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe(`${meta.name}.customArguments`, () => this.emit('refresh'));
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

      if (Boolean(which_1.sync('powershell', whichOptions)) || Boolean(which_1.sync('pwsh', whichOptions))) {
        Logger.log('Build provider is eligible');
        return true;
      }

      Logger.error('Build provider isn\'t eligible');
      return false;
    }

    settings() {
      const errorMatch = [// Unreliable since PowerShell wraps output after 80 characters
      '(?<message>.+)\\nAt (?<file>.+):(?<line>\\d+) char:(?<col>\\d+)'];
      const args = ['-NoLogo', '-NonInteractive', '-NoProfile']; // Only add ExecutionPolicy param on Windows

      if (os.platform() === 'win32') {
        args.push('-ExecutionPolicy');
        args.push('Unrestricted');
      }

      args.push('-File');
      args.push('{FILE_ACTIVE}'); // User settings

      const customArguments = getConfig('customArguments').trim().split(' ');
      return [{
        name: 'PowerShell',
        exec: 'powershell',
        args: args,
        cwd: '{FILE_ACTIVE_PATH}',
        sh: false,
        atomCommandName: 'powershell:run-script',
        errorMatch: errorMatch
      }, {
        name: 'PowerShell (user)',
        exec: 'powershell',
        args: customArguments,
        cwd: '{FILE_ACTIVE_PATH}',
        sh: false,
        atomCommandName: 'powershell:run-script-with-user-settings',
        errorMatch: errorMatch
      }];
    }

  };
}
function activate() {
  Logger.log('Activating package'); // This package depends on build, make sure it's installed

  if (getConfig('manageDependencies') === true) {
    lib.satisfyDependencies(meta.name);
  }
}
function deactivate() {
  Logger.log('Deactivating package');
}

exports.activate = activate;
exports.config = configSchema;
exports.deactivate = deactivate;
exports.provideBuilder = provideBuilder;
//# sourceMappingURL=provider.js.map
