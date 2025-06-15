// This is an auto-generated file from Firebase Studio.

'use server';
/**
 * @fileOverview Flow pour aider à trouver un médecin basé sur les symptômes.
 *
 * - findDoctorBySymptoms - Fonction principale pour obtenir des suggestions de spécialités et des médecins.
 * - FindDoctorBySymptomsInput - Type d'entrée.
 * - FindDoctorBySymptomsOutput - Type de sortie.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  // Pourrait être étendu avec d'autres infos : horaires, assurances acceptées, etc.
});

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
      'Liste de médecins simulés correspondant à la spécialité suggérée. Sera remplacé par une vraie recherche plus tard.'
    ),
  searchNote: z.string().describe('Note expliquant que les médecins listés sont des exemples simulés pour l"instant.')
});
export type FindDoctorBySymptomsOutput = z.infer<
  typeof FindDoctorBySymptomsOutputSchema
>;

export async function findDoctorBySymptoms(
  input: FindDoctorBySymptomsInput
): Promise<FindDoctorBySymptomsOutput> {
  return findDoctorFlow(input);
}

// TODO: Remplacer ceci par une vraie recherche de médecins, potentiellement via un Tool Genkit lisant un CSV ou une base de données.
function getSimulatedDoctors(specialty: string, postalCode?: string): z.infer<typeof DoctorSchema>[] {
  const allDoctors = [
    { name: 'Dr. Jeanne Martin', specialty: 'Médecine Générale', address: '12 Rue de la Paix, 75002 Paris', phone: '01 23 45 67 89' },
    { name: 'Dr. Paul Durand', specialty: 'Cardiologie', address: '45 Avenue des Champs, 75008 Paris', phone: '01 98 76 54 32' },
    { name: 'Dr. Sophie Bernard', specialty: 'Dermatologie', address: '3 Boulevard Saint-Germain, 75005 Paris', phone: '01 12 23 34 45' },
    { name: 'Dr. Luc Moreau', specialty: 'Pédiatrie', address: '7 Rue de Rivoli, 75001 Paris', phone: '01 56 67 78 89' },
    { name: 'Dr. Émilie Petit', specialty: 'Médecine Générale', address: '101 Rue Oberkampf, 75011 Paris', phone: '01 34 45 56 67' },
    { name: 'Dr. Antoine Dubois', specialty: 'Cardiologie', address: '22 Place Vendôme, 75001 Paris', phone: '01 78 89 90 01' },
    { name: 'Dr. Marie Leclerc', specialty: 'Gastro-entérologie', address: '55 Quai de Valmy, 75010 Paris', phone: '01 21 32 43 54' },
  ];

  let filteredDoctors = allDoctors.filter(doc => 
    doc.specialty.toLowerCase().includes(specialty.toLowerCase())
  );

  // Simulation très basique de filtrage par code postal si fourni
  if (postalCode && filteredDoctors.length > 0) {
     // Pour la démo, on s'assure qu'au moins un médecin correspond si un code postal est donné
     // et que la spécialité correspond.
     // Dans une vraie appli, ce serait un vrai filtre.
     if (!filteredDoctors.find(doc => doc.address.includes(postalCode))) {
        // Si aucun ne correspond au CP exact, on en prend un au hasard de la bonne spécialité
        // et on fait comme si son CP correspondait pour la démo.
        const randomDocInSpecialty = filteredDoctors[Math.floor(Math.random() * filteredDoctors.length)];
        // On pourrait modifier l'adresse pour inclure le CP pour la démo, mais on va juste les retourner
     }
     // Pour l'instant, ne filtre pas réellement par code postal pour les données simulées
     // pour toujours avoir des résultats si la spécialité correspond.
  }


  return filteredDoctors.length > 0 ? filteredDoctors.slice(0, 3) : 
         allDoctors.filter(doc => doc.specialty === 'Médecine Générale').slice(0,2); // Fallback si la spécialité n'est pas trouvée
}

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
  },
  async (input) => {
    const {output} = await prompt(input);

    if (!output?.suggestedSpecialty) {
      // Fallback si l'IA ne retourne pas de spécialité
      return {
        suggestedSpecialty: 'Médecine Générale',
        reasoning: 'Les informations fournies n"ont pas permis de déterminer une spécialité spécifique. Un médecin généraliste est un bon point de départ pour évaluer vos symptômes.',
        doctors: getSimulatedDoctors('Médecine Générale', input.postalCode),
        searchNote: 'Note : Les médecins listés ci-dessous sont des exemples simulés. Cette fonctionnalité sera bientôt connectée à une vraie base de données.'
      };
    }
    
    const simulatedDoctors = getSimulatedDoctors(output.suggestedSpecialty, input.postalCode);

    return {
      suggestedSpecialty: output.suggestedSpecialty,
      reasoning: output.reasoning,
      doctors: simulatedDoctors,
      searchNote: 'Note : Les médecins listés ci-dessous sont des exemples simulés pour illustrer la fonctionnalité. Une recherche réelle dans une base de données de médecins sera implémentée prochainement.'
    };
  }
);
    
