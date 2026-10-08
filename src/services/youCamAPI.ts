import { Product, YouCamEndpointType } from '../types/fashion';
import { createProductCategoryDetector } from './productCategoryDetector';

/**
 * YouCam API Service - Virtual Try-On for Fashion Items
 * Supports multiple endpoints for different product categories:
 * - cloth-v4: Clothing (tops, bottoms, dresses, outerwear)
 * - shoes-transfer: Shoes
 * - bag: Bags and purses
 * - scarf: Scarves and wraps
 * - bracelet: Bracelets and watches
 * - earrings: Earrings
 * - ring: Rings
 * - hat: Hats and caps
 */

const YOUCAM_BASE_URL = import.meta.env.VITE_YOUCAM_BASE_URL || 'https://yce-api-01.makeupar.com';
const YOUCAM_API_KEY = import.meta.env.VITE_YOUCAM_API_KEY;

interface YouCamFileUploadResponse {
  status: number;
  data: {
    files: Array<{
      file_id: string;
      file_name: string;
      content_type: string;
      requests: Array<{
        method: string;
        url: string;
        headers: Record<string, string>;
      }>;
    }>;
  };
}

interface YouCamTaskResponse {
  status: number;
  data: {
    task_id: string;
  };
}

interface YouCamTaskStatusResponse {
  status: number;
  data: {
    task_status: 'processing' | 'success' | 'error';
    results?: {
      url: string;
    };
    error?: string;
  };
}

export interface TryOnResult {
  success: boolean;
  resultImageUrl?: string;
  error?: string;
}

export class YouCamAPIService {
  private categoryDetector = createProductCategoryDetector();

  /**
   * Upload an image file to YouCam
   */
  private async uploadImage(imageFile: File): Promise<string> {
    console.log(`📤 Uploading image to YouCam: ${imageFile.name}`);

    // Step 1: Get upload URL
    const response = await fetch(`${YOUCAM_BASE_URL}/s2s/v2.0/file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: [{
          content_type: imageFile.type,
          file_name: imageFile.name,
          file_size: imageFile.size,
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.status}`);
    }

    const data: YouCamFileUploadResponse = await response.json();
    const fileData = data.data.files[0];
    const uploadUrl = fileData.requests[0].url;
    const fileId = fileData.file_id;

    // Step 2: Upload file to S3
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': imageFile.type,
        'Content-Length': imageFile.size.toString(),
      },
      body: imageFile,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.status}`);
    }

    console.log(`✅ Image uploaded successfully: ${fileId}`);
    return fileId;
  }

  /**
   * Create a virtual try-on task (multi-endpoint support)
   */
  private async createTryOnTask(
    userPhotoFileId: string,
    garmentImageUrl: string,
    endpoint: YouCamEndpointType,
    product: Product
  ): Promise<string> {
    console.log(`🎨 Creating try-on task: ${endpoint} for ${product.name}`);

    // Route to the correct endpoint
    switch (endpoint) {
      case 'cloth-v4':
        return this.createClothTask(userPhotoFileId, garmentImageUrl, product);
      
      case 'shoes-transfer':
        return this.createShoesTask(userPhotoFileId, garmentImageUrl, product);
      
      case 'bag':
        return this.createBagTask(userPhotoFileId, garmentImageUrl, product);
      
      case 'scarf':
        return this.createScarfTask(userPhotoFileId, garmentImageUrl, product);
      
      case 'bracelet':
        return this.createBraceletTask(userPhotoFileId, garmentImageUrl, product);
      
      case 'earrings':
        return this.createEarringsTask(userPhotoFileId, garmentImageUrl, product);
      
      case 'ring':
        return this.createRingTask(userPhotoFileId, garmentImageUrl, product);
      
      case 'hat':
        return this.createHatTask(userPhotoFileId, garmentImageUrl, product);
      
      default:
        throw new Error(`Unsupported endpoint: ${endpoint}`);
    }
  }

  /**
   * Create cloth-v4 task (clothing)
   */
  private async createClothTask(
    userPhotoFileId: string,
    garmentImageUrl: string,
    product: Product
  ): Promise<string> {
    const garmentCategory = this.categoryDetector.detectClothingCategory(product);

    const response = await fetch(`${YOUCAM_BASE_URL}/s2s/v2.0/task/cloth-v4`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src_file_id: userPhotoFileId,
        ref_file_url: garmentImageUrl,
        garment_category: garmentCategory,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create cloth task: ${response.status} - ${errorText}`);
    }

    const data: YouCamTaskResponse = await response.json();
    console.log(`✅ Cloth task created: ${data.data.task_id}`);
    return data.data.task_id;
  }

  /**
   * Create shoes-transfer task
   */
  private async createShoesTask(
    userPhotoFileId: string,
    garmentImageUrl: string,
    product: Product
  ): Promise<string> {
    // Valid gender values: male, female (not 'men', 'women')
    const gender = product.gender === 'men' ? 'male' : 'female';

    const response = await fetch(`${YOUCAM_BASE_URL}/s2s/v2.0/task/shoes-transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src_file_id: userPhotoFileId,
        ref_file_url: garmentImageUrl,
        gender: gender,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create shoes task: ${response.status} - ${errorText}`);
    }

    const data: YouCamTaskResponse = await response.json();
    console.log(`✅ Shoes task created: ${data.data.task_id}`);
    return data.data.task_id;
  }

  /**
   * Create bag task
   * API only accepts: gender (female/male), src_file_id/url, ref_file_id/url
   * NO style parameter!
   */
  private async createBagTask(
    userPhotoFileId: string,
    garmentImageUrl: string,
    product: Product
  ): Promise<string> {
    // Valid gender values: male, female (not 'men', 'women')
    const gender = product.gender === 'men' ? 'male' : 'female';

    const response = await fetch(`${YOUCAM_BASE_URL}/s2s/v2.0/task/bag`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src_file_id: userPhotoFileId,
        ref_file_url: garmentImageUrl,
        gender: gender,
        // Note: NO style parameter - API doesn't support it
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create bag task: ${response.status} - ${errorText}`);
    }

    const data: YouCamTaskResponse = await response.json();
    console.log(`✅ Bag task created: ${data.data.task_id}`);
    return data.data.task_id;
  }

  /**
   * Create scarf task
   * Requires: gender, style parameters
   * Style: "random" is a valid option
   */
  private async createScarfTask(
    userPhotoFileId: string,
    garmentImageUrl: string,
    product: Product
  ): Promise<string> {
    // Valid gender values: male, female (not 'men', 'women')
    const gender = product.gender === 'men' ? 'male' : 'female';

    const response = await fetch(`${YOUCAM_BASE_URL}/s2s/v2.0/task/scarf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src_file_id: userPhotoFileId,
        ref_file_url: garmentImageUrl,
        gender: gender,
        style: 'random', // YouCam will choose appropriate style
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create scarf task: ${response.status} - ${errorText}`);
    }

    const data: YouCamTaskResponse = await response.json();
    console.log(`✅ Scarf task created: ${data.data.task_id}`);
    return data.data.task_id;
  }

  /**
   * Create bracelet task (also handles watches)
   * NOTE: This endpoint returns 404 - may not be available in current YouCam API
   */
  private async createBraceletTask(
    userPhotoFileId: string,
    garmentImageUrl: string,
    product: Product
  ): Promise<string> {
    // Bracelet endpoint may not be available - throw a friendly error
    throw new Error('Bracelet/Watch try-on is not currently supported by YouCam API');

    /* Original code - endpoint not found (404)
    const response = await fetch(`${YOUCAM_BASE_URL}/s2s/v2.0/task/bracelet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src_file_id: userPhotoFileId,
        ref_file_url: garmentImageUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create bracelet task: ${response.status} - ${errorText}`);
    }

    const data: YouCamTaskResponse = await response.json();
    console.log(`✅ Bracelet task created: ${data.data.task_id}`);
    return data.data.task_id;
    */
  }

  /**
   * Create earrings task
   * NOTE: This endpoint returns 404 - not available in current YouCam API
   */
  private async createEarringsTask(
    userPhotoFileId: string,
    garmentImageUrl: string,
    product: Product
  ): Promise<string> {
    throw new Error('Earrings try-on is not currently supported by YouCam API');
  }

  /**
   * Create ring task
   * NOTE: This endpoint returns 404 - not available in current YouCam API
   */
  private async createRingTask(
    userPhotoFileId: string,
    garmentImageUrl: string,
    product: Product
  ): Promise<string> {
    throw new Error('Ring try-on is not currently supported by YouCam API');
  }

  /**
   * Create hat task
   * Requires: gender, style parameters
   * Style: "random" is a valid option
   */
  private async createHatTask(
    userPhotoFileId: string,
    garmentImageUrl: string,
    product: Product
  ): Promise<string> {
    // Valid gender values: male, female (not 'men', 'women')
    const gender = product.gender === 'men' ? 'male' : 'female';

    const response = await fetch(`${YOUCAM_BASE_URL}/s2s/v2.0/task/hat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src_file_id: userPhotoFileId,
        ref_file_url: garmentImageUrl,
        gender: gender,
        style: 'random', // YouCam will choose appropriate style
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create hat task: ${response.status} - ${errorText}`);
    }

    const data: YouCamTaskResponse = await response.json();
    console.log(`✅ Hat task created: ${data.data.task_id}`);
    return data.data.task_id;
  }

  /**
   * Poll task status until complete (multi-endpoint support)
   */
  private async pollTaskStatus(taskId: string, endpoint: YouCamEndpointType, maxAttempts = 30): Promise<string> {
    console.log(`⏳ Polling task status: ${taskId} (${endpoint})`);

    const endpointPath = endpoint === 'shoes-transfer' ? 'shoes-transfer' : endpoint;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Wait 2 seconds between polls
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(
        `${YOUCAM_BASE_URL}/s2s/v2.0/task/${endpointPath}/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${YOUCAM_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to check task status: ${response.status}`);
      }

      const data: YouCamTaskStatusResponse = await response.json();
      console.log(`📊 Task status (attempt ${attempt + 1}): ${data.data.task_status}`);

      if (data.data.task_status === 'success') {
        if (data.data.results?.url) {
          console.log(`✅ Try-on complete!`);
          return data.data.results.url;
        }
        throw new Error('Task succeeded but no result URL');
      }

      if (data.data.task_status === 'error') {
        throw new Error(data.data.error || 'Try-on failed');
      }
    }

    throw new Error('Try-on timed out after 60 seconds');
  }

  /**
   * Try on a garment (main public method with AI-powered routing)
   */
  async tryOnGarment(
    userPhotoFile: File,
    product: Product
  ): Promise<TryOnResult> {
    try {
      if (!YOUCAM_API_KEY) {
        throw new Error('YouCam API key not configured');
      }

      if (!product.imageUrl) {
        throw new Error('Product has no image URL');
      }

      // AI-powered endpoint detection
      const endpoint = this.categoryDetector.detectYouCamEndpoint(product);
      const endpointName = this.categoryDetector.getEndpointDisplayName(endpoint);
      
      console.log(`🤖 AI detected category: ${endpointName} (${endpoint})`);
      console.log(`🎯 Starting virtual try-on for: ${product.name}`);

      // Step 1: Upload user photo
      const userPhotoFileId = await this.uploadImage(userPhotoFile);

      // Step 2: Create try-on task with AI-detected endpoint
      const taskId = await this.createTryOnTask(
        userPhotoFileId,
        product.imageUrl,
        endpoint,
        product
      );

      // Step 3: Poll for result
      const resultUrl = await this.pollTaskStatus(taskId, endpoint);

      return {
        success: true,
        resultImageUrl: resultUrl,
      };
    } catch (error) {
      console.error('❌ Virtual try-on error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Try on multiple garments (for complete outfit)
   * This creates separate try-ons and combines them
   */
  async tryOnOutfit(
    userPhotoFile: File,
    products: Product[]
  ): Promise<Map<string, TryOnResult>> {
    const results = new Map<string, TryOnResult>();

    // Process each product
    for (const product of products) {
      console.log(`\n🔄 Processing: ${product.name}`);
      const result = await this.tryOnGarment(userPhotoFile, product);
      results.set(product.id, result);

      // Small delay between requests to respect rate limits
      if (products.indexOf(product) < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
}

/**
 * Create YouCam API service instance
 */
export function createYouCamAPIService(): YouCamAPIService {
  return new YouCamAPIService();
}
