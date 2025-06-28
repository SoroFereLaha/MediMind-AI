import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Dans Next.js 15+, nous devons attendre params avant de l'utiliser
  const paramsData = await params;
  const id = paramsData.id;
  
  try {
    const db = await getDb();
    const patientsCollection = db.collection('patientRecords');

    // Convertir l'ID en ObjectId
    const objectId = new ObjectId(id);
    
    const patient = await patientsCollection.findOne({ _id: objectId });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient non trouvé" },
        { status: 404 }
      );
    }

    // Formattez les données selon vos besoins
    const formattedPatient = {
      id: patient._id.toString(),
      patientFirstName: patient.patientFirstName,
      patientLastName: patient.patientLastName,
      patientSex: patient.patientSex,
      patientDOB: patient.patientDOB,
      patientAge: patient.patientAge,
      disease: patient.disease,
      notes: patient.notes || '',
      createdAt: patient.createdAt,
      doctorName: patient.doctorName,
      consultations: patient.consultations || []
    };

    return NextResponse.json(formattedPatient);
  } catch (error) {
    console.error("Erreur lors de la récupération du patient:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du patient" },
      { status: 500 }
    );
  }
}
