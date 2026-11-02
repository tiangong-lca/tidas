import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

// Resolve the installed consumer dependency, rather than a separate direct pin.
// Loading must fail the suite if the native dependency cannot initialize.
const requireFromNext = createRequire(import.meta.resolve('next/package.json'));
const sharpPath = requireFromNext.resolve('sharp');
const sharp = requireFromNext('sharp');
const options = { limitInputPixels: 256 };
const maxEncodedBytes = 64 * 1024;

test('Next dependency context loads Sharp and renders an SVG to resized PNG pixels', { timeout: 10_000 }, async (t) => {
  t.diagnostic(JSON.stringify({
    node: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    sharpPath,
    sharp: sharp.versions.sharp,
    libvips: sharp.versions.vips,
  }));
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="#d02030"/></svg>');
  const { data, info } = await sharp(svg, options)
    .resize(2, 3, { fit: 'fill', kernel: 'nearest' })
    .png()
    .toBuffer({ resolveWithObject: true });
  assert.equal(info.format, 'png');
  assert.equal(info.width, 2);
  assert.equal(info.height, 3);
  assert.ok(data.length > 0 && data.length <= maxEncodedBytes);
  const decoded = await sharp(data, options).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual([decoded.info.width, decoded.info.height, decoded.info.channels], [2, 3, 4]);
  assert.deepEqual(decoded.data, Buffer.from(Array.from({ length: 6 }, () => [208, 32, 48, 255]).flat()));
});

test('installed Sharp round-trips RGBA pixels through PNG and lossless WebP', { timeout: 10_000 }, async () => {
  const pixels = Buffer.from([255, 0, 0, 255, 0, 255, 0, 128, 0, 0, 255, 64, 123, 45, 67, 0]);
  for (const format of ['png', 'webp']) {
    const image = sharp(pixels, { ...options, raw: { width: 2, height: 2, channels: 4 } });
    const encoded = await (format === 'png' ? image.png() : image.webp({ lossless: true, exact: true }))
      .toBuffer({ resolveWithObject: true });
    assert.equal(encoded.info.format, format);
    assert.ok(encoded.data.length > 0 && encoded.data.length <= maxEncodedBytes);
    const metadata = await sharp(encoded.data, options).metadata();
    assert.deepEqual([metadata.format, metadata.width, metadata.height], [format, 2, 2]);
    const decoded = await sharp(encoded.data, options).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.deepEqual([decoded.info.width, decoded.info.height, decoded.info.channels], [2, 2, 4]);
    assert.deepEqual(decoded.data, pixels, `${format} must retain every RGBA byte`);
  }
});

test('installed Sharp rejects malformed image input', { timeout: 10_000 }, async () => {
  await assert.rejects(sharp(Buffer.from('not-an-image'), options).png().toBuffer(), Error);
});
