# SF Food Trucks 🚚🌮

A modern web application that helps San Francisco residents and visitors find the closest food trucks based on their current location. Built with React and TypeScript, featuring an interactive map and real-time location services.

**🌐 Live Demo:** https://sf-food-trucks.fly.dev

## ✨ Features

- **Auto-location detection** - Automatically detects user's location on page load
- **Interactive map** - Mapbox-powered map showing food truck locations and user position
- **Smart filtering** - Shows the 5 closest approved food trucks
- **Real-time data** - Fetches live data from San Francisco's open data API
- **Responsive design** - Works seamlessly on desktop and mobile devices
- **Distance calculation** - Accurate distance calculations using the Haversine formula (Thanks Copilot!)
- **Clean UI** - Modern interface with loading states and error handling

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with shadcn/ui components
- **Maps**: Mapbox GL JS
- **HTTP Client**: Native Fetch API
- **Testing**: Vitest + React Testing Library
- **Type Checking**: TypeScript
- **Linting**: ESLint v9
- **Code Formatting**: Prettier
- **Package Manager**: npm (pinned via Volta)

## 🚀 Getting Started

### Prerequisites

This project uses [Volta](https://volta.sh/) to manage Node.js and npm versions. Please install Volta first:

```bash
# Install Volta
curl https://get.volta.sh | bash

# Restart your terminal
```

### Installation

```bash
# Clone the repository
git clone https://github.com/abumah1r/sf-food-trucks.git
cd sf-food-trucks

# Install dependencies (Volta will use the correct npm version)
npm install

# Set up environment variables
cp .env.example .env
# Add your Mapbox access token to .env

Get a free Mapbox token at [mapbox.com](https://www.mapbox.com/).
```

### Environment Variables

Create a `.env` file with:

```bash
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
```

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 🧪 Testing

This project includes comprehensive testing with unit, component, and integration tests:

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Structure

```
tests/
├── setup.ts                    # Test configuration
├── components/                 # Component tests
│   ├── food-truck-list.test.tsx
│   ├── location-card.test.tsx
│   └── map.test.tsx
├── hooks/                      # Hook tests
│   ├── use-food-trucks.test.ts
│   └── use-grolocation.test.ts
└── lib/                        # Utility tests
    └── utils.test.ts
```

## 🔄 Continuous Integration

This project uses GitHub Actions for automated testing and quality checks. Every push and pull request triggers:

- **Linting** - Code style and quality checks with ESLint
- **Type checking** - TypeScript compilation and type validation
- **Testing** - Complete test suite with Vitest
- **Building** - Production build verification

The CI pipeline ensures code quality and prevents regressions. All checks must pass before merging.

### Local CI Simulation

Run the same checks locally before pushing:

```bash
npm run lint      # ESLint checks
npm run typecheck # Type validation
npm run test      # Run test suite
npm run build     # Verify production builds without issues
```

## 🚀 Deployment

This project automatically deploys to [Fly.io](https://fly.io) on every push to the main branch using GitHub Actions.

### Deployment Pipeline

The deployment workflow:

1. **Builds** a Docker image from the latest code
2. **Pushes** the image to GitHub Container Registry (GHCR)
3. **Deploys** the image to Fly.io using the containerized approach

### Live Application

🌐 **Production**: https://sf-food-trucks.fly.dev

### Manual Deployment

To deploy manually (requires Fly.io CLI and authentication):

```bash
# Deploy directly from source
flyctl deploy

# Or deploy a specific Docker image
flyctl deploy -i ghcr.io/abumah1r/sf-food-trucks:latest
```

## 🏗 Project Structure

```
sf-food-trucks/
├── .github/                  # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml            # CI/CD pipeline
├── app/                      # Application source code
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── food-truck-list.tsx
│   │   ├── location-card.tsx
│   │   └── map.tsx
│   ├── lib/                  # Utilities and hooks
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types.ts          # TypeScript definitions
│   │   └── utils.ts          # Utility functions
│   ├── routes/               # React Router routes
│   │   └── home.tsx          # Home page route
│   ├── root.tsx              # App root component
│   ├── route.tsx             # Route configuration
│   └── styles/               # CSS and styling
├── tests/                    # Test files
│   ├── components/           # Component tests
│   ├── hooks/                # Hook tests
│   ├── lib/                  # Utility tests
│   └── setup.ts              # Test configuration
├── public/                   # Static assets
├── eslint.config.js          # ESLint configuration
├── vitest.config.ts          # Vitest test configuration
└── package.json              # Dependencies and scripts
```

## 🤝 How to Contribute

Contributions are welcome! Here's how to get started:

### 1. Development Environment Setup

**Install Volta** (required for consistent Node.js/npm versions):

```bash
# Install Volta
curl https://get.volta.sh | bash

# Restart your terminal - Volta will automatically use the pinned versions
```

The `package.json` has Volta configuration that pins the projects Node.js and npm versions

### 2. Fork and Clone

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/your-username/sf-food-trucks.git
cd sf-food-trucks

# Install dependencies (Volta ensures correct versions)
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Development Workflow

```bash
# Start development server
npm run dev

# Run tests while developing
npm run test

# Check types
npm run typecheck

# Lint code
npm run lint
```

### 5. Testing Requirements

- Add tests for new features
- Ensure all tests pass: `npm test`
- Follow existing test patterns

### 6. Code Standards

- **TypeScript**: Use proper types, avoid `any`
- **Components**: Follow React best practices
- **Styling**: Use Tailwind CSS classes
- **Testing**: Write meaningful test descriptions
- **Git**: Use [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/).

### 7. Pull Request Process

1. Ensure all tests pass and code is formatted
2. Update documentation if needed
3. Create a pull request with a clear description
4. Link any related issues

## 🌟 Key Features Explained

### Smart Location Detection

- Automatically requests user location on page load
- Graceful fallback for denied permissions
- Real-time location updates with manual refresh option

### Intelligent Food Truck Filtering

- Fetches live data from SF's open data API
- Filters for approved trucks only
- Removes duplicates and invalid coordinates
- Sorts by distance using precise geolocation calculations

### Interactive Map Experience

- Real-time markers for user location and food trucks
- Custom popups with truck details
- Automatic bounds fitting to show relevant area
- Mobile-responsive touch controls

## 🚧 Future Improvements

- **Favorite trucks** functionality with local storage
- **Advanced filtering** by food type
- **Route directions** to selected food trucks

## 📄 License

Feel free to copy this project and use it however you'd like!

## 🙏 Acknowledgments

- San Francisco's Open Data initiative for providing the food truck dataset
- Mapbox for excellent mapping services
- The React and TypeScript communities for amazing tools and documentation

---

**Built with ❤️ for the San Francisco food truck community**
