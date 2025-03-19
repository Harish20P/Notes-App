document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const notesList = document.getElementById('notesList');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const newNoteBtn = document.getElementById('newNoteBtn');
    const saveNoteBtn = document.getElementById('saveNote');
    const deleteNoteBtn = document.getElementById('deleteNote');
    const themeToggle = document.getElementById('themeToggle');
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');

    // State
    let currentNote = null;
    let notes = [];

    // Theme
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    // Event Listeners
    newNoteBtn.addEventListener('click', createNewNote);
    saveNoteBtn.addEventListener('click', saveNote);
    deleteNoteBtn.addEventListener('click', deleteNote);
    themeToggle.addEventListener('click', toggleTheme);

    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.dataset.format;
            formatText(format);
        });
    });

    // Load notes on startup
    loadNotes();

    // Functions
    async function loadNotes() {
        try {
            const response = await fetch('/api/notes');
            notes = await response.json();
            renderNotesList();
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    }

    function renderNotesList() {
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            if (currentNote && currentNote.id === note.id) {
                noteElement.classList.add('active');
            }
            noteElement.innerHTML = `
                <h3>${note.title || 'Untitled'}</h3>
                <p>${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}</p>
                <small>${new Date(note.updated_at).toLocaleDateString()}</small>
            `;
            noteElement.addEventListener('click', () => selectNote(note));
            notesList.appendChild(noteElement);
        });
    }

    function createNewNote() {
        currentNote = {
            title: '',
            content: ''
        };
        noteTitle.value = '';
        noteContent.value = '';
        renderNotesList();
    }

    function selectNote(note) {
        currentNote = note;
        noteTitle.value = note.title;
        noteContent.value = note.content;
        renderNotesList();
    }

    async function saveNote() {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();

        if (!title && !content) return;

        try {
            if (currentNote && currentNote.id) {
                // Update existing note
                const response = await fetch(`/api/notes/${currentNote.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content })
                });
                if (response.ok) {
                    await loadNotes();
                }
            } else {
                // Create new note
                const response = await fetch('/api/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content })
                });
                if (response.ok) {
                    await loadNotes();
                }
            }
        } catch (error) {
            console.error('Error saving note:', error);
        }
    }

    async function deleteNote() {
        if (!currentNote || !currentNote.id) return;

        if (confirm('Are you sure you want to delete this note?')) {
            try {
                const response = await fetch(`/api/notes/${currentNote.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    currentNote = null;
                    noteTitle.value = '';
                    noteContent.value = '';
                    await loadNotes();
                }
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    function formatText(format) {
        const start = noteContent.selectionStart;
        const end = noteContent.selectionEnd;
        const selectedText = noteContent.value.substring(start, end);
        let formattedText = '';

        switch (format) {
            case 'list':
                formattedText = `\n- ${selectedText}`;
                break;
            case 'code':
                formattedText = `\`${selectedText}\``;
                break;
        }

        noteContent.value = noteContent.value.substring(0, start) + formattedText + noteContent.value.substring(end);
        noteContent.focus();
    }
}); 