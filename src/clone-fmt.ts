// --- Types these formatters expect (minimal shape) ---

export interface LineColLike {
    line: number;
    column: number | undefined;
    // toString(): string; // so `${start}` works like in Python
}

export class LineColFormat {
    static simple(): LineColFormat {
        return new LineColFormat();
    }

    render(lineCol: LineColLike): string {
        return `${lineCol.line}:${lineCol.column}`;
    }
}
export interface CloneFileInfo {
    file: string;
    start: LineColLike;
    end: LineColLike;
}

export interface CloneInfo {
    info1: CloneFileInfo;
    info2: CloneFileInfo;
    lines: number;
    tokens: number | undefined;
}

// --- SnippetPosFormat ---

export enum SnippetPosFormat {
    SHORT = 'short',
    LONG = 'long',
}

export function renderSnippetPos(format: SnippetPosFormat,
                                 lineColFormat: LineColFormat,
                                 info: CloneFileInfo): string {
    switch (format) {
        case SnippetPosFormat.SHORT:
            return `${info.file}:${info.start.line}`;
        case SnippetPosFormat.LONG:
            return `${info.file} [${lineColFormat.render(info.start)} - ${lineColFormat.render(info.end)}]`;
        default: {
            // defensive; TS enum exhaustiveness usually makes this unreachable
            throw new Error(`Unknown format`);
        }
    }
}

// --- CloneFileInfoFormat ---

export class CloneFileInfoFormat {
    public snippetSpec: SnippetPosFormat;
    public snippetWidth: number;
    public lineColFormat: LineColFormat;

    constructor(snippetSpec: SnippetPosFormat, snippetWidth: number, lineColFormat: LineColFormat) {
        this.snippetSpec = snippetSpec;
        this.snippetWidth = snippetWidth;
        this.lineColFormat = lineColFormat;
    }

    static short(): CloneFileInfoFormat {
        return new CloneFileInfoFormat(SnippetPosFormat.SHORT, 30, LineColFormat.simple());
    }

    static long(): CloneFileInfoFormat {
        return new CloneFileInfoFormat(SnippetPosFormat.LONG, 40, LineColFormat.simple());
    }

    render(info: CloneFileInfo): string {
        const s = renderSnippetPos(this.snippetSpec, this.lineColFormat, info);
        return padRight(s, this.snippetWidth);
    }

    adjustWidth(cloneInfos: CloneInfo[]): void {
        if (cloneInfos.length === 0) {
            return;
        }

        this.snippetWidth = 0;

        const leftSnippetWidth = Math.max(
            ...cloneInfos.map((ci) => renderSnippetPos(this.snippetSpec, this.lineColFormat, ci.info1).length),
        );
        const rightSnippetWidth = Math.max(
            ...cloneInfos.map((ci) => renderSnippetPos(this.snippetSpec, this.lineColFormat, ci.info2).length),
        );

        this.snippetWidth = Math.max(leftSnippetWidth, rightSnippetWidth);
    }
}

// --- CloneInfoFormat ---

// export type FmtArg = 'short' | 'long';

export class CloneInfoFormat {
    public fileFormat: CloneFileInfoFormat;
    public singleLine: boolean;

    constructor(fileFormat: CloneFileInfoFormat, singleLine: boolean) {
        this.fileFormat = fileFormat;
        this.singleLine = singleLine;
    }

    static standard(format: SnippetPosFormat): CloneInfoFormat {
        switch (format) {
            case SnippetPosFormat.SHORT:
                return new CloneInfoFormat(CloneFileInfoFormat.short(), true);
            case SnippetPosFormat.LONG:
                return new CloneInfoFormat(CloneFileInfoFormat.long(), false);
            default: {
                // defensive; TS enum exhaustiveness usually makes this unreachable
                throw new Error(`Unknown format`);
            }
        }
    }

    renderInfo(info: CloneInfo): string {
        // Python: f"{info.lines:{3 if self.single_line else ''}} lines, {info.tokens:3} tokens"
        // We'll emulate:
        // - singleLine => pad lines to width 3
        // - tokens always width 3
        const linesStr = this.singleLine ? padLeft(String(info.lines), 2) : String(info.lines);
        if (info.tokens !== undefined) {
            const tokensStr = padLeft(String(info.tokens), 2);
            return `${linesStr} lines, ${tokensStr} tokens`;
        }
        return `${linesStr} lines`;
    }

    render(info: CloneInfo): string {
        const fmt = this.fileFormat;

        if (this.singleLine) {
            return `${this.renderInfo(info)} — ${fmt.render(info.info1)} - ${fmt.render(info.info2)}`;
        }

        return (
            `${fmt.render(info.info1)} ` +
            `(${this.renderInfo(info)})\n` +
            `${fmt.render(info.info2)}\n`
        );
    }

    adjustWidth(cloneInfos: CloneInfo[]): void {
        this.fileFormat.adjustWidth(cloneInfos);
    }
}

// --- helpers ---

function padRight(s: string, width: number): string {
    return s.length >= width ? s : s + ' '.repeat(width - s.length);
}

function padLeft(s: string, width: number): string {
    return s.length >= width ? s : ' '.repeat(width - s.length) + s;
}
