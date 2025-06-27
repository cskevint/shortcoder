import { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Stack } from '@mui/material';
import { Content } from '@/lib/supabase';

interface ContentFormProps {
  initialData?: Content;
  onSubmit: (title: string, content: string) => Promise<void>;
  isLoading?: boolean;
  showPreview?: boolean;
  onPreview?: () => void;
}

export default function ContentForm({
  initialData,
  onSubmit,
  isLoading = false,
  showPreview = false,
  onPreview,
}: ContentFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(title, content);
  };

  // Helper to insert text at the cursor position in the textarea
  const insertAtCursor = (insertText: string) => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    setContent(before + insertText + after);
    // Move cursor to inside the inserted tag if possible
    setTimeout(() => {
      textarea.focus();
      const cursorPos = before.length + insertText.indexOf(']') + 1;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          disabled={isLoading}
        />
        {/* Toolbar */}
        <Box display="flex" gap={1} mb={1}>
          <Button size="small" variant="outlined" onClick={() => insertAtCursor('<b></b>')} disabled={isLoading}>B</Button>
          <Button size="small" variant="outlined" onClick={() => insertAtCursor('<i></i>')} disabled={isLoading}>I</Button>
          <Button size="small" variant="outlined" onClick={() => insertAtCursor('<u></u>')} disabled={isLoading}>U</Button>
          <Button size="small" variant="outlined" onClick={() => insertAtCursor('<p></p>')} disabled={isLoading}>Paragraph</Button>
          <Button size="small" variant="outlined" onClick={() => insertAtCursor('[blockquote color="yellow"][/blockquote]')} disabled={isLoading}>Blockquote</Button>
          <Button size="small" variant="outlined" onClick={() => insertAtCursor('[list][list-item icon=""][/list-item][/list]')} disabled={isLoading}>List</Button>
          <Button size="small" variant="outlined" onClick={() => insertAtCursor('[collapsible title=""][/collapsible]')} disabled={isLoading}>Collapsible</Button>
        </Box>
        <TextField
          id="content-textarea"
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          required
          multiline
          rows={10}
          disabled={isLoading}
        />
        <Box display="flex" gap={2} justifyContent="flex-end">
          {showPreview && onPreview && (
            <Button
              variant="outlined"
              onClick={onPreview}
              disabled={isLoading}
            >
              Preview
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {initialData ? 'Save' : 'Create'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
