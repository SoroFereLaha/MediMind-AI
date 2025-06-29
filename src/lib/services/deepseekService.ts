import { ai } from '@/ai/genkit';

// Interface for the drug summary data structure
export interface DrugSummary {
  nom: string;
  indication: string;
  posologie_adulte: string;
  effets_secondaires: string;
  contre_indications: string;
  avertissements: string;
}

// Interface for AI completion response
interface AICompletion {
  text: string;
}

/**
 * Summarizes FDA drug information using AI
 * @param rawFdaText Raw FDA text to summarize
 * @param options Optional patient information for context
 * @returns Promise resolving to a DrugSummary or null if an error occurs
 */
export async function summarizeDrugInfoWithLLM(
  rawFdaText: string,
  options?: {
    age?: number;
    sexe?: string;
    allergies?: string;
    currentMedications?: string;
  }
): Promise<DrugSummary | null> {
  // Build patient information string if options are provided
  let patientInfo = '';
  if (options) {
    const infos: string[] = [];
    if (options.age) infos.push(`Âge du patient : ${options.age}`);
    if (options.sexe) infos.push(`Sexe du patient : ${options.sexe}`);
    if (options.allergies) infos.push(`Allergies connues : ${options.allergies}`);
    if (options.currentMedications) infos.push(`Médicaments actuels : ${options.currentMedications}`);
    patientInfo = infos.length > 0
      ? '\n\nInformations patient à prendre en compte pour adapter le résumé :\n' + infos.join(' ; ')
      : '';
  }

  // Construct the prompt for the AI
  const prompt = `Tu es un assistant médical. À partir de la fiche brute OpenFDA suivante (en anglais), extrais et traduis en français uniquement les informations suivantes :\n- Nom du médicament\n- Indication(s)\n- Posologie adulte (si disponible, adapte-la à l'âge/au sexe du patient si pertinent)\n- Effets secondaires majeurs\n- Contre-indications principales (adapte-les selon l'âge, le sexe, les allergies et les médicaments actuels du patient si possible)\n- Avertissements importants\n\nFormate la réponse STRICTEMENT en JSON, sans texte avant ni après, ni commentaire, ni retour à la ligne inutile :\n{\n  \"nom\": \"...\",\n  \"indication\": \"...\",\n  \"posologie_adulte\": \"...\",\n  \"effets_secondaires\": \"...\",\n  \"contre_indications\": \"...\",\n  \"avertissements\": \"...\"\n}\nRéponds UNIQUEMENT avec ce JSON, même si certains champs sont vides. N'ajoute rien d'autre, pas de phrase d'intro, pas de commentaire, pas d'explication, pas de texte autour. N'utilise JAMAIS de balises markdown (pas de trois backticks), ni de coloration syntaxique, ni de texte autour. Réponds strictement en français.${patientInfo}\n\nFiche OpenFDA :\n${rawFdaText}`;

  try {
    // Call the AI service with proper configuration
    const completion: AICompletion = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      config: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
      prompt: {
        text: prompt,
      },
    });

    // Check for valid response
    if (!completion?.text) {
      console.error('Aucune réponse du service AI');
      return null;
    }

    // Nettoyage : enlève les balises markdown éventuelles autour du JSON
    let aiText = completion.text.trim();
    if (aiText.startsWith('```')) {
      aiText = aiText.replace(/^```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
    }
    const match = aiText.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error('Aucun JSON trouvé dans la réponse AI. Réponse brute Gemini :', completion.text);
      return null;
    }

    // Parse the JSON response
    let summary: DrugSummary;
    try {
      summary = JSON.parse(match[0]);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      return null;
    }

    // Validate required fields
    if (!summary.nom || !summary.indication) {
      console.error('Champs requis manquants dans la réponse');
      return null;
    }

    // Ensure all required fields have values
    return {
      nom: summary.nom || 'Non spécifié',
      indication: summary.indication || 'Non spécifiée',
      posologie_adulte: summary.posologie_adulte || 'Non spécifiée',
      effets_secondaires: summary.effets_secondaires || 'Aucun effet secondaire majeur rapporté',
      contre_indications: summary.contre_indications || 'Aucune contre-indication majeure rapportée',
      avertissements: summary.avertissements || 'Aucun avertissement supplémentaire',
    };
  } catch (err) {
    console.error('Erreur lors de la génération du résumé:', err);
    return null;
  }
}
