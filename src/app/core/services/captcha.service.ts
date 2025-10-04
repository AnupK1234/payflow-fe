import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  private readonly CAPTCHA_LENGTH = 6;
  private readonly CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

  generateCaptcha(): string {
    let captcha = '';
    for (let i = 0; i < this.CAPTCHA_LENGTH; i++) {
      captcha += this.CAPTCHA_CHARS.charAt(Math.floor(Math.random() * this.CAPTCHA_CHARS.length));
    }
    return captcha;
  }

  // The validation itself can remain in the component, but the generation logic is now separated.
  // Alternatively, you could pass the user's input to this service for validation if state management were involved.
}
