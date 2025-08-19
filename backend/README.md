# Resume Analysis API 🚀

A powerful Flask-based backend API that provides comprehensive resume analysis using Mistral AI. This service offers intelligent resume parsing, ATS compatibility scoring, skill matching, career insights, and interview preparation tools through a robust RESTful API.

## 🎯 Core Capabilities

The Resume Analysis API delivers:
- **AI-Powered Resume Parsing**: Advanced OCR using Mistral AI for accurate text extraction from PDFs
- **Intelligent Matching**: Deep analysis of resume-job description compatibility
- **ATS Optimization**: Comprehensive scoring with detailed breakdowns for applicant tracking systems
- **Career Intelligence**: Actionable insights and recommendations for resume improvement
- **Interview Preparation**: AI-generated flashcards tailored to specific roles and skills

## Features

- **Resume Analysis**: Match resumes against job descriptions for skills, keywords, and experience.
- **ATS Scoring**: Calculate ATS compatibility with detailed breakdowns.
- **Career Insights**: Provide actionable recommendations for resume improvement.
- **Flashcards**: Generate interview preparation flashcards based on the resume and job description.
- **Health Check**: Verify the API's operational status.

---

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- `pip` (Python package manager)
- Cloudinary account for file uploads
- Mistral AI API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd resume-analysis/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your credentials:
     - `MISTRAL_API_KEY`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET_KEY`

5. Run the application:
   ```bash
   python main.py
   ```

6. Access the API at `http://localhost:5000`.

---

## API Endpoints

### 1. **Health Check**
   - **URL**: `/health`
   - **Method**: `GET`
   - **Description**: Check if the API service is running.
   - **Response**:
     ```json
     {
       "status": "healthy",
       "service": "Resume Analysis API"
     }
     ```

### 2. **Analyze Resume**
   - **URL**: `/analyze-resume`
   - **Method**: `POST`
   - **Description**: Upload a resume and job description for analysis.
   - **Request**:
     - Form Data:
       - `resume` (file): PDF file of the resume.
       - `job_description` (text): Job description text.
   - **Response**:
     ```json
     {
       "success": true,
       "data": {
         "analysis": { ... },
         "insights": { ... },
         "flashcards": [ ... ],
         "ats_score": { ... },
         "resume_preview": "Extracted resume text"
       }
     }
     ```

   - **Error Responses**:
     - `400`: Missing or invalid input (e.g., no resume file, unsupported file format).
     - `500`: Internal server error.

---

## Environment Variables

| Variable                  | Description                          |
|---------------------------|--------------------------------------|
| `MISTRAL_API_KEY`         | API key for Mistral AI.             |
| `CLOUDINARY_API_KEY`      | API key for Cloudinary.             |
| `CLOUDINARY_API_SECRET_KEY` | Secret key for Cloudinary.         |
| `FLASK_ENV`               | Flask environment (`development`).  |
| `FLASK_DEBUG`             | Enable debug mode (`True`/`False`). |

---

## Development

### Running Tests
- Use Postman or any API testing tool to test the endpoints.
- A Postman collection is available in `postman_collection.json`.

### Debugging
- Set `FLASK_DEBUG=True` in `.env` to enable debug mode.

---

## Dependencies

- Flask
- Flask-CORS
- PyPDF2
- requests
- mistralai
- cloudinary

---

## Example Usage

### Analyze Resume
1. Use the `/analyze-resume` endpoint to upload a resume and job description.
2. Example cURL request:
   ```bash
   curl -X POST http://localhost:5000/analyze-resume \
   -F "resume=@sample_resume.pdf" \
   -F "job_description=Python Developer with Flask experience..."
   ```

3. Example Response:
   ```json
   {
     "success": true,
     "data": {
       "analysis": { ... },
       "insights": { ... },
       "flashcards": [ ... ],
       "ats_score": { ... },
       "resume_preview": "Extracted resume text"
     }
   }
   ```

---

## 📊 API Response Schema

### Analysis Response Structure
```json
{
  "success": true,
  "data": {
    "analysis": {
      "matching_skills": ["Python", "Flask", "REST APIs"],
      "missing_skills": ["Docker", "Kubernetes", "AWS"],
      "matching_keywords": ["backend", "database", "API"],
      "missing_keywords": ["microservices", "DevOps"],
      "experience_match": {
        "required_years": "3-5 years",
        "candidate_years": "4 years",
        "match_percentage": 85
      },
      "education_match": {
        "required": "Bachelor's degree in Computer Science",
        "candidate": "BS Computer Science",
        "match": true
      },
      "role_compatibility": {
        "score": 78,
        "reasoning": "Strong technical background with relevant experience"
      }
    },
    "insights": {
      "strengths": ["Strong Python expertise", "Relevant project experience"],
      "improvements": ["Add cloud platform experience", "Include more DevOps tools"],
      "recommendations": {
        "high_priority": ["Add Docker/containerization skills"],
        "medium_priority": ["Highlight database optimization experience"],
        "low_priority": ["Include soft skills section"]
      }
    },
    "flashcards": [
      {
        "front": "Explain your experience with REST API development",
        "back": "Focus on Flask framework usage, endpoint design, and authentication"
      }
    ],
    "ats_score": {
      "overall_score": 76,
      "breakdown": {
        "keyword_density": 82,
        "skills_match": 75,
        "experience_relevance": 80,
        "education_match": 90,
        "format_optimization": 70
      }
    },
    "resume_preview": "Full extracted resume text..."
  }
}
```

## 🚀 Technical Architecture

### Core Components

#### 1. **ResumeAnalyzer Class**
- **PDF Processing**: Handles file upload, temporary storage, and Cloudinary integration
- **OCR Integration**: Uses Mistral AI's OCR capabilities for text extraction
- **Analysis Pipeline**: Orchestrates multiple analysis functions
- **Error Handling**: Comprehensive exception management

#### 2. **Mistral AI Integration**
```python
# OCR Processing
ocr_response = mis_client.ocr.process(
    document=DocumentURLChunk(document_url=cloudinary_url),
    model='mistral-ocr-latest',
    include_image_base64=True
)

# Text Analysis
payload = {
    "model": "mistral-small-latest",
    "messages": [...],
    "max_tokens": 1500,
    "temperature": 0.3
}
```

#### 3. **Cloudinary File Management**
- **Secure Upload**: PDF files uploaded to cloud storage
- **URL Generation**: Secure URLs for Mistral AI processing
- **Cleanup**: Automatic temporary file removal

### Analysis Functions

1. **`analyze_resume_match()`**: Core compatibility analysis
2. **`generate_insights()`**: Improvement recommendations
3. **`generate_flashcards()`**: Interview preparation questions
4. **`calculate_ats_score()`**: ATS compatibility scoring

## 🔧 Configuration & Setup

### Environment Setup
```bash
# Development environment
export FLASK_ENV=development
export FLASK_DEBUG=True

# Production environment
export FLASK_ENV=production
export FLASK_DEBUG=False
```

### Required API Keys
1. **Mistral AI**: Sign up at [mistral.ai](https://mistral.ai)
2. **Cloudinary**: Create account at [cloudinary.com](https://cloudinary.com)

### Security Configuration
```python
# CORS Configuration
CORS(app, origins=['http://localhost:5173'])  # Frontend URL

# File Upload Security
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB limit
UPLOAD_EXTENSIONS = {'.pdf'}
```

## 🛡️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common Error Codes
- **`INVALID_FILE_FORMAT`**: Non-PDF file uploaded
- **`MISSING_JOB_DESCRIPTION`**: Job description not provided
- **`PDF_PROCESSING_ERROR`**: OCR extraction failed
- **`AI_SERVICE_ERROR`**: Mistral AI service unavailable
- **`CLOUDINARY_ERROR`**: File upload failed

## 📊 Performance & Monitoring

### Performance Metrics
- **PDF Processing**: ~5-15 seconds (depends on file size)
- **AI Analysis**: ~10-30 seconds (depends on complexity)
- **Memory Usage**: ~50-200MB per request
- **Concurrent Requests**: Up to 10 (configurable)

### Monitoring Endpoints
```bash
# Health check with detailed status
GET /health

# Service metrics (if implemented)
GET /metrics
```

## 📖 API Testing

### Using Postman
1. Import `postman_collection.json`
2. Set environment variables:
   - `base_url`: `http://localhost:5000`
3. Test `/health` endpoint first
4. Upload sample resume for `/analyze-resume`

### Using cURL
```bash
# Health check
curl -X GET http://localhost:5000/health

# Resume analysis
curl -X POST http://localhost:5000/analyze-resume \
  -F "resume=@test_resume.pdf" \
  -F "job_description=Software Engineer position requiring Python, Flask, and API development experience"
```

## 🚀 Deployment

### Production Deployment
```bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 main:app

# With configuration file
gunicorn -c gunicorn.conf.py main:app
```

### Docker Deployment
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app"]
```

### Environment Variables for Production
```env
FLASK_ENV=production
FLASK_DEBUG=False
MISTRAL_API_KEY=your_production_key
CLOUDINARY_API_KEY=your_production_key
CLOUDINARY_API_SECRET_KEY=your_production_secret
```

## 🔍 Debugging & Troubleshooting

### Common Issues

1. **PDF Processing Fails**
   ```bash
   # Check Cloudinary configuration
   python -c "import cloudinary; print(cloudinary.config())"
   
   # Verify file permissions
   ls -la uploads/
   ```

2. **Mistral API Errors**
   ```bash
   # Test API key
   curl -H "Authorization: Bearer $MISTRAL_API_KEY" \
        https://api.mistral.ai/v1/models
   ```

3. **Memory Issues**
   ```bash
   # Monitor memory usage
   ps aux | grep python
   
   # Adjust worker processes
   gunicorn -w 2 main:app  # Reduce workers
   ```

### Debug Mode
```python
# Enable detailed logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Flask debug mode
app.run(debug=True, port=5000)
```

## 📋 Logging

### Log Levels
- **INFO**: Normal operations
- **WARNING**: Potential issues
- **ERROR**: Processing errors
- **DEBUG**: Detailed debugging information

### Log Format
```python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

---

## 📝 License

This project is licensed under the MIT License.
