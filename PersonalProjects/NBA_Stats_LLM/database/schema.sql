-- NBA Stats LLM Database Schema
-- This schema supports caching NBA data and user preferences

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for storing user preferences and favorites
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players cache table
CREATE TABLE players_cache (
    id VARCHAR(50) PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    team_id VARCHAR(50),
    team_name VARCHAR(100),
    team_code VARCHAR(10),
    position VARCHAR(10),
    height VARCHAR(20),
    weight VARCHAR(20),
    birth_date DATE,
    birth_country VARCHAR(100),
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Player stats cache table
CREATE TABLE player_stats_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id VARCHAR(50) NOT NULL,
    season VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'regular' or 'playoffs'
    stats JSONB NOT NULL,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '6 hours'),
    UNIQUE(player_id, season, type)
);

-- Teams cache table
CREATE TABLE teams_cache (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    city VARCHAR(100),
    logo TEXT,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- User favorites table
CREATE TABLE user_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    player_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, player_id)
);

-- Query history table for analytics
CREATE TABLE query_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    ai_response TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- League leaders cache table
CREATE TABLE league_leaders_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    season VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    leaders JSONB NOT NULL,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '2 hours'),
    UNIQUE(season, type, category)
);

-- Game schedule cache table
CREATE TABLE games_cache (
    id VARCHAR(50) PRIMARY KEY,
    season VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    home_team_id VARCHAR(50),
    away_team_id VARCHAR(50),
    home_team_name VARCHAR(100),
    away_team_name VARCHAR(100),
    home_score INTEGER,
    away_score INTEGER,
    status VARCHAR(20),
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Indexes for better performance
CREATE INDEX idx_players_cache_name ON players_cache(firstname, lastname);
CREATE INDEX idx_players_cache_team ON players_cache(team_id);
CREATE INDEX idx_player_stats_cache_player_season ON player_stats_cache(player_id, season, type);
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_query_history_user ON query_history(user_id);
CREATE INDEX idx_query_history_created_at ON query_history(created_at);
CREATE INDEX idx_games_cache_date ON games_cache(date);
CREATE INDEX idx_games_cache_teams ON games_cache(home_team_id, away_team_id);

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM players_cache WHERE expires_at < NOW();
    DELETE FROM player_stats_cache WHERE expires_at < NOW();
    DELETE FROM teams_cache WHERE expires_at < NOW();
    DELETE FROM league_leaders_cache WHERE expires_at < NOW();
    DELETE FROM games_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update cache timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_history ENABLE ROW LEVEL SECURITY;

-- Policy for users to access their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own query history" ON query_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own query history" ON query_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
