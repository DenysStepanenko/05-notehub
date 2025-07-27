import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { CreateNoteData, NoteTag } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onSubmit: (noteData: CreateNoteData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content must be at most 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

const initialValues: CreateNoteData = {
  title: '',
  content: '',
  tag: 'Todo' as NoteTag,
};

const NoteForm = ({ onSubmit, onCancel, isSubmitting }: NoteFormProps) => {
  const handleSubmit = (values: CreateNoteData) => {
    onSubmit(values);
  };

  const tagOptions = [
    { value: 'Todo', label: '📝 Todo', color: '#ef4444' },
    { value: 'Work', label: '💼 Work', color: '#3b82f6' },
    { value: 'Personal', label: '👤 Personal', color: '#10b981' },
    { value: 'Meeting', label: '🤝 Meeting', color: '#f59e0b' },
    { value: 'Shopping', label: '🛒 Shopping', color: '#8b5cf6' },
  ];

  return (
    <div className={css.container}>
      <h2 className={css.title}>Create New Note</h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title" className={css.label}>
                Title *
              </label>
              <Field
                id="title"
                name="title"
                type="text"
                className={`${css.input} ${errors.title && touched.title ? css.inputError : ''}`}
                placeholder="Enter note title..."
              />
              <ErrorMessage name="title" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content" className={css.label}>
                Content
              </label>
              <Field
                id="content"
                name="content"
                as="textarea"
                rows={6}
                className={`${css.textarea} ${errors.content && touched.content ? css.inputError : ''}`}
                placeholder="Write your note content here..."
              />
              <ErrorMessage name="content" component="span" className={css.error} />
              <div className={css.charCount}>
                {values.content.length}/500 characters
              </div>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag" className={css.label}>
                Category *
              </label>
              <Field
                id="tag"
                name="tag"
                as="select"
                className={`${css.select} ${errors.tag && touched.tag ? css.inputError : ''}`}
              >
                {tagOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button 
                type="button" 
                className={css.cancelButton}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={css.spinner}></span>
                    Creating...
                  </>
                ) : (
                  '✨ Create Note'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NoteForm;