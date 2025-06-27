'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Skeleton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import ContentForm from '@/components/ContentForm';
import { Content, getContentById, updateContent } from '@/lib/supabase';

export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = React.use(params);

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadContent = async () => {
    try {
      const data = await getContentById(id);
      setContent(data);
    } catch {
      enqueueSnackbar('Failed to load content', { variant: 'error' });
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (title: string, content: string) => {
    setIsLoading(true);
    try {
      await updateContent(id, title, content);
      enqueueSnackbar('Content updated successfully', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to update content', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Skeleton width={200} height={40} />
        <Skeleton height={400} sx={{ mt: 2 }} />
      </>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Content
      </Typography>
      <ContentForm
        initialData={content}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        showPreview
        onPreview={() => router.push(`/preview/${id}`)}
      />
    </>
  );
}
