/**
 * ==========================================================================
 * QUIZORA - CORE APPLICATION ENGINE
 * Features: View Switching, Dynamic Tests, Timer System, Palette Drawer,
 * LocalStorage Persistence, Viva-friendly modular code.
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. APPLICATION STATE MANAGEMENT
// --------------------------------------------------------------------------
const state = {
  theme: 'light',
  currentView: 'dashboard',
  
  // Test Runtime State
  activeQuestions: [],
  answers: {},     // { questionIndex: selectedOptionIndex }
  flagged: {},     // { questionIndex: boolean }
  currentIndex: 0,
  
  // Timer State
  timerInterval: null,
  timeRemaining: 0, // seconds
  totalTime: 0,     // initial total seconds
  startTimeStamp: null,

  // Test Configuration
  testConfig: {
    title: 'Quick Quiz',
    type: 'quick',
    category: 'all',
    difficulty: 'all',
    count: 5,
    timeLimitMinutes: 0
  },

  // Active Review State
  currentFilter: 'all',
  testResult: null,

  // LocalStorage Persisted Data
  history: [],
  streak: 0,
  lastAttemptDate: null
};

// --------------------------------------------------------------------------
// 2. INITIALIZATION & THEME HANDLING
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/**
 * Initializes the Quizora application on page load.
 */
function initApp() {
  loadTheme();
  loadHistory();
  loadStreak();
  updateDashboardStats();
  renderHistoryView();
  
  // Handle initial view
  navigateTo('dashboard');
}

/**
 * Loads saved theme preference or defaults to 'light'.
 */
function loadTheme() {
  const savedTheme = localStorage.getItem('quizora_theme') || 'light';
  state.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons();
}

/**
 * Toggles between Light and Dark mode.
 */
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('quizora_theme', state.theme);
  updateThemeIcons();
}

/**
 * Updates navbar theme toggle button icons.
 */
function updateThemeIcons() {
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  if (state.theme === 'dark') {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

// --------------------------------------------------------------------------
// 3. NAVIGATION & VIEW ROUTING
// --------------------------------------------------------------------------

/**
 * Switches current active view without page reload.
 * @param {string} viewName - Name of the view ('dashboard', 'quiz', 'result', 'history')
 */
function navigateTo(viewName) {
  // Prevent navigating away from active timed quiz without prompt
  if (state.currentView === 'quiz' && viewName !== 'quiz' && state.timerInterval) {
    const confirmLeave = confirm("You have an active test running. Leaving will forfeit your current test progress. Continue?");
    if (!confirmLeave) return;
    clearTimer();
  }

  // Update State
  state.currentView = viewName;

  // Hide all views & remove active status
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  // Show target view
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.add('active');

  // Highlight Nav Item
  const activeNavItem = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (activeNavItem) activeNavItem.classList.add('active');

  // View specific refresh tasks
  if (viewName === 'dashboard') {
    updateDashboardStats();
  } else if (viewName === 'history') {
    renderHistoryView();
  }

  // Close mobile navigation drawer if open
  const navLinks = document.getElementById('nav-links');
  if (navLinks) navLinks.classList.remove('mobile-open');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Toggles mobile menu drawer on small screens.
 */
function toggleMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.toggle('mobile-open');
}

// --------------------------------------------------------------------------
// 4. TEST ENGINE & QUESTION RANDOMIZATION
// --------------------------------------------------------------------------

/**
 * Starts a test session based on mode type.
 * @param {string} type - 'quick', 'mock', or 'custom'
 */
function startTest(type) {
  let category = 'all';
  let difficulty = 'all';
  let count = 5;
  let timeLimitMinutes = 0;
  let title = 'Quick Quiz';

  if (type === 'quick') {
    title = 'Quick Quiz';
    count = 5;
    timeLimitMinutes = 0;
  } else if (type === 'mock') {
    title = 'Full Mock Test';
    count = 15;
    timeLimitMinutes = 15;
  }

  initTestConfig({ title, type, category, difficulty, count, timeLimitMinutes });
}

/**
 * Starts a category-specific quiz.
 * @param {string} categoryKey - Category identifier string
 */
function startCategoryTest(categoryKey) {
  const categoryObj = QUESTION_BANK.find(q => q.category === categoryKey);
  const categoryName = categoryObj ? categoryObj.categoryName : 'Category Quiz';
  
  initTestConfig({
    title: `${categoryName} Quiz`,
    type: 'category',
    category: categoryKey,
    difficulty: 'all',
    count: 5,
    timeLimitMinutes: 0
  });
}

/**
 * Core function to initialize test configuration, filter & shuffle questions,
 * set up state, and launch quiz view.
 */
function initTestConfig(config) {
  state.testConfig = config;

  // Filter question bank based on criteria
  let filtered = QUESTION_BANK.filter(q => {
    const matchCat = (config.category === 'all' || q.category === config.category);
    const matchDiff = (config.difficulty === 'all' || q.difficulty === config.difficulty);
    return matchCat && matchDiff;
  });

  // Handle case where filtered list is smaller than requested count
  if (filtered.length === 0) {
    alert("No questions matched your selected filters. Please adjust your criteria.");
    return;
  }

  // Shuffle filtered questions using Fisher-Yates algorithm
  const selected = shuffleArray([...filtered]).slice(0, Math.min(config.count, filtered.length));

  // Deep clone questions & shuffle options while maintaining correct index reference
  state.activeQuestions = selected.map(q => {
    const originalOptions = [...q.options];
    const correctAnswerText = originalOptions[q.correctIndex];

    // Shuffle options
    const shuffledOptions = shuffleArray([...originalOptions]);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

    return {
      ...q,
      options: shuffledOptions,
      correctIndex: newCorrectIndex
    };
  });

  // Reset runtime test state
  state.answers = {};
  state.flagged = {};
  state.currentIndex = 0;
  state.startTimeStamp = Date.now();

  // Set up timer if timed
  clearTimer();
  if (config.timeLimitMinutes > 0) {
    startTimer(config.timeLimitMinutes);
    document.getElementById('quiz-timer-box').style.display = 'flex';
  } else {
    document.getElementById('quiz-timer-box').style.display = 'none';
  }

  // Set UI Headers
  document.getElementById('quiz-title-text').innerText = config.title;

  // Navigate to Quiz View & render first question
  navigateTo('quiz');
  renderQuestion(0);
}

/**
 * Standard Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --------------------------------------------------------------------------
// 5. TIMER SYSTEM
// --------------------------------------------------------------------------

/**
 * Launches countdown timer.
 * @param {number} minutes - Duration in minutes
 */
function startTimer(minutes) {
  state.totalTime = minutes * 60;
  state.timeRemaining = state.totalTime;

  updateTimerDisplay();

  const timerBox = document.getElementById('quiz-timer-box');
  timerBox.classList.remove('warning');

  state.timerInterval = setInterval(() => {
    state.timeRemaining--;

    // Warning state when less than 2 minutes remain
    if (state.timeRemaining <= 120) {
      timerBox.classList.add('warning');
    }

    if (state.timeRemaining <= 0) {
      clearTimer();
      alert("Time is up! Submitting your test automatically.");
      submitTest(true);
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

/**
 * Updates visual timer display formatted as MM:SS.
 */
function updateTimerDisplay() {
  const display = document.getElementById('quiz-timer-display');
  const minutes = Math.floor(state.timeRemaining / 60);
  const seconds = state.timeRemaining % 60;
  display.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Clears active timer interval.
 */
function clearTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

// --------------------------------------------------------------------------
// 6. QUESTION RENDER & INTERACTION
// --------------------------------------------------------------------------

/**
 * Renders question card and options for current index.
 * @param {number} index - Index of question to render
 */
function renderQuestion(index) {
  if (index < 0 || index >= state.activeQuestions.length) return;

  state.currentIndex = index;
  const q = state.activeQuestions[index];
  const total = state.activeQuestions.length;

  // Header progress
  document.getElementById('quiz-curr-q-num').innerText = index + 1;
  document.getElementById('quiz-total-q-num').innerText = total;

  const percent = Math.round(((index + 1) / total) * 100);
  document.getElementById('quiz-progress-percent').innerText = `${percent}%`;
  document.getElementById('quiz-progress-fill').style.width = `${percent}%`;

  // Badges & Question Text
  document.getElementById('q-category-badge').innerText = q.categoryName;
  
  const diffBadge = document.getElementById('q-difficulty-badge');
  diffBadge.innerText = q.difficulty;
  diffBadge.className = `badge badge-${q.difficulty.toLowerCase()}`;

  document.getElementById('q-question-text').innerText = q.question;

  // Render Options A / B / C / D
  const optionsContainer = document.getElementById('q-options-container');
  optionsContainer.innerHTML = '';

  const optionPrefixes = ['A', 'B', 'C', 'D'];
  q.options.forEach((optText, optIdx) => {
    const isSelected = (state.answers[index] === optIdx);
    
    const optionEl = document.createElement('div');
    optionEl.className = `option-item ${isSelected ? 'selected' : ''}`;
    optionEl.onclick = () => selectOption(optIdx);

    optionEl.innerHTML = `
      <div class="option-badge">${optionPrefixes[optIdx]}</div>
      <div class="option-text">${escapeHtml(optText)}</div>
    `;

    optionsContainer.appendChild(optionEl);
  });

  // Flag button state
  const flagBtn = document.getElementById('btn-flag-toggle');
  const isFlagged = Boolean(state.flagged[index]);
  if (isFlagged) {
    flagBtn.classList.add('flagged');
    document.getElementById('flag-btn-text').innerText = 'Flagged';
  } else {
    flagBtn.classList.remove('flagged');
    document.getElementById('flag-btn-text').innerText = 'Flag for Review';
  }

  // Navigation Button States
  const prevBtn = document.getElementById('btn-prev-q');
  const nextBtn = document.getElementById('btn-next-q');
  const submitBtn = document.getElementById('btn-submit-q');

  prevBtn.disabled = (index === 0);
  prevBtn.style.opacity = (index === 0) ? '0.5' : '1';

  if (index === total - 1) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
  } else {
    nextBtn.style.display = 'inline-flex';
    submitBtn.style.display = 'none';
  }

  // Render Question Palette Grid
  renderQuestionPalette();
}

/**
 * Handles user selecting an answer option.
 * @param {number} optionIndex 
 */
function selectOption(optionIndex) {
  state.answers[state.currentIndex] = optionIndex;
  renderQuestion(state.currentIndex);
}

/**
 * Toggles flagged status for current question.
 */
function toggleFlagQuestion() {
  const currentIdx = state.currentIndex;
  state.flagged[currentIdx] = !state.flagged[currentIdx];
  renderQuestion(currentIdx);
}

/**
 * Navigates to prev/next question.
 * @param {number} direction - -1 or 1
 */
function navigateQuestion(direction) {
  const newIndex = state.currentIndex + direction;
  if (newIndex >= 0 && newIndex < state.activeQuestions.length) {
    renderQuestion(newIndex);
  }
}

/**
 * Renders the interactive Question Palette drawer/sidebar.
 */
function renderQuestionPalette() {
  const container = document.getElementById('palette-grid-container');
  container.innerHTML = '';

  state.activeQuestions.forEach((_, idx) => {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.innerText = idx + 1;

    const isCurrent = (idx === state.currentIndex);
    const isAnswered = (state.answers[idx] !== undefined);
    const isFlagged = Boolean(state.flagged[idx]);

    if (isAnswered) btn.classList.add('answered');
    if (isCurrent) btn.classList.add('current');
    if (isFlagged) btn.classList.add('flagged');

    btn.onclick = () => renderQuestion(idx);
    container.appendChild(btn);
  });
}

// --------------------------------------------------------------------------
// 7. SUBMIT & CONFIRMATION DIALOGS
// --------------------------------------------------------------------------

/**
 * Displays submit confirmation modal with test statistics.
 */
function showSubmitModal() {
  const total = state.activeQuestions.length;
  const answeredCount = Object.keys(state.answers).length;
  const unansweredCount = total - answeredCount;
  const flaggedCount = Object.values(state.flagged).filter(Boolean).length;

  document.getElementById('sub-cnt-answered').innerText = answeredCount;
  document.getElementById('sub-cnt-unanswered').innerText = unansweredCount;
  document.getElementById('sub-cnt-flagged').innerText = flaggedCount;

  document.getElementById('submit-confirm-modal').classList.add('active');
}

/**
 * Closes submit modal.
 */
function closeSubmitModal() {
  document.getElementById('submit-confirm-modal').classList.remove('active');
}

/**
 * Confirms test submission.
 */
function confirmSubmitTest() {
  closeSubmitModal();
  submitTest(false);
}

/**
 * Calculates results, clears timer, updates streak & history, and opens result view.
 */
function submitTest(isAutoSubmit = false) {
  clearTimer();

  const totalTimeSpentSec = Math.round((Date.now() - state.startTimeStamp) / 1000);
  const result = calculateResult(totalTimeSpentSec);

  state.testResult = result;

  // Streak Update Logic
  if (result.percentage >= 50) {
    state.streak += 1;
  } else {
    state.streak = 0;
  }
  localStorage.setItem('quizora_streak', state.streak);
  updateStreakBadge();

  // Save to history
  saveHistoryAttempt(result);

  // Render Result View
  navigateTo('result');
  renderResultView(result);
}

// --------------------------------------------------------------------------
// 8. SCORE CALCULATION & RESULT VIEW
// --------------------------------------------------------------------------

/**
 * Calculates score percentage, accuracy, status, and feedback snapshot.
 * @param {number} timeSpentSec - Time spent in seconds
 */
function calculateResult(timeSpentSec) {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  state.activeQuestions.forEach((q, idx) => {
    const userPick = state.answers[idx];
    if (userPick === undefined) {
      unanswered++;
    } else if (userPick === q.correctIndex) {
      correct++;
    } else {
      incorrect++;
    }
  });

  const total = state.activeQuestions.length;
  const percentage = Math.round((correct / total) * 100);
  const status = percentage >= 60 ? 'PASSED' : 'NEEDS IMPROVEMENT';

  // Dynamic Snapshot Recommendation Statement
  let snapshotMsg = '';
  if (percentage >= 85) {
    snapshotMsg = "Outstanding performance! You have demonstrated excellent subject mastery.";
  } else if (percentage >= 60) {
    snapshotMsg = "Good attempt! You have a solid grasp, but reviewing missed concepts will sharpen your accuracy.";
  } else {
    snapshotMsg = "Keep practicing! Carefully review the detailed answer explanations below and attempt again.";
  }

  const minutesSpent = Math.floor(timeSpentSec / 60);
  const secondsSpent = timeSpentSec % 60;
  const formattedTime = `${String(minutesSpent).padStart(2, '0')}:${String(secondsSpent).padStart(2, '0')}`;

  return {
    testTitle: state.testConfig.title,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    totalQuestions: total,
    correct,
    incorrect,
    unanswered,
    percentage,
    status,
    snapshotMsg,
    timeSpent: formattedTime,
    questions: state.activeQuestions,
    userAnswers: state.answers
  };
}

/**
 * Renders the detailed Result View.
 * @param {Object} result - Result metrics object
 */
function renderResultView(result) {
  document.getElementById('result-test-title').innerText = result.testTitle;
  document.getElementById('res-score-percent').innerText = `${result.percentage}%`;
  document.getElementById('res-score-fraction').innerText = `${result.correct} / ${result.totalQuestions} Correct`;

  // Animated SVG Progress Ring
  const circleBar = document.getElementById('score-circle-bar');
  const circumference = 2 * Math.PI * 70; // r=70 -> ~439.8
  const offset = circumference - (result.percentage / 100) * circumference;
  circleBar.style.strokeDasharray = circumference;
  circleBar.style.strokeDashoffset = offset;

  // Status Badge & Snapshot
  const statusBadge = document.getElementById('res-status-badge');
  statusBadge.innerText = result.status;
  if (result.status === 'PASSED') {
    statusBadge.className = 'badge badge-easy';
    statusBadge.style.fontSize = '0.9rem';
  } else {
    statusBadge.className = 'badge badge-hard';
    statusBadge.style.fontSize = '0.9rem';
  }

  document.getElementById('res-snapshot-msg').innerText = result.snapshotMsg;

  // Metrics Grid
  document.getElementById('res-total-q').innerText = result.totalQuestions;
  document.getElementById('res-correct-q').innerText = result.correct;
  document.getElementById('res-incorrect-q').innerText = result.incorrect;
  document.getElementById('res-unanswered-q').innerText = result.unanswered;
  document.getElementById('res-time-spent').innerText = result.timeSpent;

  // Answer Review List
  state.currentFilter = 'all';
  renderReviewList('all');
}

/**
 * Filters and renders question review cards.
 * @param {string} filter - 'all', 'correct', 'incorrect', 'unanswered'
 * @param {HTMLElement} tabElement - Active filter button element
 */
function filterReview(filter, tabElement) {
  if (tabElement) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tabElement.classList.add('active');
  }

  state.currentFilter = filter;
  const container = document.getElementById('review-list-container');
  container.innerHTML = '';

  const res = state.testResult;
  if (!res) return;

  const optionLetters = ['A', 'B', 'C', 'D'];

  res.questions.forEach((q, idx) => {
    const userPick = res.userAnswers[idx];
    const isCorrect = (userPick === q.correctIndex);
    const isUnanswered = (userPick === undefined);

    // Apply Filter Logic
    if (filter === 'correct' && !isCorrect) return;
    if (filter === 'incorrect' && (isCorrect || isUnanswered)) return;
    if (filter === 'unanswered' && !isUnanswered) return;

    const card = document.createElement('div');
    card.className = 'review-item-card';

    let badgeHtml = '';
    if (isCorrect) {
      badgeHtml = `<span class="badge badge-easy">✓ Correct</span>`;
    } else if (isUnanswered) {
      badgeHtml = `<span class="badge badge-medium">— Unanswered</span>`;
    } else {
      badgeHtml = `<span class="badge badge-hard">✕ Incorrect</span>`;
    }

    let optionsHtml = '';
    q.options.forEach((optText, optIdx) => {
      let optClass = 'review-option';
      let pickTag = '';

      if (optIdx === q.correctIndex) {
        optClass += ' correct-pick';
        pickTag = ' <strong>(Correct Answer)</strong>';
      }
      if (optIdx === userPick && !isCorrect) {
        optClass += ' wrong-pick';
        pickTag = ' <strong>(Your Answer)</strong>';
      }

      optionsHtml += `
        <div class="${optClass}">
          <span>${optionLetters[optIdx]}. ${escapeHtml(optText)}</span>
          <span>${pickTag}</span>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="review-item-header">
        <span class="review-q-num">Question ${idx + 1} • ${q.categoryName}</span>
        ${badgeHtml}
      </div>
      <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:1rem;">${escapeHtml(q.question)}</h4>
      <div class="review-options-box">${optionsHtml}</div>
      <div class="explanation-box">
        <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Retakes the current test with a fresh question shuffle.
 */
function retakeCurrentTest() {
  initTestConfig(state.testConfig);
}

// --------------------------------------------------------------------------
// 9. CUSTOM TEST MODAL HANDLERS
// --------------------------------------------------------------------------

function openCustomModal() {
  document.getElementById('custom-test-modal').classList.add('active');
}

function closeCustomModal() {
  document.getElementById('custom-test-modal').classList.remove('active');
}

function submitCustomModal() {
  const category = document.getElementById('custom-category').value;
  const difficulty = document.getElementById('custom-difficulty').value;
  const count = parseInt(document.getElementById('custom-count').value) || 10;
  const timeLimit = parseInt(document.getElementById('custom-timer').value) || 0;

  if (count < 5 || count > 20) {
    alert("Please select a question count between 5 and 20.");
    return;
  }

  closeCustomModal();

  initTestConfig({
    title: 'Custom Test',
    type: 'custom',
    category,
    difficulty,
    count,
    timeLimitMinutes: timeLimit
  });
}

// --------------------------------------------------------------------------
// 10. LOCALSTORAGE HISTORY & STATS PERSISTENCE
// --------------------------------------------------------------------------

function loadHistory() {
  const stored = localStorage.getItem('quizora_history');
  if (stored) {
    try {
      state.history = JSON.parse(stored);
    } catch (e) {
      state.history = [];
    }
  } else {
    state.history = [];
  }
}

function saveHistoryAttempt(result) {
  const record = {
    id: 'att_' + Date.now(),
    date: result.date,
    title: result.testTitle,
    category: state.testConfig.category,
    total: result.totalQuestions,
    score: result.correct,
    percentage: result.percentage
  };

  state.history.unshift(record);
  localStorage.setItem('quizora_history', JSON.stringify(state.history));
}

function loadStreak() {
  const storedStreak = localStorage.getItem('quizora_streak');
  state.streak = storedStreak ? parseInt(storedStreak) : 0;
  updateStreakBadge();
}

function updateStreakBadge() {
  document.getElementById('streak-count').innerText = state.streak;
  document.getElementById('stat-streak-val').innerText = state.streak;
}

/**
 * Calculates and updates dashboard stats from history.
 */
function updateDashboardStats() {
  const testsCount = state.history.length;
  document.getElementById('stat-tests-count').innerText = testsCount;

  if (testsCount === 0) {
    document.getElementById('stat-avg-score').innerText = '0%';
    document.getElementById('stat-best-score').innerText = '0%';
    document.getElementById('hero-badge-score').innerText = '0%';
    return;
  }

  const totalPercent = state.history.reduce((acc, curr) => acc + curr.percentage, 0);
  const avg = Math.round(totalPercent / testsCount);
  const best = Math.max(...state.history.map(h => h.percentage));

  document.getElementById('stat-avg-score').innerText = `${avg}%`;
  document.getElementById('stat-best-score').innerText = `${best}%`;
  document.getElementById('hero-badge-score').innerText = `${avg}%`;
}

/**
 * Renders history view table, handles empty state, and renders SVG performance chart.
 */
function renderHistoryView() {
  const tableBody = document.getElementById('history-table-body');
  const emptyState = document.getElementById('history-empty-state');
  
  tableBody.innerHTML = '';

  if (state.history.length === 0) {
    emptyState.style.display = 'flex';
    document.querySelector('.history-table').style.display = 'none';
    renderPerformanceChart([]);
    return;
  }

  emptyState.style.display = 'none';
  document.querySelector('.history-table').style.display = 'table';

  state.history.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:600;">${item.date}</td>
      <td><span class="badge badge-category">${item.title}</span></td>
      <td>${item.category}</td>
      <td>${item.total} Qs</td>
      <td style="font-weight:700;">${item.score} / ${item.total}</td>
      <td><strong style="color:var(--primary);">${item.percentage}%</strong></td>
    `;
    tableBody.appendChild(tr);
  });

  renderPerformanceChart(state.history);
}

/**
 * Renders a dynamic score progression trend chart using pure SVG.
 * @param {Array} history 
 */
function renderPerformanceChart(history) {
  const wrapper = document.getElementById('history-chart-wrapper');
  wrapper.innerHTML = '';

  if (!history || history.length === 0) {
    wrapper.innerHTML = `
      <div style="height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:0.9rem;">
        Complete tests to view score progression trend graph.
      </div>
    `;
    return;
  }

  // Reverse history so oldest is left, newest is right
  const pointsData = [...history].reverse().slice(-10); // last 10 attempts
  const width = 600;
  const height = 180;
  const padding = 30;

  const stepX = (width - padding * 2) / Math.max(pointsData.length - 1, 1);
  
  let pointsStr = '';
  let dotsHtml = '';

  pointsData.forEach((item, idx) => {
    const x = padding + (idx * stepX);
    // Y mapped 0% -> height-padding, 100% -> padding
    const y = (height - padding) - (item.percentage / 100) * (height - padding * 2);

    pointsStr += `${x},${y} `;
    dotsHtml += `
      <circle cx="${x}" cy="${y}" r="5" fill="var(--primary)" stroke="var(--bg-surface)" stroke-width="2"/>
      <text x="${x}" y="${y - 10}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--text-main)">${item.percentage}%</text>
    `;
  });

  const svgHtml = `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
      <!-- Grid Lines -->
      <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="var(--border)" stroke-dasharray="4"/>
      <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="var(--border)" stroke-dasharray="4"/>
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border)"/>

      <!-- Polyline score trend -->
      <polyline fill="none" stroke="var(--primary)" stroke-width="3" points="${pointsStr.trim()}"/>
      ${dotsHtml}
    </svg>
  `;

  wrapper.innerHTML = svgHtml;
}

// --------------------------------------------------------------------------
// 11. CLEAR HISTORY & ABOUT MODALS
// --------------------------------------------------------------------------

function showClearHistoryModal() {
  document.getElementById('clear-history-modal').classList.add('active');
}

function closeClearHistoryModal() {
  document.getElementById('clear-history-modal').classList.remove('active');
}

function confirmClearHistory() {
  localStorage.removeItem('quizora_history');
  localStorage.removeItem('quizora_streak');
  state.history = [];
  state.streak = 0;
  
  closeClearHistoryModal();
  updateStreakBadge();
  updateDashboardStats();
  renderHistoryView();
}

function openAboutModal() {
  document.getElementById('about-modal').classList.add('active');
}

function closeAboutModal() {
  document.getElementById('about-modal').classList.remove('active');
}

// --------------------------------------------------------------------------
// 12. UTILITY HELPERS
// --------------------------------------------------------------------------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
