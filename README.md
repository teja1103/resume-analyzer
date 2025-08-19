# Resume Analysis Platform 📄🔍

A comprehensive AI-powered resume analysis platform that provides intelligent insights, ATS optimization, and interview preparation tools. Built with Flask (backend) and React + TypeScript (frontend), leveraging Mistral AI for advanced natural language processing.

## 🎯 Overview

The Resume Analysis Platform helps job seekers optimize their resumes by:
- **Analyzing resume-job description compatibility**
- **Providing ATS (Applicant Tracking System) scoring**
- **Generating actionable improvement insights**
- **Creating personalized interview preparation flashcards**
- **Extracting and processing PDF resumes using OCR**

## ✨ Key Features

### 🤖 AI-Powered Analysis
- **Smart Resume Parsing**: Advanced OCR using Mistral AI for accurate text extraction
- **Skill Matching**: Identifies matching and missing skills against job requirements
- **Keyword Optimization**: Highlights important keywords for ATS compatibility
- **Experience Assessment**: Evaluates experience level against job requirements

### 📊 Comprehensive Insights
- **ATS Score**: Detailed compatibility scoring with breakdown
- **Role Compatibility**: Percentage match with reasoning
- **Education Matching**: Degree and qualification assessment
- **Improvement Recommendations**: Actionable suggestions for resume enhancement

### 🎓 Interview Preparation
- **Custom Flashcards**: AI-generated interview questions based on your resume
- **Skill-Based Questions**: Targeted questions for specific competencies
- **Interactive Study Mode**: Flip cards for active learning

## 🏗️ Architecture

```
resume-analysis/
├── backend/          # Flask API server
│   ├── main.py       # Core application logic
│   ├── requirements.txt
│   └── README.md     # Backend documentation
├── frontend/         # React TypeScript application
│   ├── src/          # Source code
│   ├── package.json
│   └── README.md     # Frontend documentation
└── README.md         # This file
```

### Backend (Flask + Python)
- **Framework**: Flask with CORS support
- **AI Integration**: Mistral AI for text analysis and OCR
- **File Processing**: PDF text extraction and cloud storage
- **API Design**: RESTful endpoints with comprehensive error handling

### Frontend (React + TypeScript)
- **Framework**: React 19+ with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: Tailwind CSS with Radix UI components
- **State Management**: React hooks with proper error boundaries
- **Charts**: Recharts for data visualization

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn/pnpm
- **Python** 3.8+
- **Mistral AI API Key**
- **Cloudinary Account** (for file uploads)

### 1. Clone Repository
```bash
git clone <repository-url>
cd resume-analysis
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python main.py
```

### 3. Setup Frontend
```bash
cd frontend
npm install  # or yarn install / pnpm install
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📋 API Documentation

### Endpoints

#### Health Check
```http
GET /health
```
Returns service status and health information.

#### Resume Analysis
```http
POST /analyze-resume
Content-Type: multipart/form-data

Form Data:
- resume: PDF file
- job_description: Text description
```

Returns comprehensive analysis including:
- Resume-job matching analysis
- ATS compatibility score
- Improvement insights
- Interview preparation flashcards
- Extracted resume text preview

## 🛠️ Configuration

### Environment Variables

#### Backend (.env)
```env
MISTRAL_API_KEY=your_mistral_api_key
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET_KEY=your_cloudinary_secret
FLASK_ENV=development
FLASK_DEBUG=True
```

#### Frontend
The frontend automatically connects to `http://localhost:5000` for the backend API.

## 🎨 Technology Stack

### Backend Technologies
- **Flask**: Lightweight Python web framework
- **Mistral AI**: Advanced language model for analysis
- **PyPDF2**: PDF text extraction
- **Cloudinary**: Cloud storage for file uploads
- **Flask-CORS**: Cross-origin resource sharing

### Frontend Technologies
- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe JavaScript
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **Recharts**: Composable charting library
- **Axios**: HTTP client for API requests

## 📱 User Interface

### Dashboard Features
- **Clean Upload Interface**: Drag-and-drop PDF upload
- **Real-time Analysis**: Progress indicators during processing
- **Interactive Charts**: Visual representation of analysis results
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Theme switching capabilities

### Analysis Views
- **Skills Matching**: Visual comparison of required vs. possessed skills
- **ATS Score Dashboard**: Comprehensive scoring with breakdown
- **Insights Panel**: Actionable recommendations
- **Flashcards Interface**: Interactive interview preparation

## 🧪 Development

### Running Tests
```bash
# Backend
cd backend
python -m pytest tests/

# Frontend
cd frontend
npm run test
```

### Code Quality
```bash
# Frontend linting
cd frontend
npm run lint

# Frontend type checking
npm run type-check
```

### Build for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend production setup
cd backend
pip install gunicorn
gunicorn main:app
```

## 🔧 Troubleshooting

### Common Issues

1. **PDF Processing Fails**
   - Ensure Cloudinary credentials are correct
   - Check PDF file size and format
   - Verify Mistral API key is valid

2. **Frontend Can't Connect to Backend**
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API endpoints are accessible

3. **Analysis Takes Too Long**
   - Large PDF files may take longer to process
   - Check network connection to Mistral AI
   - Monitor API rate limits

### Performance Optimization
- Use environment-specific configurations
- Implement proper error boundaries
- Add request caching where appropriate
- Optimize PDF processing pipeline

## 🤝 Contributing

We welcome contributions! Please see our contribution guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper tests
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mistral AI** for powerful language model capabilities
- **Cloudinary** for reliable file storage and processing
- **Tailwind CSS** and **Radix UI** for beautiful, accessible components
- **React** and **Vite** communities for excellent developer experience

---

**Ready to optimize your resume? Start analyzing today! 🚀**

For detailed setup instructions, see the individual README files in the [backend/](./backend/README.md) and [frontend/](./frontend/README.md) directories.
