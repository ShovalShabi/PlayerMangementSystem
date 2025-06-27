# Players Dashboard

A modern React-based web application for managing soccer player data with advanced filtering, CRUD operations, and bulk data import capabilities.

## 🚀 Features

- **Player Management**: Create, read, update, and delete player records
- **Advanced Filtering**: Filter players by name, age, height, nationality, and position
- **Bulk Data Import**: Upload CSV files to import multiple players at once
- **Responsive Design**: Modern UI built with Material-UI components
- **Dark/Light Theme**: Toggle between dark and light themes
- **Data Persistence**: Redux state persistence across browser sessions
- **Real-time Search**: Debounced search functionality
- **Internationalization**: Support for multiple nationalities with flag icons
- **Measurement Units**: Toggle between metric and imperial units

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher) or **yarn** (v1.22 or higher)
- **Backend Service**: The PlayerService Spring Boot application must be running

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PlayerMangementSystem/PlayersDashboard
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create environment files based on your deployment environment:

#### Development Environment

Create `.env.dev` file:

```env
VITE_PORT=3000
VITE_BACKEND_HOST=localhost
VITE_BACKEND_PORT=8080
VITE_ENV=dev
```

#### Production Environment

Create `.env.prod` file:

```env
VITE_PORT=3000
VITE_BACKEND_HOST=your-backend-host
VITE_BACKEND_PORT=your-backend-port
VITE_ENV=prod
```

### 4. Start the Backend Service

Ensure the PlayerService Spring Boot application is running on the configured backend host and port.

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will start on `http://localhost:3000` (or the port specified in your environment file).

### Production Mode

```bash
npm run prod
# or
yarn prod
```

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 📁 Code Structure

```
src/
├── api/                    # API service layer
│   └── player-service.ts   # Player API endpoints
├── components/             # Reusable UI components
│   ├── player/            # Player-specific components
│   ├── filters/           # Filter components
│   └── ...                # Other UI components
├── dtos/                  # Data Transfer Objects
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
├── store/                 # Redux store configuration
├── theme/                 # Material-UI theme configuration
├── utils/                 # Utility functions and types
│   ├── handlers/          # API request handlers
│   ├── interfaces/        # TypeScript interfaces
│   ├── objects/           # Static data objects
│   └── types/             # Type definitions
├── App.tsx               # Main App component
└── main.tsx              # Application entry point
```

## 🧩 Key Components

### Core Components

#### `MainPage.tsx`

- **Purpose**: Main application page that orchestrates all player management functionality
- **Features**:
  - Player table with sorting and pagination
  - Filter drawer for advanced filtering
  - Theme switching
  - Measurement unit toggling
  - Global alerts and modals

#### `PlayerTable.tsx`

- **Purpose**: Displays player data in a sortable, paginated table
- **Features**:
  - Material-UI DataGrid integration
  - Column sorting and filtering
  - Row selection
  - Action buttons for edit/delete operations

#### `PlayerModal.tsx`

- **Purpose**: Modal for creating and editing player records
- **Features**:
  - Form validation
  - Dynamic field rendering
  - Image upload support
  - Responsive design

#### `FilterComponentDrawer.tsx`

- **Purpose**: Side drawer containing all filter components
- **Features**:
  - Collapsible filter sections
  - Real-time filter application
  - Filter reset functionality

### Filter Components

#### `NameFilter.tsx`

- Debounced text search for player names
- Real-time filtering as you type

#### `AgeFilter.tsx`

- Range slider for age filtering
- Min/max age selection

#### `HeightFilter.tsx`

- Range slider for height filtering
- Unit-aware (cm/ft) filtering

#### `NationalityFilter.tsx`

- Dropdown with country flags
- Multi-select capability

#### `PositionFilter.tsx`

- Checkbox group for soccer positions
- Categorized by position types (Forwards, Midfielders, Defenders)

### Utility Components

#### `AlertProvider.tsx`

- Global alert system using React Context
- Success, error, warning, and info notifications

#### `ThemeModeSwitcher.tsx`

- Toggle between light and dark themes
- Persists theme preference

#### `UploadCSVButton.tsx`

- CSV file upload functionality
- Bulk player import with validation

## 🔧 State Management

The application uses Redux Toolkit for state management with the following slices:

### Theme Reducer

- Manages dark/light theme state
- Persists theme preference

### Filters Reducer

- Manages all filter states
- Handles filter updates and resets

### Measurement Reducer

- Manages unit system (metric/imperial)
- Persists unit preference

## 🌐 API Integration

### Player Service (`api/player-service.ts`)

The application communicates with the backend through the following endpoints:

- `GET /api/players` - Fetch players with pagination and filtering
- `POST /api/players` - Create new player
- `PUT /api/players/{id}` - Update existing player
- `DELETE /api/players/{id}` - Delete player
- `POST /api/players/upload` - Upload CSV file for bulk import

### Error Handling

- Global error handling with user-friendly messages
- Network error detection and retry mechanisms
- Validation error display in forms

## 🎨 Theming

The application uses Material-UI theming with:

- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Reduced eye strain for low-light environments
- **Custom Color Palette**: Brand-specific colors
- **Responsive Typography**: Scalable text sizes
- **Component Overrides**: Custom styling for specific components

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (320px - 767px)

## 🚀 Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t players-dashboard .

# Run the container
docker run -p 3000:3000 players-dashboard
```

### Environment Variables for Production

Ensure all environment variables are properly configured for your production environment:

- `VITE_BACKEND_HOST`: Your backend service host
- `VITE_BACKEND_PORT`: Your backend service port
- `VITE_PORT`: Frontend application port
- `VITE_ENV`: Environment identifier

## 🧪 Testing

### Linting

```bash
npm run lint
# or
yarn lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## 📊 Data Format

### Player Data Structure

```typescript
interface Player {
  id: number;
  name: string;
  age: number;
  height: number;
  nationality: string;
  position: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### CSV Upload Format

The application accepts CSV files with the following columns:

- `name` (required): Player's full name
- `age` (required): Player's age (number)
- `height` (required): Player's height in cm
- `nationality` (required): Player's nationality (country name)
- `position` (required): Player's position (Forward, Midfielder, Defender)

## 🆘 Support

For support and questions:

1. Check the existing documentation
2. Review the code comments
3. Create an issue in the repository
4. Contact the development team

---

**Note**: This application requires the PlayerService backend to be running for full functionality. Ensure the backend service is properly configured and accessible before using the frontend application.
