import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TemplateCustomizationPage as CustomizationPage } from '../components/template-components/template-customization-page';
import { toast } from 'sonner';
import { getTemplateById } from '../data/templates';

export function TemplateCustomizePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const template = getTemplateById(id || '');

  if (!template) {
    toast.error('Template not found');
    navigate('/templates');
    return null;
  }

  const handleBack = () => {
    navigate('/templates');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <CustomizationPage templateId={template.id} onBack={handleBack} />
      <Footer />
    </div>
  );
}
