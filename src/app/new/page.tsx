'use client';

import { useState } from 'react';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import ContentForm from '@/components/ContentForm';
import { createContent } from '@/lib/supabase';

export default function NewContentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (title: string, content: string) => {
    setIsLoading(true);
    try {
      const newContent = await createContent(title, content);
      enqueueSnackbar('Content created successfully', { variant: 'success' });
      router.push(`/edit/${newContent.id}`);
    } catch {
      enqueueSnackbar('Failed to create content', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Content
      </Typography>
      <ContentForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
