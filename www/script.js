// --- ZONE DE DONNÉES (TEMPORAIRE POUR TESTER) ---
// Plus tard, nous mettrons cela dans des fichiers séparés
const library = {
    "Histoire": [
        {
            titre: "Exemple: La Guerre Froide",
            resume: "Introduction aux blocs Est/Ouest",
            cours: "<h3>1. Introduction</h3><p>Ceci est un texte d'exemple en attendant tes PDF.</p>",
            quiz: [
                { q: "Qui a gagné ?", opts: ["Personne", "USA", "URSS"], good: 0, note: "C'est complexe." }
            ]
        }
    ],
    "SVT": [],
    "Anglais": [],
    "Philo": []
};

// --- LOGIQUE DE L'APP ---
let currentSubject = "";
let currentChapter = {};
let quizStep = 0;
let score = 0;

// 1. Initialisation : Afficher les matières
window.onload = () => {
    const grid = document.querySelector('.grid-menu');
    Object.keys(library).forEach(subject => {
        let div = document.createElement('div');
        div.className = 'card-subject';
        div.innerHTML = `<span>📚</span><br>${subject}`;
        div.onclick = () => openSubject(subject);
        grid.appendChild(div);
    });
};

// 2. Navigation
function openSubject(subject) {
    currentSubject = subject;
    document.getElementById('subject-title').innerText = subject;
    
    const list = document.getElementById('chapter-list');
    list.innerHTML = "";
    
    // Générer la liste des chapitres
    if(library[subject].length === 0) {
        list.innerHTML = "<p style='text-align:center; color:#999'>Aucun cours disponible.</p>";
    } else {
        library[subject].forEach((chap, idx) => {
            let div = document.createElement('div');
            div.className = 'chapter-item';
            div.innerHTML = `<h3>${chap.titre}</h3><p>${chap.resume}</p>`;
            div.onclick = () => openCourse(idx);
            list.appendChild(div);
        });
    }

    switchScreen('screen-chapters');
}

function openCourse(index) {
    currentChapter = library[currentSubject][index];
    document.getElementById('course-title').innerText = currentChapter.titre;
    document.getElementById('course-content').innerHTML = currentChapter.cours;
    switchScreen('screen-course');
}

function startQuiz() {
    quizStep = 0;
    score = 0;
    showQuestion();
    switchScreen('screen-quiz');
}

// 3. Moteur de Quiz
function showQuestion() {
    if (!currentChapter.quiz || currentChapter.quiz.length === 0) return;
    
    let qData = currentChapter.quiz[quizStep];
    document.getElementById('question-text').innerText = qData.q;
    document.getElementById('quiz-progress').innerText = `Question ${quizStep + 1}/${currentChapter.quiz.length}`;
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('btn-next').classList.add('hidden');

    const optsDiv = document.getElementById('options-container');
    optsDiv.innerHTML = "";

    qData.opts.forEach((opt, idx) => {
        let btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(btn, idx, qData);
        optsDiv.appendChild(btn);
    });
}

function checkAnswer(btn, idx, qData) {
    let all = document.querySelectorAll('.btn-option');
    all.forEach(b => b.disabled = true);

    if(idx === qData.good) {
        btn.classList.add('correct');
        score++;
        document.getElementById('feedback').innerText = "✅ Bravo ! " + qData.note;
    } else {
        btn.classList.add('wrong');
        all[qData.good].classList.add('correct');
        document.getElementById('feedback').innerText = "❌ Raté. " + qData.note;
    }
    
    document.getElementById('quiz-score').innerText = "Score: " + score;
    document.getElementById('feedback').classList.remove('hidden');
    document.getElementById('btn-next').classList.remove('hidden');
}

function nextQuestion() {
    quizStep++;
    if(quizStep < currentChapter.quiz.length) {
        showQuestion();
    } else {
        alert(`Quiz terminé ! Note : ${score}/${currentChapter.quiz.length}`);
        goBackToChapters();
    }
}

// Utilitaires
function switchScreen(id) {
    document.querySelectorAll('.container').forEach(d => d.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
function goHome() { switchScreen('screen-home'); }
function goBackToChapters() { switchScreen('screen-chapters'); }