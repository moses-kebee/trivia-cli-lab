const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Array of trivia questions
const questions = [
    {
        question: "What does JavaScript primarily run on?",
        options: ["A) Java Virtual Machine", "B) Browser's JavaScript Engine", "C) Python Interpreter", "D) C++ Compiler"],
        answer: "B",
        correctAnswer: "Browser's JavaScript Engine"
    },
    {
        question: "Which of the following is used to declare a variable in JavaScript?",
        options: ["A) var", "B) let", "C) const", "D) All of the above"],
        answer: "D",
        correctAnswer: "All of the above"
    },
    {
        question: "What does CLI stand for?",
        options: ["A) Common Line Interface", "B) Command Line Interface", "C) Code Language Integration", "D) Computer Language Interface"],
        answer: "B",
        correctAnswer: "Command Line Interface"
    },
    {
        question: "Which symbol is used for single-line comments in JavaScript?",
        options: ["A) /* */", "B) <!-- -->", "C) //", "D) #"],
        answer: "C",
        correctAnswer: "//"
    },
    {
        question: "What is the correct way to write an array in JavaScript?",
        options: ["A) {1, 2, 3}", "B) (1, 2, 3)", "C) [1, 2, 3]", "D) <1, 2, 3>"],
        answer: "C",
        correctAnswer: "[1, 2, 3]"
    }
];

// Game state variables
let score = 0;
let currentQuestionIndex = 0;
let timeLeft = 15;
let timer = null;
let gameActive = true;

// Function to display welcome message
function displayWelcome() {
    console.log("\n" + "=".repeat(50));
    console.log("🎉 WELCOME TO THE TRIVIA CHALLENGE! 🎉");
    console.log("=".repeat(50));
    console.log("\n📋 RULES:");
    console.log("• You will have 15 seconds per question");
    console.log("• Type A, B, C, or D to select your answer");
    console.log("• Get points for correct answers");
    console.log("• Try to beat the clock!\n");
}

// Function to start the timer
function startTimer() {
    timeLeft = 15;
    
    timer = setInterval(() => {
        if (!gameActive) return;
        
        timeLeft--;
        
        // Display timer every 5 seconds or when time is low
        if (timeLeft <= 5 || timeLeft === 10 || timeLeft === 15) {
            process.stdout.write(`\r⏰ Time remaining: ${timeLeft} seconds   `);
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            console.log("\n\n⌛ TIME'S UP!");
            handleTimeout();
        }
    }, 1000);
}

// Function to handle timeout
function handleTimeout() {
    if (!gameActive) return;
    
    console.log(`\n❌ Out of time! The correct answer was: ${questions[currentQuestionIndex].correctAnswer}\n`);
    gameActive = false;
    
    setTimeout(() => {
        currentQuestionIndex++;
        gameActive = true;
        askQuestion();
    }, 2000);
}

// Function to stop timer
function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// Function to display a question
function displayQuestion() {
    const q = questions[currentQuestionIndex];
    console.log("\n" + "-".repeat(40));
    console.log(`📋 QUESTION ${currentQuestionIndex + 1} of ${questions.length}`);
    console.log("-".repeat(40));
    console.log(`\n❓ ${q.question}\n`);
    
    // Use forEach to display options (array iteration)
    q.options.forEach(option => {
        console.log(`   ${option}`);
    });
    
    console.log("\n" + "-".repeat(40));
}

// Function to ask a question
function askQuestion() {
    // Check if game is over
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }
    
    gameActive = true;
    displayQuestion();
    startTimer();
    
    rl.question("\n📝 Your answer (A, B, C, or D): ", (userAnswer) => {
        if (!gameActive) return;
        
        stopTimer();
        checkAnswer(userAnswer.toUpperCase().trim());
    });
}

// Function to check answer
function checkAnswer(userAnswer) {
    const currentQ = questions[currentQuestionIndex];
    const isValid = ['A', 'B', 'C', 'D'].includes(userAnswer);
    
    if (!isValid) {
        console.log("\n⚠️ Invalid input! Please enter A, B, C, or D.");
        // Let them try the same question again
        gameActive = true;
        askQuestion();
        return;
    }
    
    if (userAnswer === currentQ.answer) {
        score++;
        console.log("\n" + "=".repeat(30));
        console.log("✅ CORRECT! ✅");
        console.log(`🎉 +1 point! Current score: ${score}`);
        console.log("=".repeat(30));
    } else {
        console.log("\n" + "=".repeat(30));
        console.log("❌ INCORRECT! ❌");
        console.log(`📚 Correct answer: ${currentQ.correctAnswer}`);
        console.log(`📊 Current score: ${score}`);
        console.log("=".repeat(30));
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        askQuestion();
    }, 2000);
}

// Function to end the game and show final results
function endGame() {
    stopTimer();
    
    // Calculate percentage
    const percentage = (score / questions.length) * 100;
    
    console.log("\n" + "=".repeat(50));
    console.log("🎮 GAME OVER! 🎮");
    console.log("=".repeat(50));
    console.log(`\n📊 FINAL SCORE: ${score} out of ${questions.length}`);
    console.log(`📈 PERCENTAGE: ${percentage}%`);
    
    // Give feedback based on performance
    console.log("\n" + "-".repeat(40));
    console.log("🏆 PERFORMANCE REVIEW:");
    console.log("-".repeat(40));
    
    if (percentage === 100) {
        console.log("🌟 PERFECT SCORE! You're a trivia master! 🌟");
    } else if (percentage >= 80) {
        console.log("🎉 Excellent work! You really know your stuff! 🎉");
    } else if (percentage >= 60) {
        console.log("👍 Good job! Keep learning and you'll do even better! 👍");
    } else if (percentage >= 40) {
        console.log("📚 Not bad! A little more practice and you'll improve! 📚");
    } else {
        console.log("💪 Keep studying! Every expert was once a beginner! 💪");
    }
    
    // Using reduce to calculate total possible score (array iteration)
    const totalPossible = questions.reduce((total, q) => total + 1, 0);
    console.log(`\n🎯 Total possible points: ${totalPossible}`);
    
    console.log("\n" + "=".repeat(50));
    console.log("Thanks for playing! 👋");
    console.log("=".repeat(50));
    
    rl.close();
}

// Function to restart the game
function askToRestart() {
    rl.question("\n🔄 Would you like to play again? (yes/no): ", (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            // Reset game state
            score = 0;
            currentQuestionIndex = 0;
            gameActive = true;
            console.clear();
            startGame();
        } else {
            console.log("\n👋 Goodbye! Thanks for playing!");
            rl.close();
        }
    });
}

// Main function to start the game
function startGame() {
    console.clear();
    displayWelcome();
    
    rl.question("Press ENTER to start the quiz... ", () => {
        console.log("\n🚀 Starting quiz in 3 seconds...");
        
        setTimeout(() => {
            score = 0;
            currentQuestionIndex = 0;
            gameActive = true;
            askQuestion();
        }, 3000);
    });
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log("\n\n👋 Game interrupted. Thanks for playing!");
    rl.close();
    process.exit();
});

// Start the game
startGame();