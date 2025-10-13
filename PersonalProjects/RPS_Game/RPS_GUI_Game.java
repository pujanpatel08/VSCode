package PersonalProjects.RPS_Game;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Random;

public class RPS_GUI_Game extends JFrame implements ActionListener {
    // Variables to track the player's and bot's scores
    private int playerScore = 0;
    private int botScore = 0;
    private int roundsPlayed = 0;
    private final int totalRounds = 7;
    
    // Components
    private JButton rockButton, paperButton, scissorsButton;
    private JLabel resultLabel, scoreLabel, roundsLabel;
    
    public RPS_GUI_Game() {
        // Set up the frame
        setTitle("Rock Paper Scissors - Best of 7");
        setSize(280, 250);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        
        // Set up the panel for the backdrop
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
        panel.setBackground(Color.BLACK);
        
        // Create labels to display the results and scores
        resultLabel = new JLabel("Make your move!", SwingConstants.CENTER);
        resultLabel.setForeground(Color.WHITE);
        resultLabel.setFont(new Font("Times New Roman", Font.BOLD, 16)); // Smaller font size for labels
        scoreLabel = new JLabel("You: 0 | Bot: 0", SwingConstants.CENTER);
        scoreLabel.setForeground(Color.WHITE);
        scoreLabel.setFont(new Font("Times New Roman", Font.BOLD, 16)); // Smaller font size for labels
        roundsLabel = new JLabel("Round: 0/7", SwingConstants.CENTER);
        roundsLabel.setForeground(Color.WHITE);
        roundsLabel.setFont(new Font("Times New Roman", Font.BOLD, 16)); // Smaller font size for labels
       
        // Set uniform size for the buttons
        Dimension buttonSize = new Dimension(250, 60); // Size for buttons
        
        // Create buttons with Times New Roman font for Rock, Paper, and Scissors
        rockButton = new JButton("Rock");
        paperButton = new JButton("Paper");
        scissorsButton = new JButton("Scissors");
        Font buttonFont = new Font("Times New Roman", Font.BOLD, 20); // Smaller font size for buttons
        
        // Set font and size for each button
        rockButton.setFont(buttonFont);
        rockButton.setPreferredSize(buttonSize);
        rockButton.setMaximumSize(buttonSize);
        
        paperButton.setFont(buttonFont);
        paperButton.setPreferredSize(buttonSize);
        paperButton.setMaximumSize(buttonSize);
        
        scissorsButton.setFont(buttonFont);
        scissorsButton.setPreferredSize(buttonSize);
        scissorsButton.setMaximumSize(buttonSize);
        
        // Add action listeners to the buttons
        rockButton.addActionListener(this);
        paperButton.addActionListener(this);
        scissorsButton.addActionListener(this);
        
        // Add the buttons to the panel without any space in between
        rockButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        paperButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        scissorsButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        // Add buttons directly to panel, without spacing between them
        panel.add(rockButton);
        panel.add(paperButton);
        panel.add(scissorsButton);
        
        // Add the labels to a new panel for results
        JPanel labelPanel = new JPanel();
        labelPanel.setLayout(new GridLayout(3, 1));
        labelPanel.setBackground(Color.BLACK);
        labelPanel.add(resultLabel);
        labelPanel.add(scoreLabel);
        labelPanel.add(roundsLabel);
        
        // Add panels to the frame
        add(panel, BorderLayout.CENTER);
        add(labelPanel, BorderLayout.SOUTH);
        
        setVisible(true);
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
        // Determine the player's move based on the button pressed
        String playerMove = "";
        if (e.getSource() == rockButton) {
            playerMove = "Rock";
        } else if (e.getSource() == paperButton) {
            playerMove = "Paper";
        } else if (e.getSource() == scissorsButton) {
            playerMove = "Scissors";
        }
        
        // Generate a random move for the bot
        String botMove = generateBotMove();
        
        // Determine the winner of the round
        String roundResult = determineWinner(playerMove, botMove);
        
        // Update scores and rounds played
        roundsPlayed++;
        if (roundResult.equals("You")) {
            playerScore++;
        } else if (roundResult.equals("Bot")) {
            botScore++;
        }
        
        // Update the result and score labels
        resultLabel.setText("You: " + playerMove + " | Bot: " + botMove + " | Result: " + roundResult);
        scoreLabel.setText("You: " + playerScore + " | Bot: " + botScore);
        roundsLabel.setText("Round: " + roundsPlayed + "/" + totalRounds);
        
        // Check if the game is over
        if (roundsPlayed >= totalRounds) {
            String finalResult = playerScore > botScore ? "You win!" : "Bot wins!";
            JOptionPane.showMessageDialog(this, finalResult + "\nFinal Score: Player " + playerScore + " - " + botScore);
            resetGame();
        }
    }
    
    // Method to generate a random move for the bot
    private String generateBotMove() {
        String[] moves = {"Rock", "Paper", "Scissors"};
        Random rand = new Random();
        return moves[rand.nextInt(3)];
    }
    
    // Method to determine the winner of the round
    private String determineWinner(String playerMove, String botMove) {
        if (playerMove.equals(botMove)) {
            return "Draw";
        } else if ((playerMove.equals("Rock") && botMove.equals("Scissors")) ||
                   (playerMove.equals("Paper") && botMove.equals("Rock")) ||
                   (playerMove.equals("Scissors") && botMove.equals("Paper"))) {
            return "You";
        } else {
            return "Bot";
        }
    }
    
    // Method to reset the game after 7 rounds
    private void resetGame() {
        playerScore = 0;
        botScore = 0;
        roundsPlayed = 0;
        resultLabel.setText("Make your move!");
        scoreLabel.setText("Player: 0 | Bot: 0");
        roundsLabel.setText("Round: 0/7");
    }

    public static void main(String[] args) {
        new RPS_GUI_Game();
    }
    
}