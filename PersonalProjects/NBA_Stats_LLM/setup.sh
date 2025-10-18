#!/bin/bash

# NBA Stats LLM - Complete Setup Script
echo "🏀 NBA Stats LLM - Complete Project Setup"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the NBA_Stats_LLM root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    echo "   Visit: https://python.org/"
    exit 1
fi

if ! command_exists npx; then
    echo "❌ npx is not available. Please ensure Node.js is properly installed."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup mobile app
echo "📱 Setting up React Native mobile app..."
cd mobile

# Install React Native dependencies
npm install

# Install iOS dependencies (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Installing iOS dependencies..."
    cd ios
    pod install
    cd ..
else
    echo "⚠️  iOS dependencies skipped (not on macOS)"
fi

cd ..

# Setup backend
echo "🔧 Setting up Express.js backend..."
cd backend
npm install
cd ..

# Setup AI wrapper
echo "🤖 Setting up Python AI wrapper..."
cd ai-wrapper

# Create virtual environment
python3 -m venv venv

# Activate virtual environment and install dependencies
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    source venv/bin/activate
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    venv\Scripts\activate
fi

pip install -r requirements.txt
cd ..

# Create environment files
echo "⚙️  Creating environment configuration files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "📝 Created backend/.env - Please update with your API keys"
fi

# AI wrapper .env
if [ ! -f "ai-wrapper/.env" ]; then
    cp ai-wrapper/env.example ai-wrapper/.env
    echo "📝 Created ai-wrapper/.env - Please update with your API keys"
fi

# Create development scripts
echo "📜 Creating development scripts..."

cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting NBA Stats LLM development environment..."

# Start backend API
echo "🔧 Starting Express.js backend..."
cd backend && npm run dev &
BACKEND_PID=$!

# Start AI wrapper
echo "🤖 Starting Python AI wrapper..."
cd ../ai-wrapper
source venv/bin/activate
python main.py &
AI_PID=$!

# Start React Native
echo "📱 Starting React Native..."
cd ../mobile
npm start &
MOBILE_PID=$!

echo "✅ All services started!"
echo "📊 Backend API: http://localhost:3001"
echo "🤖 AI Service: http://localhost:8000"
echo "📱 React Native: Check terminal for instructions"

# Wait for user to stop
echo "Press Ctrl+C to stop all services"
wait
EOF

chmod +x start-dev.sh

cat > stop-dev.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping NBA Stats LLM development environment..."

# Kill all Node.js processes
pkill -f "node.*server.js"
pkill -f "node.*react-native"

# Kill Python processes
pkill -f "python.*main.py"

echo "✅ All services stopped"
EOF

chmod +x stop-dev.sh

# Create README with setup instructions
cat > SETUP_INSTRUCTIONS.md << 'EOF'
# NBA Stats LLM - Setup Instructions

## Prerequisites Setup

### 1. Install Required Software
```bash
# Install Node.js (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install React Native CLI
npm install -g @react-native-community/cli

# Install iOS development tools (macOS only)
xcode-select --install

# Install CocoaPods for iOS dependencies
sudo gem install cocoapods

# Install Python 3 (if not already installed)
brew install python3
```

### 2. Get API Keys

#### NBA API (RapidAPI)
1. Go to [RapidAPI NBA API](https://rapidapi.com/api-sports/api/api-nba)
2. Subscribe to the free plan
3. Copy your API key

#### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an account and get API key
3. Add credits to your account

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com)
2. Create a new API key
3. Copy the key

#### Supabase (Optional)
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

### 3. Configure Environment Variables

Update the following files with your API keys:

#### backend/.env
```
RAPIDAPI_KEY=your_rapidapi_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### ai-wrapper/.env
```
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
RAPIDAPI_KEY=your_rapidapi_key_here
```

## Running the Application

### Start All Services
```bash
./start-dev.sh
```

### Stop All Services
```bash
./stop-dev.sh
```

### Individual Services

#### Backend API
```bash
cd backend
npm run dev
```

#### AI Wrapper
```bash
cd ai-wrapper
source venv/bin/activate
python main.py
```

#### React Native App
```bash
cd mobile
npm start
```

## Testing the Setup

1. **Backend API**: Visit http://localhost:3001/health
2. **AI Service**: Visit http://localhost:8000/health
3. **React Native**: Follow the instructions in the terminal

## Project Structure

```
NBA_Stats_LLM/
├── mobile/           # React Native iOS app
├── backend/          # Express.js API server
├── ai-wrapper/       # Python AI service
├── database/         # Supabase schema
└── scripts/          # Setup and deployment scripts
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **iOS build issues**: Clean build folder in Xcode
3. **Python import errors**: Ensure virtual environment is activated
4. **API rate limits**: Check your RapidAPI subscription limits

### Getting Help

- Check the logs in each service terminal
- Verify all environment variables are set correctly
- Ensure all ports (3001, 8000) are available
EOF

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. 📝 Update API keys in backend/.env and ai-wrapper/.env"
echo "2. 🚀 Run './start-dev.sh' to start all services"
echo "3. 📱 Follow React Native instructions to run on iOS simulator"
echo ""
echo "📖 See SETUP_INSTRUCTIONS.md for detailed instructions"
echo ""
echo "Happy coding! 🏀"