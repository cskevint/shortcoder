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
        <TextField
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
