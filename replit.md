# Overview

This is a modern portfolio website for Monu Saini, a Python developer and data science enthusiast. The application showcases professional experience, skills, services, and projects through an interactive single-page application. Built with a React frontend and Express.js backend, it features a contact form system for potential clients to reach out. The site emphasizes a futuristic, tech-focused design with smooth animations and responsive layouts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Single-page application using functional components and hooks
- **Vite**: Modern build tool for fast development and optimized production builds
- **Wouter**: Lightweight client-side routing library
- **TanStack Query**: Server state management for API calls and caching
- **Shadcn/ui**: Component library built on Radix UI primitives with Tailwind CSS styling
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens for futuristic theme

## Backend Architecture
- **Express.js**: RESTful API server with TypeScript
- **In-memory Storage**: Simple storage implementation using Maps for development/demo purposes
- **Contact Form API**: Handles form submissions with validation using Zod schemas

## Data Storage Solutions
- **Memory Storage**: Current implementation uses in-memory storage for simplicity
- **Drizzle ORM**: Database toolkit configured for PostgreSQL (ready for production database)
- **Schema Definition**: Shared TypeScript schemas for users and contact messages

## Component Structure
- **Section-based Layout**: Modular components for hero, about, services, portfolio, experience, blog, and contact sections
- **Reusable UI Components**: Standardized components following Shadcn/ui patterns
- **Animation System**: Custom animations using CSS transitions and Intersection Observer API
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

## Styling Architecture
- **CSS Variables**: Custom properties for consistent theming and dark mode support
- **Design System**: Cohesive color palette with tech-focused gradients and futuristic elements
- **Typography**: Multi-font system using Inter, Poppins, and Google Fonts integration
- **Glass Morphism**: Modern UI pattern with semi-transparent elements and backdrop blur effects

# External Dependencies

## UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives for complex components
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Utility for creating variant-based component styles
- **clsx**: Conditional className utility for dynamic styling

## State Management and Data Fetching
- **@tanstack/react-query**: Server state management, caching, and synchronization
- **wouter**: Lightweight routing solution for single-page applications

## Form Handling and Validation
- **@hookform/resolvers**: Integration layer between React Hook Form and validation libraries
- **drizzle-zod**: Zod integration for Drizzle ORM schema validation
- **zod**: TypeScript-first schema validation library

## Database and Server
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **drizzle-orm**: Type-safe ORM with excellent TypeScript support
- **drizzle-kit**: CLI tools for database migrations and schema management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Development Tools
- **tsx**: TypeScript execution environment for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **vite**: Modern frontend build tool with hot module replacement

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **embla-carousel-react**: Performant carousel component for React
- **cmdk**: Command palette component for enhanced UX