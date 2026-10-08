/**
 * Image Optimization Utilities
 * Handles Shopify CDN image transformations and optimization
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  scale?: 2 | 3; // For retina displays
  format?: 'jpg' | 'pjpg' | 'webp';
  quality?: number; // 1-100
}

/**
 * Transform Shopify CDN image URL with optimization parameters
 * 
 * Shopify CDN supports URL parameters for image transformation:
 * https://cdn.shopify.com/s/files/1/0000/0000/files/image.jpg?v=123
 * 
 * Can be transformed to:
 * https://cdn.shopify.com/s/files/1/0000/0000/files/image_400x.jpg
 * https://cdn.shopify.com/s/files/1/0000/0000/files/image_400x400_crop_center.jpg
 */
export function transformShopifyImage(
  imageUrl: string,
  options: ImageTransformOptions = {}
): string {
  if (!imageUrl || !imageUrl.includes('cdn.shopify.com')) {
    return imageUrl; // Not a Shopify CDN URL, return as-is
  }

  const { width, height, crop, scale, format } = options;

  // Remove existing transformation parameters
  const baseUrl = imageUrl.split('?')[0];
  const extension = baseUrl.split('.').pop() || 'jpg';
  const urlWithoutExtension = baseUrl.substring(0, baseUrl.lastIndexOf('.'));

  // Build transformation suffix
  let transformSuffix = '';

  if (width && height) {
    transformSuffix = `_${width}x${height}`;
    if (crop) {
      transformSuffix += `_crop_${crop}`;
    }
  } else if (width) {
    transformSuffix = `_${width}x`;
  } else if (height) {
    transformSuffix = `_x${height}`;
  }

  // Add scale for retina
  if (scale && scale > 1) {
    transformSuffix += `@${scale}x`;
  }

  // Use specified format or keep original
  const finalFormat = format || extension;

  return `${urlWithoutExtension}${transformSuffix}.${finalFormat}`;
}

/**
 * Get optimized image URL for different use cases
 */
export const ImageSizes = {
  /**
   * Thumbnail size for product grid
   */
  thumbnail: (url: string) =>
    transformShopifyImage(url, { width: 300, height: 400, crop: 'center' }),

  /**
   * Medium size for product details
   */
  medium: (url: string) =>
    transformShopifyImage(url, { width: 600, height: 800, crop: 'center' }),

  /**
   * Large size for lightbox/zoom
   */
  large: (url: string) =>
    transformShopifyImage(url, { width: 1200, height: 1600 }),

  /**
   * Hero image size
   */
  hero: (url: string) =>
    transformShopifyImage(url, { width: 1920, height: 1080, crop: 'center' }),

  /**
   * Square thumbnail for cart items
   */
  cartItem: (url: string) =>
    transformShopifyImage(url, { width: 100, height: 100, crop: 'center' }),

  /**
   * Try-on studio preview
   */
  tryOn: (url: string) =>
    transformShopifyImage(url, { width: 800, height: 1000, crop: 'center' }),
};

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(imageUrl: string, widths: number[]): string {
  return widths
    .map(width => {
      const url = transformShopifyImage(imageUrl, { width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Preload critical images
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Lazy load images with Intersection Observer
 */
export function setupLazyLoading(
  imageElements: NodeListOf<HTMLImageElement> | HTMLImageElement[]
) {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const dataSrc = img.getAttribute('data-src');
          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    imageElements.forEach(img => imageObserver.observe(img));

    return () => imageObserver.disconnect();
  } else {
    // Fallback for browsers without IntersectionObserver
    imageElements.forEach(img => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        img.src = dataSrc;
        img.removeAttribute('data-src');
      }
    });
  }
}

/**
 * Get appropriate image URL based on device pixel ratio
 */
export function getRetinaImage(imageUrl: string, width: number): string {
  const dpr = window.devicePixelRatio || 1;
  
  if (dpr >= 3) {
    return transformShopifyImage(imageUrl, { width: width * 2, scale: 3 });
  } else if (dpr >= 2) {
    return transformShopifyImage(imageUrl, { width: width * 2, scale: 2 });
  }
  
  return transformShopifyImage(imageUrl, { width });
}

/**
 * Extract dominant color from image (for loading placeholders)
 */
export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('#CCCCCC');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get average color from center region
      const centerX = Math.floor(img.width / 2);
      const centerY = Math.floor(img.height / 2);
      const sampleSize = 10;

      const imageData = ctx.getImageData(
        centerX - sampleSize,
        centerY - sampleSize,
        sampleSize * 2,
        sampleSize * 2
      );

      let r = 0, g = 0, b = 0;
      const pixels = imageData.data.length / 4;

      for (let i = 0; i < imageData.data.length; i += 4) {
        r += imageData.data[i];
        g += imageData.data[i + 1];
        b += imageData.data[i + 2];
      }

      r = Math.floor(r / pixels);
      g = Math.floor(g / pixels);
      b = Math.floor(b / pixels);

      resolve(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = () => resolve('#CCCCCC');
    
    // Use thumbnail for color extraction
    img.src = transformShopifyImage(imageUrl, { width: 50, height: 50 });
  });
}

/**
 * OptimizedImage component helper
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Get optimized image props for img element
 */
export function getOptimizedImageProps(
  props: OptimizedImageProps
): React.ImgHTMLAttributes<HTMLImageElement> {
  const { src, alt, width = 600, height, className, loading = 'lazy', onLoad, onError } = props;

  const optimizedSrc = transformShopifyImage(src, {
    width,
    height,
    crop: height ? 'center' : undefined,
  });

  const srcSet = generateSrcSet(src, [300, 600, 900, 1200]);

  return {
    src: optimizedSrc,
    srcSet,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    alt,
    width,
    height,
    className,
    loading,
    onLoad,
    onError,
    decoding: 'async',
  };
}

/**
 * Image quality presets
 */
export const ImageQuality = {
  low: 60,
  medium: 75,
  high: 85,
  max: 95,
} as const;

/**
 * Check if image is from Shopify CDN
 */
export function isShopifyImage(url: string): boolean {
  return url.includes('cdn.shopify.com');
}

/**
 * Fallback image URL
 */
export const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
