# 🎨 YouCam API Virtual Try-On Integration Guide

## 📋 Overview

YouCam API by Perfect Corp. provides AI-powered virtual try-on capabilities for fashion items including:
- **Clothes Virtual Try-On** (tops, bottoms, full-body outfits)
- **Shoes Virtual Try-On**
- **Accessories Virtual Try-On** (bags, jewelry)
- **Hair & Beard Try-On**
- **Makeup Virtual Try-On**

For Fashion Fusion, we'll focus on **AI Clothes Virtual Try-On API**.

---

## 🚀 Step 1: Get YouCam API Access

### 1.1 Register for Free Account

1. **Visit**: [https://yce.makeupar.com/ai-api](https://yce.makeupar.com/ai-api)
2. **Sign up** for a free account
3. **Verify** your email

### 1.2 Get API Key

1. **Login** to console: [https://yce.makeupar.com/api-console/en/api-keys/](https://yce.makeupar.com/api-console/en/api-keys/)
2. Go to **"API Key"** tab
3. Click **"Generate API Key"**
4. **Copy** your API key (looks like: `eyJhbGc...`)

### 1.3 Pricing Plans

**Free Trial:**
- Get initial credits to test the API
- Perfect for development

**Pay-As-You-Go:**
- $0.05 - $0.20 per API call (depending on endpoint)
- No monthly commitment

**Subscription Plans:**
- Monthly plans with discounted rates
- Better for production use

**Check pricing**: [https://yce.makeupar.com/pricing](https://yce.makeupar.com/pricing)

---

## 🔧 Step 2: API Workflow

### The YouCam API follows this workflow:

```
1. Upload Image → Get file_id
2. Create Try-On Task → Get task_id
3. Poll Task Status → Check if complete
4. Retrieve Result → Get result image URL
```

### 2.1 API Endpoints

**Base URL**: `https://yce-api-01.makeupar.com`

**Key Endpoints:**
- `POST /s2s/v2.0/file` - Upload images
- `POST /s2s/v2.0/task/cloth-v4` - Create clothes try-on task
- `GET /s2s/v2.0/task/cloth-v4/{task_id}` - Get task status/result

**Authentication:**
```
Authorization: Bearer YOUR_API_KEY
```

---

## 📸 Step 3: Image Requirements

### User Photo (Person Image):
- ✅ **High-resolution** full-body photo
- ✅ **Clear view** of entire body
- ✅ **Clean background** (solid color preferred)
- ✅ **Single person** in frame
- ✅ **Good lighting**
- ✅ **Facing camera** (front view)
- ❌ Avoid: Multiple people, busy backgrounds, poor lighting

### Garment Photo (Reference Image):
- ✅ **Product photo** of clothing item
- ✅ **Clean background** (white/transparent)
- ✅ **High quality** image
- ✅ **Full garment visible**
- ❌ Avoid: Low resolution, dark images, partial views

**Supported Categories:**
- `upper_body` - Tops, shirts, blouses, jackets
- `lower_body` - Pants, skirts, shorts
- `full_body` - Dresses, full outfits

---

## 💻 Step 4: Implementation Flow

### 4.1 Upload User Photo

```bash
curl --request POST \
  --url https://yce-api-01.makeupar.com/s2s/v2.0/file \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --data '{
    "files": [{
      "content_type": "image/jpg",
      "file_name": "user_photo.jpg",
      "file_size": 500000
    }]
  }'
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "files": [{
      "file_id": "abc123...",
      "requests": [{
        "method": "PUT",
        "url": "https://yce-us.s3-accelerate.amazonaws.com/...",
        "headers": {
          "Content-Length": "500000",
          "Content-Type": "image/jpg"
        }
      }]
    }]
  }
}
```

### 4.2 Upload Image to S3

```bash
curl --request PUT 'UPLOAD_URL_FROM_RESPONSE' \
  --header 'Content-Type: image/jpg' \
  --header 'Content-Length: 500000' \
  --data-binary @'./user_photo.jpg'
```

### 4.3 Create Try-On Task

```bash
curl --request POST \
  --url https://yce-api-01.makeupar.com/s2s/v2.0/task/cloth-v4 \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --data '{
    "src_file_id": "USER_PHOTO_FILE_ID",
    "ref_file_url": "https://example.com/garment.jpg",
    "garment_category": "upper_body"
  }'
```

**Or use URLs directly:**
```json
{
  "src_file_url": "https://example.com/user_photo.jpg",
  "ref_file_url": "https://example.com/garment.jpg",
  "garment_category": "upper_body"
}
```

**Response:**
```json
{
  "status": 200,
  "data": {
    "task_id": "task_abc123..."
  }
}
```

### 4.4 Poll Task Status

```bash
curl --request GET \
  --url https://yce-api-01.makeupar.com/s2s/v2.0/task/cloth-v4/TASK_ID \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

**Response (Processing):**
```json
{
  "status": 200,
  "data": {
    "task_status": "processing"
  }
}
```

**Response (Success):**
```json
{
  "status": 200,
  "data": {
    "task_status": "success",
    "results": {
      "url": "https://yce-us.s3-accelerate.amazonaws.com/result.jpg"
    }
  }
}
```

**Response (Error):**
```json
{
  "status": 200,
  "data": {
    "task_status": "error",
    "error": "Invalid image format"
  }
}
```

---

## 🏗️ Step 5: Integration Architecture

### For Fashion Fusion App:

```
User Action (Try On Button)
    ↓
1. Upload user's photo (or use webcam capture)
    ↓
2. Get product image URL from our SerpAPI products
    ↓
3. Send to YouCam API:
   - User photo file_id
   - Product image URL
   - Garment category (tops/bottoms/full_body)
    ↓
4. Get task_id
    ↓
5. Poll every 2-3 seconds until task_status = "success"
    ↓
6. Display result image to user
    ↓
7. Allow user to:
   - Save result
   - Try different products
   - Add to cart if they like the fit
```

---

## 🎯 Step 6: Implementation Plan for Fashion Fusion

### 6.1 Create YouCam Service

**File**: `src/services/youCamAPI.ts`

**Features to implement:**
- Upload user photo
- Create try-on task
- Poll task status
- Handle errors
- Cache results

### 6.2 Update UI Components

**TryOnStudio.tsx:**
- Add webcam capture OR file upload for user photo
- Show "processing" state while API works
- Display result image
- Allow trying multiple products

**ProductCatalog.tsx:**
- Add "Virtual Try-On" button
- Opens modal with photo upload
- Shows try-on result

### 6.3 Environment Configuration

**Add to `.env.local`:**
```env
VITE_YOUCAM_API_KEY=your_youcam_api_key_here
VITE_YOUCAM_BASE_URL=https://yce-api-01.makeupar.com
```

---

## 🔐 Step 7: Security Considerations

### ⚠️ **IMPORTANT**: API Key Security

**Problem:**
- YouCam API key is sensitive
- Should NOT be exposed in frontend code
- Browser-side API calls expose your key

**Solution Options:**

#### Option A: Backend Proxy (Recommended)
```
Frontend → Your Backend → YouCam API
```
- Frontend sends request to YOUR server
- Your server calls YouCam API with key
- Key stays secure on backend

#### Option B: Environment Variables (Development Only)
```
Frontend → YouCam API (with key in .env)
```
- ⚠️ Key is exposed in frontend bundle
- **Only use for testing/development**
- **NOT for production**

#### Option C: Firebase Functions / Serverless
```
Frontend → Cloud Function → YouCam API
```
- Deploy serverless function
- Function holds API key
- Frontend calls function

---

## 📊 Step 8: Cost Estimation

### For Fashion Fusion Users:

**Assumptions:**
- 1 try-on = 1 API call
- Average user tries 5-10 products
- 100 users/day

**Costs:**
- $0.10 per try-on (average)
- 100 users × 7 try-ons = 700 calls/day
- 700 × $0.10 = $70/day
- **Monthly**: ~$2,100

**Optimization:**
- Cache results (same user + same product = reuse)
- Implement rate limiting
- Use subscription plan for discounts

---

## 🧪 Step 9: Testing with API Playground

### Before coding, test manually:

1. **Visit**: [https://yce.makeupar.com/api-console/en/playground/](https://yce.makeupar.com/api-console/en/playground/)
2. **Select**: "AI Clothes Virtual Try-On"
3. **Upload**:
   - User photo (full body)
   - Garment photo (product image)
4. **Select**: Garment category
5. **Click**: "Start Processing"
6. **Wait**: 5-10 seconds
7. **View**: Result image

**This helps you:**
- Understand image requirements
- See processing time
- Test different garment types
- Verify API key works

---

## 📱 Step 10: User Flow in Fashion Fusion

### Scenario: User wants to try on a shirt

```
1. User browses products
   ↓
2. Clicks "Virtual Try-On" on a shirt
   ↓
3. Modal opens:
   - Option A: Upload photo
   - Option B: Take webcam photo
   ↓
4. User uploads/captures full-body photo
   ↓
5. App shows "Processing... Please wait"
   ↓
6. Behind the scenes:
   - Upload photo to YouCam
   - Get product image URL (already have from SerpAPI)
   - Create try-on task
   - Poll until complete (5-10 seconds)
   ↓
7. Show result: User wearing the shirt!
   ↓
8. User can:
   - Save result
   - Try different size/color
   - Try different product
   - Add to cart
```

---

## ✅ Step 11: Integration Checklist

### Pre-Integration:
- [ ] Register YouCam API account
- [ ] Get API key
- [ ] Test in API Playground
- [ ] Verify pricing/credits
- [ ] Read terms of service

### Development:
- [ ] Add API key to `.env.local`
- [ ] Create YouCam service module
- [ ] Implement file upload
- [ ] Implement task creation
- [ ] Implement status polling
- [ ] Handle errors gracefully
- [ ] Add loading states
- [ ] Cache results

### UI/UX:
- [ ] Add "Virtual Try-On" button
- [ ] Create photo upload modal
- [ ] Add webcam capture option
- [ ] Show processing indicator
- [ ] Display result image
- [ ] Allow switching products
- [ ] Add save/share options

### Testing:
- [ ] Test with different photo types
- [ ] Test with different garments
- [ ] Test error handling
- [ ] Test on mobile
- [ ] Test polling timeout
- [ ] Performance testing

### Security:
- [ ] Never commit API key
- [ ] Consider backend proxy
- [ ] Implement rate limiting
- [ ] Validate user uploads
- [ ] Sanitize file names

### Production:
- [ ] Set up backend proxy (recommended)
- [ ] Monitor API usage
- [ ] Track costs
- [ ] Set up alerts for errors
- [ ] Implement caching strategy

---

## 🎓 Step 12: Code Example (TypeScript)

### Basic Implementation:

```typescript
// src/services/youCamAPI.ts

const YOUCAM_BASE_URL = 'https://yce-api-01.makeupar.com';
const YOUCAM_API_KEY = import.meta.env.VITE_YOUCAM_API_KEY;

export async function tryOnClothes(
  userPhotoUrl: string,
  garmentImageUrl: string,
  garmentCategory: 'upper_body' | 'lower_body' | 'full_body'
): Promise<string> {
  // 1. Create try-on task
  const taskResponse = await fetch(`${YOUCAM_BASE_URL}/s2s/v2.0/task/cloth-v4`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUCAM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      src_file_url: userPhotoUrl,
      ref_file_url: garmentImageUrl,
      garment_category: garmentCategory,
    }),
  });

  const taskData = await taskResponse.json();
  const taskId = taskData.data.task_id;

  // 2. Poll for result
  let resultUrl: string | null = null;
  let attempts = 0;
  const maxAttempts = 30; // 30 attempts = 60 seconds max

  while (!resultUrl && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    const statusResponse = await fetch(
      `${YOUCAM_BASE_URL}/s2s/v2.0/task/cloth-v4/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        },
      }
    );

    const statusData = await statusResponse.json();

    if (statusData.data.task_status === 'success') {
      resultUrl = statusData.data.results.url;
    } else if (statusData.data.task_status === 'error') {
      throw new Error(statusData.data.error || 'Try-on failed');
    }

    attempts++;
  }

  if (!resultUrl) {
    throw new Error('Try-on timed out');
  }

  return resultUrl;
}
```

---

## 🚀 Next Steps

### Ready to implement? Follow these steps:

1. **Get API Key** ✅
   - Register at YouCam
   - Generate API key
   - Test in playground

2. **Add to Project** 📦
   - Add key to `.env.local`
   - Create YouCam service
   - Update UI components

3. **Test Integration** 🧪
   - Test with sample images
   - Verify processing works
   - Check error handling

4. **Deploy** 🌐
   - Set up backend proxy
   - Monitor usage
   - Launch to users!

---

## 📚 Resources

- **YouCam API Docs**: [https://docs.perfectcorp.com](https://docs.perfectcorp.com)
- **API Console**: [https://yce.makeupar.com/api-console](https://yce.makeupar.com/api-console)
- **Playground**: [https://yce.makeupar.com/api-console/en/playground/](https://yce.makeupar.com/api-console/en/playground/)
- **Support Email**: YouCamOnlineEditor_API@perfectcorp.com

---

## ❓ FAQ

**Q: How long does processing take?**
A: Typically 5-10 seconds per try-on.

**Q: Can I use webcam photos?**
A: Yes! Just ensure good lighting and full-body view.

**Q: What if the result looks bad?**
A: Try with better quality input images (higher resolution, better lighting, cleaner background).

**Q: Can I try multiple products at once?**
A: No, each API call handles one garment. But you can make multiple sequential calls.

**Q: Is there a free tier?**
A: Yes, you get initial credits for testing.

**Q: How do I handle errors?**
A: Implement retry logic and show user-friendly error messages.

---

**Ready to start? Let me know and I'll help you implement the YouCam integration!** 🎨✨
