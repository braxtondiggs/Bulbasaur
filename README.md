# Bulbasaur Portfolio ![Bulbasaur](cryptonym.png)

> A modern, responsive portfolio website built with Angular 20, showcasing professional experience, skills, and projects.

## 🚀 Features

- **Modern Angular 20** with standalone components and latest features
- **Responsive Design** using DaisyUI and Tailwind CSS
- **Interactive Data Visualization** with Highcharts integration
- **Real-time Coding Analytics** from WakaTime API
- **Firebase Integration** for hosting and analytics
- **Progressive Web App** (PWA) capabilities
- **Theme Support** with multiple color schemes (light, dark, cyberpunk, synthwave)
- **Performance Optimized** with lazy loading and service workers

## 🛠️ Tech Stack

### Frontend

- **Angular 20** - Latest framework with standalone components
- **TypeScript** - Type-safe development
- **TailwindCSS 4** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Highcharts** - Interactive data visualization
- **ng-icons** - Modern icon system

### Backend & Services

- **Firebase** - Hosting, analytics, and cloud functions
- **WakaTime API** - Real-time coding activity tracking
- **Angular Fire** - Firebase integration

### Development Tools

- **Jest** - Unit testing framework
- **ESLint** - Code linting and formatting
- **Webpack Bundle Analyzer** - Performance monitoring
- **GitHub Actions** - CI/CD pipeline

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Angular CLI 20+

### Installation

```bash
# Clone the repository
git clone https://github.com/braxtondiggs/Bulbasaur.git
cd Bulbasaur

# Install dependencies
npm install

# Start development server
npm start
```

### Development Commands

```bash
# Development
npm start                 # Start dev server with HMR
npm run dev              # Start dev server and open browser
npm run build:dev        # Development build

# Production
npm run build            # Production build
npm run build:stats      # Build with bundle analysis
npm run serve:dist       # Serve production build locally

# Testing
npm test                 # Run unit tests
npm run test:coverage    # Run tests with coverage
npm run test:watch       # Run tests in watch mode
npm run test:ci          # CI test run

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run analyze          # Analyze bundle size

# Deployment
npm run deploy           # Deploy to Firebase
npm run clean            # Clean build artifacts
```

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   └── layout/             # Layout components
│   ├── features/               # Feature modules
│   │   ├── portfolio/          # Portfolio content
│   │   │   └── content/        # Skills, projects, contact
│   │   └── profile/            # Profile components
│   ├── shared/                 # Shared utilities
│   │   ├── directives/         # Custom directives
│   │   ├── models/             # TypeScript interfaces
│   │   ├── pipes/              # Custom pipes
│   │   └── services/           # Shared services
│   └── assets/                 # Static assets
├── environments/               # Environment configurations
└── scss/                      # Global styles
```

## 🎨 Key Features

### Interactive Skills Dashboard

- Real-time coding activity visualization
- Programming language usage analytics
- Editor preference tracking
- Custom date range selection

### Modern UI/UX

- Multiple theme support (light/dark/cyberpunk/synthwave)
- Responsive design for all devices
- Smooth animations and transitions
- Accessible navigation

### Performance Optimized

- Lazy-loaded routes and components
- Optimized bundle size
- Service worker caching
- Progressive enhancement

## 🚀 Deployment

The application is automatically deployed to Firebase Hosting through GitHub Actions:

1. **Staging**: Automatic deployment on pull requests
2. **Production**: Automatic deployment on main branch updates
3. **Manual**: `npm run deploy` for manual deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Angular Team](https://angular.io/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [DaisyUI](https://daisyui.com/) for beautiful components
- [Highcharts](https://www.highcharts.com/) for data visualization
- [WakaTime](https://wakatime.com/) for coding analytics

---

Built with ❤️ by [Braxton Diggs](https://braxtondiggs.com)
