import { useState, useEffect } from 'react';

interface DraftData {
  templateId: string;
  customization: any;
  lastSaved: string;
}

/**
 * Hook to persist and restore draft customizations
 */
export function useDraftPersistence(key: string) {
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveDraft = (data: any) => {
    try {
      const draft: DraftData = {
        templateId: data.templateId,
        customization: data.customization,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(`draft_${key}`, JSON.stringify(draft));
      setLastSaved(new Date());
      setIsDraftSaving(false);
      console.log('💾 Draft saved:', key);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const loadDraft = (): DraftData | null => {
    try {
      const saved = localStorage.getItem(`draft_${key}`);
      if (saved) {
        const draft = JSON.parse(saved);
        console.log('📂 Draft loaded:', key);
        return draft;
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return null;
  };

  const clearDraft = () => {
    localStorage.removeItem(`draft_${key}`);
    setLastSaved(null);
    console.log('🗑️ Draft cleared:', key);
  };

  const autoSave = (data: any, delay: number = 2000) => {
    setIsDraftSaving(true);
    const timer = setTimeout(() => saveDraft(data), delay);
    return () => clearTimeout(timer);
  };

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    autoSave,
    isDraftSaving,
    lastSaved,
  };
}

/**
 * Hook to detect unsaved changes
 */
export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return { hasUnsavedChanges, setHasUnsavedChanges };
}
