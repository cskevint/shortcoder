'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Skeleton,
  Stack
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { Content, getAllContent } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

export default function HomePage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadContents = async () => {
    try {
      const data = await getAllContent();
      setContents(data);
    } catch (error) {
      enqueueSnackbar('Failed to load content', { variant: 'error' });
      console.error('Error loading contents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Stack spacing={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Skeleton width={200} height={40} />
          <Skeleton width={100} height={40} />
        </Box>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={200} />
        ))}
      </Stack>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Content Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/new')}
        >
          Create New
        </Button>
      </Box>

      <Stack spacing={2}>
        {contents.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No content available. Create your first piece of content!
          </Typography>
        ) : (
          contents.map((content) => (
            <Card key={content.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {content.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created {formatDistanceToNow(new Date(content.created_at))} ago
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => router.push(`/edit/${content.id}`)}>
                  Edit
                </Button>
                <Button size="small" onClick={() => router.push(`/preview/${content.id}`)}>
                  Preview
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Stack>
    </>
  );
}
