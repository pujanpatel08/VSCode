from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import google.generativeai as genai
import requests
import os
from dotenv import load_dotenv
import json
import asyncio
from typing import Optional, List, Dict, Any

load_dotenv()

app = FastAPI(title="NBA Stats AI Wrapper", version="1.0.0")

# Configure AI services
openai.api_key = os.getenv("OPENAI_API_KEY")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# NBA API configuration
NBA_API_BASE = "http://localhost:3001/api"
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

class QueryRequest(BaseModel):
    query: str

class PlayerAnalysisRequest(BaseModel):
    player_id: str
    season: str
    type: str

class ComparePlayersRequest(BaseModel):
    player_ids: List[str]
    season: str

class AIResponse(BaseModel):
    response: str
    confidence: Optional[float] = None
    sources: Optional[List[str]] = None

class NBADataService:
    def __init__(self):
        self.base_url = NBA_API_BASE
    
    async def search_players(self, query: str) -> List[Dict]:
        """Search for NBA players by name"""
        try:
            response = requests.get(f"{self.base_url}/players/search", params={"q": query})
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error searching players: {e}")
            return []
    
    async def get_player_stats(self, player_id: str, season: str, type: str = "regular") -> Dict:
        """Get player statistics for a specific season and type"""
        try:
            response = requests.get(
                f"{self.base_url}/players/{player_id}/stats",
                params={"season": season, "type": type}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error getting player stats: {e}")
            return {}
    
    async def get_player_info(self, player_id: str) -> Dict:
        """Get basic player information"""
        try:
            response = requests.get(f"{self.base_url}/players/{player_id}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error getting player info: {e}")
            return {}

class AIService:
    def __init__(self):
        self.nba_service = NBADataService()
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def process_natural_language_query(self, query: str) -> str:
        """Process natural language queries about NBA stats"""
        try:
            # First, try to extract player names and context from the query
            players = await self.nba_service.search_players(query)
            
            if not players:
                return "I couldn't find any players matching your query. Please try a different search term."
            
            # Get stats for the first matching player
            player = players[0]
            player_stats = await self.nba_service.get_player_stats(
                player["id"], 
                "2023-24",  # Default to current season
                "regular"
            )
            
            if not player_stats:
                return f"I found {player['firstname']} {player['lastname']}, but couldn't retrieve their statistics."
            
            # Create a detailed response using AI
            prompt = f"""
            Based on the following NBA player statistics, provide a natural, conversational response to the user's question: "{query}"
            
            Player: {player['firstname']} {player['lastname']}
            Team: {player.get('team', {}).get('name', 'Unknown')}
            
            Statistics:
            - Points per game: {player_stats.get('points', 0):.1f}
            - Rebounds per game: {player_stats.get('totReb', 0):.1f}
            - Assists per game: {player_stats.get('assists', 0):.1f}
            - Field goal percentage: {player_stats.get('fgp', 0):.1f}%
            - Three-point percentage: {player_stats.get('tpp', 0):.1f}%
            - Free throw percentage: {player_stats.get('ftp', 0):.1f}%
            - Steals per game: {player_stats.get('steals', 0):.1f}
            - Blocks per game: {player_stats.get('blocks', 0):.1f}
            - Turnovers per game: {player_stats.get('turnovers', 0):.1f}
            
            Please provide a comprehensive, engaging response that directly answers the user's question while highlighting key statistics and insights.
            """
            
            response = self.model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Error processing query: {e}")
            return "I'm sorry, I encountered an error while processing your request. Please try again."
    
    async def analyze_player_performance(self, player_id: str, season: str, type: str) -> str:
        """Provide detailed analysis of a player's performance"""
        try:
            player_info = await self.nba_service.get_player_info(player_id)
            player_stats = await self.nba_service.get_player_stats(player_id, season, type)
            
            if not player_stats:
                return "Unable to retrieve player statistics for analysis."
            
            prompt = f"""
            Provide a detailed analysis of this NBA player's performance:
            
            Player: {player_info.get('firstname', '')} {player_info.get('lastname', '')}
            Team: {player_info.get('team', {}).get('name', 'Unknown')}
            Season: {season}
            Type: {type}
            
            Statistics:
            - Points per game: {player_stats.get('points', 0):.1f}
            - Rebounds per game: {player_stats.get('totReb', 0):.1f}
            - Assists per game: {player_stats.get('assists', 0):.1f}
            - Field goal percentage: {player_stats.get('fgp', 0):.1f}%
            - Three-point percentage: {player_stats.get('tpp', 0):.1f}%
            - Free throw percentage: {player_stats.get('ftp', 0):.1f}%
            - Steals per game: {player_stats.get('steals', 0):.1f}
            - Blocks per game: {player_stats.get('blocks', 0):.1f}
            - Turnovers per game: {player_stats.get('turnovers', 0):.1f}
            
            Please provide:
            1. Overall performance assessment
            2. Strengths and areas for improvement
            3. Comparison to league averages
            4. Key insights and observations
            """
            
            response = self.model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Error analyzing player: {e}")
            return "I'm sorry, I couldn't analyze the player's performance at this time."
    
    async def compare_players(self, player_ids: List[str], season: str) -> str:
        """Compare multiple players' statistics"""
        try:
            players_data = []
            
            for player_id in player_ids:
                player_info = await self.nba_service.get_player_info(player_id)
                player_stats = await self.nba_service.get_player_stats(player_id, season, "regular")
                
                if player_info and player_stats:
                    players_data.append({
                        "info": player_info,
                        "stats": player_stats
                    })
            
            if len(players_data) < 2:
                return "I need at least 2 players to make a comparison."
            
            prompt = f"""
            Compare these NBA players' performances for the {season} season:
            
            """
            
            for i, player_data in enumerate(players_data):
                player = player_data["info"]
                stats = player_data["stats"]
                prompt += f"""
                Player {i+1}: {player.get('firstname', '')} {player.get('lastname', '')} ({player.get('team', {}).get('name', 'Unknown')})
                - Points: {stats.get('points', 0):.1f}
                - Rebounds: {stats.get('totReb', 0):.1f}
                - Assists: {stats.get('assists', 0):.1f}
                - FG%: {stats.get('fgp', 0):.1f}%
                - 3P%: {stats.get('tpp', 0):.1f}%
                - FT%: {stats.get('ftp', 0):.1f}%
                
                """
            
            prompt += """
            Please provide:
            1. Statistical comparison highlighting key differences
            2. Strengths and weaknesses of each player
            3. Overall assessment and recommendation
            4. Interesting insights and observations
            """
            
            response = self.model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Error comparing players: {e}")
            return "I'm sorry, I couldn't compare the players at this time."

# Initialize AI service
ai_service = AIService()

@app.post("/query", response_model=AIResponse)
async def process_query(request: QueryRequest):
    """Process natural language queries about NBA statistics"""
    try:
        response_text = await ai_service.process_natural_language_query(request.query)
        return AIResponse(response=response_text, confidence=0.85)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-player")
async def analyze_player(request: PlayerAnalysisRequest):
    """Analyze a specific player's performance"""
    try:
        analysis = await ai_service.analyze_player_performance(
            request.player_id, 
            request.season, 
            request.type
        )
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare-players")
async def compare_players(request: ComparePlayersRequest):
    """Compare multiple players' statistics"""
    try:
        comparison = await ai_service.compare_players(
            request.player_ids, 
            request.season
        )
        return {"comparison": comparison}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "NBA Stats AI Wrapper"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
