
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
    const placeholderDoctorId = new ObjectId(); // This is a NEW ObjectId, not necessarily a real doctor.

    const newRecordDocument = {
      ...recordInput,
      doctorId: placeholderDoctorId, // Assign the placeholder doctorId
      patientDOB: new Date(recordInput.patientDOB), // Store as Date object
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('patientRecords').insertOne(newRecordDocument);
    
    if (!result.insertedId) {
      return NextResponse.json({ message: 'Failed to create patient record' }, { status: 500 });
    }

    // Construct the response object according to PatientRecordServerResponse
    const createdRecord: PatientRecordServerResponse = {
      id: result.insertedId.toString(),
      doctorId: newRecordDocument.doctorId.toString(), // Convert doctorId ObjectId to string for response
      patientFirstName: newRecordDocument.patientFirstName,
      patientLastName: newRecordDocument.patientLastName,
      patientDOB: newRecordDocument.patientDOB.toISOString(), // Convert Date to ISO string
      patientSex: newRecordDocument.patientSex,
      disease: newRecordDocument.disease,
      notes: newRecordDocument.notes,
      createdAt: newRecordDocument.createdAt.toISOString(), // Convert Date to ISO string
      updatedAt: newRecordDocument.updatedAt.toISOString(), // Convert Date to ISO string
    };

    return NextResponse.json(createdRecord, { status: 201 });
  } catch (error) {
    console.error('API POST /api/patient-records - Failed to create patient record:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    
    // TODO: In a real app, you would filter records based on the authenticated doctor's ID.
    // For example: const doctorId = getDoctorIdFromSession(request);
    // const recordsFromDb = await db.collection('patientRecords').find({ doctorId: new ObjectId(doctorId) }).sort({ createdAt: -1 }).toArray();
    
    // For now, fetching all records (or you can implement a query param for doctorId if needed for testing)
    const recordsFromDb = await db.collection('patientRecords').find({}).sort({ createdAt: -1 }).toArray();
    
    const records: PatientRecordServerResponse[] = recordsFromDb.map(doc => ({
      id: doc._id.toString(),
      doctorId: doc.doctorId.toString(), // Ensure doctorId is string
      patientFirstName: doc.patientFirstName,
      patientLastName: doc.patientLastName,
      patientDOB: doc.patientDOB.toISOString(),
      patientSex: doc.patientSex,
      disease: doc.disease,
      notes: doc.notes,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error('API GET /api/patient-records - Failed to fetch patient records:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}
