'use server';

import { z } from 'zod';
import { findDoctorBySymptoms } from '@/ai/flows/ai-find-doctor-flow';
import { getRecommendationsForPatient } from '@/ai/flows/ai-recommendations-flow';

const healthAssistantSchema = z.object({
  symptoms: z.string().min(10),
  age: z.number().optional(),
  sex: z.enum(['male', 'female', 'other']).optional(),
  patientId: z.string().optional(), // Pour les recommandations
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export async function getUnifiedHealthAnalysis(input: unknown) {
  const validation = healthAssistantSchema.safeParse(input);

  if (!validation.success) {
    throw new Error('Invalid input: ' + validation.error.message);
  }

  const { symptoms, age, sex, patientId, latitude, longitude } = validation.data;

  try {
    // Exécuter les appels à l'IA en parallèle pour gagner du temps
    const [doctorAnalysis, recommendations] = await Promise.all([
      findDoctorBySymptoms({ symptoms, age, sex, latitude, longitude }),
      getRecommendationsForPatient({ symptoms }),
    ]);

    // Pour l'instant, nous n'avons pas d'analyse de symptômes dédiée, 
    // nous pouvons réutiliser une partie de l'analyse des médecins.
    const symptomAnalysis = {
        summary: `Basé sur vos symptômes, une consultation avec un spécialiste est recommandée. Voici quelques pistes.`,
        details: doctorAnalysis.symptomAnalysis
    };

    return {
      symptomAnalysis,
      recommendedDoctors: doctorAnalysis.recommendedDoctors,
      recommendedArticles: recommendations,
    };

  } catch (error) {
    console.error('Error in unified health analysis:', error);
    // Gérer l'erreur de manière appropriée pour l'UI
    return { error: 'Une erreur est survenue lors de l\'analyse. Veuillez réessayer.' };
  }
}
