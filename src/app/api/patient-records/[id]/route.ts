import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { PatientRecordServerResponse } from '@/contexts/app-context';

// GET - Récupérer une fiche patient par ID
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'ID de patient invalide' }, { status: 400 });
    }

    const db = await getDb();
    const patient = await db.collection<PatientRecordServerResponse>('patientRecords').findOne({ _id: new ObjectId(id) });

    if (!patient) {
      return NextResponse.json({ message: `Fiche patient non trouvée pour l'ID: ${id}` }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Erreur API [GET /api/patient-records/[id]]:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ message: 'Erreur interne du serveur', error: errorMessage }, { status: 500 });
  }
}

// PUT - Mettre à jour une fiche patient
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'ID de patient invalide' }, { status: 400 });
    }

    const body = await request.json();
    // Empêcher la modification de l'ID et d'autres champs immuables
    delete body._id;
    delete body.patientId;
    delete body.doctorId;
    delete body.createdAt;
    
    const db = await getDb();
    const result = await db.collection('patientRecords').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Fiche patient non trouvée' }, { status: 404 });
    }

    const updatedPatient = await db.collection('patientrecords').findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Erreur API [PUT /api/patient-records/[id]]:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ message: 'Erreur lors de la mise à jour', error: errorMessage }, { status: 500 });
  }
}

// DELETE - Supprimer une fiche patient
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'ID de patient invalide' }, { status: 400 });
    }
    
    const db = await getDb();
    const result = await db.collection('patientRecords').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Fiche patient non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fiche patient supprimée avec succès' }, { status: 200 });
  } catch (error) {
    console.error("Erreur API [DELETE /api/patient-records/[id]]:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ message: 'Erreur lors de la suppression', error: errorMessage }, { status: 500 });
  }
}
