from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import io
import json
import requests
import re
from typing import Dict, List, Any
import os
import tempfile
from dataclasses import dataclass
from mistralai import Mistral, DocumentURLChunk
import cloudinary
import cloudinary.uploader

app = Flask(__name__)
CORS(app)

# Configuration
MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY', 'YOUR_MISTRAL_API_KEY')
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
CLOUDINARY_CLOUD_NAME = "dplpfiymx"
CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY', 'YOUR_CLOUDINARY_API_KEY')
CLOUDINARY_API_SECRET_KEY = os.getenv('CLOUDINARY_API_SECRET_KEY', 'YOUR_CLOUDINARY_API_SECRET_KEY')

# Configure Cloudinary
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET_KEY,
    secure=True
)

mis_client = Mistral(api_key=MISTRAL_API_KEY)

@dataclass
class AnalysisResult:
    analysis: Dict[str, Any]
    insights: Dict[str, Any]
    flashcards: List[Dict[str, str]]
    ats_score: Dict[str, Any]

class ResumeAnalyzer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def extract_text_from_pdf(self, pdf_file) -> str:
        """Extract text from uploaded PDF file"""
        try:
            # Save uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                pdf_file.seek(0)
                temp_file.write(pdf_file.read())
                temp_file_path = temp_file.name
            print(f"Temporary PDF file created at: {temp_file_path}")
            
            try:
                # Upload to Cloudinary using SDK
                print("Uploading PDF to Cloudinary using SDK...")
                
                upload_result = cloudinary.uploader.upload(
                    temp_file_path,
                    public_id=f"resume_{os.path.basename(temp_file_path)}",
                    resource_type="raw",  # Use 'raw' for PDF files
                    folder="resumes"
                )
                print(f"Upload result: {upload_result}")
                cloudinary_url = upload_result['secure_url']
                print(f"Uploaded PDF to Cloudinary: {cloudinary_url}")
                
                # Process with Mistral OCR using Cloudinary URL
                ocr_response = mis_client.ocr.process(
                    document=DocumentURLChunk(document_url=cloudinary_url),
                    model='mistral-ocr-latest',
                    include_image_base64=True
                )
                print("OCR processing completed successfully.")
                
                # Extract text from OCR response pages
                extracted_text = ""
                if hasattr(ocr_response, 'pages') and ocr_response.pages:
                    for page in ocr_response.pages:
                        if hasattr(page, 'markdown') and page.markdown:
                            extracted_text += page.markdown + "\n"
                
                # Fallback if no text extracted
                if not extracted_text.strip():
                    raise Exception("No text could be extracted from the PDF")
                
                print(f"Extracted text length: {len(extracted_text.strip())} characters")
                print(f"Extracted text preview: {extracted_text[:500]}...")
                
                return extracted_text.strip()
            except Exception as e:
                print(f"Error processing PDF with Mistral: {str(e)}")
                raise Exception(f"Error processing PDF: {str(e)}")
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    
        except Exception as e:
            raise Exception(f"Error extracting PDF text: {str(e)}")
    
    def call_mistral_api(self, prompt: str, max_tokens: int = 1000) -> str:
        """Make API call to Mistral"""
        payload = {
            "model": "mistral-small-latest",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                },
                {
                    "role": "system",
                    "content": "You are an expert resume analysis AI. Provide detailed and accurate responses. Only return valid JSON. Do not include any additional text or explanations. Ensure your responses are concise and focused on the analysis requested. This will help ensure the output is structured and usable. The resume analysis should be thorough and cover all aspects of the resume in relation to the job description provided."
                }
            ],
            "max_tokens": max_tokens,
            "temperature": 0.3
        }
        
        try:
            response = requests.post(
                MISTRAL_API_URL,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            print(f"Mistral API response : {response.json()["choices"][0]["message"]["content"]}")
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            raise Exception(f"Mistral API error: {str(e)}")
    
    def _clean_json_response(self, response: str) -> str:
        """Clean Mistral response to extract JSON content from markdown blocks"""
        if "```json" in response:
            start = response.find("```json") + 7
            end = response.find("```", start)
            if end != -1:
                return response[start:end].strip()
        elif "```" in response:
            start = response.find("```") + 3
            end = response.rfind("```")
            if end != -1 and end > start:
                return response[start:end].strip()
        return response.strip()

    def analyze_resume_match(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Analyze resume against job description for matching"""
        prompt = f"""
        You are an expert HR analyst and ATS system. Analyze the following resume against the job description.

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {job_description}

        Provide a detailed analysis in the following JSON format:
        {{
            "matching_skills": ["skill1", "skill2", ...],
            "missing_skills": ["skill1", "skill2", ...],
            "matching_keywords": ["keyword1", "keyword2", ...],
            "missing_keywords": ["keyword1", "keyword2", ...],
            "experience_match": {{
                "required_years": "X years",
                "candidate_years": "Y years",
                "match_percentage": 85
            }},
            "education_match": {{
                "required": "Degree requirement",
                "candidate": "Candidate degree",
                "match": true
            }},
            "role_compatibility": {{
                "score": 78,
                "reasoning": "Detailed explanation of compatibility"
            }}
        }}
        
        Be precise and only return valid JSON.
        """
        
        response = self.call_mistral_api(prompt, 1500)
        try:
            cleaned_response = self._clean_json_response(response)
            return json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            print(f"JSON decode error in analysis: {e}")
            print(f"Cleaned response: {cleaned_response[:500]}...")
            return self._parse_analysis_fallback(response)
    
    def generate_insights(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Generate actionable insights for resume improvement"""
        prompt = f"""
        As a career counselor and resume expert, provide actionable insights for improving this resume for the target job.

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {job_description}

        Provide insights in this JSON format:
        {{
            "strengths": ["strength1", "strength2", ...],
            "weaknesses": ["weakness1", "weakness2", ...],
            "recommendations": [
                {{
                    "category": "Skills",
                    "suggestion": "Specific actionable advice",
                    "priority": "High/Medium/Low"
                }},
                ...
            ],
            "career_progression": {{
                "current_level": "Junior/Mid/Senior",
                "target_level": "Level for this role",
                "gap_analysis": "What's needed to bridge the gap"
            }},
            "resume_improvements": [
                "Specific resume writing suggestions"
            ]
        }}
        
        Return only valid JSON.
        """
        
        response = self.call_mistral_api(prompt, 1200)
        try:
            cleaned_response = self._clean_json_response(response)
            return json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            print(f"JSON decode error in insights: {e}")
            print(f"Cleaned response: {cleaned_response[:500]}...")
            return self._parse_insights_fallback(response)
    
    def generate_flashcards(self, resume_text: str, job_description: str) -> List[Dict[str, str]]:
        """Generate flashcards for interview preparation"""
        prompt = f"""
        Create interview preparation flashcards based on the resume and job description.

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {job_description}

        Generate 15-20 flashcards in this JSON format:
        [
            {{
                "question": "Technical/behavioral question",
                "answer": "Detailed answer based on resume experience",
                "category": "Technical/Behavioral/Situational",
                "difficulty": "Easy/Medium/Hard"
            }},
            ...
        ]

        Focus on:
        - Technical skills mentioned in the resume
        - Behavioral questions based on job requirements
        - Situational questions for the specific role
        - Questions about projects/experience from the resume

        Return only valid JSON array.
        """
        
        response = self.call_mistral_api(prompt, 2000)
        try:
            cleaned_response = self._clean_json_response(response)
            return json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            print(f"JSON decode error in flashcards: {e}")
            print(f"Cleaned response: {cleaned_response[:500]}...")
            return self._parse_flashcards_fallback(response)
    
    def calculate_ats_score(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Calculate ATS score and provide detailed breakdown"""
        prompt = f"""
        You are an ATS (Applicant Tracking System) analyzer. Calculate a comprehensive ATS score for this resume.

        RESUME:
        {resume_text}

        JOB DESCRIPTION:
        {job_description}

        Provide ATS analysis in this JSON format:
        {{
            "overall_score": 85,
            "score_breakdown": {{
                "keyword_match": {{
                    "score": 75,
                    "max_score": 100,
                    "details": "X% of required keywords found"
                }},
                "skills_match": {{
                    "score": 80,
                    "max_score": 100,
                    "details": "Technical and soft skills alignment"
                }},
                "experience_relevance": {{
                    "score": 90,
                    "max_score": 100,
                    "details": "Experience relevance to role"
                }},
                "format_optimization": {{
                    "score": 85,
                    "max_score": 100,
                    "details": "ATS-friendly formatting"
                }}
            }},
            "improvement_suggestions": [
                {{
                    "area": "Keywords",
                    "suggestion": "Add these specific keywords",
                    "impact": "High/Medium/Low"
                }},
                ...
            ],
            "ats_compatibility": {{
                "rating": "Excellent/Good/Fair/Poor",
                "key_issues": ["issue1", "issue2"],
                "optimization_tips": ["tip1", "tip2"]
            }}
        }}

        Return only valid JSON.
        """
        
        response = self.call_mistral_api(prompt, 1500)
        try:
            cleaned_response = self._clean_json_response(response)
            return json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            print(f"JSON decode error in ATS score: {e}")
            print(f"Cleaned response: {cleaned_response[:500]}...")
            return self._parse_ats_fallback(response)
    
    def _parse_analysis_fallback(self, response: str) -> Dict[str, Any]:
        """Fallback parser for analysis if JSON parsing fails"""
        return {
            "matching_skills": [],
            "missing_skills": [],
            "matching_keywords": [],
            "missing_keywords": [],
            "experience_match": {"match_percentage": 0},
            "education_match": {"match": False},
            "role_compatibility": {"score": 0, "reasoning": "Analysis failed to parse"}
        }
    
    def _parse_insights_fallback(self, response: str) -> Dict[str, Any]:
        """Fallback parser for insights"""
        return {
            "strengths": [],
            "weaknesses": [],
            "recommendations": [],
            "career_progression": {"gap_analysis": "Unable to analyze"},
            "resume_improvements": []
        }
    
    def _parse_flashcards_fallback(self, response: str) -> List[Dict[str, str]]:
        """Fallback parser for flashcards"""
        return [
            {
                "question": "Tell me about yourself",
                "answer": "Prepare based on your resume highlights",
                "category": "Behavioral",
                "difficulty": "Easy"
            }
        ]
    
    def _parse_ats_fallback(self, response: str) -> Dict[str, Any]:
        """Fallback parser for ATS score"""
        return {
            "overall_score": 0,
            "score_breakdown": {},
            "improvement_suggestions": [],
            "ats_compatibility": {"rating": "Unable to analyze"}
        }

# Initialize analyzer
analyzer = ResumeAnalyzer(MISTRAL_API_KEY)

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    """Main endpoint for comprehensive resume analysis"""
    print("Received request for resume analysis")
    try:
        # Validate request
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400
        
        if 'job_description' not in request.form:
            return jsonify({"error": "No job description provided"}), 400
        
        resume_file = request.files['resume']
        job_description = request.form['job_description']
        print("Processing resume and job description", job_description[:50] + "...")  # Log first 50 chars of job description
        
        if resume_file.filename == '':
            return jsonify({"error": "No resume file selected"}), 400
        
        if not resume_file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are supported"}), 400
        
        # Extract text from PDF
        try:
            resume_text = analyzer.extract_text_from_pdf(resume_file)
            if not resume_text.strip():
                return jsonify({"error": "Could not extract text from PDF"}), 400
        except Exception as e:
            return jsonify({"error": f"PDF processing error: {str(e)}"}), 400
        
        # Perform all analyses
        try:
            analysis = analyzer.analyze_resume_match(resume_text, job_description)
            insights = analyzer.generate_insights(resume_text, job_description)
            flashcards = analyzer.generate_flashcards(resume_text, job_description)
            ats_score = analyzer.calculate_ats_score(resume_text, job_description)
            
            # Compile results
            result = {
                "success": True,
                "data": {
                    "analysis": analysis,
                    "insights": insights,
                    "flashcards": flashcards,
                    "ats_score": ats_score,
                    "resume_preview": resume_text
                }
            }

            print("Analysis completed successfully:", result)

            return jsonify(result), 200
            
        except Exception as e:
            return jsonify({
                "error": f"Analysis error: {str(e)}",
                "success": False
            }), 500
    
    except Exception as e:
        return jsonify({
            "error": f"Server error: {str(e)}",
            "success": False
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Resume Analysis API"
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Ensure API key is set
    # print("Mistral API Key:", MISTRAL_API_KEY)
    if not MISTRAL_API_KEY or MISTRAL_API_KEY != 'YOUR_MISTRAL_API_KEY':
        # print("Condition result 1:", MISTRAL_API_KEY == 'YOUR_MISTRAL_API_KEY')
        print("Warning: MISTRAL_API_KEY not set. Please set your Mistral API key.")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
