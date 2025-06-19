
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { PatientRecordInput, PatientRecordServerResponse } from '@/contexts/app-context';

export async function POST(request: NextRequest) {
  try {
    const recordInput: PatientRecordInput = await request.json();
    const db = await getDb();

    // TODO: In a real app, doctorId would come from an authenticated session.
    // For now, using a placeholder. Ensure your `users` collection and auth logic are set up.
    // Consider creating a separate `doctors` collection and linking via doctorId if more doctor-specific info is needed.
    const placeholderDoctorId = new ObjectId(); 

    const newRecordDocument = {
      ...recordInput,
      doctorId: placeholderDoctorId, 
      patientDOB: new Date(recordInput.patientDOB), 
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('patientRecords').insertOne(newRecordDocument);
    
    if (!result.insertedId) {
      console.error('API POST /api/patient-records - MongoDB insertOne failed to return insertedId');
      return NextResponse.json({ message: 'Failed to create patient record: No insertedId returned' }, { status: 500 });
    }

    const createdRecord: PatientRecordServerResponse = {
      id: result.insertedId.toString(),
      doctorId: newRecordDocument.doctorId.toString(), 
      patientFirstName: newRecordDocument.patientFirstName,
      patientLastName: newRecordDocument.patientLastName,
      patientDOB: newRecordDocument.patientDOB.toISOString(), 
      patientSex: newRecordDocument.patientSex,
      disease: newRecordDocument.disease,
      notes: newRecordDocument.notes,
      createdAt: newRecordDocument.createdAt.toISOString(), 
      updatedAt: newRecordDocument.updatedAt.toISOString(), 
    };

    return NextResponse.json(createdRecord, { status: 201 });
  } catch (error) {
    console.error('API POST /api/patient-records - Failed to create patient record:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during record creation.';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    
    // TODO: In a real app, you would filter records based on the authenticated doctor's ID.
    const recordsFromDb = await db.collection('patientRecords').find({}).sort({ createdAt: -1 }).toArray();
    
    const records: PatientRecordServerResponse[] = recordsFromDb.map(doc => {
      if (!doc || typeof doc !== 'object') {
        console.warn(`[API GET /api/patient-records] Encountered invalid document in recordsFromDb:`, doc);
        return null; 
      }
      if (!doc._id || typeof doc._id.toString !== 'function') {
        console.warn(`[API GET /api/patient-records] Document missing or invalid _id:`, doc);
        return null;
      }

      const id = doc._id.toString();
      const doctorId = (doc.doctorId && typeof doc.doctorId.toString === 'function') ? doc.doctorId.toString() : 'ID Médecin Indisponible';
      
      let patientDOBStr: string;
      try {
        patientDOBStr = doc.patientDOB instanceof Date ? doc.patientDOB.toISOString() : new Date(doc.patientDOB || 0).toISOString();
        if (new Date(doc.patientDOB || 0).getFullYear() < 1900 && doc.patientDOB) { // Basic sanity check for very old dates if not epoch
            console.warn(`[API GET /api/patient-records] Unusual patientDOB for doc ${id}:`, doc.patientDOB);
        }
      } catch (e) {
        console.warn(`[API GET /api/patient-records] Invalid patientDOB for doc ${id}:`, doc.patientDOB, e);
        patientDOBStr = new Date(0).toISOString(); 
      }

      let createdAtStr: string;
      try {
        createdAtStr = doc.createdAt instanceof Date ? doc.createdAt.toISOString() : new Date(doc.createdAt || 0).toISOString();
      } catch (e) {
        console.warn(`[API GET /api/patient-records] Invalid createdAt for doc ${id}:`, doc.createdAt, e);
        createdAtStr = new Date(0).toISOString();
      }

      let updatedAtStr: string;
      try {
        updatedAtStr = doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : new Date(doc.updatedAt || 0).toISOString();
      } catch (e) {
        console.warn(`[API GET /api/patient-records] Invalid updatedAt for doc ${id}:`, doc.updatedAt, e);
        updatedAtStr = new Date(0).toISOString();
      }
      
      return {
        id: id,
        doctorId: doctorId,
        patientFirstName: String(doc.patientFirstName || 'Prénom Non Renseigné'),
        patientLastName: String(doc.patientLastName || 'Nom Non Renseigné'),
        patientDOB: patientDOBStr,
        patientSex: String(doc.patientSex || 'Sexe Non Renseigné'),
        disease: String(doc.disease || 'Maladie Non Renseignée'),
        notes: String(doc.notes || 'Notes Non Renseignées'),
        createdAt: createdAtStr,
        updatedAt: updatedAtStr,
      };
    }).filter(record => record !== null) as PatientRecordServerResponse[];

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error('API GET /api/patient-records - Failed to fetch patient records:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching records.';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}
