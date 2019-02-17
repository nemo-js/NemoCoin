export declare class Profile {
    name: string;
    key: string;
    private static dir;
    constructor();
    load(name: string): void;
    create(name: string): void;
    save(): void;
    private getProfilePath;
}
