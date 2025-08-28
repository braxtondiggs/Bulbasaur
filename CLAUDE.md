# CLAUDE.md

This file provides comprehensive guidance for AI assistants (Claude, GitHub Copilot, etc.) when working with this codebase.

## 🎯 Project Overview

**Bulbasaur** is a modern personal portfolio website built with **Angular 20** featuring:

- **Standalone Components** architecture (no NgModules)
- **Real-time coding analytics** from WakaTime API
- **Interactive data visualizations** with Highcharts
- **Modern styling** with TailwindCSS 4 + DaisyUI
- **Multiple themes** (light, dark, cyberpunk, synthwave)
- **Firebase integration** for hosting and analytics
- **Progressive Web App** capabilities

## 🏗️ Architecture & Patterns

### Modern Angular 20 Features

- **Standalone Components**: No NgModules, direct imports
- **Signals**: Reactive state management (where applicable)
- **Control Flow**: `@if`, `@for`, `@switch` syntax
- **inject()**: Preferred over constructor DI
- **OnPush**: Change detection strategy

### Key Architectural Decisions

- **Feature-based structure**: Organized by business domains
- **Shared utilities**: Reusable across features
- **Type safety**: Comprehensive TypeScript interfaces
- **Responsive design**: Mobile-first approach
- **Performance**: Lazy loading and optimization

## 📦 Dependencies & Configuration

### Core Framework

```json
{
  "@angular/core": "^20.2.2",
  "@angular/common": "^20.2.2",
  "typescript": "^5.9.2"
}
```

### UI & Styling

```json
{
  "tailwindcss": "^4.1.12",
  "daisyui": "^5.0.53",
  "@ng-icons/core": "^32.1.0",
  "theme-change": "^2.5.0"
}
```

### Data Visualization

```json
{
  "highcharts": "^12.3.0",
  "highcharts-angular": "^5.1.0"
}
```

### Firebase & Analytics

```json
{
  "@angular/fire": "^20.0.1",
  "firebase": "^12.1.0"
}
```

### Testing & Quality

```json
{
  "jest": "^30.1.1",
  "jest-preset-angular": "^15.0.0",
  "@ngneat/spectator": "^21.0.1",
  "@angular-eslint/eslint-plugin": "^20.2.0"
}
```

## 🛠️ Development Commands

### Primary Commands

```bash
npm start                 # Development server with HMR (localhost:4200)
npm run build            # Production build
npm run test             # Jest unit tests
npm run lint             # ESLint code analysis
npm run lint:fix         # Auto-fix ESLint issues
```

### Advanced Commands

```bash
npm run build:stats      # Build with bundle analysis
npm run test:coverage    # Tests with coverage report
npm run test:watch       # Tests in watch mode
npm run analyze          # Bundle size analysis
npm run deploy           # Firebase deployment
```

## 📁 File Structure & Components

### Core Application Structure

```
src/app/
├── app.component.ts           # Root standalone component
├── app.config.ts             # Application configuration
├── core/                     # Core functionality
│   └── layout/              # Layout components (header, nav)
├── features/                # Feature modules
│   ├── portfolio/           # Portfolio content
│   │   └── content/         # Skills, projects, contact
│   └── profile/             # Profile components
├── shared/                  # Shared utilities
│   ├── directives/          # Custom directives
│   ├── models/              # TypeScript interfaces
│   ├── pipes/               # Custom pipes
│   └── services/            # Shared services
└── assets/                  # Static assets & data
```

### Key Component Details

#### Skills Component (`features/portfolio/content/skills/`)

- **Purpose**: Interactive coding analytics dashboard
- **Data Source**: WakaTime API integration
- **Visualizations**: Languages, activity timeline, editors
- **Features**: Date range selection, theme-aware charts
- **Technology**: Highcharts with responsive configuration

#### Profile Components (`features/profile/`)

- **ProfileBox**: Main profile information
- **Social**: Social media links and contact
- **Instagram**: Social media integration

#### Layout Components (`core/layout/`)

- **Header**: Navigation and theme switcher
- **SideNav**: Mobile navigation drawer
- **Footer**: Footer information

## 🎨 Styling & Theming

### TailwindCSS 4 + DaisyUI Configuration

- **Framework**: TailwindCSS 4 (latest version)
- **Components**: DaisyUI for pre-built components
- **Themes**: Multiple theme support with `theme-change`
- **Responsive**: Mobile-first design principles

### Theme Implementation

```typescript
// Theme switching with theme-change library
import { themeChange } from 'theme-change';

// Available themes
themes: ['light', 'dark', 'cyberpunk', 'synthwave'];
```

### Custom Styling

- **Global styles**: `src/scss/styles.scss`
- **Fonts**: Custom font integration (BandaRegular)
- **Variables**: CSS custom properties for theming

## 📊 Data Management

### WakaTime Integration

```typescript
// Skills data from WakaTime API
interface SkillsData {
  Languages: Array<{ name: string; total_seconds: number }>;
  Editors: Array<{ name: string; total_seconds: number }>;
  Timeline: Array<{ date: string; total_seconds: number }>;
}
```

### Static Data

- **Location**: `src/assets/data.json`
- **Content**: Projects, experience, personal information
- **Format**: Structured JSON for easy maintenance

## 🧪 Testing Strategy

### Jest Configuration

- **Framework**: Jest with jest-preset-angular
- **Utilities**: @ngneat/spectator for simplified testing
- **Coverage**: Comprehensive coverage reporting
- **Watch mode**: Real-time test execution

### Testing Patterns

```typescript
// Example test structure
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

describe('ComponentName', () => {
  let spectator: Spectator<ComponentName>;
  const createComponent = createComponentFactory(ComponentName);

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
```

## 🚀 Build & Deployment

### Firebase Configuration

- **Hosting**: Firebase Hosting for static assets
- **Analytics**: Firebase Analytics integration
- **Functions**: Cloud Functions (in functions/ directory)

### Build Optimization

- **Bundle size**: Monitored with webpack-bundle-analyzer
- **Lazy loading**: Route-based code splitting
- **Tree shaking**: Automatic unused code removal
- **Service worker**: PWA capabilities enabled

### Performance Monitoring

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "2mb",
      "maximumError": "5mb"
    }
  ]
}
```

## 🔧 Code Quality & Standards

### ESLint Configuration

- **Parser**: @typescript-eslint/parser
- **Rules**: Angular-specific + TypeScript best practices
- **Prettier**: Code formatting integration
- **Pre-commit hooks**: Automated quality checks

### Coding Patterns

1. **Standalone Components**: Always use standalone: true
2. **inject() over constructor**: Modern DI pattern
3. **OnPush**: Change detection optimization
4. **Type safety**: Comprehensive interface definitions
5. **Reactive patterns**: RxJS best practices

### Component Structure

```typescript
@Component({
  standalone: true,
  imports: [CommonModule /* other imports */],
  selector: 'app-component',
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentName {
  private service = inject(ServiceName);
  // Component implementation
}
```

## 🔍 Common Development Tasks

### Adding New Components

1. Use Angular CLI: `ng generate component path/to/component`
2. Ensure standalone: true configuration
3. Add appropriate imports
4. Implement OnPush change detection
5. Add comprehensive tests

### Updating Dependencies

```bash
npm outdated                    # Check for updates
npm update                      # Update dependencies
npm audit                       # Security audit
npm run check                   # Full quality check
```

### Performance Optimization

1. **Bundle analysis**: `npm run analyze`
2. **Lazy loading**: Route-based splitting
3. **OnPush**: Change detection optimization
4. **Trackby functions**: For \*ngFor performance

## ⚠️ Important Notes

### Migration Status

- **Migrated to**: Angular 20 with standalone components
- **Previous version**: Angular 14 with NgModules
- **Breaking changes**: Component architecture, imports, styling

### Known Considerations

- **Highcharts integration**: Uses highcharts-angular v5
- **Theme persistence**: Handled by theme-change library
- **Mobile responsiveness**: TailwindCSS utility classes
- **SEO optimization**: Angular Universal (if needed)

---

This documentation should be updated as the project evolves. When making changes, please update this file to reflect the current state of the application.
