import type { IClone, IOptions } from '@jscpd/core';
import type { IReporter } from '@jscpd/finder';
import type { CloneInfo } from './clone-fmt';
import { SnippetPosFormat } from './clone-fmt';

import {CloneInfoFormat} from './clone-fmt';
import {convertIClonesToCloneInfos} from './iclone-to-clone-info'

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

export default class SortShortReporter implements IReporter {
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
