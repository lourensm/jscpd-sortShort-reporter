import type {IClone, ITokenLocation, IOptions} from '@jscpd/core';
import type {Duplication} from './types'
import type {CloneInfo, CloneFileInfo, LineColLike} from './clone-fmt';
import {relative} from 'path';
// --- Helpers ---

class LineCol implements LineColLike {
    constructor(
        public line: number,
        public column: number | undefined,
    ) {}
}

function tokenLocToLineCol(loc: ITokenLocation): LineCol {
    return new LineCol(loc.line, loc.column);
}

function getPath(filePath: string, options: IOptions): string {
    return options.absolute ? filePath : relative(process.cwd(), filePath);
}

function dupToCloneFileInfo(dup: IClone['duplicationA'], options: IOptions): CloneFileInfo {
    const start = tokenLocToLineCol(dup.start);
    const end = tokenLocToLineCol(dup.end);

    return {
        file: getPath(dup.sourceId, options),
        start, // has .line and toString()
        end,
    };
}

// @jscpd  clones-found.ts:
// 		(${duplicationA.end.line - duplicationA.start.line} lines
// 		${duplicationA.end.position ? ', ' + (duplicationA.end.position - (duplicationA.start.position as number)) + ' tokens' : ''})`,
function computeLines(dup: Duplication): number {
    const startLine = dup.start.line;
    const endLine = dup.end.line;
    return endLine - startLine;
}

function computeTokens(dup: Duplication): number | undefined {
    const start = dup.start.position;
    const end = dup.end.position;

    if (start === undefined || end === undefined) {
        return undefined;
    }

    return end - start;
}

function convertICloneToCloneInfo(clone: IClone, options: IOptions): CloneInfo {
    const info1 = dupToCloneFileInfo(clone.duplicationA, options);
    const info2 = dupToCloneFileInfo(clone.duplicationB, options);

    // Usually lines/tokens are the same for A and B (it’s “the same clone” in two places),
    // so we compute from A. If you want to be defensive, you can also compare A vs B.
    const lines = computeLines(clone.duplicationA);
    const tokens = computeTokens(clone.duplicationA);

    return { info1, info2, lines, tokens };
}

export function convertIClonesToCloneInfos(clones: IClone[], options: IOptions): CloneInfo[] {
    return clones.map(clone => convertICloneToCloneInfo(clone, options));
}