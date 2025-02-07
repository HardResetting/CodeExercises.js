interface IEvent<T> {
    on(handler: {
        (data?: T): void;
    }): void;
    off(handler: {
        (data?: T): void;
    }): void;
}
export declare class Event<T> implements IEvent<T> {
    private handlers;
    on(handler: {
        (data: T): void;
    }): void;
    off(handler: {
        (data?: T): void;
    }): void;
    trigger(data: T): void;
    expose(): Event<T>;
}
export {};
