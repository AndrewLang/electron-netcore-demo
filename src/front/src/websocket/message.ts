export const MessageInvocation = 'Invocation';
export const MessageCompletion = 'Completion';

export interface IMessage {
    type?: string;
    invocationId?: string;
}


export interface IInvocationMessage extends IMessage {    
    name: string;
    payload?: any;
}

export interface ICompleteMessage extends IMessage {
    payload?: any;
} 