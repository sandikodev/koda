/**
 * 🧘 Koda Signals: The Universal State Bus
 * Lightweight, fine-grained reactivity for the Zenith Synthesis.
 */

type Listener<T> = (value: T) => void;

export class Signal<T> {
    private _value: T;
    private listeners: Set<Listener<T>> = new Set();

    constructor(value: T) {
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    set value(newValue: T) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.notify();
        }
    }

    subscribe(listener: Listener<T>): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach((listener) => listener(this._value));
    }

    /**
     * For Qwik Serialization
     */
    toJSON() {
        return { $signal: this._value };
    }
}

export function signal<T>(initialValue: T): Signal<T> {
    return new Signal(initialValue);
}

/**
 * Computed Signal
 */
export class Computed<T> {
    private _value: T;
    private listeners: Set<Listener<T>> = new Set();
    private fn: () => T;

    constructor(fn: () => T, dependencies: Signal<any>[]) {
        this.fn = fn;
        this._value = fn();

        dependencies.forEach(dep => {
            dep.subscribe(() => {
                this._value = this.fn();
                this.notify();
            });
        });
    }

    get value(): T {
        return this._value;
    }

    subscribe(listener: Listener<T>): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach((listener) => listener(this._value));
    }
}

export function computed<T>(fn: () => T, deps: Signal<any>[]): Computed<T> {
    return new Computed(fn, deps);
}
