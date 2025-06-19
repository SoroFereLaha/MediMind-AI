
import { MongoClient, ServerApiVersion, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'MediMindIA';

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local or your environment configuration. Example: mongodb://localhost:27017/MediMindIA'
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    globalWithMongo._mongoClientPromise = client.connect();
    console.log('[MongoDB] New connection initiated in development.');
  } else {
    console.log('[MongoDB] Reusing existing connection in development.');
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
  console.log('[MongoDB] New connection initiated in production.');
}

export async function getDb(): Promise<Db> {
  try {
    console.log('[DEBUG] === DÉBUT DE getDb() ===');
    console.log('[DEBUG] MONGODB_URI:', process.env.MONGODB_URI);
    console.log('[DEBUG] DB Name:', dbName);
    console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV);
    
    console.log('[DEBUG] Tentative de connexion à MongoDB...');
    const mongoClient = await clientPromise;
    console.log('[DEBUG] ✅ MongoDB client connecté avec succès');
    
    const db = mongoClient.db(dbName);
    console.log('[DEBUG] ✅ Base de données récupérée:', dbName);
    
    return db;
  } catch (error) {
    console.error('[DEBUG] ❌ ERREUR dans getDb():', error);
    console.error('[DEBUG] Type d\'erreur:', typeof error);
    console.error('[DEBUG] Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
    
    throw new Error('Failed to connect to the database.');
  }
}
