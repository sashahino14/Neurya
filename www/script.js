// --- STRUCTURE SCOLAIRE IVOIRIENNE 🇨🇮 ---
const schoolStructure = {
    "Premier Cycle (Collège)": {
        "6ème": ["Français", "Mathématiques", "Histoire-Géographie", "SVT", "Anglais", "EDHC", "Arts Plastiques", "Éducation Musicale", "EPS", "SNT (Initiation)"],
        "5ème": ["Français", "Mathématiques", "Histoire-Géographie", "SVT", "Anglais", "Physique-Chimie", "EDHC", "Arts Plastiques", "Éducation Musicale", "EPS"],
        "4ème": ["Français", "Mathématiques", "Histoire-Géographie", "SVT", "Physique-Chimie", "Anglais", "Allemand", "Espagnol", "EDHC", "Arts Plastiques", "Éducation Musicale", "EPS"],
        "3ème": ["Français", "Mathématiques", "Histoire-Géographie", "SVT", "Physique-Chimie", "Anglais", "Allemand", "Espagnol", "EDHC", "Arts Plastiques", "Éducation Musicale", "EPS"]
    },
    "Second Cycle (Lycée)": {
        "2nde A": ["Français", "Anglais", "Allemand/Espagnol", "Histoire-Géographie", "Mathématiques", "SVT", "Physique-Chimie", "EPS", "EDHC"],
        "2nde C": ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Anglais", "Histoire-Géographie", "EPS", "EDHC", "SNT"],
        
        "1ère A": ["Français", "Philosophie", "Histoire-Géographie", "Anglais", "Allemand/Espagnol", "Mathématiques", "SVT", "EPS", "SES"],
        "1ère C": ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "EPS"],
        "1ère D": ["SVT", "Physique-Chimie", "Mathématiques", "Français", "Histoire-Géographie", "Anglais", "EPS"],
        
        "Terminale A": ["Philosophie", "Français", "Histoire-Géographie", "Anglais", "Allemand/Espagnol", "Mathématiques", "EPS", "SES"],
        "Terminale C": ["Mathématiques", "Physique-Chimie", "Philosophie", "Histoire-Géographie", "Anglais", "SVT", "EPS"],
        "Terminale D": ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Philosophie", "Histoire-Géographie", "Anglais", "EPS"]
    }
};

// --- CONTENU DES COURS (Exemples pour tester) ---
// Format de la clé : "CLASSE - MATIÈRE"
// Copie cette structure pour ajouter tes vrais cours
const library = {
    "Terminale D - SVT": [
        {
            titre: "La reproduction humaine",
            resume: "Étude des gamètes et de la fécondation",
            cours: "<h3>I. Introduction</h3><p>La reproduction humaine implique...</p>",
            quiz: [
                { q: "Où a lieu la fécondation ?", opts: ["Utérus", "Trompes", "Ovaire"], good: 1, note: "C'est dans le tiers supérieur de la trompe." }
            ]
        }
    ],
    "3ème - Histoire-Géographie": [
        {
            titre: "La décolonisation en Afrique",
            resume: "Les indépendances des années 1960",
            cours: "<h3>Le cas de la Côte d'Ivoire</h3><p>Proclamée le 7 août 1960...</p>",
            quiz: [
                { q: "Date indépendance RCI ?", opts: ["1958", "1960", "1962"], good: 1, note: "Le 7 août 1960." }
            ]
        }
    ]
};

// --- LOGIQUE DE L'APPLICATION (Ne pas modifier) ---
let currentCycle = "";
let currentClass = "";
let currentSubject = "";
let currentChapter = {};
let quizStep = 0;
let score = 0;

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

function openCycle(cycle) {
    currentCycle = cycle;
    document.getElementById('cycle-title').innerText = cycle;
    const grid = document.getElementById('grid-classes');
    grid.innerHTML = "";
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
    const matieres = schoolStructure[currentCycle][currentClass];
    matieres.forEach(subject => {
        let div = document.createElement('div');
        div.className = 'card-subject';
        // Petit hack pour mettre des émojis selon la matière
        let icon = "📚";
        if(subject.includes("Math")) icon = "📐";
        if(subject.includes("SVT") || subject.includes("Physique")) icon = "🔬";
        if(subject.includes("Sport") || subject.includes("EPS")) icon = "🏃";
        if(subject.includes("Art") || subject.includes("Musi")) icon = "🎨";
        if(subject.includes("Anglais") || subject.includes("Esp") || subject.includes("All")) icon = "🗣️";
        
        div.innerHTML = `<span>${icon}</span><br>${subject}`;
        div.onclick = () => openSubject(subject);
        grid.appendChild(div);
    });
    switchScreen('screen-subjects');
}

function openSubject(subject) {
    currentSubject = subject;
    document.getElementById('subject-title').innerText = `${subject}`;
    const list = document.getElementById('chapter-list');
    list.innerHTML = "";
    
    // On cherche si on a des cours pour cette combinaison Classe + Matière
    const uniqueKey = `${currentClass} - ${currentSubject}`;
    const chapters = library[uniqueKey] || [];

    if(chapters.length === 0) {
        list.innerHTML = `<div style='text-align:center; color:#888; margin-top:50px'>
            <p style='font-size:40px'>📂</p>
            <p>Aucun cours disponible pour le moment en<br><strong>${subject}</strong> (${currentClass})</p>
        </div>`;
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

function switchScreen(id) {
    document.querySelectorAll('.container').forEach(d => d.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
function goBackToCycles() { switchScreen('screen-cycles'); }
function goBackToClasses() { switchScreen('screen-classes'); }
function goBackToSubjects() { switchScreen('screen-subjects'); }
function goBackToChapters() { switchScreen('screen-chapters'); }