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

Sorting is configured in `src/index.ts` (see `makeCloneInfoComparator(...)` and the `cloneInfos.sort(...)` call)

Example output
```shell
jscpd  --min-tokens 40 --silent --reporters sortShort *.swift
 5 lines, 61 tokens — Views/BasketsView.swift:49                - Views/StocksView.swift:53                
 6 lines, 62 tokens — LSQRange/TableColForeach2.swift:35        - LSQRange/TestTableColumnForEach.swift:31 
 7 lines, 65 tokens — Views/SettingsView.swift:35               - Views/Personal/PfCSVAnalysis.swift:274   
 9 lines, 72 tokens — Views/MultiGraphView.swift:158            - Views/Personal/AccountChartView.swift:218
10 lines, 76 tokens — Views/BasketsView.swift:37                - Views/StocksView.swift:34                
 9 lines, 78 tokens — Views/StocksDataView.swift:21             - Views/StocksView.swift:23                
10 lines, 80 tokens — Views/SettingsView.swift:65               - Views/WindowSettingsView.swift:84        
11 lines, 99 tokens — Model/FXAccess.swift:210                  - Model/FXAccess.swift:192                 
Duplications detection: Found 8 exact clones with 67(0.46%) duplicated lines in 84 (1 formats) files.
```
(I am somewhat suspicious whether the min-tokens option cutoff and found tokens match in jscpd)

