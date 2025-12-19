# jscpd-sortShort-reporter

A sorted short format reporter for [jscpd](https://github.com/kucherenko/jscpd).


## Getting started

### Install

Make sure the package is available somehow:

Prepare locally:
```shell
cd ~/path/to/jscpd-sortShort-reporter
npm install
npm run build
```

After that, if you want to have it installed:

```shell
npm install -g .
```

If you only want a symlink-based global link:
```shell
npm link
```
You can undo with `npm unlink jscpd-sortShort-reporter` (sometimes `npm unlink -g jscpd-sortShort-reporter`), depending on your npm version/setup.

### Usage

```shell
jscpd [...options] --reporters sortShort /path/to/source
```
or
```bash
jscpd [...options] --silent --reporters sortShort /path/to/source
```
With --silent, jscpd reduces console output; depending on jscpd version, this may suppress clone logging and leave only the summary/statistics.”

See the [jscpd CLI docs](https://github.com/kucherenko/jscpd/tree/master/apps/jscpd) for available options and configuration.

By default, this reporter currently sorts by tokens. 

Sorting is currently configured in `src/index.ts` (see `makeCloneInfoComparator(...)` and the `cloneInfos.sort(...)` call)


