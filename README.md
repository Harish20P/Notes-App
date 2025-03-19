# Flask Notes App

A modern, feature-rich notes application built with Flask, SQLite, and vanilla JavaScript. This application allows users to create, edit, delete, and search notes with a beautiful and responsive user interface.

## Features

- Create, edit, and delete notes
- Real-time search functionality
- Dark mode support
- Markdown formatting support
- Responsive design
- SQLite database for data persistence

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flask-notes-app
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Flask development server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

## Usage

- Click the "New Note" button to create a new note
- Use the search bar to find notes by title or content
- Click on a note in the sidebar to edit it
- Use the formatting toolbar to apply markdown formatting
- Toggle dark mode using the moon/sun icon
- Save changes using the save button
- Delete notes using the delete button

## Project Structure

```
flask-notes-app/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css  # Stylesheets
│   └── js/
│       └── main.js    # Frontend JavaScript
├── templates/
│   └── index.html     # Main HTML template
└── notes.db           # SQLite database (created automatically)
```

## Contributing

Feel free to submit issues and enhancement requests! 