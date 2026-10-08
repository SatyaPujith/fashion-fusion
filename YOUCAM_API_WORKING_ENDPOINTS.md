# YouCam API - Working Endpoints & Parameters

Based on official YouCam/Perfect Corp documentation and testing.

## ✅ Working Endpoints

### 1. **Clothing** - `/s2s/v2.0/task/cloth-v4`

**Status**: ✅ WORKING

**Use For**: Tops, Bottoms, Dresses, Outerwear

**Required Parameters**:
```json
{
  "src_file_id": "uploaded_user_photo_id",
  "ref_file_url": "https://product-image-url.jpg",
  "garment_category": "upper_body" | "lower_body" | "full_body"
}
```

**Photo Requirements**:
- Full body photo
- Clear view of the area being clothed
- Good lighting, minimal background

**Notes**:
- Most reliable endpoint
- Works well for shirts, pants, dresses
- Can only try ONE garment at a time (no combinations)

---

### 2. **Shoes** - `/s2s/v2.0/task/shoes-transfer`

**Status**: ✅ WORKING

**Use For**: Sneakers, Boots, Heels, Sandals, All Footwear

**Required Parameters**:
```json
{
  "src_file_id": "uploaded_user_photo_id",
  "ref_file_url": "https://shoe-image-url.jpg",
  "gender": "male" | "female"
}
```

**Gender Values**: Must be `"male"` or `"female"` (NOT "men" or "women")

**Photo Requirements**:
- Full body or legs visible
- Feet clearly shown
- Standing position recommended

**Notes**:
- Works very well
- Gender parameter is REQUIRED

---

### 3. **Bags** - `/s2s/v2.0/task/bag`

**Status**: ✅ WORKING (Fixed)

**Use For**: Handbags, Backpacks, Totes, Clutches, All Bags

**Required Parameters**:
```json
{
  "src_file_id": "uploaded_user_photo_id",
  "ref_file_url": "https://bag-image-url.jpg",
  "gender": "male" | "female"
}
```

**Gender Values**: Must be `"male"` or `"female"` (NOT "men" or "women")

**Photo Requirements**:
- Upper body or full body visible
- Hands/shoulder area clear

**IMPORTANT**: 
- ❌ NO `style` parameter! 
- The API does NOT accept a `style` parameter despite what you might expect
- Only `gender`, `src_file_id`, and `ref_file_url` are accepted

---

### 4. **Scarves** - `/s2s/v2.0/task/scarf`

**Status**: ✅ WORKING (Fixed)

**Use For**: Scarves, Shawls, Wraps, Stoles

**Required Parameters**:
```json
{
  "src_file_id": "uploaded_user_photo_id",
  "ref_file_url": "https://scarf-image-url.jpg",
  "gender": "male" | "female",
  "style": "random"
}
```

**Gender Values**: Must be `"male"` or `"female"` (NOT "men" or "women")

**Style Values**: `"random"` lets YouCam choose the best draping style

**Photo Requirements**:
- Upper body visible
- Neck and chest area clear
- Face visible for best results

**Notes**:
- Both `gender` AND `style` parameters are REQUIRED
- Using `style: "random"` gives good results

---

### 5. **Hats** - `/s2s/v2.0/task/hat`

**Status**: ✅ WORKING (Fixed)

**Use For**: Hats, Caps, Beanies, Fedoras, All Headwear

**Required Parameters**:
```json
{
  "src_file_id": "uploaded_user_photo_id",
  "ref_file_url": "https://hat-image-url.jpg",
  "gender": "male" | "female",
  "style": "random"
}
```

**Gender Values**: Must be `"male"` or `"female"` (NOT "men" or "women")

**Style Values**: `"random"` lets YouCam choose the best fit

**Photo Requirements**:
- Head and face clearly visible
- Hair visible (affects hat placement)
- Upper body in frame

**Notes**:
- Both `gender` AND `style` parameters are REQUIRED
- Using `style: "random"` gives good results

---

## ❌ Non-Working Endpoints

### Jewelry Endpoints - NOT AVAILABLE

All jewelry endpoints return **404 Not Found**:

- ❌ `/s2s/v2.0/task/bracelet` - Does NOT exist
- ❌ `/s2s/v2.0/task/ring` - Does NOT exist  
- ❌ `/s2s/v2.0/task/earrings` - Does NOT exist
- ❌ `/s2s/v2.0/task/watch` - Does NOT exist
- ❌ `/s2s/v2.0/task/necklace` - Does NOT exist

**Workaround**: These items cannot be virtually tried on with YouCam API currently.

---

## 🔑 API Authentication

All requests require Bearer token authentication:

```bash
Authorization: Bearer YOUR_API_KEY
```

Get your API key from: https://yce.makeupar.com/api-console/en/api-keys/

---

## 📤 File Upload Process

### Step 1: Request Upload URL

```bash
POST https://yce-api-01.makeupar.com/s2s/v2.0/file
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "files": [{
    "content_type": "image/jpg",
    "file_name": "user-photo.jpg",
    "file_size": 547541
  }]
}
```

### Step 2: Upload to S3

```bash
PUT <url_from_response>
Content-Type: image/jpg
Content-Length: 547541

<binary_image_data>
```

### Step 3: Use file_id

The `file_id` from Step 1 response is used in the `src_file_id` parameter.

---

## ⏱️ Task Polling

### Check Task Status

```bash
GET https://yce-api-01.makeupar.com/s2s/v2.0/task/{endpoint}/{task_id}
Authorization: Bearer YOUR_API_KEY
```

**Endpoints**: `cloth-v4`, `shoes-transfer`, `bag`, `scarf`, `hat`

**Response Statuses**:
- `"running"` - Still processing
- `"success"` - Complete, result URL available
- `"error"` - Failed

**Polling Strategy**:
- Wait 2 seconds between polls
- Maximum 30 attempts (60 seconds total)
- Check `task_status` field

---

## 📸 Photo Requirements Summary

| Endpoint | Required Photo | Notes |
|----------|----------------|-------|
| Clothing (upper) | Full body | Arms and torso visible |
| Clothing (lower) | Full body | Legs and waist visible |
| Clothing (full) | Full body | Entire body visible |
| Shoes | Full body or legs | Feet must be clearly visible |
| Bags | Upper body | Hands/shoulder visible |
| Scarves | Upper body/neck | Neck and chest clear |
| Hats | Head/face | Hair and upper body visible |

**General Tips**:
- Good lighting
- Minimal background distractions
- No multiple people in photo
- Clear, unobstructed view
- Standing position works best

---

## 🚨 Common Errors

### 1. Gender Parameter Error
```json
{
  "status": 400,
  "error": "gender is not one of the accepted values.",
  "error_code": "InvalidParameters"
}
```
**Fix**: Use `"male"` or `"female"` (not "men" or "women")

### 2. Style Parameter Error (Bag)
```json
{
  "status": 400,
  "error": "style is not one of the accepted values.",
  "error_code": "InvalidParameters"
}
```
**Fix**: Remove `style` parameter - bags don't accept it!

### 3. Missing Required Parameter
```json
{
  "status": 400,
  "error": "gender is required but wasn't included in your request.",
  "error_code": "InvalidParameters"
}
```
**Fix**: Add the missing required parameter

### 4. Endpoint Not Found
```json
{
  "status": 404,
  "error": "This endpoint doesn't exist.",
  "error_code": "NotFound"
}
```
**Fix**: Endpoint doesn't exist - use a different category or show error to user

---

## ✅ Implementation Checklist

- [x] Clothing - cloth-v4 endpoint
- [x] Shoes - shoes-transfer endpoint with gender
- [x] Bags - bag endpoint (NO style parameter)
- [x] Scarves - scarf endpoint with gender + style
- [x] Hats - hat endpoint with gender + style
- [ ] Bracelets - NOT AVAILABLE
- [ ] Rings - NOT AVAILABLE
- [ ] Earrings - NOT AVAILABLE
- [ ] Watches - NOT AVAILABLE

---

## 📚 Official Documentation

- Bag API: https://docs.perfectcorp.com/reference/ai_bag
- Scarf API: https://docs.perfectcorp.com/reference/ai_scarf
- Hat API: https://docs.perfectcorp.com/reference/ai_hat
- Clothes API: https://docs.perfectcorp.com/reference/ai_clothes

---

## 💡 Best Practices

1. **Always validate gender parameter**: Convert "men"→"male", "women"→"female"
2. **Use style="random" for scarves/hats**: Gives best automatic results
3. **Don't send style parameter for bags**: API will reject it
4. **Handle 404 gracefully**: Show friendly message for unsupported items
5. **Poll appropriately**: 2-second intervals, max 30 attempts
6. **Upload full body photos**: Works for all endpoints
7. **One item at a time**: API doesn't support combinations

---

## 🔧 Troubleshooting

**Issue**: Scarf looks wrong/regenerates entire image
- **Cause**: Missing `style` parameter
- **Fix**: Add `style: "random"` to request

**Issue**: Bag request fails with style error
- **Cause**: Including unsupported `style` parameter
- **Fix**: Remove `style` parameter completely

**Issue**: Gender error
- **Cause**: Using "men"/"women" instead of "male"/"female"
- **Fix**: Convert to correct format

**Issue**: Belt changes shirt instead of showing belt
- **Cause**: Belt detected as jewelry/accessory, routed to wrong endpoint
- **Fix**: Route belts to cloth-v4 as accessories (upper_body)

---

## Summary

**Working Categories**: Clothing, Shoes, Bags, Scarves, Hats (5 categories)

**Not Working**: All Jewelry (Bracelets, Rings, Earrings, Watches, Necklaces)

**Key Takeaway**: Always check official documentation and test parameters - assumptions about API structure can lead to errors!
