import { HealthAssistantForm } from './form';

export default function HealthAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Assistant Santé</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Décrivez vos symptômes et obtenez une analyse complète, des recommandations de spécialistes et des articles pertinents en une seule étape.
      </p>
      <HealthAssistantForm />
    </div>
  );
}
