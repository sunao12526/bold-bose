export interface CaptchaResult {
    key: string;
    image: string;
}
export declare class CaptchaService {
    private store;
    constructor();
    generate(): CaptchaResult;
    verify(key: string, input: string): boolean;
    private randomCode;
    private renderSvg;
    private cleanup;
}
