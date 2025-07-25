# 🌱 Vegan E-Number Checker

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Tesseract.js](https://img.shields.io/badge/Tesseract.js-OCR-orange?style=flat-square)](https://tesseract.projectnaptha.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)
[![Vegan Friendly](https://img.shields.io/badge/🌱-Vegan_Friendly-green?style=flat-square)](https://www.vegansociety.com/)

A simple and fast web application built with Next.js 15 that helps you determine if food products are vegan by analyzing E-numbers (food additives) found in ingredient lists.

## 🎯 What It Does

This website allows you to:

- **Text Input**: Manually type or paste ingredient lists
- **Image OCR**: Upload photos of ingredient labels using your phone camera or file upload
- **Instant Analysis**: Automatically detect and extract E-numbers from text or images
- **Vegan Verification**: Check if ALL detected E-numbers are vegan-friendly
- **Clear Results**: Get a definitive YES or NO answer about product veganism

## 🚀 How It Works

### Method 1: Text Input

1. Visit the homepage
2. Type or paste the ingredient list into the text area
3. Click "Check" button
4. Get redirected to either `/yes` (all E-numbers are vegan) or `/no` (contains non-vegan E-numbers)

### Method 2: Image Upload

1. Visit the homepage
2. Click "Choose File" or use camera capture on mobile
3. Upload a photo of the ingredient label
4. The OCR (Optical Character Recognition) will automatically extract text
5. E-numbers are detected and analyzed
6. Get redirected to the result page

## 🔍 Features

- **Advanced OCR**: Uses Tesseract.js with image preprocessing for better accuracy
- **Smart Detection**: Recognizes E-numbers in various formats (E100, E-100, e 100, etc.)
- **Comprehensive Database**: Includes 400+ verified vegan E-numbers
- **Visual Feedback**: Color-coded E-numbers (green = vegan, red = non-vegan)
- **Mobile Optimized**: Camera capture support for on-the-go checking
- **Fast Processing**: Client-side OCR for instant results

## 📱 Technology Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form with Zod validation
- **OCR**: Tesseract.js with canvas image preprocessing
- **UI Components**: Radix UI primitives
- **Icons**: React Icons
- **TypeScript**: Full type safety

## 🛠️ Installation & Development

```bash
# Clone the repository
git clone <repository-url>
cd enumbers

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📋 How the Vegan Check Works

The application follows a strict **ALL-OR-NOTHING** rule:

- ✅ **VEGAN**: If ALL detected E-numbers are in the vegan database
- ❌ **NOT VEGAN**: If ANY E-number is missing from the vegan database or is known to be non-vegan

### Example Scenarios:

**Scenario 1** - Input: "E100, E200, E300"

- All three E-numbers are vegan → Result: `/yes`

**Scenario 2** - Input: "E100, E120, E300"

- E120 (cochineal) is not vegan → Result: `/no`

**Scenario 3** - Input: "E999, E1000"

- E1000 is not in vegan database → Result: `/no`

## 🎨 User Interface

### Homepage (`/`)

- Clean, minimal interface
- Text input area for manual entry
- File upload with camera support
- Real-time E-number detection and color coding

### Results Pages

- **`/yes`**: Celebratory page confirming the product is vegan
- **`/no`**: Clear indication that the product contains non-vegan ingredients
- Both pages include "Check Another Product" button to return home

## 🔧 Technical Details

### Image Processing Pipeline

1. **File Upload**: Accept image files or camera capture
2. **Base64 Conversion**: Convert uploaded file to base64
3. **Canvas Processing**: Resize and optimize image for OCR
4. **Contrast Enhancement**: Apply black/white filter for better text recognition
5. **Blob Creation**: Convert processed canvas to blob for Tesseract
6. **OCR Processing**: Extract text using Tesseract.js
7. **E-number Detection**: Parse text with regex pattern
8. **Vegan Analysis**: Cross-reference with vegan E-numbers database

### E-Number Detection Regex

```javascript
/\b[Ee][- ]?\d{3,4}[a-z]?\b/gi;
```

Matches patterns like: E100, E-200, e300, E123a, etc.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [Apache License 2.0](LICENSE).

## 🤝 Acknowledgments

- Vegan E-numbers database compiled from various food safety authorities
- Tesseract.js team for the excellent OCR library
- Next.js team for the amazing framework

---

**Made with 💚 for the vegan community**
