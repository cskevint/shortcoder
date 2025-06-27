"use client";

import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { Content, getContentById, updateContent } from "@/lib/supabase";
import ContentForm from "@/components/ContentForm";
import { postprocessContent } from "@/lib/contentPostprocess";
import MUIIconHydrator from "@/components/MUIIconHydrator.client";

export default function LivePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewContent, setPreviewContent] = useState<string>("");
  const { id } = React.use(params);

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadContent = async () => {
    try {
      const data = await getContentById(id);
      setContent(data);
      setPreviewContent(data.content);
    } catch {
      enqueueSnackbar("Failed to load content", { variant: "error" });
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (title: string, contentValue: string) => {
    setIsLoading(true);
    try {
      await updateContent(id, title, contentValue);
      enqueueSnackbar("Content updated successfully", { variant: "success" });
      setPreviewContent(contentValue);
    } catch {
      enqueueSnackbar("Failed to update content", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box display="flex" width="100vw" minHeight="80vh" gap={2} position="fixed" left={0} top={0} right={0} bottom={0} sx={{ bgcolor: 'background.default', zIndex: 1, p: 2 }}>
        {/* Left: Editor */}
        <Box flex={1} minWidth={0}>
          <Typography variant="h5" mb={2}>
            Edit Content
          </Typography>
          {content && (
            <ContentForm
              initialData={content}
              onSubmit={handleSave}
              isLoading={isLoading}
              showPreview={false}
            />
          )}
        </Box>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        {/* Right: Live Preview */}
        <Box flex={1} minWidth={0}>
          <Typography variant="h5" mb={2}>
            Live Preview
          </Typography>
          <MUIIconHydrator>
            <Paper sx={{ p: 3, minHeight: 200 }}>
              <Box
                dangerouslySetInnerHTML={{ __html: postprocessContent(previewContent) }}
              />
            </Paper>
          </MUIIconHydrator>
        </Box>
      </Box>
      {/* Static Pi character bottom left */}
      <Box
        component="a"
        href="/"
        sx={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 2000,
          cursor: 'pointer',
          fontSize: 36,
          color: 'primary.main',
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'transform 0.1s',
          '&:hover': { transform: 'scale(1.15)', color: 'secondary.main' },
        }}
        aria-label="Go to Home"
      >
        π
      </Box>
    </>
  );
}
