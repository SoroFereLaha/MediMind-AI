import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const db = await getDb();
    const patientsCollection = db.collection('patientRecords');

    // Récupérer tous les patients et formater les données
    const patients = await patientsCollection.find().toArray();
    
    const formattedPatients = patients.map(patient => ({
      id: patient._id.toString(),
      patientFirstName: patient.patientFirstName,
      patientLastName: patient.patientLastName,
      patientDOB: patient.patientDOB,
      patientSex: patient.patientSex,
      disease: patient.disease,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      doctorName: patient.doctorName,
      consultations: patient.consultations || []
    }));

    return NextResponse.json(formattedPatients);
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des patients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const patientsCollection = db.collection('patientRecords');

    const { patientFirstName, patientLastName, patientDOB, patientSex, disease, doctorName, notes } = await request.json();

    if (!patientFirstName || !patientLastName || !patientDOB || !patientSex || !disease || !notes) {
      return NextResponse.json(
        { error: "Tous les champs requis ne sont pas fournis" },
        { status: 400 }
      );
    }

    const newPatient = {
      patientFirstName,
      patientLastName,
      patientDOB,
      patientSex,
      disease,
      doctorName,
      consultations: [{
        date: new Date().toISOString(),
        notes
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await patientsCollection.insertOne(newPatient);
    
    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newPatient
    });
  } catch (error) {
    console.error("Erreur lors de la création du patient:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du patient" },
      { status: 500 }
    );
  }
}
