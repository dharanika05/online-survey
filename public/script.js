const questionBank = [
  {q:"How satisfied are you with your overall experience?",a:["Very satisfied","Satisfied","Neutral","Dissatisfied"]},
  {q:"How often do you use online services?",a:["Every day","A few times a week","Sometimes","Rarely"]},
  {q:"Which feature matters most to you?",a:["Easy to use","Fast performance","Good design","Helpful support"]},
  {q:"How would you rate the quality of the information provided?",a:["Excellent","Good","Average","Poor"]},
  {q:"Would you recommend this service to a friend?",a:["Definitely","Probably","Not sure","No"]},
  {q:"What device do you usually use to access websites?",a:["Mobile phone","Laptop","Desktop computer","Tablet"]},
  {q:"How easy was it to find what you needed?",a:["Very easy","Easy","Somewhat difficult","Very difficult"]},
  {q:"How important is privacy when using an online service?",a:["Extremely important","Very important","Somewhat important","Not important"]},
  {q:"What is your preferred way to receive updates?",a:["Email","SMS","App notification","I prefer no updates"]},
  {q:"How likely are you to use this service again?",a:["Very likely","Likely","Uncertain","Unlikely"]},
  {q:"Which area should be improved first?",a:["Features","Design","Speed","Customer support"]},
  {q:"How would you describe your overall experience?",a:["Excellent","Good","Average","Needs improvement"]}
];

const welcome = document.getElementById("welcome");
const survey = document.getElementById("survey");
const result = document.getElementById("result");
const questionsEl = document.getElementById("questions");
const form = document.getElementById("surveyForm");
const submitBtn = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMessage");
let selectedQuestions = [];

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startSurvey() {
  selectedQuestions = shuffle(questionBank).slice(0, 5);
  questionsEl.innerHTML = selectedQuestions.map((item, index) => `
    <section class="question">
      <h3><span class="q-number">0${index + 1}</span>${item.q}</h3>
      <div class="options">
        ${item.a.map((answer, j) => `
          <div class="option">
            <input type="radio" id="q${index}_${j}" name="q${index}" value="${answer}" required>
            <label for="q${index}_${j}">${answer}</label>
          </div>`).join("")}
      </div>
    </section>`).join("");

  form.reset();
  errorMessage.classList.add("hidden");
  welcome.classList.add("hidden");
  result.classList.add("hidden");
  survey.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("startBtn").addEventListener("click", startSurvey);
document.getElementById("againBtn").addEventListener("click", startSurvey);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.classList.add("hidden");

  const answers = selectedQuestions.map((item, index) => {
    const chosen = document.querySelector(`input[name="q${index}"]:checked`);
    return { question: item.q, answer: chosen ? chosen.value : "" };
  });

  if (answers.some(item => !item.answer)) {
    errorMessage.textContent = "Please answer all 5 questions.";
    errorMessage.classList.remove("hidden");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";
  try {
    const response = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not save your answers.");

    document.getElementById("summary").innerHTML = answers.map((item, index) =>
      `<p><strong>${index + 1}. ${escapeHtml(item.question)}</strong><br>${escapeHtml(item.answer)}</p>`
    ).join("");
    survey.classList.add("hidden");
    result.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    errorMessage.textContent = error.message + " Check that the server and MongoDB are running.";
    errorMessage.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit answers <span>→</span>';
  }
});

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}
