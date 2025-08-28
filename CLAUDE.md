# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bulbasaur is a personal portfolio website built with Angular 14. It's a single-page application showcasing professional experience, projects, and skills with Firebase integration for hosting and analytics.

## Development Commands

### Core Commands

- `npm start` or `ng serve` - Start development server (localhost:4200)
- `npm run build` - Production build
- `npm run build:stats` - Production build with bundle analysis
- `npm test` - Run Jest unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size (requires build:stats first)

### Testing Framework

- Uses Jest (not Karma) for unit testing with jest-preset-angular
- Test files use `.spec.ts` extension
- Jest config excludes functions directory

## Architecture & Key Files

### Main Application Structure

- **AppModule** (`src/app/app.module.ts`) - Root module with Firebase, Material Design, and service worker setup
- **Components**: Header, ProfileBox, ContentComponent (with Contact, Project, Skills sub-components), SideNav, Footer, Social
- **Data Source**: `src/assets/data.json` - Contains employment history, projects, and personal interests

### Firebase Integration

- Firebase hosting configured in `firebase.json`
- AngularFire for Firestore and Analytics
- Environment configs in `src/environments/` with Firebase configuration
- Service worker enabled for PWA functionality

### Shared Resources

- **Services**: GoogleAnalyticsService, ScrollService
- **Pipes**: DateFormatPipe, DifferencePipe, ParsePipe, SkillPipe
- **Directives**: AnimateOnScrollDirective for scroll animations
- **Material Design**: Custom material module with Angular Material components

### Styling

- SCSS architecture in `src/scss/` with variables, fonts, and Material theming
- Custom font integration (Banda, Linearicons)
- Angular Flex Layout for responsive design

### Build Configuration

- Angular CLI with custom webpack configuration
- Bundle size monitoring (2MB warning, 5MB error thresholds)
- Asset optimization for icons, fonts, and images
- Service worker with 30-second registration strategy

### Key Dependencies

- Angular 14 with Material Design and Flex Layout
- Firebase v9 with AngularFire
- Highcharts for data visualization
- ngx-page-scroll for smooth scrolling
- ng-lazyload-image for performance optimization

## Data Management

The application uses a static JSON file (`src/assets/data.json`) containing:

- Employment history with company details and date ranges
- Project portfolio with descriptions, images, and links
- Personal interests and skills

This data drives the dynamic content throughout the application components.
