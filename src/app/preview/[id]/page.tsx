'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { Typography, Paper, Skeleton, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { Content, getContentById } from '@/lib/supabase';
import { postprocessContent } from '@/lib/contentPostprocess';

export default function PreviewContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = React.use(params);

  useEffect(() => {
    loadContent();
  }, [id]);

  const loadContent = async () => {
    try {
      const data = await getContentById(id);
      setContent(data);
    } catch (error) {
      enqueueSnackbar('Failed to load content', { variant: 'error' });
      router.push('/');
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
        {content.title}
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box
          whiteSpace="pre-wrap"
          dangerouslySetInnerHTML={{ __html: postprocessContent(content.content) }}
        />
      </Paper>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <button
          type="button"
          onClick={() => router.push(`/edit/${id}`)}
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: '8px 24px',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Edit
        </button>
      </Box>
    </>
  );
}
