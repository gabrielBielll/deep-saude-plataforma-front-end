import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Importar authOptions
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, FileText, UploadCloud, CalendarDays, Mail, Phone } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';

// --- DEFINIÇÃO DOS TIPOS DE DADOS ---
interface Patient {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  data_nascimento: string | null;
  avatar_url?: string | null;
  data_cadastro: string;
}

interface SessionNote { id: string; date: string; content: string; }
interface Document { id: string; name: string; uploadDate: string; url: string; }

// --- FUNÇÃO PARA BUSCAR OS DADOS DO PACIENTE NA API ---
async function getPatientDetails(patientId: string, token: string): Promise<Patient | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/pacientes/${patientId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.data_nascimento) {
      data.data_nascimento = new Date(data.data_nascimento).toISOString().split('T')[0];
    }
    return data;
  } catch (error) {
    console.error("Erro na API ao buscar detalhes do paciente:", error);
    return null;
  }
}

// --- DADOS MOCKADOS (COMO SOLICITADO) ---
const mockNotes: SessionNote[] = [
    { id: 'n1', date: '2024-07-15', content: 'Paciente relatou sentir-se ansioso...' },
    { id: 'n2', date: '2024-07-08', content: 'Acompanhamento sobre estressores familiares...' },
];
const mockDocuments: Document[] = [
    { id: 'd1', name: 'Formulário de Admissão.pdf', uploadDate: '2023-01-10', url: '#' },
    { id: 'd2', name: 'Carta de Encaminhamento.docx', uploadDate: '2023-02-20', url: '#' },
];

// --- O COMPONENTE DA PÁGINA (SERVER COMPONENT) ---
export default async function PatientDetailPage({ params }: { params: { patientId: string } }) {
  // CORREÇÃO: Busca a sessão de forma robusta no servidor
  const session = await getServerSession(authOptions);
  const token = (session as any)?.backendToken;
  
  if (!token) {
    return <p className="p-4">Sessão inválida ou não encontrada. Por favor, faça login novamente.</p>;
  }

  const patient = await getPatientDetails(params.patientId, token);

  if (!patient) {
    notFound();
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* SEÇÃO PRINCIPAL COM DADOS REAIS */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={patient.avatar_url || ''} alt={patient.nome} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-3xl">{getInitials(patient.nome)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-3xl">{patient.nome}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">ID do Paciente: {patient.id}</CardDescription>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
              <span className="flex items-center"><Mail className="h-4 w-4 mr-1 text-primary" /> {patient.email || 'N/A'}</span>
              <span className="flex items-center"><Phone className="h-4 w-4 mr-1 text-primary" /> {patient.telefone || 'N/A'}</span>
              <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1 text-primary" /> Cadastrado em: {new Date(patient.data_cadastro).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="py-3"><User className="mr-2 h-5 w-5" />Detalhes do Perfil</TabsTrigger>
          <TabsTrigger value="notes" className="py-3"><FileText className="mr-2 h-5 w-5" />Anotações da Sessão</TabsTrigger>
          <TabsTrigger value="documents" className="py-3"><UploadCloud className="mr-2 h-5 w-5" />Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-md">
            <CardHeader><CardTitle className="font-headline text-2xl">Informações do Paciente</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label htmlFor="name">Nome Completo</Label><Input id="name" value={patient.nome} readOnly /></div>
                <div><Label htmlFor="dob">Data de Nascimento</Label><Input id="dob" value={patient.data_nascimento ? new Date(patient.data_nascimento).toLocaleDateString('pt-BR') : 'N/A'} readOnly /></div>
                <div><Label htmlFor="email">Endereço de E-mail</Label><Input id="email" type="email" value={patient.email || 'N/A'} readOnly /></div>
                <div><Label htmlFor="phone">Número de Telefone</Label><Input id="phone" type="tel" value={patient.telefone || 'N/A'} readOnly /></div>
                <div className="md:col-span-2"><Label htmlFor="address">Endereço</Label><Textarea id="address" value={patient.endereco || 'N/A'} readOnly className="h-24" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="shadow-md">
            <CardHeader><CardTitle className="font-headline text-2xl">Anotações da Sessão (Mock)</CardTitle></CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                  {mockNotes.map(note => (
                    <Card key={note.id} className="bg-background/70">
                      <CardHeader><CardTitle className="text-md font-semibold">Sessão: {new Date(note.date).toLocaleDateString('pt-BR')}</CardTitle></CardHeader>
                      <CardContent><p className="whitespace-pre-wrap text-sm">{note.content}</p></CardContent>
                    </Card>
                  ))}
                  </div>
                </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="shadow-md">
            <CardHeader><CardTitle className="font-headline text-2xl">Documentos do Paciente (Mock)</CardTitle></CardHeader>
            <CardContent>
                <ul className="space-y-3">
                  {mockDocuments.map(doc => (
                    <li key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-secondary/20">
                      <div><a href={doc.url} className="text-primary hover:underline font-medium">{doc.name}</a><p className="text-xs text-muted-foreground">Carregado em: {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</p></div>
                      <Button variant="outline" size="sm" asChild><a href={doc.url} download>Baixar</a></Button>
                    </li>
                  ))}
                </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
