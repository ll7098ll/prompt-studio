import { deflateSync } from "node:zlib";
export function pngFixture(red = 85, green = 65, blue = 190): Buffer {
  function chunk(name: string, data: Buffer) {
    const type = Buffer.from(name), body = Buffer.concat([type, data]);
    let crc = 0xffffffff;
    for (const byte of body) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
    const size = Buffer.alloc(4), check = Buffer.alloc(4); size.writeUInt32BE(data.length); check.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([size, body, check]);
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(80, 0); ihdr.writeUInt32BE(60, 4); ihdr[8] = 8; ihdr[9] = 2;
  const pixels = Buffer.alloc(60 * (1 + 80 * 3));
  for (let y = 0; y < 60; y++) for (let x = 0; x < 80; x++) { const at = y * 241 + 1 + x * 3; pixels[at] = red; pixels[at + 1] = green; pixels[at + 2] = blue; }
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(pixels)), chunk("IEND", Buffer.alloc(0))]);
}
export function wavFixture(): Buffer {
  const rate = 8000, bytes = Buffer.alloc(44 + rate * 2);
  bytes.write("RIFF"); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write("WAVEfmt ", 8); bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22); bytes.writeUInt32LE(rate, 24); bytes.writeUInt32LE(rate * 2, 28); bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34); bytes.write("data", 36); bytes.writeUInt32LE(rate * 2, 40);
  for (let i = 0; i < rate; i++) bytes.writeInt16LE(Math.round(Math.sin(i * 2 * Math.PI * 220 / rate) * 500), 44 + i * 2);
  return bytes;
}
