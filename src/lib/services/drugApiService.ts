// Service pour interroger OpenFDA Drug API et faire le mapping FR -> EN des symptômes courants
import type { DrugSummary } from './deepseekService';
import { ExtractedSymptom, OpenFDAResponse } from './types/drug-api-types';

const symptomFrToEn: Record<string, string> = {
  // Symptômes généraux supplémentaires
  'perte de connaissance': 'loss of consciousness',
  'inconscience': 'unconsciousness',
  'difficulté à marcher': 'difficulty walking',
  'chute': 'fall',
  'intolérance à la chaleur': 'heat intolerance',
  'intolérance au froid': 'cold intolerance',

  // Neurologique / psychiatrique
  'ralentissement psychomoteur': 'psychomotor retardation',
  'trouble de l\'équilibre': 'balance disorder',
  'trouble cognitif': 'cognitive impairment',
  'trouble de la coordination': 'coordination disorder',
  'hallucination visuelle': 'visual hallucination',
  'hallucination auditive': 'auditory hallucination',

  // Hématologique / immunitaire
  'purpura': 'purpura',
  'pétéchie': 'petechiae',
  'hématome': 'hematoma',
  'fièvre inexpliquée': 'unexplained fever',
  'perte de sang': 'blood loss',

  // Médicamenteux / iatrogènes
  'effet secondaire': 'side effect',
  'réaction allergique': 'allergic reaction',
  'intolérance médicamenteuse': 'drug intolerance',
  'surdosage': 'overdose',
  'sevrage': 'withdrawal',

  // Symptômes atypiques ou systémiques
  'trouble immunitaire': 'immune disorder',
  'trouble métabolique': 'metabolic disorder',
  'trouble endocrinien': 'endocrine disorder',
  'trouble hépatique': 'liver disorder',
  'trouble rénal': 'kidney disorder',
  // Symptômes généraux (existant + nouveaux)
  'fièvre': 'fever',
  'douleur': 'pain',
  'toux': 'cough',
  'maux de tête': 'headache',
  'mal de tête': 'headache',
  'rhume': 'cold',
  'allergie': 'allergy',
  'diarrhée': 'diarrhea',
  'nausée': 'nausea',
  'vomissement': 'vomiting',
  'fatigue': 'fatigue',
  'gorge': 'throat',
  'asthme': 'asthma',
  'eczéma': 'eczema',
  'démangeaison': 'itching',
  'constipation': 'constipation',
  'vertige': 'dizziness',
  'brûlure': 'burn',
  'frissons': 'chills',
  'perte de poids': 'weight loss',
  'prise de poids': 'weight gain',
  'soif excessive': 'excessive thirst',
  'faim excessive': 'excessive hunger',
  'transpiration excessive': 'excessive sweating',
  'bouche sèche': 'dry mouth',
  'halitose': 'bad breath',
  'oedème': 'edema',
  'lymphedème': 'lymphedema',
  // Douleurs spécifiques (complété)
  'mal de dos': 'back pain',
  'douleur abdominale': 'abdominal pain',
  'douleur thoracique': 'chest pain',
  'douleur musculaire': 'muscle pain',
  'douleur articulaire': 'joint pain',
  'crampe': 'cramp',
  'spasme': 'spasm',
  'migraine': 'migraine',
  'douleur dentaire': 'toothache',
  'mal de ventre': 'stomach ache',
  'douleur pelvienne': 'pelvic pain',
  'douleur au cou': 'neck pain',
  'douleur aux épaules': 'shoulder pain',
  'douleur aux jambes': 'leg pain',
  'douleur aux pieds': 'foot pain',
  'douleur aux mains': 'hand pain',
  'douleur osseuse': 'bone pain',
  'douleur neuropathique': 'neuropathic pain',
  'douleur fantôme': 'phantom pain',
  // Symptômes respiratoires (complété)
  'essoufflement': 'shortness of breath',
  'difficulté à respirer': 'breathing difficulty',
  'respiration sifflante': 'wheezing',
  'congestion nasale': 'nasal congestion',
  'nez bouché': 'stuffy nose',
  'nez qui coule': 'runny nose',
  'éternuement': 'sneezing',
  'mal de gorge': 'sore throat',
  'gorge irritée': 'throat irritation',
  'enrouement': 'hoarseness',
  'expectoration': 'sputum',
  'crachats sanglants': 'bloody sputum',
  'toux sèche': 'dry cough',
  'toux grasse': 'productive cough',
  'toux chronique': 'chronic cough',
  'apnée': 'apnea',
  'hypoxie': 'hypoxia',
  'cyanose': 'cyanosis',
  // Symptômes digestifs (complété)
  'brûlures d\'estomac': 'heartburn',
  'remontées acides': 'acid reflux',
  'ballonnement': 'bloating',
  'gaz': 'gas',
  'indigestion': 'indigestion',
  'perte d\'appétit': 'loss of appetite',
  'selles molles': 'loose stools',
  'sang dans les selles': 'blood in stool',
  'difficulté à avaler': 'difficulty swallowing',
  'dysphagie': 'dysphagia',
  'reflux gastro-œsophagien': 'gastroesophageal reflux',
  'ulcère': 'ulcer',
  'hémorroïdes': 'hemorrhoids',
  'ictère': 'jaundice',
  'foie gras': 'fatty liver',
  'ascite': 'ascites',
  'hématémèse': 'hematemesis',
  'méléna': 'melena',
  // Symptômes cutanés (complété)
  'éruption cutanée': 'rash',
  'urticaire': 'hives',
  'acné': 'acne',
  'psoriasis': 'psoriasis',
  'dermatite': 'dermatitis',
  'peau sèche': 'dry skin',
  'rougeur': 'redness',
  'gonflement': 'swelling',
  'bleu': 'bruise',
  'coupure': 'cut',
  'plaie': 'wound',
  'ulcération': 'ulceration',
  'kératose': 'keratosis',
  'prurit': 'pruritus',
  'pustule': 'pustule',
  'vésicule': 'vesicle',
  'bulle': 'bulla',
  'nodule': 'nodule',
  'tache de naissance': 'birthmark',
  'angiome': 'angioma',
  'alopécie': 'alopecia',
  'pelade': 'alopecia areata',
  // Symptômes neurologiques (complété)
  'étourdissement': 'lightheadedness',
  'évanouissement': 'fainting',
  'convulsion': 'seizure',
  'engourdissement': 'numbness',
  'fourmillement': 'tingling',
  'perte de mémoire': 'memory loss',
  'confusion': 'confusion',
  'trouble de vision': 'vision problems',
  'vision floue': 'blurred vision',
  'acouphène': 'tinnitus',
  'tremblement': 'tremor',
  'tics': 'tics',
  'ataxie': 'ataxia',
  'aphasie': 'aphasia',
  'dysarthrie': 'dysarthria',
  'paralysie': 'paralysis',
  'parésie': 'paresis',
  'névralgie': 'neuralgia',
  'sciatique': 'sciatica',
  'neuropathie': 'neuropathy',
  'paresthésie': 'paresthesia',
  'syndrome des jambes sans repos': 'restless legs syndrome',
  // Symptômes cardiaques (complété)
  'palpitation': 'palpitations',
  'rythme cardiaque irrégulier': 'irregular heartbeat',
  'battement de cœur rapide': 'rapid heartbeat',
  'hypertension': 'high blood pressure',
  'hypotension': 'low blood pressure',
  'angine de poitrine': 'angina',
  'infarctus': 'heart attack',
  'arythmie': 'arrhythmia',
  'tachycardie': 'tachycardia',
  'bradycardie': 'bradycardia',
  'souffle cardiaque': 'heart murmur',
  'œdème pulmonaire': 'pulmonary edema',
  'thrombose': 'thrombosis',
  'embolie': 'embolism',
  'varices': 'varicose veins',
  'phlébite': 'phlebitis',
  // Symptômes urinaires/génitaux (complété)
  'brûlure en urinant': 'burning urination',
  'miction fréquente': 'frequent urination',
  'sang dans l\'urine': 'blood in urine',
  'incontinence': 'incontinence',
  'infection urinaire': 'urinary tract infection',
  'cystite': 'cystitis',
  'colique néphrétique': 'renal colic',
  'calcul rénal': 'kidney stone',
  'protéinurie': 'proteinuria',
  'hématurie': 'hematuria',
  'oligurie': 'oliguria',
  'anurie': 'anuria',
  'polyurie': 'polyuria',
  'nocturie': 'nocturia',
  'dysurie': 'dysuria',
  'énurésie': 'enuresis',
  'prostatite': 'prostatitis',
  'hypertrophie de la prostate': 'prostate enlargement',
  // Symptômes féminins (complété)
  'règles douloureuses': 'painful periods',
  'règles irrégulières': 'irregular periods',
  'saignement vaginal': 'vaginal bleeding',
  'pertes vaginales': 'vaginal discharge',
  'bouffée de chaleur': 'hot flashes',
  'aménorrhée': 'amenorrhea',
  'dysménorrhée': 'dysmenorrhea',
  'ménorragie': 'menorrhagia',
  'métrorragie': 'metrorrhagia',
  'endométriose': 'endometriosis',
  'kyste ovarien': 'ovarian cyst',
  'sécheresse vaginale': 'vaginal dryness',
  'prurit vulvaire': 'vulvar itching',
  'mastodynie': 'mastodynia',
  'galactorrhée': 'galactorrhea',
  // Symptômes masculins (nouveau)
  'dysfonction érectile': 'erectile dysfunction',
  'éjaculation précoce': 'premature ejaculation',
  'douleur testiculaire': 'testicular pain',
  'hypertrophie mammaire': 'gynecomastia',
  'problèmes de fertilité': 'fertility problems',
  // Symptômes du sommeil (complété)
  'insomnie': 'insomnia',
  'trouble du sommeil': 'sleep disorder',
  'apnée du sommeil': 'sleep apnea',
  'somnolence': 'drowsiness',
  'cauchemar': 'nightmare',
  'ronflement': 'snoring',
  'somnambulisme': 'sleepwalking',
  'parasomnie': 'parasomnia',
  'narcolepsie': 'narcolepsy',
  'hypersomnie': 'hypersomnia',
  // Symptômes psychologiques (complété)
  'anxiété': 'anxiety',
  'dépression': 'depression',
  'stress': 'stress',
  'panique': 'panic',
  'irritabilité': 'irritability',
  'trouble de l\'humeur': 'mood disorder',
  'trouble bipolaire': 'bipolar disorder',
  'schizophrénie': 'schizophrenia',
  'trouble obsessionnel compulsif': 'obsessive compulsive disorder',
  'trouble de stress post-traumatique': 'post traumatic stress disorder',
  'phobie': 'phobia',
  'crise d\'angoisse': 'panic attack',
  'trouble de la personnalité': 'personality disorder',
  'trouble alimentaire': 'eating disorder',
  'anorexie': 'anorexia',
  'boulimie': 'bulimia',
  'automutilation': 'self-harm',
  'idées suicidaires': 'suicidal thoughts',
  'hallucination': 'hallucination',
  'délire': 'delusion',
  'paranoïa': 'paranoia',
  // Symptômes oculaires (complété)
  'yeux rouges': 'red eyes',
  'yeux secs': 'dry eyes',
  'yeux larmoyants': 'watery eyes',
  'douleur oculaire': 'eye pain',
  'sensibilité à la lumière': 'light sensitivity',
  'vision double': 'double vision',
  'cécité nocturne': 'night blindness',
  'daltonisme': 'color blindness',
  'mouches volantes': 'floaters',
  'décollement de rétine': 'retinal detachment',
  'glaucome': 'glaucoma',
  'cataracte': 'cataract',
  'conjonctivite': 'conjunctivitis',
  'blépharite': 'blepharitis',
  'orgelet': 'stye',
  'chalazion': 'chalazion',
  // Symptômes ORL (complété)
  'mal d\'oreille': 'earache',
  'oreille bouchée': 'blocked ear',
  'perte d\'audition': 'hearing loss',
  'saignement de nez': 'nosebleed',
  'sinusite': 'sinusitis',
  'vertige positionnel': 'positional vertigo',
  'hyperacousie': 'hyperacusis',
  'anosmie': 'anosmia',
  'agueusie': 'ageusia',
  'dysgueusie': 'dysgeusia',
  'laryngite': 'laryngitis',
  'pharyngite': 'pharyngitis',
  'amygdalite': 'tonsillitis',
  'adénopathie': 'lymphadenopathy',
  // Symptômes infectieux (complété)
  'infection': 'infection',
  'inflammation': 'inflammation',
  'abcès': 'abscess',
  'kyste': 'cyst',
  'ganglion': 'swollen lymph node',
  'sueurs nocturnes': 'night sweats',
  'frisson': 'chills',
  'malaise': 'malaise',
  'septicémie': 'sepsis',
  'bactériémie': 'bacteremia',
  'virémie': 'viremia',
  'parasitose': 'parasitic infection',
  'mycose': 'fungal infection',
  'candidose': 'candidiasis',
  'herpès': 'herpes',
  'zona': 'shingles',
  'gale': 'scabies',
  'pédiculose': 'pediculosis',
  'grippe intestinale': 'stomach flu',
  // Symptômes endocriniens (nouveau)
  'diabète': 'diabetes',
  'hypoglycémie': 'hypoglycemia',
  'hyperglycémie': 'hyperglycemia',
  'goitre': 'goiter',
  'thyroïdite': 'thyroiditis',
  'hyperthyroïdie': 'hyperthyroidism',
  'hypothyroïdie': 'hypothyroidism',
  'maladie d\'Addison': 'Addison\'s disease',
  'maladie de Cushing': 'Cushing\'s syndrome',
  'acromégalie': 'acromegaly',
  'gigantisme': 'gigantism',
  'nanisme': 'dwarfism',
  // Symptômes hématologiques (nouveau)
  'anémie': 'anemia',
  'leucémie': 'leukemia',
  'lymphome': 'lymphoma',
  'hémophilie': 'hemophilia',
  'thrombocytopénie': 'thrombocytopenia',
  'thrombocytose': 'thrombocytosis',
  'neutropénie': 'neutropenia',
  'pancytopénie': 'pancytopenia',
  'polyglobulie': 'polycythemia',
  'drépanocytose': 'sickle cell anemia',
  // Symptômes oncologiques (nouveau)
  'tumeur': 'tumor',
  'cancer': 'cancer',
  'métastase': 'metastasis',
  'cachexie': 'cachexia',
  'adénocarcinome': 'adenocarcinoma',
  'carcinome': 'carcinoma',
  'sarcome': 'sarcoma',
  'mélanome': 'melanoma',
  'lymphadénopathie': 'lymphadenopathy',
  'masse palpable': 'palpable mass',
  // Symptômes rhumatologiques (nouveau)
  'arthrite': 'arthritis',
  'arthrose': 'osteoarthritis',
  'polyarthrite rhumatoïde': 'rheumatoid arthritis',
  'goutte': 'gout',
  'spondylarthrite': 'spondylarthritis',
  'lombalgie': 'low back pain',
  'tendinite': 'tendinitis',
  'bursite': 'bursitis',
  'fibromyalgie': 'fibromyalgia',
  'lupus': 'lupus',
  'sclérodermie': 'scleroderma',
  'syndrome de Sjögren': 'Sjögren\'s syndrome',
  // Symptômes pédiatriques (nouveau)
  'colique du nourrisson': 'infant colic',
  'érythème fessier': 'diaper rash',
  'ictère néonatal': 'neonatal jaundice',
  'retard de croissance': 'growth delay',
  'trouble du spectre autistique': 'autism spectrum disorder',
  'hyperactivité': 'hyperactivity',
  'trouble de l\'attention': 'attention deficit disorder',
  'énurésie nocturne': 'nocturnal enuresis',
  'phimosis': 'phimosis',
  'cryptorchidie': 'cryptorchidism',
  // Symptômes gériatriques (nouveau)
  'démence': 'dementia',
  'maladie d\'Alzheimer': 'Alzheimer\'s disease',
  'maladie de Parkinson': 'Parkinson\'s disease',
  'incontinence urinaire': 'urinary incontinence',
  'incontinence fécale': 'fecal incontinence',
  'ostéoporose': 'osteoporosis',
  'fracture pathologique': 'pathological fracture',
  'presbyacousie': 'presbycusis',
  'presbytie': 'presbyopia',
  'cataracte sénile': 'senile cataract',
  'délirium': 'delirium',
  // Variations linguistiques (complété)
  'mal à la tête': 'headache',
  'avoir mal': 'pain',
  'être malade': 'illness',
  'se sentir mal': 'feeling unwell',
  'pas bien': 'unwell',
  'grippe': 'flu',
  'rhume des foins': 'hay fever',
  'coup de soleil': 'sunburn',
  'intoxication alimentaire': 'food poisoning',
  'crise de foie': 'indigestion',
  'tournis': 'dizziness',
  'coup de chaleur': 'heat stroke',
  'hypothermie': 'hypothermia',
  'gelure': 'frostbite',
  'claquage': 'muscle strain',
  'entorse': 'sprain',
  'foulure': 'twist',
  'luxation': 'dislocation',
  'fracture': 'fracture',
  'traumatisme': 'trauma',
  'choc': 'shock',
  'coma': 'coma',
  'état végétatif': 'vegetative state'
};

/**
 * Extracts and translates symptoms from a comma-separated string
 * @param symptomsFr Comma-separated list of symptoms in French
 * @returns Array of translated symptoms in English, or empty array if none found
 */
function extractSymptomKeywords(symptomsFr: string): string[] {
  console.log('[Medication Debug] Input symptoms (FR):', symptomsFr);
  if (!symptomsFr?.trim()) return [];
  
  // Normalize input text
  const normalized = symptomsFr
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  
  // Split by various separators
  const symptomList = normalized
    .split(/[,;\s]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  // Extract and translate each symptom
  const extracted: ExtractedSymptom[] = [];
  
  symptomList.forEach(symptom => {
    // Try multiple variations of the symptom
    const variations = [
      symptom,
      symptom.replace(/\s+/g, ''), // Remove spaces
      symptom.replace(/\s+/g, '_'), // Replace spaces with underscore
      symptom.replace(/\s+/g, '-') // Replace spaces with dash
    ];
    
    for (const variation of variations) {
      const translated = symptomFrToEn[variation];
      if (translated && !extracted.some(e => e.translated === translated)) {
        extracted.push({ original: symptom, translated });
        break;
      }
    }
  });
  
  // Log the extracted symptoms
  console.log('[Medication Debug] Extracted symptoms:', extracted);
  
  // Return only the translated versions
  return extracted.map(s => s.translated);
}

function summarizeIndication(text: string, maxLength = 350): string {
  if (!text) return '';
  const words = text.split(' ');
  let summary = '';
  let currentLength = 0;
  
  for (const word of words) {
    if (currentLength + word.length + 1 <= maxLength) {
      summary += (currentLength > 0 ? ' ' : '') + word;
      currentLength += word.length + 1;
    } else {
      break;
    }
  }
  return summary;
}

async function translateToFrench(text: string): Promise<string> {
  if (!text.trim()) return '';
  const safeText = text.slice(0, 500);
  try {
    const response = await fetch('https://api.mymemory.translated.net/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: safeText,
        langpair: 'en|fr'
      })
    });
    const data: { translatedText: string } = await response.json();
    return data.translatedText || safeText;
  } catch (e) {
    console.error('Erreur de traduction (catch):', e);
    return safeText;
  }
}

interface SearchDrugsOptions {
  maxResultsPerSymptom?: number;
  age?: number;
  sexe?: string;
  allergies?: string;
  currentMedications?: string;
}

interface OpenFDARawDrug {
  id?: string;
  set_id?: string;
  name?: string;
  indication?: string;
  [key: string]: any;
}

interface OpenFDADrug {
  id?: string;
  set_id?: string;
  name?: string;
  indication?: string;
  purpose?: string;
  [key: string]: any;
}

interface ProcessedDrug {
  id?: string;
  set_id?: string;
  rawData: any;
  nom: string;
  indication: string;
  posologie_adulte: string;
  effets_secondaires: string;
  contre_indications: string;
  avertissements: string;
}

export async function searchDrugsBySymptom(
  symptomsFr: string, 
  options: SearchDrugsOptions = {}
): Promise<ProcessedDrug[]> {
  try {
    const symptomsCopy = symptomsFr; // Sauvegarde pour le logging
    console.log('[Medication Debug] searchDrugsBySymptom called with:', { symptomsCopy, options });
    const { maxResultsPerSymptom = 5, ...otherOptions } = options;
    
    // Extract and translate all symptoms
    const symptoms = extractSymptomKeywords(symptomsCopy);
    console.log('[Medication Debug] Extracted/translated symptoms:', symptoms);
    if (symptoms.length === 0) {
      console.warn('[Medication Debug] No valid symptoms extracted, aborting drug search.');
      return [];
    }

    // Process each symptom sequentially to avoid rate limiting
    const allResults: ProcessedDrug[] = [];
    for (const symptom of symptoms) {
      try {
        console.log(`[Medication Debug] Querying OpenFDA for symptom: ${symptom}`);
        const symptomResults = await searchOpenFDA(symptom, maxResultsPerSymptom, otherOptions);
        console.log(`[Medication Debug] Results for symptom "${symptom}":`, symptomResults);
        
        if (symptomResults && symptomResults.length > 0) {
          allResults.push(...symptomResults);
        }
      } catch (error) {
        console.error(`[Medication Debug] Error processing symptom "${symptom}":`, error);
      }
    }

    // Deduplicate results by drug name
    const uniqueDrugs = new Map<string, ProcessedDrug>();
    allResults.forEach(drug => {
      if (drug?.nom) {
        uniqueDrugs.set(drug.nom, drug);
      }
    });
    const deduped = Array.from(uniqueDrugs.values());
    
    console.log('[Medication Debug] Final deduplicated drug results:', deduped);
    return deduped;
  } catch (error) {
    console.error('[Medication Debug] Error in searchDrugsBySymptom:', error);
    return [];
  }
}

export async function searchOpenFDA(
  symptom: string, 
  limit: number,
  options: Omit<SearchDrugsOptions, 'maxResultsPerSymptom'>
): Promise<ProcessedDrug[]> {
  try {
    const symptomCopy = symptom; // Sauvegarde de la valeur pour le logging
    console.log(`[Medication Debug] searchOpenFDA called for symptom: ${symptomCopy}, limit: ${limit}, options:`, options);
    
    // Try multiple search strategies with variations
    const searchQueries = [
      `indications_and_usage:${encodeURIComponent(symptom)}`,
      `purpose:${encodeURIComponent(symptom)}`,
      `indications_and_usage:${encodeURIComponent(symptom)} OR purpose:${encodeURIComponent(symptom)}`,
      `openfda.indications_and_usage:${encodeURIComponent(symptom)}`,
      `indications_and_usage:"${encodeURIComponent(symptom)}"`,
      `purpose:"${encodeURIComponent(symptom)}"`
    ];

    let results: OpenFDADrug[] = [];
    let queryAttempts = 0;
    
    for (const query of searchQueries) {
      if (queryAttempts >= 3) break; // Limit to 3 attempts to avoid excessive API calls
      
      const url = `https://api.fda.gov/drug/label.json?search=${query}&limit=${limit}`;
      console.log(`[Medication Debug] Trying OpenFDA query: ${query}`);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`[Medication Debug] OpenFDA API error: ${response.status} - ${response.statusText}`);
          queryAttempts++;
          continue;
        }
        
        const data: OpenFDAResponse = await response.json();
        
        if (data && data.results) {
          results = [...results, ...data.results];
          console.log(`[Medication Debug] Found ${data.results.length} results for query "${query}"`);
          
          // If we found results and they are relevant, stop searching
          if (data.results.length > 0 && data.results.some((r: any) => r.indication || r.purpose)) {
            break;
          }
        }
      } catch (error) {
        console.error(`[Medication Debug] Error fetching OpenFDA data for query "${query}":`, error);
        queryAttempts++;
      }
    }
    
    if (results.length === 0) {
      console.warn(`[Medication Debug] No results found after trying multiple queries`);
      return [];
    }

    // Process and translate drug information
    // Appel Gemini pour chaque médicament, avec adaptation au contexte utilisateur
    const mapped = await Promise.all(results.map(async (d: OpenFDARawDrug, idx: number) => {
      try {
        const { summarizeDrugInfoWithLLM } = await import('./deepseekService');
        console.log(`[Medication Debug] Calling Gemini for drug #${idx+1} (OpenFDA id: ${d.id || d.set_id || 'unknown'})`);
        const summary = await summarizeDrugInfoWithLLM(
          JSON.stringify(d),
          {
            age: options.age,
            sexe: options.sexe,
            allergies: options.allergies,
            currentMedications: options.currentMedications
          }
        );
        
        if (!summary) {
          console.error(`[Medication Debug] Gemini failed to summarize drug ${d.name || 'unknown'}`);
          return null;
        }
        console.log(`[Medication Debug] Gemini summary for drug #${idx+1}:`, summary);
        
        return {
          id: d.id,
          set_id: d.set_id,
          rawData: d,
          nom: summary.nom || 'Non spécifié',
          indication: summary.indication || 'Non spécifiée',
          posologie_adulte: summary.posologie_adulte || 'Non spécifiée',
          effets_secondaires: summary.effets_secondaires || 'Aucun effet secondaire majeur rapporté',
          contre_indications: summary.contre_indications || 'Aucune contre-indication majeure rapportée',
          avertissements: summary.avertissements || 'Aucun avertissement supplémentaire'
        } as ProcessedDrug;
      } catch (e) {
        console.error(`[Medication Debug] Error processing drug ${d.name || 'unknown'}:`, e);
        return null;
      }
    }));
    
    console.log(`[Medication Debug] Processed drug summaries:`, mapped);
    return mapped.filter((d: ProcessedDrug | null): d is ProcessedDrug => d !== null);
  } catch (error) {
    console.error('[Medication Debug] Error processing drug summaries:', error);
    return [];
  }
}
