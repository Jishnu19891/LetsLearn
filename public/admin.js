// ── Section Navigation ────────────────────────────────────────
function showSection(name) {
    document.getElementById('section-subjects').style.display  = name === 'subjects'  ? 'block' : 'none';
    document.getElementById('section-questions').style.display = name === 'questions' ? 'block' : 'none';

    document.querySelectorAll('.nav-btn').forEach((btn, i) => {
        btn.classList.toggle('active', (i === 0 && name === 'subjects') || (i === 1 && name === 'questions'));
    });

    if (name === 'questions') loadQuestions();
}

// ── Utility ───────────────────────────────────────────────────
function setMsg(id, text, type) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.style.color = type === 'success' ? '#27ae60' : '#e74c3c';
    setTimeout(() => { el.textContent = ''; el.style.color = ''; }, 3000);
}

function createCell(content, tag = 'td') {
    const cell = document.createElement(tag);
    cell.textContent = content;
    return cell;
}

// ── Categories ────────────────────────────────────────────────
async function loadCategories() {
    try {
        const res = await fetch('/api/admin/categories');
        const cats = await res.json();

        // Populate table
        const tbody = document.getElementById('cat-list');
        tbody.innerHTML = '';
        if (!cats.length) {
            tbody.innerHTML = '<tr><td colspan="3" style="color:#999">No subjects yet.</td></tr>';
        } else {
            cats.forEach(c => {
                const tr = document.createElement('tr');

                const tdKey = document.createElement('td');
                const code = document.createElement('code');
                code.textContent = c.key;
                tdKey.appendChild(code);

                const tdLabel = createCell(c.label);

                const tdAction = document.createElement('td');
                const btn = document.createElement('button');
                btn.className = 'btn-danger';
                btn.textContent = 'Delete';
                btn.onclick = () => deleteCategory(c.key);
                tdAction.appendChild(btn);

                tr.appendChild(tdKey);
                tr.appendChild(tdLabel);
                tr.appendChild(tdAction);
                tbody.appendChild(tr);
            });
        }

        // Populate dropdowns
        const qCategory = document.getElementById('q-category');
        const qFilter   = document.getElementById('q-filter');

        qCategory.innerHTML = cats.length ? '' : '<option value="">No subjects</option>';
        qFilter.innerHTML   = '<option value="">All subjects</option>';

        cats.forEach(c => {
            const opt1 = document.createElement('option');
            opt1.value       = c.key;
            opt1.textContent = c.label;
            qCategory.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value       = c.key;
            opt2.textContent = c.label;
            qFilter.appendChild(opt2);
        });
    } catch (err) {
        console.error('Failed to load categories:', err);
    }
}

async function addCategory() {
    const key   = document.getElementById('cat-key').value.trim().toLowerCase();
    const label = document.getElementById('cat-label').value.trim();

    if (!key || !label) return setMsg('cat-msg', 'Both fields are required.', 'error');

    const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, label })
    });
    const data = await res.json();

    if (!res.ok) return setMsg('cat-msg', data.error, 'error');

    document.getElementById('cat-key').value   = '';
    document.getElementById('cat-label').value = '';
    setMsg('cat-msg', `Subject "${label}" added!`, 'success');
    loadCategories();
}

async function deleteCategory(key) {
    if (!confirm(`Delete subject "${key}" and all its questions?`)) return;

    const res = await fetch(`/api/admin/categories/${encodeURIComponent(key)}`, { method: 'DELETE' });
    if (res.ok) {
        loadCategories();
        loadQuestions();
    }
}

// ── Questions ─────────────────────────────────────────────────
async function loadQuestions() {
    try {
        const filter = document.getElementById('q-filter').value;
        const url = filter
            ? `/api/admin/questions?category=${encodeURIComponent(filter)}`
            : '/api/admin/questions';

        const res = await fetch(url);
        const questions = await res.json();

        const tbody = document.getElementById('q-list');
        tbody.innerHTML = '';
        if (!questions.length) {
            tbody.innerHTML = '<tr><td colspan="5" style="color:#999">No questions yet.</td></tr>';
            return;
        }

        questions.forEach(q => {
            const tr = document.createElement('tr');

            const tdCat = document.createElement('td');
            const code = document.createElement('code');
            code.textContent = q.category;
            tdCat.appendChild(code);

            const tdAction = document.createElement('td');
            const btn = document.createElement('button');
            btn.className = 'btn-danger';
            btn.textContent = 'Delete';
            btn.onclick = () => deleteQuestion(q._id);
            tdAction.appendChild(btn);

            tr.appendChild(tdCat);
            tr.appendChild(createCell(q.title));
            tr.appendChild(createCell(q.question));
            const tdAnswer = document.createElement('td');
            const strong = document.createElement('strong');
            strong.textContent = q.answer;
            tdAnswer.appendChild(strong);
            tr.appendChild(tdAnswer);
            tr.appendChild(tdAction);
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Failed to load questions:', err);
    }
}

async function addQuestion() {
    const category = document.getElementById('q-category').value;
    const title    = document.getElementById('q-title').value.trim();
    const lesson   = document.getElementById('q-lesson').value.trim();
    const question = document.getElementById('q-question').value.trim();
    const answer   = document.getElementById('q-answer').value.trim().toLowerCase();

    if (!category || !title || !lesson || !question || !answer)
        return setMsg('q-msg', 'All fields are required.', 'error');

    const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title, lesson, question, answer })
    });
    const data = await res.json();

    if (!res.ok) return setMsg('q-msg', data.error, 'error');

    document.getElementById('q-title').value    = '';
    document.getElementById('q-lesson').value   = '';
    document.getElementById('q-question').value = '';
    document.getElementById('q-answer').value   = '';
    setMsg('q-msg', 'Question added!', 'success');
    loadQuestions();
}

async function deleteQuestion(id) {
    if (!confirm('Delete this question?')) return;
    const res = await fetch(`/api/admin/questions/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) loadQuestions();
}

// ── Init ──────────────────────────────────────────────────────
loadCategories();
