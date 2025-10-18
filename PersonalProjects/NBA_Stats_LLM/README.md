# NBA Stats LLM - Complete Project Documentation

## 🏀 Project Overview

NBA Stats LLM is an iOS application built with React Native that uses AI to provide NBA player statistics through natural language queries. Users can ask questions like "What were LeBron James' stats in the 2023 playoffs?" and get instant, comprehensive responses.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React Native + TypeScript
- **Backend**: Express.js + Node.js  
- **AI Service**: Python + FastAPI + OpenAI GPT-4/Google Gemini
- **Database**: Supabase (PostgreSQL)
- **NBA Data**: RapidAPI NBA API
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Styling**: React Native Paper

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Express.js    │    │   Python AI     │
│   iOS App       │◄──►│   Backend API   │◄──►│   Wrapper       │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   RapidAPI      │    │   OpenAI/       │
│   Database      │    │   NBA API       │    │   Gemini API    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
NBA_Stats_LLM/
├── mobile/                    # React Native iOS app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # App screens (Home, Player, Query, Favorites)
│   │   ├── services/         # API calls and data fetching
│   │   ├── store/           # Redux store and slices
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Helper functions
│   ├── ios/                 # iOS native code
│   ├── android/             # Android native code (for future)
│   └── package.json         # React Native dependencies
├── backend/                  # Express.js API server
│   ├── routes/              # API route handlers
│   │   ├── players.js      # Player-related endpoints
│   │   ├── teams.js        # Team-related endpoints
│   │   └── stats.js        # Statistics endpoints
│   ├── services/            # Business logic
│   │   └── nbaService.js   # NBA API integration
│   ├── middleware/          # Authentication, validation
│   ├── models/              # Database models
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── ai-wrapper/              # Python AI service
│   ├── services/            # GPT/Gemini integration
│   ├── data_processing/     # NBA data processing
│   ├── requirements.txt     # Python dependencies
│   ├── main.py             # Main Python service
│   └── env.example         # Environment variables template
├── database/                # Supabase schema and migrations
│   ├── migrations/          # Database migration files
│   └── schema.sql          # Initial database schema
├── scripts/                 # Setup and deployment scripts
│   ├── setup.sh            # Project setup script
│   ├── start-dev.sh        # Start all services
│   └── stop-dev.sh         # Stop all services
├── package.json             # Root package.json
├── setup.sh                # Main setup script
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Prerequisites Installation
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

### 2. Project Setup
```bash
# Clone and setup the project
git clone <your-repo-url>
cd NBA_Stats_LLM

# Run the setup script
chmod +x setup.sh
./setup.sh
```

### 3. API Keys Configuration

#### Get API Keys:
1. **NBA API**: [RapidAPI NBA API](https://rapidapi.com/api-sports/api/api-nba)
2. **OpenAI**: [OpenAI Platform](https://platform.openai.com)
3. **Gemini**: [Google AI Studio](https://makersuite.google.com)
4. **Supabase**: [Supabase](https://supabase.com) (optional)

#### Update Environment Files:
```bash
# Update backend/.env
RAPIDAPI_KEY=your_rapidapi_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Update ai-wrapper/.env
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
RAPIDAPI_KEY=your_rapidapi_key_here
```

### 4. Run the Application
```bash
# Start all services
./start-dev.sh

# Or start individually:
# Backend API: cd backend && npm run dev
# AI Service: cd ai-wrapper && source venv/bin/activate && python main.py
# React Native: cd mobile && npm start
```

## 🔧 Development

### API Endpoints

#### Backend API (Port 3001)
- `GET /health` - Health check
- `GET /api/players/search?q={query}` - Search players
- `GET /api/players/{id}` - Get player info
- `GET /api/players/{id}/stats?season={season}&type={type}` - Get player stats
- `GET /api/teams` - Get all teams
- `GET /api/stats/leaders` - Get league leaders

#### AI Service (Port 8000)
- `POST /query` - Process natural language queries
- `POST /analyze-player` - Analyze player performance
- `POST /compare-players` - Compare multiple players
- `GET /health` - Health check

### Key Features

1. **Natural Language Queries**: Ask questions in plain English
2. **Player Search**: Search by name, team, position
3. **Season Selection**: Regular season, playoffs, specific seasons
4. **Stat Categories**: Points, rebounds, assists, shooting percentages
5. **Game Analysis**: Individual game stats, series analysis
6. **Favorites**: Save favorite players and queries
7. **Offline Support**: Cache recent queries

### Example Queries
- "What were LeBron James' stats in the 2023 playoffs?"
- "How many points did Stephen Curry average in the 2022-23 regular season?"
- "Show me Nikola Jokic's playoff stats for 2023"
- "What was Kevin Durant's shooting percentage in the 2023 playoffs?"
- "Compare Luka Doncic's regular season vs playoff stats for 2023"

## 🧪 Testing

### Manual Testing
1. **Backend API**: Visit http://localhost:3001/health
2. **AI Service**: Visit http://localhost:8000/health
3. **React Native**: Follow terminal instructions

### API Testing
```bash
# Test player search
curl "http://localhost:3001/api/players/search?q=lebron"

# Test AI query
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "What were LeBron James stats in 2023 playoffs?"}'
```

## 🚀 Deployment

### iOS App Store
1. Build release version: `cd mobile && npx react-native run-ios --configuration Release`
2. Archive in Xcode
3. Upload to App Store Connect

### Backend Deployment
1. Deploy to Heroku, Vercel, or AWS
2. Update environment variables
3. Configure domain and SSL

### AI Service Deployment
1. Deploy to Google Cloud Run, AWS Lambda, or similar
2. Update API URLs in mobile app
3. Configure scaling and monitoring

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Rate Limiting**: Implement rate limiting on all endpoints
3. **Input Validation**: Validate all user inputs
4. **CORS**: Configure CORS properly for production
5. **Authentication**: Implement user authentication for premium features

## 📊 Performance Optimization

1. **Caching**: Implement Redis caching for frequently accessed data
2. **Database Indexing**: Optimize database queries with proper indexes
3. **Image Optimization**: Compress and optimize player/team images
4. **Bundle Size**: Optimize React Native bundle size
5. **API Response**: Implement pagination for large datasets

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**: 
   ```bash
   npx react-native start --reset-cache
   ```

2. **iOS build issues**: 
   - Clean build folder in Xcode
   - Delete `ios/build` folder
   - Run `cd ios && pod install`

3. **Python import errors**: 
   - Ensure virtual environment is activated
   - Check Python version compatibility

4. **API rate limits**: 
   - Check your RapidAPI subscription limits
   - Implement exponential backoff

### Debugging Tips

1. Check logs in each service terminal
2. Verify all environment variables are set correctly
3. Ensure all ports (3001, 8000) are available
4. Test API endpoints individually
5. Use React Native debugger for mobile app issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- NBA API by RapidAPI for basketball data
- OpenAI and Google for AI capabilities
- React Native community for mobile development tools
- Supabase for database infrastructure

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Happy coding! 🏀**