import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';

void main() {
  runApp(const MaterialApp(home: FlappyBird()));
}

class FlappyBird extends StatefulWidget {
  const FlappyBird({super.key});

  @override
  State<FlappyBird> createState() => _FlappyBirdState();
}

class _FlappyBirdState extends State<FlappyBird>
    with SingleTickerProviderStateMixin {
  final double boardWidth = 360;
  final double boardHeight = 640;

  // Bird
  double birdX = 360 / 8;
  double birdY = 640 / 2;
  double birdWidth = 34;
  double birdHeight = 24;

  // Pipe
  double pipeWidth = 64;
  double pipeHeight = 512;
  List<Pipe> pipes = [];

  // Game Logic
  double velocityY = 0;
  double gravity = 1;
  double velocityX = -4;
  double score = 0;
  bool gameOver = false;

  Timer? gameLoop;
  Timer? pipeTimer;

  @override
  void initState() {
    super.initState();
    startGame();
  }

  void startGame() {
    gameOver = false;
    score = 0;
    birdY = boardHeight / 2;
    velocityY = 0;
    pipes.clear();

    pipeTimer = Timer.periodic(
      const Duration(milliseconds: 1300),
      (_) => placePipes(),
    );

    gameLoop = Timer.periodic(const Duration(milliseconds: 16), (_) {
      setState(() {
        move();
      });
    });
  }

  void placePipes() {
    double openingSpace = boardHeight / 5;
    double randomPipeY =
        -pipeHeight / 4 - Random().nextDouble() * pipeHeight / 2;

    pipes.add(Pipe(x: boardWidth, y: randomPipeY, isTop: true));
    pipes.add(
      Pipe(
        x: boardWidth,
        y: randomPipeY + pipeHeight + openingSpace,
        isTop: false,
      ),
    );
  }

  void move() {
    velocityY += gravity;
    birdY += velocityY;
    birdY = max(birdY, 0);

    for (var pipe in pipes) {
      pipe.x += velocityX;

      if (!pipe.passed && birdX > pipe.x + pipeWidth) {
        pipe.passed = true;
        score += 0.5;
      }

      if (checkCollision(pipe)) {
        gameOver = true;
        stopGame();
      }
    }

    if (birdY > boardHeight) {
      gameOver = true;
      stopGame();
    }
  }

  bool checkCollision(Pipe pipe) {
    return birdX < pipe.x + pipeWidth &&
        birdX + birdWidth > pipe.x &&
        birdY < pipe.y + pipeHeight &&
        birdY + birdHeight > pipe.y;
  }

  void stopGame() {
    gameLoop?.cancel();
    pipeTimer?.cancel();
  }

  void jump() {
    if (gameOver) {
      startGame();
    } else {
      setState(() {
        velocityY = -9;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GestureDetector(
        onTap: jump,
        child: Container(
          color: Colors.blue,
          width: boardWidth,
          height: boardHeight,
          child: CustomPaint(
            painter: GamePainter(
              birdX: birdX,
              birdY: birdY,
              birdWidth: birdWidth,
              birdHeight: birdHeight,
              pipes: pipes,
              score: score,
              gameOver: gameOver,
            ),
          ),
        ),
      ),
    );
  }
}

class Pipe {
  double x;
  double y;
  bool isTop;
  bool passed = false;

  Pipe({required this.x, required this.y, required this.isTop});
}

class GamePainter extends CustomPainter {
  final double birdX, birdY, birdWidth, birdHeight, score;
  final List<Pipe> pipes;
  final bool gameOver;

  GamePainter({
    required this.birdX,
    required this.birdY,
    required this.birdWidth,
    required this.birdHeight,
    required this.pipes,
    required this.score,
    required this.gameOver,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();

    // Background
    paint.color = Colors.lightBlue;
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);

    // Bird
    paint.color = Colors.yellow;
    canvas.drawRect(Rect.fromLTWH(birdX, birdY, birdWidth, birdHeight), paint);

    // Pipes
    for (var pipe in pipes) {
      paint.color = Colors.green;
      canvas.drawRect(Rect.fromLTWH(pipe.x, pipe.y, 64, 512), paint);
    }

    // Score
    final textPainter = TextPainter(
      text: TextSpan(
        text: gameOver ? 'Game Over: ${score.toInt()}' : '${score.toInt()}',
        style: const TextStyle(color: Colors.white, fontSize: 32),
      ),
      textDirection: TextDirection.ltr,
    );

    textPainter.layout();
    textPainter.paint(canvas, const Offset(10, 10));
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
