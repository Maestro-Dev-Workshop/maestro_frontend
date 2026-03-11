# Maestro Frontend

An Angular-based web application for the Maestro AI-powered learning platform. This application provides an interactive interface for users to create personalized learning sessions, study with AI-generated content, and track their progress.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Application Architecture](#application-architecture)
- [Key Components](#key-components)
- [Services](#services)
- [Testing](#testing)
- [Styling](#styling)
- [Development](#development)

## Features

- **User Authentication**: Login, registration, email verification, password reset, and Google OAuth
- **Dashboard**: Overview of all learning subjects with progress tracking
- **Subject Creation Wizard**: Multi-step process to upload documents and generate lessons
- **Interactive Lessons**:
  - Markdown content with syntax highlighting
  - Interactive charts (Plotly.js)
  - Mermaid diagrams
  - Executable code cells with live output
  - Audio snippets
- **Practice & Assessment**:
  - Multiple choice and multiple selection questions
  - Essay questions with AI evaluation
  - Topic exercises and final exams
  - Score tracking and feedback
- **Study Tools**:
  - Flashcards with flip animations
  - Searchable glossary
  - Progress tracking per topic
- **AI Chatbot**: Context-aware assistant available during lessons
- **Subscription Management**: Plan selection and payment via Paystack
- **Responsive Design**: Mobile-friendly interface
- **Dark/Light Theme**: User-selectable theme preference

## Tech Stack

- **Framework**: Angular 20.x (Standalone Components)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.x
- **State Management**: Angular Signals
- **Charts**: Plotly.js
- **Diagrams**: Mermaid.js
- **Code Editor**: Monaco Editor (ngx-monaco-editor-v2)
- **Markdown**: markdown-it with KaTeX support
- **Testing**: Karma + Jasmine
- **Build**: Angular CLI with esbuild

## Project Structure

```
src/
├── app/
│   ├── core/                       # Core functionality
│   │   ├── guards/                 # Route guards
│   │   │   ├── auth.guard.ts
│   │   │   └── subscription.guard.ts
│   │   ├── interceptors/           # HTTP interceptors
│   │   │   └── auth.interceptor.ts
│   │   ├── models/                 # TypeScript interfaces
│   │   │   ├── api-response.model.ts
│   │   │   ├── auth-payload.model.ts
│   │   │   ├── chat-message.model.ts
│   │   │   ├── code-execution.model.ts
│   │   │   ├── exam.model.ts
│   │   │   ├── exercise.model.ts
│   │   │   ├── extension-settings.model.ts
│   │   │   ├── lesson-content.model.ts
│   │   │   ├── question.model.ts
│   │   │   ├── subject.model.ts
│   │   │   ├── subject-status.model.ts
│   │   │   ├── subscription.model.ts
│   │   │   ├── subtopic.model.ts
│   │   │   ├── toast.model.ts
│   │   │   ├── topic.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── index.ts
│   │   └── services/               # API services
│   │       ├── __tests__/          # Service unit tests
│   │       ├── auth.service.ts
│   │       ├── chatbot.service.ts
│   │       ├── confirm.ts
│   │       ├── http-base.service.ts
│   │       ├── lesson.service.ts
│   │       ├── notification.service.ts
│   │       ├── onboarding.service.ts
│   │       ├── subjects.service.ts
│   │       ├── subscription.service.ts
│   │       ├── theme.service.ts
│   │       └── user.service.ts
│   │
│   ├── pages/                      # Page components
│   │   ├── auth/                   # Authentication pages
│   │   │   ├── check-email/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── verify-email/
│   │   ├── dashboard/              # Main dashboard
│   │   │   ├── subjects/
│   │   │   ├── subscription/
│   │   │   └── verify-payment/
│   │   ├── home/                   # Landing pages
│   │   │   ├── contact/
│   │   │   ├── features/
│   │   │   ├── home/
│   │   │   ├── landing/
│   │   │   ├── pricing/
│   │   │   ├── privacy-policy/
│   │   │   ├── team/
│   │   │   └── terms-of-service/
│   │   ├── lesson/                 # Lesson viewer
│   │   │   ├── lesson-page/        # Main lesson container
│   │   │   ├── sidebar/            # Navigation sidebar
│   │   │   ├── subtopic/           # Subtopic content viewer
│   │   │   ├── practice/           # Exercise/exam component
│   │   │   ├── flashcards/         # Flashcard viewer
│   │   │   ├── glossary/           # Glossary viewer
│   │   │   ├── chatbot/            # AI chat interface
│   │   │   └── cells/              # Content cell components
│   │   │       ├── audio-snippet-cell/
│   │   │       ├── chart-cell/
│   │   │       ├── diagram-cell/
│   │   │       ├── executable-code-cell/
│   │   │       └── markdown-cell/
│   │   ├── subject-create/         # Subject creation wizard
│   │   │   ├── creation-step-tab/
│   │   │   ├── extension-config-overlay/
│   │   │   ├── lesson-generation/
│   │   │   └── naming-upload/
│   │   └── not-found/              # 404 page
│   │
│   ├── shared/                     # Shared components
│   │   ├── components/
│   │   │   ├── confirm-logout/
│   │   │   ├── confirmation/
│   │   │   ├── context-menu/
│   │   │   ├── header/
│   │   │   ├── rating-modal/
│   │   │   ├── subject-card/
│   │   │   ├── theme-icon/
│   │   │   ├── toast/
│   │   │   └── tutorial-element/
│   │   ├── directives/
│   │   │   ├── file-type.directive.ts
│   │   │   ├── password-validator.ts
│   │   │   ├── preference-validator.ts
│   │   │   └── subject-name-validator.ts
│   │   ├── pipes/
│   │   │   ├── currency-localizer-pipe.ts
│   │   │   └── markdown-pipe.ts
│   │   └── utils/
│   │       ├── file-validation.util.ts
│   │       └── icon.util.ts
│   │
│   ├── app.config.ts               # App configuration
│   ├── app.routes.ts               # Route definitions
│   └── app.ts                      # Root component
│
├── public/                         # Static assets
│   └── images/                     # SVG icons and images
│       ├── dark/                   # Dark theme icons
│       └── light/                  # Light theme icons
│
├── environments/                   # Environment configs
│   ├── environment.ts
│   ├── environment.prod.ts
│   └── environment.sample.ts
│
└── styles.css                      # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd maestro_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (see [Environment Configuration](#environment-configuration))

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`.

## Environment Configuration

Copy `src/environments/environment.sample.ts` to `environment.ts` and update:

```typescript
export const environment = {
  type: 'local',                              // 'local', 'beta', or 'prod'
  apiUrl: 'http://localhost:5000/api',        // Backend API URL
  googleClientId: 'your-google-client-id',    // Google OAuth Client ID
};
```

For production, update `src/environments/environment.prod.ts` accordingly.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server at localhost:4200 |
| `npm run build` | Build for production |
| `npm test` | Run unit tests with Karma |
| `ng test --watch` | Run tests in watch mode |
| `ng test --code-coverage` | Run tests with coverage report |
| `npm run docs` | Generate documentation with Compodoc |

## Application Architecture

### Standalone Components

The application uses Angular's standalone components architecture, eliminating the need for NgModules:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './example.html',
})
export class Example { }
```

### Signal-Based State

Components use Angular Signals for reactive state management:

```typescript
// In component
currentView = signal<ViewState | null>(null);
loading = signal(false);

// Computed values
progress = computed(() => this.calculateProgress());

// Effects for side effects
private autoSave = effect(() => {
  const data = this.formData();
  if (data) this.save(data);
});
```

### Input/Output with Signals

```typescript
// Signal-based inputs
subject = input.required<SubjectData>();
disabled = input(false);

// Outputs
cardClick = output<SubjectData>();
```

## Key Components

### Lesson Page (`/lesson/:subjectId`)

The main learning interface with:
- **Sidebar**: Navigation tree for topics, subtopics, exercises, flashcards
- **Subtopic Viewer**: Renders lesson content cells
- **Practice Component**: Handles exercises and exams
- **Chatbot**: AI assistant panel

### Content Cells

Subtopics contain various cell types:

| Cell Type | Component | Description |
|-----------|-----------|-------------|
| Markdown | `MarkdownCell` | Rich text with code highlighting |
| Chart | `ChartCell` | Interactive Plotly.js charts |
| Diagram | `DiagramCell` | Mermaid.js diagrams |
| Code | `ExecutableCodeCell` | Monaco editor with execution |
| Audio | `AudioSnippetCell` | Audio playback |

### Subject Creation Wizard

Multi-step form for creating learning sessions:
1. **Name**: Enter subject name
2. **Documents**: Upload PDF/text files
3. **Topics**: AI-extracted topics with selection
4. **Preferences**: Learning style preferences
5. **Extensions**: Enable flashcards, diagrams, etc.
6. **Generate**: Real-time generation progress

## Services

### Core Services

| Service | Purpose |
|---------|---------|
| `AuthService` | Authentication operations |
| `SubjectsService` | Subject CRUD operations |
| `LessonService` | Topic, exercise, and exam operations |
| `ChatbotService` | AI chat functionality |
| `SubscriptionService` | Payment and subscription |
| `ThemeService` | Dark/light theme management |
| `NotificationService` | Toast notifications |
| `OnboardingService` | First-time user guidance |

### HTTP Base Service

All services use a base HTTP service for consistent API calls:

```typescript
@Injectable({ providedIn: 'root' })
export class HttpBaseService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }
  // post, put, delete...
}
```

## Testing

The project uses Karma with Jasmine for unit testing.

### Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
ng test --watch

# With code coverage
ng test --code-coverage

# Specific file
ng test --include="**/lesson-page.spec.ts"
```

### Test Structure

Tests are co-located with components:
```
component/
├── component.ts
├── component.html
├── component.css
└── component.spec.ts
```

Service tests are in a dedicated folder:
```
services/
├── __tests__/
│   ├── auth.service.spec.ts
│   ├── subjects.service.spec.ts
│   └── ...
```

### Writing Tests

```typescript
describe('SubjectCard', () => {
  let component: SubjectCard;
  let fixture: ComponentFixture<SubjectCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectCard);
    component = fixture.componentInstance;
  });

  it('should display subject name', () => {
    fixture.componentRef.setInput('subject', mockSubject);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Test Subject');
  });
});
```

## Styling

### Tailwind CSS

The project uses Tailwind CSS with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'prussian-blue': { /* custom palette */ },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
};
```

### CSS Variables for Theming

```css
:root {
  --bg-primary: #ffffff;
  --bg-card: #f8f9fa;
  --text-primary: #1a1a1a;
  /* ... */
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-card: #1e293b;
  --text-primary: #f1f5f9;
  /* ... */
}
```

## Development

### Adding a New Page

1. Create component in `src/app/pages/`:
```bash
ng generate component pages/new-page --standalone
```

2. Add route in `app.routes.ts`:
```typescript
{
  path: 'new-page',
  loadComponent: () => import('./pages/new-page/new-page').then(m => m.NewPage),
}
```

### Adding a New Service

1. Generate service:
```bash
ng generate service core/services/new-service
```

2. Inject `HttpBaseService` and implement methods:
```typescript
@Injectable({ providedIn: 'root' })
export class NewService {
  private http = inject(HttpBaseService);

  getData(): Observable<DataResponse> {
    return this.http.get<DataResponse>('endpoint');
  }
}
```

### Code Conventions

- Standalone components (no NgModules)
- Signal-based state management
- `input()` / `output()` for component communication
- Tailwind CSS for styling
- Co-located test files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved
