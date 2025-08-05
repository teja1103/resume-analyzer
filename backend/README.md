# Resume Analysis API

The Resume Analysis API is a Flask-based application that provides comprehensive resume analysis using Mistral AI. It includes features such as ATS scoring, skill matching, career insights, and interview preparation flashcards.

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

## License

This project is licensed under the MIT License.
