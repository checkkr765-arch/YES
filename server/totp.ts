import crypto from 'crypto';
import QRCode from 'qrcode';

// Base32 decoding and encoding functions
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateBase32Secret(length = 16): string {
  let secret = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    secret += BASE32_CHARS[randomBytes[i] % BASE32_CHARS.length];
  }
  return secret;
}

function base32ToBuffer(base32: string): Buffer {
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_CHARS.indexOf(clean[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

export function generateTOTP(secret: string, timestamp = Date.now(), windowOffset = 0): string {
  const step = 30; // 30 seconds
  const counter = Math.floor(timestamp / 1000 / step) + windowOffset;
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter), 0);

  const secretBuffer = base32ToBuffer(secret);
  const hmac = crypto.createHmac('sha1', secretBuffer);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamic truncation
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

export function verifyTOTP(token: string, secret: string): boolean {
  if (!token || token.length !== 6) return false;
  const now = Date.now();
  // Check current window and +/- 1 window (30 seconds drift tolerance)
  for (let offset = -1; offset <= 1; offset++) {
    const expected = generateTOTP(secret, now, offset);
    if (expected === token) {
      return true;
    }
  }
  return false;
}

export async function generateQrCodeDataUrl(secret: string, accountName: string, issuer = 'ALABBAS FURNITURE HOUSE'): Promise<string> {
  const uri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
  return await QRCode.toDataURL(uri, {
    margin: 2,
    width: 260,
    color: {
      dark: '#1E1410',
      light: '#FFFFFF',
    },
  });
}
