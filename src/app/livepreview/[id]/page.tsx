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
  }, [id]);

  const loadContent = async () => {
    try {
      const data = await getContentById(id);
      setContent(data);
      setPreviewContent(data.content);
    } catch (error) {
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
    } catch (error) {
      enqueueSnackbar("Failed to update content", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (title: string, contentValue: string) => {
    setPreviewContent(contentValue);
  };

  return (
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
  );
}
