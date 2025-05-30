# Lakes Dynamic Dashboard

## Overview

The Lakes Dynamic Dashboard is a comprehensive web application built with Next.js 14, TypeScript, and React. This dashboard provides a centralized platform for managing and viewing lake-related data and content. The application features a modern, responsive interface built with PrimeReact components and Tailwind CSS.

### Key Features

- **User Authentication**: Secure login/logout, user registration, password reset, and account activation
- **Content Management**: Manage articles, photos, projects, and metadata related to lakes
- **Dashboard Interface**: Intuitive dashboard with multiple sections for different data types
- **Profile Management**: User profile settings and security configurations
- **Contact System**: Built-in contact management functionality
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS and PrimeReact components

### Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, PrimeReact UI Components
- **Forms**: React Hook Form
- **API**: Axios for HTTP requests
- **Development**: ESLint, PostCSS, Autoprefixer

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager
- Git

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd lakes_dynamic_dashboard
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the required environment variables (see Environment Variables section below).

4. **Start the development server:**

   ```bash
   yarn dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint for code linting

## Environment Variables

The application requires the following environment variables to function properly:

### Required Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=your_api_base_url_here
```

### Environment Variable Descriptions

- **NEXT_PUBLIC_API_BASE_URL**: The base URL for the backend API that the dashboard connects to. This should include the protocol (http/https) and domain/port (e.g., `https://api.yourdomain.com` or `http://localhost:8000`)

### Example .env.local

```bash
# Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Production
# NEXT_PUBLIC_API_BASE_URL=https://api.lakesdashboard.com
```

**Note**: The `NEXT_PUBLIC_` prefix makes these variables available to the client-side code. Never include sensitive server-side secrets with this prefix.

## Deployment

This application is designed to be deployed on [Vercel](https://vercel.com), which provides seamless integration with Next.js applications.

### Deploying to Vercel

#### Method 1: Vercel CLI (Recommended for development)

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**

   ```bash
   vercel
   ```

4. **Configure environment variables:**
   - During deployment, Vercel will prompt you to add environment variables
   - Add `NEXT_PUBLIC_API_BASE_URL` with your production API URL

#### Method 2: Git Integration (Recommended for production)

1. **Connect your repository to Vercel:**

   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository (GitHub, GitLab, or Bitbucket)
   - Vercel will automatically detect it's a Next.js project

2. **Configure environment variables:**

   - In your Vercel project dashboard, go to Settings → Environment Variables
   - Add the following variable:
     - **Name**: `NEXT_PUBLIC_API_BASE_URL`
     - **Value**: Your production API URL (e.g., `https://api.lakesdashboard.com`)
   - Apply to Production, Preview, and Development environments as needed

3. **Deploy:**
   - Click "Deploy" to start the initial deployment
   - Every push to your main branch will automatically trigger a new deployment
   - Pull requests will create preview deployments

### Vercel Configuration

The application uses Vercel's default Next.js configuration. If you need custom settings, create a `vercel.json` file:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ]
}
```

### Domain Configuration

1. **Custom Domain** (optional):
   - In your Vercel project dashboard, go to Settings → Domains
   - Add your custom domain (e.g., `lakesdashboard.yourdomain.com`)
   - Follow Vercel's DNS configuration instructions

### Environment-Specific Deployments

- **Production**: Main branch deployments with production environment variables
- **Preview**: Pull request deployments with preview/staging environment variables
- **Development**: Local development with `.env.local` file

### Pre-deployment Checklist

- [ ] Environment variables are configured in Vercel dashboard
- [ ] API endpoints are accessible from Vercel's deployment environment
- [ ] Build process completes without errors locally (`yarn build`)
- [ ] All required dependencies are listed in `package.json`
- [ ] Repository is connected to Vercel and has proper access permissions

### Monitoring and Analytics

Vercel provides built-in analytics and monitoring:

- **Analytics**: View page performance and visitor data in the Vercel dashboard
- **Function Logs**: Monitor API routes and server-side functions
- **Real User Monitoring**: Track Core Web Vitals and performance metrics

### Troubleshooting Deployment Issues

- **Build Failures**: Check the build logs in Vercel dashboard for detailed error messages
- **Environment Variables**: Ensure all required variables are set and have correct values
- **API Connectivity**: Verify that your API endpoints are accessible from Vercel's servers
- **Domain Issues**: Check DNS settings and SSL certificate status in Vercel dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support and questions, please use the contact functionality within the dashboard or reach out to the development team.

---

Built with ❤️ using Next.js and React
