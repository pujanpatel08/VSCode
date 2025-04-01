import SwiftUI

struct ContentView: View {
    enum Move: String, CaseIterable {
        case rock = "Rock"
        case paper = "Paper"
        case scissors = "Scissors"
    }
    
    @State private var playerChoice: Move?
    @State private var botChoice: Move?
    @State private var playerScore = 0
    @State private var botScore = 0
    @State private var gameOver = false
    
    func play(_ choice: Move) {
        playerChoice = choice
        botChoice = Move.allCases.randomElement()
        determineWinner()
    }
    
    func determineWinner() {
        guard let player = playerChoice, let bot = botChoice else { return }
        
        if player == bot {
            return // Tie, no score change
        }
        
        if (player == .rock && bot == .scissors) ||
           (player == .paper && bot == .rock) ||
           (player == .scissors && bot == .paper) {
            playerScore += 1
        } else {
            botScore += 1
        }
        
        if playerScore == 4 || botScore == 4 {
            gameOver = true
        }
    }
    
    func resetGame() {
        playerScore = 0
        botScore = 0
        playerChoice = nil
        botChoice = nil
        gameOver = false
    }
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Rock Paper Scissors")
                .font(.largeTitle)
                .bold()
            
            Text("Best of 7 Series")
                .font(.headline)
            
            Text("Player Score: \(playerScore)  -  Bot Score: \(botScore)")
                .font(.title2)
                .padding()
            
            if let player = playerChoice, let bot = botChoice {
                Text("You chose: \(player.rawValue)")
                Text("Bot chose: \(bot.rawValue)")
            }
            
            HStack {
                ForEach(Move.allCases, id: \.self) { move in
                    Button(action: { play(move) }) {
                        Text(move.rawValue)
                            .frame(width: 100, height: 50)
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                }
            }
            
            if gameOver {
                Text(playerScore > botScore ? "You Win! 🎉" : "Bot Wins! 🤖")
                    .font(.title)
                    .bold()
                    .padding()
                
                Button("Play Again") {
                    resetGame()
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
        }
        .padding()
    }
}

@main
struct RPSGameApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}