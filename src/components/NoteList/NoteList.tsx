import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
  isDeleting: boolean;
}

const NoteList = ({ notes, onDeleteNote, isDeleting }: NoteListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTagColor = (tag: string) => {
    const colors = {
      Todo: '#ef4444',
      Work: '#3b82f6',
      Personal: '#10b981',
      Meeting: '#f59e0b',
      Shopping: '#8b5cf6'
    };
    return colors[tag as keyof typeof colors] || '#6b7280';
  };

  const getTagEmoji = (tag: string) => {
    const emojis = {
      Todo: '📝',
      Work: '💼',
      Personal: '👤',
      Meeting: '🤝',
      Shopping: '🛒'
    };
    return emojis[tag as keyof typeof emojis] || '📄';
  };

  const handleDeleteClick = (noteId: string, noteTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${noteTitle}"?`)) {
      onDeleteNote(noteId);
    }
  };

  return (
    <div className={css.grid}>
      {notes.map((note) => (
        <article key={note.id} className={css.card}>
          <div className={css.cardHeader}>
            <h2 className={css.title}>{note.title}</h2>
            <span 
              className={css.tag}
              style={{ backgroundColor: getTagColor(note.tag) }}
            >
              {getTagEmoji(note.tag)} {note.tag}
            </span>
          </div>
          
          <div className={css.content}>
            <p className={css.text}>
              {note.content || 'No content'}
            </p>
          </div>
          
          <div className={css.cardFooter}>
            <time className={css.date} dateTime={note.createdAt}>
              {formatDate(note.createdAt)}
            </time>
            <button 
              className={css.deleteButton}
              onClick={() => handleDeleteClick(note.id, note.title)}
              disabled={isDeleting}
              aria-label={`Delete note: ${note.title}`}
              type="button"
            >
              {isDeleting ? '⏳' : '🗑️'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default NoteList;