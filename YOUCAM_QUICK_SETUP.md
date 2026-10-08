# 🚀 YouCam API Quick Setup (5 Minutes)

## Step 1: Get API Key

1. **Register**: [https://yce.makeupar.com/ai-api](https://yce.makeupar.com/ai-api)
2. **Verify** email
3. **Get Key**: [https://yce.makeupar.com/api-console/en/api-keys/](https://yce.makeupar.com/api-console/en/api-keys/)
4. **Copy** your API key

---

## Step 2: Test in Playground

Before coding, test it works:

1. **Visit**: [API Playground](https://yce.makeupar.com/api-console/en/playground/)
2. **Select**: "AI Clothes Virtual Try-On"
3. **Upload**:
   - User photo (full body)
   - Garment photo (product)
4. **Click**: "Start Processing"
5. **Wait**: 5-10 seconds
6. **See**: Result!

---

## Step 3: Add to Fashion Fusion

```bash
# Add to .env.local
echo "VITE_YOUCAM_API_KEY=your_api_key_here" >> .env.local
```

---

## Step 4: What You Get

### Virtual Try-On Features:
- ✅ **Upload user photo** or use webcam
- ✅ **Try on any product** from catalog
- ✅ **See realistic result** in 5-10 seconds
- ✅ **Try multiple items** sequentially
- ✅ **Save/share results**

### How It Works:
```
User clicks "Try On" 
  → Upload photo 
  → Processing (5-10s) 
  → See result!
```

---

## 📊 Pricing

**Free Trial**: Get credits to test
**Pay-as-you-go**: ~$0.10 per try-on
**Monthly Plans**: Discounted rates

**For 100 users/day:**
- ~700 try-ons/day
- ~$70/day = $2,100/month

**Tip**: Cache results to save costs!

---

## 🎯 API Workflow

### Simple Version:
```javascript
1. POST /file → Upload user photo → Get file_id
2. POST /task/cloth-v4 → Create try-on → Get task_id
3. GET /task/cloth-v4/{task_id} → Poll status → Get result URL
```

### Using URLs (Easier):
```javascript
POST /task/cloth-v4
{
  "src_file_url": "user_photo.jpg",
  "ref_file_url": "product.jpg",
  "garment_category": "upper_body"
}
```

---

## 📸 Image Requirements

### User Photo:
- ✅ Full body visible
- ✅ Clean background
- ✅ Good lighting
- ✅ Facing camera
- ❌ No multiple people

### Product Photo:
- ✅ High quality
- ✅ Clean background
- ✅ Full garment visible
- ✅ Product-style photo

---

## 💻 Next Steps

### Want me to implement it?

I can help you:
1. ✅ Create YouCam service module
2. ✅ Add photo upload UI
3. ✅ Integrate with product catalog
4. ✅ Show processing states
5. ✅ Display results beautifully

**Just say**: "Implement YouCam virtual try-on"

---

## 🔐 Security Note

⚠️ **API Key Safety:**

**For Development:**
- Use `.env.local` (OK for testing)
- Key exposed in frontend (not ideal)

**For Production:**
- Create backend proxy (recommended)
- Keep key on server only
- Frontend → Your Server → YouCam API

---

## 📚 Full Documentation

See **YOUCAM_API_INTEGRATION_GUIDE.md** for:
- Detailed API docs
- Code examples
- Error handling
- Best practices
- Cost optimization

---

## ✅ Ready?

**Test it now:**
1. Get API key ✓
2. Test in playground ✓
3. Add to `.env.local` ✓
4. Tell me to implement! ✓

**Questions?** Ask me anything about YouCam integration!
