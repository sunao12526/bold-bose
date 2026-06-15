"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let CaptchaService = class CaptchaService {
    store = new Map();
    constructor() {
        setInterval(() => this.cleanup(), 60_000);
    }
    generate() {
        const code = this.randomCode(4);
        const key = crypto.randomUUID();
        this.store.set(key, {
            code: code.toLowerCase(),
            expiresAt: Date.now() + 5 * 60 * 1000,
        });
        console.log(`[Captcha] Generated: key=${key}, code=${code.toLowerCase()}`);
        return { key, image: this.renderSvg(code) };
    }
    verify(key, input) {
        console.log(`[Captcha] Verifying: key=${key}, input=${input}`);
        const record = this.store.get(key);
        if (!record) {
            console.log(`[Captcha] Verify failed: no record for key=${key}`);
            return false;
        }
        this.store.delete(key);
        if (Date.now() > record.expiresAt) {
            console.log(`[Captcha] Verify failed: expired`);
            return false;
        }
        const result = record.code === input.toLowerCase();
        console.log(`[Captcha] Verify: stored=${record.code}, input_lower=${input.toLowerCase()}, match=${result}`);
        return result;
    }
    randomCode(len) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let code = '';
        const buf = crypto.randomBytes(len);
        for (let i = 0; i < len; i++) {
            code += chars[buf[i] % chars.length];
        }
        return code;
    }
    renderSvg(text) {
        const width = 120;
        const height = 40;
        const bg = '#f0f2f5';
        const textColor = () => {
            const colors = ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2', '#eb2f96'];
            return colors[Math.floor(Math.random() * colors.length)];
        };
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
        svg += `<rect width="${width}" height="${height}" fill="${bg}" rx="4"/>`;
        for (let i = 0; i < 4; i++) {
            const x1 = Math.random() * width;
            const y1 = Math.random() * height;
            const x2 = Math.random() * width;
            const y2 = Math.random() * height;
            const color = textColor();
            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.5"/>`;
        }
        for (let i = 0; i < 30; i++) {
            const cx = Math.random() * width;
            const cy = Math.random() * height;
            const r = Math.random() * 2;
            const color = textColor();
            svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.4"/>`;
        }
        const chars = text.split('');
        chars.forEach((char, i) => {
            const x = 15 + i * 25;
            const y = 28;
            const rotate = Math.floor(Math.random() * 20) - 10;
            const color = textColor();
            svg += `<text x="${x}" y="${y}" font-size="22" font-weight="bold" font-family="monospace" fill="${color}" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
        });
        svg += '</svg>';
        return svg;
    }
    cleanup() {
        const now = Date.now();
        for (const [key, record] of this.store) {
            if (now > record.expiresAt)
                this.store.delete(key);
        }
    }
};
exports.CaptchaService = CaptchaService;
exports.CaptchaService = CaptchaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CaptchaService);
//# sourceMappingURL=captcha.service.js.map