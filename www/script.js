// --- STRUCTURE DE L'ÉCOLE ---
// C'est ici qu'on définit les classes et les matières pour chaque niveau
const schoolStructure = {
    "Premier Cycle": {
        "6ème": ["Histoire", "Géographie", "SVT", "Anglais", "Français"],
        "5ème": ["Histoire", "Géographie", "SVT", "Anglais", "Français", "Physique-Chimie"],
        "4ème": ["Histoire", "Géographie", "SVT", "Anglais", "Français", "Physique-Chimie", "Espagnol/Allemand"],
        "3ème": ["Histoire", "Géographie", "SVT", "Anglais", "Français", "Physique-Chimie", "Espagnol/Allemand"]
    },
    "Second Cycle": {
        "2nde": ["Français", "Anglais", "Histoire-Géo", "Maths", "Physique-Chimie", "SVT"],
        "1ère": ["Français", "Philo", "Histoire-Géo", "Maths", "Physique-Chimie", "SVT"],
        "Terminale A": ["Philosophie", "Français", "Anglais", "Histoire-Géo", "Maths", "Allemand/Espagnol"],
        "Terminale D": ["Mathématiques", "Physique-Chimie", "SVT", "Philosophie", "Français", "Anglais"]
    }
};

// --- CONTENU DES COURS (EXEMPLE) ---
// La clé est : "CLASSE - MATIÈRE" (Ex: "Terminale D - SVT")
const library = {
    "Terminale D - Histoire-Géo": [
        {
            titre: "La Guerre Froide",
            resume: "Les blocs de l'Est et de l'Ouest",
            cours: "<h3>Introduction</h3><p>Contenu du cours sur la guerre froide...</p>",
            quiz: [{ q: "Date début ?", opts: ["1945", "1914"], good: 0, note: "" }]
        }
    ],
    // Tu ajouteras tes autres cours ici plus tard
};

// --- VARIABLES DE NAVIGATION ---
let currentCycle = "";
let currentClass = "";
let currentSubject = "";
let currentChapter = {};
let quizStep = 0;
let score = 0;

// 1. Démarrage : Afficher les Cycles
window.onload = () => {
    const grid = document.getElementById('grid-cycles');
    Object.keys(schoolStructure).forEach(cycle => {
        let div = document.createElement('div');
        div.className = 'card-subject';
        div.innerHTML = `<span>🏫</span><br>${cycle}`;
        div.onclick = () => openCycle(cycle);
        grid.appendChild(div);
    });
};

// 2. Navigation
function openCycle(cycle) {
    currentCycle = cycle;
    document.getElementById('cycle-title').innerText = cycle;
    
    const grid = document.getElementById('grid-classes');
    grid.innerHTML = "";
    
    // Récupère les classes du cycle (ex: 6ème, 5ème...)
    Object.keys(schoolStructure[cycle]).forEach(classeName => {
        let div = document.createElement('div');
        div.className = 'card-subject';
        div.innerHTML = `<span>🎓</span><br>${classeName}`;
        div.onclick = () => openClass(classeName);
        grid.appendChild(div);
    });

    switchScreen('screen-classes');
}

function openClass(classeName) {
    currentClass = classeName;
    document.getElementById('class-title').innerText = "Matières (" + classeName + ")";
    
    const grid = document.getElementById('grid-subjects');
    grid.innerHTML = "";
    
    // Récupère les matières de la classe
    const matieres = schoolStructure[currentCycle][currentClass];
    matieres.forEach(subject => {
        let div = document.createElement('div');
        div.className = 'card-subject';
        div.innerHTML = `<span>📚</span><br>${subject}`;
        div.onclick = () => openSubject(subject);
        grid.appendChild(div);
    });

    switchScreen('screen-subjects');
}

function openSubject(subject) {
    currentSubject = subject;
    document.getElementById('subject-title').innerText = `${subject} (${currentClass})`;
    
    const list = document.getElementById('chapter-list');
    list.innerHTML = "";
    
    // Clé unique pour trouver le cours : "CLASSE - MATIÈRE"
    const uniqueKey = `${currentClass} - ${currentSubject}`;
    const chapters = library[uniqueKey] || [];

    if(chapters.length === 0) {
        list.innerHTML = "<p style='text-align:center; color:#999'>Aucun cours disponible pour le moment.</p>";
    } else {
        chapters.forEach((chap, idx) => {
            let div = document.createElement('div');
            div.className = 'chapter-item';
            div.innerHTML = `<h3>${chap.titre}</h3><p>${chap.resume}</p>`;
            div.onclick = () => openCourse(uniqueKey, idx);
            list.appendChild(div);
        });
    }

    switchScreen('screen-chapters');
}

function openCourse(uniqueKey, index) {
    currentChapter = library[uniqueKey][index];
    document.getElementById('course-title').innerText = currentChapter.titre;
    document.getElementById('course-content').innerHTML = currentChapter.cours;
    switchScreen('screen-course');
}

// 3. Quiz (inchangé)
function startQuiz() {
    quizStep = 0; score = 0;
    showQuestion();
    switchScreen('screen-quiz');
}

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
        btn.classList.add('correct'); score++;
        document.getElementById('feedback').innerText = "✅ Bravo ! " + (qData.note || "");
    } else {
        btn.classList.add('wrong'); all[qData.good].classList.add('correct');
        document.getElementById('feedback').innerText = "❌ Raté. " + (qData.note || "");
    }
    document.getElementById('quiz-score').innerText = "Score: " + score;
    document.getElementById('feedback').classList.remove('hidden');
    document.getElementById('btn-next').classList.remove('hidden');
}

function nextQuestion() {
    quizStep++;
    if(quizStep < currentChapter.quiz.length) showQuestion();
    else { alert(`Quiz terminé ! Note : ${score}/${currentChapter.quiz.length}`); goBackToChapters(); }
}

// Utilitaires de navigation (Retour arrière)
function switchScreen(id) {
    document.querySelectorAll('.container').forEach(d => d.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
function goBackToCycles() { switchScreen('screen-cycles'); }
function goBackToClasses() { switchScreen('screen-classes'); }
function goBackToSubjects() { switchScreen('screen-subjects'); }
function goBackToChapters() { switchScreen('screen-chapters'); }