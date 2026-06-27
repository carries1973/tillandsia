// Client-side image pipeline (spec §6): HEIC→JPEG, downscale before upload,
// never send raw multi-MB iPhone photos. Returns a JPEG blob + dimensions.

const MAX_EDGE = 1600; // px — plenty for an album card / recognition thumbnail
const JPEG_QUALITY = 0.82;

export interface ProcessedImage {
  blob: Blob;
  width: number;
  height: number;
}

function isHeic(file: File) {
  const n = file.name.toLowerCase();
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    n.endsWith('.heic') ||
    n.endsWith('.heif')
  );
}

async function toRasterBlob(file: File): Promise<Blob> {
  if (!isHeic(file)) return file;
  // heic2any is browser-only; import lazily so it never runs on the server.
  const heic2any = (await import('heic2any')).default as (opts: {
    blob: Blob;
    toType?: string;
    quality?: number;
  }) => Promise<Blob | Blob[]>;
  const out = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
  return Array.isArray(out) ? out[0] : out;
}

async function loadBitmap(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(blob);
    } catch {
      /* fall through to <img> */
    }
  }
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

export async function processImage(file: File): Promise<ProcessedImage> {
  const raster = await toRasterBlob(file);
  const bmp = await loadBitmap(raster);

  const srcW = (bmp as ImageBitmap).width || (bmp as HTMLImageElement).naturalWidth;
  const srcH = (bmp as ImageBitmap).height || (bmp as HTMLImageElement).naturalHeight;

  const scale = Math.min(1, MAX_EDGE / Math.max(srcW, srcH));
  const w = Math.round(srcW * scale);
  const h = Math.round(srcH * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(bmp as CanvasImageSource, 0, 0, w, h);

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Could not encode image'))),
      'image/jpeg',
      JPEG_QUALITY
    )
  );

  if ('close' in bmp && typeof bmp.close === 'function') bmp.close();

  return { blob, width: w, height: h };
}
