import { useState, useEffect, useCallback } from 'react';

interface Template {
  id: number;
  name: string;
  description?: string;
  template_data?: any;
  created_at?: string;
}

export const useTemplateRefresh = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/labels/custom-templates');
      if (response.ok) {
        const data = await response.json();
        const templatesArray = data.data || data.templates || data || [];
        
        // Check if count changed
        if (templatesArray.length !== lastCount) {
          console.log(`📊 Template count changed: ${lastCount} → ${templatesArray.length}`);
          setLastCount(templatesArray.length);
        }
        
        setTemplates(templatesArray);
        return templatesArray;
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
    return [];
  }, [lastCount]);

  // Initial fetch
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Polling mechanism - check every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTemplates();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchTemplates]);

  const refresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    return fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    refresh,
    templateCount: templates.length
  };
};