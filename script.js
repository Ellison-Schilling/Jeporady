// Game setup

// Questions
const questions = {
  "Who Started Saying It?": {
      200: {question: "I'm out here busting", answer: "What is Shawn?"},
      400: {question: "Cool, cool, cool", answer: "Who is Toby?"},
      600: {question: "I'm going to eat you", answer: "Who is Hadley?"},
      800: {question: "Adoption, oh no!", answer: "Who is Adrian?"},  
      1000: {question: "Que ganga", answer: "Who is Katy?"}
  },
  "Cooligan History": {
      200: {question: "The only planned dinner meal that has been on every group trip", answer: "What is Tacos by Ethan?"},
      400: {question: "The original group name given on the first group trip", answer: "Who are the Rootin Tootin Hooligans?"},
      600: {question: "The name of the place the group went to eat out on the final day of the group trip last year", answer: "What is Pirate's Cove?"},
      800: {question: "The place where the third annual group trip was held", answer: "What is Government Camp?/The Mountains?"},  
      1000: {question: "The game that was played all night during Prom", answer: "Monopoly Deal"}
  },
  "Fun Facts": {
      200: {question: "How much garlic goes into one batch of Ellie's Naan", answer: "What is one head of garlic?"},
      400: {question: "The oldest member of the cooligans", answer: "Who is Chris?"},
      600: {question: "Shawn's nickname for Alyssa when she is washing her face", answer: "What is Froggy Princess?"},
      800: {question: "What Katy is going to do to Adrian when they are married", answer: "What is pegging?"},  
      1000: {question: "The day of the week weekly get togethers at Katy's were hosted", answer: "What are Wednesdays?"}
  },
  "Legendary Moments": {
      200: {question: "The event where Toby and Chris first met", answer: "What is Shawn and Alyssa's wedding?"},
      400: {question: "The game where Ethan first showed interest in Jesus?", answer: "What is Twilight Imperium?"},
      600: {question: "The two major compeitiors in the round of ipod focused on songs including the word \"butt\"", answer: "Who are Adrian and Katy?"},
      800: {question: "The game that took up a whole table on the first group trip", answer: "What is Catan?"},  
      1000: {question: "The year Toby officially became one of Ethan's wives", answer: "When was 2023?"}
  },
  "Inside Jokes": {
      200: {question: "There's no escape from _____", answer: "Where is here?"},
      400: {question: "Dragon _____", answer: "What is Deez Nuts Across Your Face"},
      600: {question: "Ethma ____", answer: "What are balls?"},
      800: {question: "Griffin's name according to some of the cooligans", answer: "Who is Grippem Hands-on?"},  
      1000: {question: "The boys favorite brand of water", answer: "What is Dasani?"}
  },
  "Music for the Group": {
      200: {question: "The person who currenty has the most contributions to the group playlist", answer: "Who is Isabel?"},
      400: {question: "The person on the cover of the first group playlist", answer: "Who is Toby"},
      600: {question: "The first song to be added to the group playlist this year", answer: "What is Two Trucks by Lemon Demon?"},
      800: {question: "The album that was played on repeat during the first group trip", answer: "What is Scaled and Icy by Twenty One Pilots?"},  
      1000: {question: "The song that was used in the video featuring the boys playing spikeball", answer: "What is I Ain't Worried by OneRebulic?"}
  }
}

// Final round question (single question)
const finalRoundQuestion = {
  question: "Ellison's SECOND favorite color at the moment", 
  answer: "What is Dark Green"
};

// Game setup
const categories = Object.keys(questions);
const points = [200, 400, 600, 800, 1000];
let teams = JSON.parse(localStorage.getItem("teams")) || {};
let currentQuestion = null;
let finalAnswered = false;

// Check if we're on the final round page
const isFinalRound = window.location.pathname.includes("final-round.html");

// Initialize the game board
function initializeGameBoard() {
if (isFinalRound) {
  initializeFinalRound();
} else {
  initializeMainGame();
}
updateTeamScores();
}

// Initialize the main game board
function initializeMainGame() {
const gameBoard = document.getElementById("game-board");
if (!gameBoard) return;

// Create category headers
categories.forEach(category => {
  const categoryDiv = document.createElement("div");
  categoryDiv.className = "category";
  categoryDiv.textContent = category;
  gameBoard.appendChild(categoryDiv);
});

// Create question boxes
points.forEach(point => {
  categories.forEach((category, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.textContent = `$${point}`;
    questionDiv.dataset.category = category;
    questionDiv.dataset.points = point;
    questionDiv.addEventListener("click", () => handleQuestionClick(category, point, questionDiv));
    gameBoard.appendChild(questionDiv);
  });
});
}

// Initialize the final round board
function initializeFinalRound() {
const finalRoundBoard = document.getElementById("final-round-board");
if (!finalRoundBoard) return;

// Create single final round question that takes up more space
const questionDiv = document.createElement("div");
questionDiv.className = "final-question-large";
questionDiv.textContent = "Final Jeopardy";
questionDiv.addEventListener("click", () => showFinalQuestion());
finalRoundBoard.appendChild(questionDiv);
}

// Handle question box clicks
function handleQuestionClick(category, point, questionDiv) {
if (questionDiv.classList.contains("disabled")) {
  // Re-enable the question
  questionDiv.classList.remove("disabled");
  questionDiv.textContent = `$${point}`;
  questionDiv.style.backgroundColor = "#1a1a1a";
  questionDiv.addEventListener("click", () => handleQuestionClick(category, point, questionDiv));
} else {
  // Show the question modal
  showQuestion(category, point);
}
}

// Show question modal
function showQuestion(category, point) {
  const modal = document.getElementById("question-modal");
  const qa = questions[category][point];
  currentQuestion = { category, point, question: qa.question, answer: qa.answer }; // Store question and answer

  // Clear previous buttons
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${category} - ${point}</h2>
      <p id="question-text"> ${qa.question}</p>
      <button id="reveal-answer-btn">Reveal Answer</button>
    </div>
  `;

  modal.style.display = "flex";

  // Add event listener to the "Reveal Answer" button
  const revealAnswerBtn = document.getElementById("reveal-answer-btn");
  revealAnswerBtn.addEventListener("click", () => revealAnswer());
}

// Reveal the answer and show correct/incorrect buttons
function revealAnswer() {
  const modal = document.getElementById("question-modal");
  modal.innerHTML = `
    <div class="modal-content">
      <p id="question-text">${currentQuestion.question}</p>
      <p><strong>Answer:</strong> ${currentQuestion.answer}</p>
      <button id="correct-btn">Correct</button>
      <button id="incorrect-btn">Incorrect</button>
    </div>
  `;

  // Add event listeners to buttons
  const correctBtn = document.getElementById("correct-btn");
  const incorrectBtn = document.getElementById("incorrect-btn");

  correctBtn.onclick = () => handleAnswer(true);
  incorrectBtn.onclick = () => handleAnswer(false);
}

// Show final round question modal
function showFinalQuestion() {
  if (finalAnswered) return;
  
  const modal = document.getElementById("final-question-modal");
  currentQuestion = finalRoundQuestion;

  // Clear previous content
  modal.innerHTML = `
    <div class="modal-content final-modal-large">
      <h2>FINAL JEOPARDY</h2>
      <p id="final-question-text">${finalRoundQuestion.question}</p>
      <button id="reveal-final-answer-btn">Reveal Answer</button>
    </div>
  `;

  modal.style.display = "flex";

  // Add event listener to the "Reveal Answer" button
  const revealAnswerBtn = document.getElementById("reveal-final-answer-btn");
  revealAnswerBtn.addEventListener("click", () => revealFinalAnswer());
}

// Reveal the final round answer and show scoring interface
function revealFinalAnswer() {
  const modal = document.getElementById("final-question-modal");
  modal.innerHTML = `
    <div class="modal-content final-modal-large">
      <p id="final-question-text">${currentQuestion.question}</p>
      <p><strong>Answer:</strong> ${currentQuestion.answer}</p>
      <button id="score-teams-btn">Score Teams</button>
    </div>
  `;

  // Add event listener to scoring button
  const scoreBtn = document.getElementById("score-teams-btn");
  scoreBtn.addEventListener("click", () => scoreFinalJeopardy());
}

// Handle Final Jeopardy scoring for all teams
function scoreFinalJeopardy() {
  const modal = document.getElementById("final-question-modal");
  
  // If no teams exist, create a simple interface to add teams
  if (Object.keys(teams).length === 0) {
      modal.innerHTML = `
          <div class="modal-content final-modal-large">
              <h2>No Teams Found</h2>
              <p>Please add teams first by playing the main game or manually updating scores.</p>
              <button id="back-to-main-btn">Back to Main Game</button>
          </div>
      `;
      
      document.getElementById("back-to-main-btn").addEventListener("click", () => {
          window.location.href = "index.html";
      });
      return;
  }
  
  // Create scoring interface for all teams
  let scoringHTML = `
      <div class="modal-content final-modal-large">
          <h2>Final Jeopardy Results</h2>
          <div class="final-scoring">
  `;
  
  // Add scoring inputs for each team
  Object.keys(teams).forEach(team => {
      const teamName = team.replace(/[^a-zA-Z0-9]/g, ''); // Clean team name for IDs
      scoringHTML += `
          <div class="team-final-score">
              <h3>${team} (Current: ${teams[team]})</h3>
              <label>Wager: $<input type="number" id="wager-${teamName}" placeholder="0" min="0" /></label>
              <label>
                  <input type="checkbox" id="correct-${teamName}" /> Correct Answer
              </label>
          </div>
      `;
  });
  
  scoringHTML += `
          </div>
          <button id="apply-final-scores-btn">Apply Final Scores</button>
          <button id="skip-final-btn">Skip Final Jeopardy</button>
      </div>
  `;
  
  modal.innerHTML = scoringHTML;
  
  // Add event listeners
  document.getElementById("apply-final-scores-btn").addEventListener("click", applyFinalScores);
  document.getElementById("skip-final-btn").addEventListener("click", () => {
      modal.style.display = "none";
      finalAnswered = true;
      showWinnerScreen();
  });
}

// Apply the final jeopardy scores
function applyFinalScores() {
  let updatedTeams = {};
  
  Object.keys(teams).forEach(team => {
      const teamName = team.replace(/[^a-zA-Z0-9]/g, ''); // Clean team name for IDs
      const wagerInput = document.getElementById(`wager-${teamName}`);
      const correctCheckbox = document.getElementById(`correct-${teamName}`);
      
      if (!wagerInput || !correctCheckbox) {
          console.error(`Could not find inputs for team: ${team}`);
          updatedTeams[team] = teams[team]; // Keep original score if inputs not found
          return;
      }
      
      const wager = parseInt(wagerInput.value) || 0;
      const isCorrect = correctCheckbox.checked;
      
      let newScore = teams[team];
      if (isCorrect) {
          newScore += wager;
      } else {
          newScore -= wager;
      }
      
      updatedTeams[team] = newScore;
      console.log(`${team}: ${teams[team]} ${isCorrect ? '+' : '-'} ${wager} = ${newScore}`);
  });
  
  // Update the teams object
  teams = updatedTeams;
  
  // Update scores and show winner
  updateTeamScores();
  localStorage.setItem("teams", JSON.stringify(teams));
  
  const modal = document.getElementById("final-question-modal");
  modal.style.display = "none";
  finalAnswered = true;
  
  showWinnerScreen();
}

// Handle answer
function handleAnswer(isCorrect) {
const modal = document.getElementById("question-modal");
modal.style.display = "none";

if (isCorrect) {
  const team = prompt("Which team answered correctly?");
  if (team) {
    teams[team] = (teams[team] || 0) + currentQuestion.point;
    updateTeamScores();
    localStorage.setItem("teams", JSON.stringify(teams));
  }
}

// Disable the question
const questions = document.querySelectorAll(".question");
questions.forEach(q => {
  if (q.dataset.category === currentQuestion.category && q.dataset.points == currentQuestion.point) {
    q.classList.add("disabled");
    q.textContent = ""; // Hide the point value
    q.style.backgroundColor = "#444"; // Darken the box
  }
});
}

// Show winner screen
function showWinnerScreen() {
const winner = getWinner();
const winnerScreen = document.createElement("div");
winnerScreen.className = "winner-screen";
winnerScreen.innerHTML = `
  <h1>Game Over!</h1>
  <h2>Winner: ${winner}</h2>
  <p>Final Scores:</p>
  <ul>
    ${Object.entries(teams).map(([team, score]) => `<li>${team}: $${score}</li>`).join("")}
  </ul>
  <button id="play-again-btn">Play Again</button>
`;
document.body.appendChild(winnerScreen);

// Add event listener for the "Play Again" button
const playAgainBtn = document.getElementById("play-again-btn");
if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    localStorage.removeItem("teams"); // Reset scores
    window.location.href = "index.html"; // Go back to the main game
  });
}
}

// Get the team with the highest score
function getWinner() {
let winner = "";
let highestScore = -Infinity;
for (const [team, score] of Object.entries(teams)) {
  if (score > highestScore) {
    highestScore = score;
    winner = team;
  }
}
return winner || "No winner yet";
}

// Update team scores display
function updateTeamScores() {
const scoresContainer = document.getElementById("scores-container");
scoresContainer.innerHTML = ""; // Clear existing scores

for (const [team, score] of Object.entries(teams)) {
  const teamScoreDiv = document.createElement("div");
  teamScoreDiv.className = "team-score";
  teamScoreDiv.textContent = `${team}: $${score}`;
  scoresContainer.appendChild(teamScoreDiv);
}

// If no teams exist, display a message
if (Object.keys(teams).length === 0) {
  scoresContainer.innerHTML = "<p>No scores yet. Start playing!</p>";
}
}

// Manual score update
function manuallyUpdateScores() {
const team = prompt("Enter the team name:");
if (team) {
  const newScore = prompt(`Enter the new score for ${team}:`);
  if (!isNaN(newScore)) {
    teams[team] = parseInt(newScore, 10);
    updateTeamScores();
    alert(`${team}'s score has been updated to $${teams[team]}.`);
    localStorage.setItem("teams", JSON.stringify(teams));
  } else {
    alert("Invalid score. Please enter a number.");
  }
}
}

// Final round button
const finalRoundBtn = document.getElementById("final-round-btn");
if (finalRoundBtn) {
finalRoundBtn.addEventListener("click", () => {
  window.location.href = "final-round.html";
});
}

// Manual score update button
const updateScoresBtn = document.getElementById("update-scores-btn");
if (updateScoresBtn) {
updateScoresBtn.addEventListener("click", manuallyUpdateScores);
}

// Initialize the game
initializeGameBoard();