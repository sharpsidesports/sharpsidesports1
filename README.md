# SharpSide Golf Analytics

## Version 2.0.0 - Prototype 2

SharpSide Golf Analytics is a comprehensive golf betting and analysis platform that helps users make data-driven decisions for golf betting and fantasy golf.

### Features

${VERSION.features.map(feature => `- ${feature}`).join('\n')}

### Getting Started

1. Install Homebrew (macOS package manager)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Use Homebrew to install Node.js (which includes npm)

```bash
brew install node
```

3. Install project dependencies

```bash
npm install
```

4. Set up your environment variables
5. Start the development server

```bash
npm run dev
```

### Architecture

The application is built with:
- React + TypeScript
- Vite for build tooling
- Zustand for state management
- TailwindCSS for styling
- Recharts for data visualization

### Project Structure

```
src/
  ├── components/      # Reusable UI components
  ├── features/        # Feature-specific code
  ├── store/          # Zustand store and slices
  ├── types/          # TypeScript type definitions
  ├── utils/          # Utility functions
  └── pages/          # Route components
```

### Version History

#### v2.0.0 - Prototype 2
- Added course conditions filters
- Enhanced performance metrics
- Improved proximity weights
- Added fantasy golf optimizer
- Implemented modular store architecture

#### v1.0.0 - Prototype 1
- Initial release
- Basic golf analytics features
- Strokes gained analysis
- Matchup and three-ball tools