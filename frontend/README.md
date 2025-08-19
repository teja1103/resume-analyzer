# Resume Analysis Frontend 🎨

A modern, responsive React + TypeScript frontend application for the Resume Analysis Platform. Built with Vite, Tailwind CSS, and Radix UI components, providing an intuitive interface for AI-powered resume analysis and interview preparation.

## 🌟 Features

### 📁 File Upload & Processing
- **Drag-and-drop PDF upload** with visual feedback
- **File validation** (PDF format, size limits)
- **Upload progress indicators** for better UX
- **Error handling** with user-friendly messages

### 📊 Analysis Dashboard
- **Interactive charts** showing skill matches and ATS scores
- **Comprehensive breakdowns** of resume analysis results
- **Visual skill comparison** between resume and job requirements
- **Detailed insights** with actionable recommendations

### 🎓 Interview Preparation
- **Interactive flashcards** with flip animations
- **AI-generated questions** tailored to your resume
- **Study mode** for interview practice
- **Progress tracking** through flashcard sets

### 🎨 Modern UI/UX
- **Responsive design** that works on all devices
- **Dark/Light theme** support with smooth transitions
- **Accessible components** following WCAG guidelines
- **Smooth animations** and micro-interactions
- **Clean, professional interface** optimized for productivity

## 🛠️ Technology Stack

### Core Framework
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety and better developer experience
- **Vite**: Lightning-fast build tool and dev server

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework with modern features
- **Radix UI**: Accessible, unstyled component primitives
- **Lucide React**: Beautiful, customizable icon library
- **Class Variance Authority**: Type-safe component variants

### Data & State Management
- **React Hooks**: Modern state management patterns
- **Axios**: HTTP client for API communication
- **Recharts**: Composable charting library for data visualization

### Development Tools
- **ESLint**: Code linting with TypeScript support
- **TypeScript ESLint**: Enhanced TypeScript linting rules
- **Vite**: Hot module replacement (HMR) for fast development

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm**, **yarn**, or **pnpm** package manager
- **Backend API** running on `http://localhost:5000`

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd resume-analysis/frontend
   ```

2. **Install dependencies**:
   ```bash
   # Using npm
   npm install
   
   # Using yarn
   yarn install
   
   # Using pnpm
   pnpm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:5173`
   - Ensure backend is running on `http://localhost:5000`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Radix UI + Tailwind)
│   │   ├── button.tsx   # Button component variants
│   │   ├── card.tsx     # Card layouts
│   │   ├── chart.tsx    # Chart components
│   │   └── ...          # Other UI primitives
│   ├── AnalysisDashboard.tsx  # Main analysis results view
│   ├── FlashCards.tsx         # Interview prep flashcards
│   └── LoadingSpinner.tsx     # Loading state component
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎨 Component Architecture

### Main Components

#### `App.tsx`
- **File upload handling**
- **API communication** with backend
- **State management** for analysis data
- **Tab navigation** between dashboard and flashcards
- **Error handling** and loading states

#### `AnalysisDashboard.tsx`
- **Results visualization** with charts and metrics
- **Skill matching** displays
- **ATS score breakdown**
- **Insights and recommendations**

#### `FlashCards.tsx`
- **Interactive card interface**
- **Flip animations** for question/answer reveal
- **Navigation** between cards
- **Progress tracking**

### UI Components (`components/ui/`)

Built with Radix UI primitives and styled with Tailwind CSS:
- **Accessible by default** (keyboard navigation, screen readers)
- **Customizable** through CSS variables and Tailwind utilities
- **Consistent design system** across the application

## ⚙️ Configuration

### Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      fontFamily: {
        // Custom fonts
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
```

### TypeScript Configuration
- **`tsconfig.json`**: Base TypeScript configuration
- **`tsconfig.app.json`**: Application-specific settings
- **`tsconfig.node.json`**: Node.js/build tool settings

## 🔧 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

#### ESLint Configuration
- **TypeScript support** with strict rules
- **React-specific linting** for hooks and JSX
- **Import/export** organization rules
- **Accessibility** linting with jsx-a11y

#### Type Safety
```typescript
// Strong typing for API responses
interface AnalysisData {
  analysis: ResumeAnalysis;
  insights: CareerInsights;
  flashcards: Flashcard[];
  ats_score: ATSScore;
  resume_preview: string;
}

// Component prop types
interface DashboardProps {
  data: AnalysisData;
  onRefresh: () => void;
}
```

### API Integration

#### Axios Configuration
```typescript
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 120000, // 2 minutes for analysis
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

#### Error Handling
```typescript
try {
  const response = await api.post('/analyze-resume', formData);
  setAnalysisData(response.data.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    setError(error.response?.data?.error || 'Analysis failed');
  } else {
    setError('Network error occurred');
  }
}
```

## 🎨 Styling Guide

### Design System

#### Color Palette
- **Primary**: Blue gradient (`from-blue-600 to-indigo-600`)
- **Secondary**: Slate variations for text and backgrounds
- **Success**: Green tones for positive feedback
- **Warning**: Amber/yellow for warnings
- **Error**: Red variations for errors

#### Typography
- **Headings**: Bold, gradient text effects
- **Body text**: Readable contrast ratios
- **Code**: Monospace with syntax highlighting

#### Components
```tsx
// Button variants
<Button variant="default" size="lg">
  Primary Action
</Button>

// Card layouts
<Card className="p-6 bg-white/80 backdrop-blur-sm">
  <CardHeader>
    <CardTitle>Analysis Results</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Responsive Design

- **Mobile-first** approach with Tailwind breakpoints
- **Flexible layouts** using CSS Grid and Flexbox
- **Adaptive components** that scale across screen sizes

```css
/* Responsive grid */
.grid-responsive {
  @apply grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3;
}
```

## 🧪 Testing

### Testing Strategy
```bash
# Unit tests (when implemented)
npm run test

# Component testing
npm run test:components

# E2E testing
npm run test:e2e
```

### Manual Testing Checklist
- [ ] File upload works with PDF files
- [ ] Error handling for invalid files
- [ ] API communication successful
- [ ] Loading states display correctly
- [ ] Charts render with proper data
- [ ] Flashcards flip and navigate properly
- [ ] Responsive design works on mobile
- [ ] Theme switching functions

## 🚀 Deployment

### Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Build with environment variables
VITE_API_URL=https://api.your-domain.com npm run build
```

### Static Hosting

#### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel
```json
{
  "builds": [{
    "src": "package.json",
    "use": "@vercel/static-build",
    "config": { "distDir": "dist" }
  }],
  "routes": [{
    "handle": "filesystem"
  }, {
    "src": ".*",
    "dest": "/index.html"
  }]
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Type Errors**
   ```bash
   # Run type checking
   npm run type-check
   
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

3. **API Connection Issues**
   - Verify backend is running on `http://localhost:5000`
   - Check CORS configuration in backend
   - Ensure API endpoints are accessible

4. **Styling Issues**
   ```bash
   # Rebuild Tailwind CSS
   npm run build:css
   
   # Check Tailwind configuration
   npx tailwindcss --init --full
   ```

## 🤝 Contributing

### Development Guidelines
1. **Follow TypeScript best practices**
2. **Use existing UI components** when possible
3. **Maintain accessibility standards**
4. **Write meaningful commit messages**
5. **Test responsive design** on multiple devices

### Code Style
- Use **functional components** with hooks
- Prefer **TypeScript interfaces** over types
- Keep **components small** and focused
- Use **meaningful variable names**
- Add **comments** for complex logic

---

## 📄 License

This project is licensed under the MIT License.

---

**Ready to build amazing resume analysis experiences! 🚀**
