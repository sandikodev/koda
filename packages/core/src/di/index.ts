/**
 * 🏛️ Koda DI: Institutional Container
 * A hierarchical dependency injection system for the Zenith Synthesis.
 */

export type Scope = 'singleton' | 'request' | 'transient';

export type Token<T = any> = string | symbol | { new(...args: any[]): T };

export interface Provider<T = any> {
    token: Token<T>;
    useValue?: T;
    useClass?: { new(...args: any[]): T };
    useFactory?: (...args: any[]) => T;
    inject?: Token[];
    scope?: Scope;
}

export class Container {
    private providers = new Map<Token, Provider>();
    private instances = new Map<Token, any>();
    private parent: Container | null = null;

    constructor(parent?: Container) {
        this.parent = parent || null;
    }

    register<T>(provider: Provider<T>) {
        this.providers.set(provider.token, provider);
    }

    get<T>(token: Token<T>): T {
        // 1. Check if instance exists in this container (Singletons)
        if (this.instances.has(token)) {
            return this.instances.get(token);
        }

        // 2. Check provider
        const provider = this.providers.get(token);

        if (!provider) {
            if (this.parent) {
                return this.parent.get(token);
            }
            throw new Error(`DI Error: No provider found for token: ${String(token)}`);
        }

        // 3. Resolve
        const instance = this.resolve(provider);

        // 4. Cache if singleton
        if (provider.scope === 'singleton' || !provider.scope) {
            this.instances.set(token, instance);
        }

        return instance;
    }

    private resolve(provider: Provider): any {
        if (provider.useValue !== undefined) {
            return provider.useValue;
        }

        const deps = (provider.inject || []).map(token => this.get(token));

        if (provider.useClass) {
            return new provider.useClass(...deps);
        }

        if (provider.useFactory) {
            return provider.useFactory(...deps);
        }

        throw new Error(`DI Error: Invalid provider for ${String(provider.token)}`);
    }

    /**
     * Creates a child container (e.g., for 'request' scope)
     */
    child() {
        return new Container(this);
    }
}

export const kodaDI = new Container();
