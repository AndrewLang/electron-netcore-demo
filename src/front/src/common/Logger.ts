
export class Logger {

    constructor(private name: string = '') {

    }

    start(group: string): Logger {
        console.group(group);
        return this;
    }

    debug(...value: any[]): Logger {
        console.log(`[${this.getTime()}]`, `[${this.name}] `, ...value);
        return this;
    }
    warn(...value: any[]): Logger {
        console.warn(`[${this.getTime()}]`, `[${this.name}] `, ...value);
        return this;
    }

    error(...value: any[]): Logger {
        console.error(`[${this.getTime()}]`, `[${this.name}] `, ...value);
        return this;
    }

    end(): void {
        console.groupEnd();
    }

    private getTime(): string {
        let date = new Date();
        return `${date.getHours()}:${this.padStart(date.getMinutes().toString(), 2, '0')}:${date.getSeconds()}.${this.padStart(date.getMilliseconds().toString(), 3, '0')}`;
    }
    
    private padStart(content: string, targetLength: number, padString: string) {

        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (content.length >= targetLength) {
            return String(content);
        } else {
            targetLength = targetLength - content.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + String(content);
        }
    }
}