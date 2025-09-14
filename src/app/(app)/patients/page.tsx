'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Search, Edit3, Trash2, ArrowRight, Leaf } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Patient {
  id: string;
  name: string;
  lastSession: string;
  avatarUrl?: string;
  initials: string;
}

const mockPatients: Patient[] = [
  { id: '1', name: 'John Doe', lastSession: '2024-07-15', avatarUrl: 'https://placehold.co/100x100.png?text=JD', initials: 'JD' },
  { id: '2', name: 'Jane Smith', lastSession: '2024-07-18', initials: 'JS' },
  { id: '3', name: 'Alice Brown', lastSession: '2024-07-12', avatarUrl: 'https://placehold.co/100x100.png?text=AB', initials: 'AB' },
  { id: '4', name: 'Bob Green', lastSession: '2024-07-20', initials: 'BG' },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePatient = (patientId: string) => {
    // Mock delete
    setPatients(prev => prev.filter(p => p.id !== patientId));
    // Show toast in real app
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-headline text-3xl">Meus Pacientes (v2 - Real)</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Gerencie os perfis, anotações e documentos de seus pacientes.
              </CardDescription>
            </div>
            <Button asChild className="mt-4 sm:mt-0">
              <Link href="/patients/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo Paciente
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar pacientes por nome..."
              className="pl-10 w-full md:w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredPatients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person portrait" />
                      <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">{patient.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-headline text-xl">{patient.name}</CardTitle>
                      <CardDescription>Última Sessão: {new Date(patient.lastSession).toLocaleDateString('pt-BR')}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {/* Placeholder for more patient info if needed */}
                    <p className="text-sm text-muted-foreground">Clique para ver perfil detalhado, notas de sessão e documentos.</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-4 border-t">
                     <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/patients/${patient.id}/edit`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro do paciente {patient.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePatient(patient.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <Button variant="default" size="sm" asChild>
                      <Link href={`/patients/${patient.id}`}>
                        Ver Perfil <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Leaf className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="font-headline text-xl text-muted-foreground">Nenhum paciente encontrado.</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Tente um termo de pesquisa diferente ou " : ""}
                <Link href="/patients/new" className="text-primary hover:underline">adicione um novo paciente</Link>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
