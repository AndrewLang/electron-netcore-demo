import * as WebSocket from 'ws';
import { Logger } from '../common/logger';
import { IMessage, MessageInvocation, MessageCompletion, IInvocationMessage, ICompleteMessage } from './message';


export class WebSocketClient {

    private logger: Logger;
    private socket: WebSocket;
    private requests = new Map<string, (msg: ICompleteMessage, error?: Error) => void>();

    enableLogging = false;

    constructor(private serverUrl: string) {
        this.logger = new Logger('WebSocketClient');
    }

    async start() {
        return new Promise((resolve, reject) => {
            try {
                let url = this.buildUrl(this.serverUrl);
                this.socket = new WebSocket(url);


                this.socket.onopen = (e) => {
                    if (this.enableLogging)
                        this.logger.debug(`WebSocket opened, ready to talk.`);

                    resolve(true);
                };

                this.socket.onmessage = (e) => {
                    this.processIncomingMessage(e.data);
                };

                this.socket.onclose = (e) => {
                    if (this.enableLogging)
                        this.logger.debug(`WebSocket closed.`);
                };

                this.socket.onerror = (e) => {
                    if (this.enableLogging)
                        this.logger.debug(`WebSocket error ${JSON.stringify(e)}`);

                    reject(e);
                };
            } catch (error) {
                if (this.enableLogging)
                    this.logger.error(`Start WebSocket client with error: ${error}. `);

                reject(error);
            }
        });
    }

    async stop(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                if (this.enableLogging)
                    this.logger.debug(`Stopping WebSocket client...`);

                this.socket.close();

                if (this.enableLogging)
                    this.logger.debug(`WebSocket client stopped.`);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async invoke(payload: IInvocationMessage): Promise<any> {
        if (!payload.invocationId) {
            payload.invocationId = this.generateId();
        }
        if (!payload.type) {
            payload.type = MessageInvocation;
        }

        return new Promise((resolve, reject) => {
            try {
                this.requests.set(payload.invocationId, (msg: ICompleteMessage, error?: Error) => {
                    // this.logger.debug(`Request handler `, msg);

                    if (error) {
                        reject(error);
                    } else if (msg) {
                        resolve(msg);
                    } else {
                        reject(new Error(`Unknow message.`));
                    }
                });

                let body = JSON.stringify(payload);
                this.socket.send(body);
            } catch (error) {
                this.requests.delete(payload.invocationId);
                reject(error);
            }
        });
    }

    private buildUrl(url: string): string {
        let result = url;
        if (url.toLowerCase().startsWith('http:')) {
            result = url.replace('http:', 'ws:');
        } else if (url.toLowerCase().startsWith('https:')) {
            result = url.replace('https:', 'wss:');
        }
        return result;
    }

    private generateId(length: number = 9): string {
        let text = '';
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+";

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    private processIncomingMessage(data: any) {
        try {
            let message = typeof (data) === 'string' && this.isJson(data) ? JSON.parse(data) as IMessage : data as IMessage;

            // this.logger.debug('Incoming message').debug(message);

            if (message) {
                if (this.enableLogging)
                    this.logger.debug(`Process incoming message`).debug(JSON.stringify(message));

                if (message.type === MessageCompletion) {
                    let completeMessage = message as ICompleteMessage;

                    if (this.requests.has(completeMessage.invocationId)) {
                        let task = this.requests.get(completeMessage.invocationId);
                        this.requests.delete(completeMessage.invocationId);
                        task(completeMessage);
                    }

                } else if (message.type === MessageInvocation) {
                    let invocationMessage = message as IInvocationMessage;
                    // invoke some method on client side.
                } else {

                }
            }
        } catch (error) {
            this.logger.debug(`Process message error: ${error}`);
        }
    }

    isJson(value: string): boolean {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
        return true;
    }
}