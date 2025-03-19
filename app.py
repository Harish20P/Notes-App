from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import markdown

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/notes', methods=['GET'])
def get_notes():
    notes = Note.query.order_by(Note.updated_at.desc()).all()
    return jsonify([{
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'created_at': note.created_at.isoformat(),
        'updated_at': note.updated_at.isoformat()
    } for note in notes])

@app.route('/api/notes', methods=['POST'])
def create_note():
    data = request.json
    note = Note(
        title=data['title'],
        content=data['content']
    )
    db.session.add(note)
    db.session.commit()
    return jsonify({
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'created_at': note.created_at.isoformat(),
        'updated_at': note.updated_at.isoformat()
    }), 201

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    note = Note.query.get_or_404(note_id)
    data = request.json
    note.title = data['title']
    note.content = data['content']
    db.session.commit()
    return jsonify({
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'created_at': note.created_at.isoformat(),
        'updated_at': note.updated_at.isoformat()
    })

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    note = Note.query.get_or_404(note_id)
    db.session.delete(note)
    db.session.commit()
    return '', 204

@app.route('/api/search')
def search_notes():
    query = request.args.get('q', '')
    notes = Note.query.filter(
        (Note.title.ilike(f'%{query}%')) | 
        (Note.content.ilike(f'%{query}%'))
    ).order_by(Note.updated_at.desc()).all()
    return jsonify([{
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'created_at': note.created_at.isoformat(),
        'updated_at': note.updated_at.isoformat()
    } for note in notes])

if __name__ == '__main__':
    app.run(debug=True) 