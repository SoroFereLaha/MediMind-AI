// This is an auto-generated file from Firebase Studio.

'use server';
/**
 * @fileOverview Flow pour aider à trouver un médecin basé sur les symptômes et un fichier CSV local.
 *
 * - findDoctorBySymptoms - Fonction principale pour obtenir des suggestions de spécialités et des médecins.
 * - FindDoctorBySymptomsInput - Type d'entrée.
 * - FindDoctorBySymptomsOutput - Type de sortie.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import fs from 'fs';
import path from 'path';

const FindDoctorBySymptomsInputSchema = z.object({
  symptoms: z.string().describe('Les symptômes décrits par l"utilisateur.'),
  age: z.number().optional().describe('L"âge de l"utilisateur (optionnel).'),
  sex: z.string().optional().describe('Le sexe de l"utilisateur (optionnel, ex: "Masculin", "Féminin").'),
  postalCode: z.string().optional().describe('Le code postal de l"utilisateur pour affiner la recherche (optionnel).'),
});
export type FindDoctorBySymptomsInput = z.infer<
  typeof FindDoctorBySymptomsInputSchema
>;

const DoctorSchema = z.object({
  name: z.string().describe('Nom complet du médecin.'),
  specialty: z.string().describe('Spécialité du médecin.'),
  address: z.string().describe('Adresse du cabinet du médecin.'),
  phone: z.string().optional().describe('Numéro de téléphone du cabinet.'),
  // postal_code n'est pas inclus dans le schéma de sortie affiché à l'utilisateur, mais utilisé pour le filtrage
});
export type Doctor = z.infer<typeof DoctorSchema>;

const FindDoctorBySymptomsOutputSchema = z.object({
  suggestedSpecialty: z
    .string()
    .describe('La spécialité médicale la plus pertinente suggérée par l"IA basée sur les symptômes.'),
  reasoning: z
    .string()
    .describe('Explication concise de la raison pour laquelle cette spécialité est suggérée.'),
  doctors: z
    .array(DoctorSchema)
    .describe(
      'Liste de médecins trouvés dans la source de données locale correspondant à la spécialité suggérée et au code postal fourni.'
    ),
  searchNote: z.string().describe('Note expliquant l"origine des données des médecins et les limites éventuelles de la recherche.')
});
export type FindDoctorBySymptomsOutput = z.infer<
  typeof FindDoctorBySymptomsOutputSchema
>;

export async function findDoctorBySymptoms(
  input: FindDoctorBySymptomsInput
): Promise<FindDoctorBySymptomsOutput> {
  return findDoctorFlow(input);
}

const getDoctorsFromCSVTool = ai.defineTool(
  {
    name: 'getDoctorsFromCSV',
    description: 'Récupère une liste de médecins depuis un fichier CSV local, filtrée par spécialité et code postal.',
    inputSchema: z.object({
      specialty: z.string().describe('Spécialité médicale à rechercher.'),
      postalCode: z.string().optional().describe('Code postal pour affiner la recherche.'),
    }),
    outputSchema: z.array(DoctorSchema),
  },
  async ({ specialty, postalCode }) => {
    const doctorsFilePath = path.join(process.cwd(), 'src', 'data', 'doctors.csv');
    const defaultDoctors: Doctor[] = [ // Utilisé en cas d'erreur de lecture du CSV ou si aucun médecin n'est trouvé.
        { name: 'Dr. Jeanne Martin (Fallback)', specialty: 'Médecine Générale', address: '12 Rue de la Paix, 75002 Paris', phone: '01 23 45 67 89' },
        { name: 'Dr. Paul Durand (Fallback)', specialty: 'Cardiologie', address: '45 Avenue des Champs, 75008 Paris', phone: '01 98 76 54 32' },
    ];

    try {
      if (!fs.existsSync(doctorsFilePath)) {
        console.warn(`Fichier doctors.csv non trouvé à l'emplacement: ${doctorsFilePath}. Utilisation des données de secours.`);
        return defaultDoctors.filter(doc => doc.specialty.toLowerCase().includes(specialty.toLowerCase()));
      }

      const fileContent = fs.readFileSync(doctorsFilePath, 'utf-8');
      const rows = fileContent.split('\n').slice(1); // Ignorer l'en-tête
      const doctors: Doctor[] = [];

      for (const row of rows) {
        const columns = row.split(',');
        if (columns.length >= 5) { // S'assurer qu'on a au moins les colonnes attendues
          const doctorPostalCode = columns[4]?.trim();
          const doctorSpecialty = columns[1]?.trim();

          const specialtyMatch = doctorSpecialty.toLowerCase().includes(specialty.toLowerCase());
          const postalCodeMatch = !postalCode || (doctorPostalCode && doctorPostalCode === postalCode);
          
          if (specialtyMatch && postalCodeMatch) {
            doctors.push({
              name: columns[0]?.trim() || 'N/A',
              specialty: doctorSpecialty || 'N/A',
              address: columns[2]?.trim() || 'N/A',
              phone: columns[3]?.trim() || undefined,
            });
          }
        }
      }
      return doctors.length > 0 ? doctors.slice(0, 5) : []; // Limiter à 5 résultats pour la démo
    } catch (error) {
      console.error('Erreur lors de la lecture ou du parsing du fichier CSV des médecins:', error);
      // Retourner une liste filtrée de médecins par défaut en cas d'erreur majeure
       return defaultDoctors.filter(doc => doc.specialty.toLowerCase().includes(specialty.toLowerCase()));
    }
  }
);


const prompt = ai.definePrompt({
  name: 'findDoctorPrompt',
  input: {schema: FindDoctorBySymptomsInputSchema},
  output: {schema: z.object({
    suggestedSpecialty: FindDoctorBySymptomsOutputSchema.shape.suggestedSpecialty,
    reasoning: FindDoctorBySymptomsOutputSchema.shape.reasoning,
  })},
  prompt: `
  Un utilisateur présente les informations suivantes :
  Symptômes : {{{symptoms}}}
  {{#if age}}Âge : {{{age}}} ans{{/if}}
  {{#if sex}}Sexe : {{{sex}}}{{/if}}
  {{#if postalCode}}Code Postal : {{{postalCode}}}{{/if}}

  Votre rôle est d'agir comme un assistant d'orientation médicale.
  1. Basé sur les symptômes, l'âge (si fourni) et le sexe (si fourni), déterminez la spécialité médicale la plus pertinente à consulter.
     Si les symptômes sont vagues ou multiples, la médecine générale est souvent un bon point de départ.
  2. Fournissez une explication concise (1-2 phrases) de la raison pour laquelle cette spécialité est suggérée.
  3. Ne fournissez PAS de diagnostic, seulement une suggestion de spécialité.

  Assurez-vous que la sortie est structurée comme demandé.
  Par exemple, si les symptômes sont "mal de gorge et fièvre", une bonne suggestion serait "Médecine Générale" avec un raisonnement comme "Un médecin généraliste peut évaluer les symptômes courants comme le mal de gorge et la fièvre et orienter vers un spécialiste si nécessaire."
  Si les symptômes sont "douleur thoracique et essoufflement", suggérez "Cardiologie" ou "Pneumologie" si plus approprié, ou "Médecine Générale / Urgences" si cela semble critique, avec un raisonnement adapté.
  Soyez prudent si les symptômes semblent urgents, suggérez une consultation rapide.
  `,
});

const findDoctorFlow = ai.defineFlow(
  {
    name: 'findDoctorFlow',
    inputSchema: FindDoctorBySymptomsInputSchema,
    outputSchema: FindDoctorBySymptomsOutputSchema,
    tools: [getDoctorsFromCSVTool], // Rendre le tool disponible pour le flow (même si pas appelé directement par le LLM ici)
  },
  async (input) => {
    const {output: llmOutput} = await prompt(input);

    let suggestedSpecialty = 'Médecine Générale';
    let reasoning = 'Les informations fournies n"ont pas permis de déterminer une spécialité spécifique. Un médecin généraliste est un bon point de départ pour évaluer vos symptômes.';
    let searchNote = 'Note : Les médecins listés ci-dessous proviennent d"une source de données locale (fichier CSV). Assurez-vous que ce fichier est à jour et correctement formaté. Si aucun médecin n"est trouvé, essayez d"élargir vos critères ou de vérifier la source de données.';

    if (llmOutput?.suggestedSpecialty) {
      suggestedSpecialty = llmOutput.suggestedSpecialty;
      reasoning = llmOutput.reasoning;
    }
    
    // Appel du Tool pour récupérer les médecins du CSV
    const doctorsFromCSV = await getDoctorsFromCSVTool({
      specialty: suggestedSpecialty,
      postalCode: input.postalCode,
    });
    
    if (doctorsFromCSV.length === 0 && suggestedSpecialty !== 'Médecine Générale') {
        // Si aucun médecin n'est trouvé pour la spécialité suggérée (et ce n'est pas déjà MG),
        // essayer de chercher des médecins généralistes comme fallback.
        const generalPractitioners = await getDoctorsFromCSVTool({
            specialty: 'Médecine Générale',
            postalCode: input.postalCode,
        });
        if (generalPractitioners.length > 0) {
            searchNote += ' Aucun médecin trouvé pour la spécialité suggérée, affichage des médecins généralistes disponibles.';
            return {
                suggestedSpecialty: 'Médecine Générale (Fallback)',
                reasoning: `Aucun médecin trouvé pour "${suggestedSpecialty}" avec les critères fournis. Voici des médecins généralistes qui pourraient vous orienter. Raison initiale pour "${suggestedSpecialty}": ${reasoning}`,
                doctors: generalPractitioners,
                searchNote,
            };
        }
    }


    return {
      suggestedSpecialty,
      reasoning,
      doctors: doctorsFromCSV,
      searchNote
    };
  }
);
    
