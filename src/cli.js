#! /usr/bin/env node

import 'source-map-support/register';
import program from 'commander';
import nativefier from './index';

const packageJson = require('./../package');

function collect(val, memo) {
  memo.push(val);
  return memo;
}

if (require.main === module) {
  program
    .version(packageJson.version)
    .arguments('<targetUrl> [dest]')
    .action((targetUrl, appDir) => {
      program.targetUrl = targetUrl;
      program.out = appDir;
    })
    .option('-n, --name <value>', 'app name')
    .option('-p, --platform <value>', '\'osx\', \'linux\' or \'windows\'')
    .option('-a, --arch <value>', '\'ia32\' or \'x64\' or \'armv7l\'')
    .option('-e, --electron-version <value>', 'electron version to package, without the \'v\', see https://github.com/atom/electron/releases')
    .option('--no-overwrite', 'do not override output directory if it already exists, defaults to false')
    .option('-c, --conceal', 'packages the source code within your app into an archive, defaults to false, see http://electron.atom.io/docs/v0.36.0/tutorial/application-packaging/')
    .option('--counter', 'if the target app should use a persistant counter badge in the dock (OSX only), defaults to false')
    .option('-i, --icon <value>', 'the icon file to use as the icon for the app (should be a .icns file on OSX, .png for Windows and Linux)')
    .option('--width <value>', 'set window default width, defaults to 1280px', parseInt)
    .option('--height <value>', 'set window default height, defaults to 800px', parseInt)
    .option('--min-width <value>', 'set window minimum width, defaults to 0px', parseInt)
    .option('--min-height <value>', 'set window minimum height, defaults to 0px', parseInt)
    .option('--max-width <value>', 'set window maximum width, default is no limit', parseInt)
    .option('--max-height <value>', 'set window maximum height, default is no limit', parseInt)
    .option('-m, --show-menu-bar', 'set menu bar visible, defaults to false')
    .option('-f, --fast-quit', 'quit app after window close (OSX only), defaults to false')
    .option('-u, --user-agent <value>', 'set the user agent string for the app')
    .option('--honest', 'prevent the nativefied app from changing the user agent string to masquerade as a regular chrome browser')
    .option('--ignore-certificate', 'ignore certificate related errors')
    .option('--insecure', 'enable loading of insecure content, defaults to false')
    .option('--flash', 'if flash should be enabled')
    .option('--flash-path <value>', 'path to Chrome flash plugin, find it in `Chrome://plugins`')
    .option('--disk-cache-size <value>', 'forces the maximum disk space (in bytes) to be used by the disk cache')
    .option('--inject <value>', 'path to a CSS/JS file to be injected', collect, [])
    .option('--full-screen', 'if the app should always be started in full screen')
    .option('--maximize', 'if the app should always be started maximized')
    .option('--hide-window-frame', 'disable window frame and controls')
    .option('--verbose', 'if verbose logs should be displayed')
    .option('--disable-context-menu', 'disable the context menu')
    .option('--disable-dev-tools', 'disable developer tools')
    .option('--zoom <value>', 'default zoom factor to use when the app is opened, defaults to 1.0', parseFloat)
    .option('--internal-urls <value>', 'regular expression of URLs to consider "internal"; all other URLs will be opened in an external browser.  (default: URLs on same second-level domain as app)')
    .option('--crash-reporter <value>', 'remote server URL to send crash reports')
    .option('--single-instance', 'allow only a single instance of the application')
    .parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.help();
  }

  nativefier(program, (error, appPath) => {
    if (error) {
      console.error(error);
      return;
    }

    if (!appPath) {
      // app exists and --overwrite is not passed
      return;
    }
    console.log(`App built to ${appPath}`);
  });
}
