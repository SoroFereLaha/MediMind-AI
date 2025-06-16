
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Users, Search, FileText, UserPlus } from 'lucide-react';
import { useAppContext, PatientRecord } from '@/contexts/app-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

function PatientListItem({ patient }: { patient: PatientRecord }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{patient.firstName} {patient.lastName}</CardTitle>
        <CardDescription>
          {patient.disease} - {new Date(patient.dob).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })} ({patient.sex})
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Dernière fiche : {new Date(patient.createdAt).toLocaleDateString('fr-FR')}</p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/medecin/patients/${patient.id}`}>
            <FileText className="mr-2 h-4 w-4" />
            Voir Fiche
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ListePatientsPage() {
  const { patientRecords } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = useMemo(() => {
    if (!searchTerm) {
      return patientRecords;
    }
    return patientRecords.filter(
      (patient) =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patientRecords, searchTerm]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Liste des Patients"
        description="Consultez et recherchez parmi les fiches de suivi de vos patients."
        icon={Users}
      />

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link href="/medecin/patients/nouveau">
            <UserPlus className="mr-2 h-4 w-4" /> Ajouter un Patient / Fiche
          </Link>
        </Button>
      </div>

      {patientRecords.length === 0 ? (
         <Card className="text-center py-10">
           <CardContent className="space-y-3">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Aucune fiche patient pour le moment.</h3>
            <p className="text-muted-foreground">Commencez par ajouter une nouvelle fiche de suivi.</p>
            <Button asChild className="mt-4">
              <Link href="/medecin/patients/nouveau">
                <UserPlus className="mr-2 h-4 w-4" /> Créer une Fiche
              </Link>
            </Button>
           </CardContent>
         </Card>
      ) : filteredPatients.length === 0 && searchTerm ? (
        <Card className="text-center py-10">
          <CardContent className="space-y-3">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Aucun patient trouvé pour "{searchTerm}".</h3>
            <p className="text-muted-foreground">Vérifiez votre recherche ou essayez d'autres termes.</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-20rem)]"> {/* Adjust height as needed */}
          <div className="space-y-4 pr-4">
            {filteredPatients.map((patient) => (
              <PatientListItem key={patient.id} patient={patient} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
