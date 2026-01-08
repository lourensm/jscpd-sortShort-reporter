import type { IClone, IOptions } from '@jscpd/core';
import type { IReporter } from '@jscpd/finder';
import type {CloneFileInfo, CloneInfo} from './clone-fmt';
import { SnippetPosFormat } from './clone-fmt';

import {CloneInfoFormat} from './clone-fmt';
import {convertIClonesToCloneInfos} from './iclone-to-clone-info';

import Table from 'cli-table3';

// brutely copied from jscpd
const TABLE_OPTIONS = {
    chars: {
        top: '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        bottom: '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        left: '',
        'left-mid': '',
        mid: '',
        'mid-mid': '',
        right: '',
        'right-mid': '',
        middle: '│',
    },
};

type By = 'lines' | 'tokens';
type Dir = 'asc' | 'desc';

function makeCloneInfoComparator(by: By, dir: Dir = 'desc') {
    const sign = dir === 'asc' ? 1 : -1;

    return (a: CloneInfo, b: CloneInfo): number => {
        const va = by === 'lines' ? a.lines : (a.tokens ?? 0);
        const vb = by === 'lines' ? b.lines : (b.tokens ?? 0);
        return sign * (va - vb);
    };
}

function generateLine(clone_info: CloneInfo, position: number, line: string): string[] {
    const lineNumberA: string = (clone_info.info1.duplication.start.line + position).toString();
    const lineNumberB: string = (clone_info.info2.duplication.start.line + position).toString();
    return [lineNumberA, lineNumberB, line];
}

function renderDup(cloneFileInfo: CloneFileInfo) {
    console.log(`${cloneFileInfo.file}:`);
    const table = new Table(TABLE_OPTIONS);
    const fragment = cloneFileInfo.duplication.fragment;
    if (fragment === undefined) {
        console.log("IMPOSSIBLE")
        return;
    }
    fragment.split('\n').forEach((line: string, position: number) => {
        const lineNumber: string = (cloneFileInfo.start.line + position).toString();
        (table).push([lineNumber, line]);
    });
    console.log(table.toString());
    // console.log('');
}
function renderCloneSnippet(clone_info: CloneInfo): void {
    const fragmentA = clone_info.info1.duplication.fragment;
    const fragmentB = clone_info.info2.duplication.fragment;
    const fmt: CloneInfoFormat = CloneInfoFormat.standard(SnippetPosFormat.SHORT);
    const fmt2: CloneInfoFormat = CloneInfoFormat.standard(SnippetPosFormat.ONLY_INFO);
    if (fragmentA === undefined || fragmentB === undefined) {
        console.log(fmt.render(clone_info))
        return;
    } // or throw, or skip
    if (fragmentA === fragmentB) {
        console.log(fmt.render(clone_info));
        const table = new Table(TABLE_OPTIONS);
        fragmentA.split('\n').forEach((line: string, position: number) => {
            (table).push(generateLine(clone_info, position, line));
        });
        console.log(table.toString());
        console.log('');
    } else {
        console.log(fmt2.render(clone_info));
        renderDup(clone_info.info1);
        renderDup(clone_info.info2);
        console.log('');
    }
}
/*export default*/ class SortShortReporter implements IReporter {
    constructor(private readonly options: IOptions) {
    }

    report(clones: IClone[]): void {
        const fmt: CloneInfoFormat = CloneInfoFormat.standard(SnippetPosFormat.SHORT);
        const cloneInfos: CloneInfo[] = convertIClonesToCloneInfos(clones, this.options);
        fmt.adjustWidth(cloneInfos);
        cloneInfos.sort(makeCloneInfoComparator('tokens', 'asc'))
        cloneInfos.forEach((clone_info: CloneInfo) => {
            console.log(fmt.render(clone_info))
        });
    }
}

export default class SortSnippetReporter implements IReporter {
    constructor(private readonly options: IOptions) {
    }

    report(clones: IClone[]): void {
        // const fmt: CloneInfoFormat = CloneInfoFormat.standard(SnippetPosFormat.SHORT);
        // const fmt2: CloneInfoFormat = CloneInfoFormat.standard(SnippetPosFormat.ONLY_INFO);
        const cloneInfos: CloneInfo[] = convertIClonesToCloneInfos(clones, this.options);
        // fmt.adjustWidth(cloneInfos);
        cloneInfos.sort(makeCloneInfoComparator('tokens', 'asc'))
        console.log("SortSnippetReporter");
        cloneInfos.forEach((clone_info: CloneInfo) => {
            // console.log(fmt.render(clone_info))
            renderCloneSnippet(clone_info);
        });
    }
}
