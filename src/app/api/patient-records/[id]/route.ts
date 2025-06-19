
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { PatientRecordServerResponse } from '@/contexts/app-context';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid patient record ID format' }, { status: 400 });
    }

    const db = await getDb();
    const recordFromDb = await db.collection('patientRecords').findOne({ _id: new ObjectId(id) });

    if (!recordFromDb) {
      return NextResponse.json({ message: 'Patient record not found' }, { status: 404 });
    }
    
    const record: PatientRecordServerResponse = {
      id: recordFromDb._id.toString(),
      doctorId: recordFromDb.doctorId.toString(), // Ensure doctorId is string
      patientFirstName: recordFromDb.patientFirstName,
      patientLastName: recordFromDb.patientLastName,
      patientDOB: recordFromDb.patientDOB.toISOString(),
      patientSex: recordFromDb.patientSex,
      disease: recordFromDb.disease,
      notes: recordFromDb.notes,
      createdAt: recordFromDb.createdAt.toISOString(),
      updatedAt: recordFromDb.updatedAt.toISOString(),
    };

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error(`API GET /api/patient-records/${params.id} - Failed to fetch patient record:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}
