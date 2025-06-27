'use client';

import React, { useState, useEffect, use } from 'react';
import { useParams }   from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, FileText, Brain, UploadCloud, CalendarDays, Mail, Phone, MapPin, PlusCircle, Save, ThumbsUp, Wand2, AlertCircle } from "lucide-react";
import { getSessionNoteInsights, SessionNoteInsightsInput, SessionNoteInsightsOutput } from '@/ai/flows/session-note-insights';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  avatarUrl?: string;
  initials: string;
  joinedDate: string;
}

interface SessionNote {
  id: string;
  date: string;
  content: string;
  insights?: SessionNoteInsightsOutput;
}

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  url: string; // This would be a GCS URL in a real app
}

const mockPatient: Patient = {
  id: '1',
  name: 'Johnathan Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  address: '123 Wellness St, Tranquility City, CA 90210',
  dob: '1985-06-15',
  avatarUrl: 'https://placehold.co/150x150.png?text=JD',
  initials: 'JD',
  joinedDate: '2023-01-10',
};

const mockNotes: SessionNote[] = [
  { id: 'n1', date: '2024-07-15', content: 'Paciente relatou sentir-se ansioso com a apresentação no trabalho. Discutimos mecanismos de enfrentamento e exercícios de respiração. Mostrou melhora no humor ao final da sessão.' },
  { id: 'n2', date: '2024-07-08', content: 'Acompanhamento sobre estressores familiares. Paciente está implementando estratégias de comunicação discutidas anteriormente. Ainda há alguma tensão, mas nota-se progresso.' },
];

const mockDocuments: Document[] = [
  { id: 'd1', name: 'Formulário de Admissão.pdf', uploadDate: '2023-01-10', url: '#' },
  { id: 'd2', name: 'Carta de Encaminhamento.docx', uploadDate: '2023-02-20', url: '#' },
];


export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const { toast } = useToast();

  // In a real app, fetch patient data based on patientId
  const [patient, setPatient] = useState<Patient>(mockPatient);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>(mockNotes);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [analyzingNoteId, setAnalyzingNoteId] = useState<string | null>(null);

  const handleAnalyzeNote = async (note: SessionNote) => {
    setAnalyzingNoteId(note.id);
    try {
      const input: SessionNoteInsightsInput = { sessionNotes: note.content };
      const insights = await getSessionNoteInsights(input);
      setSessionNotes(prevNotes => 
        prevNotes.map(n => n.id === note.id ? { ...n, insights } : n)
      );
      toast({
        title: "Análise Concluída",
        description: "Insights da anotação de sessão gerados com sucesso.",
        variant: "default",
        className: "bg-primary text-primary-foreground"
      });
    } catch (error) {
      console.error("Erro ao analisar anotação:", error);
      toast({
        title: "Falha na Análise",
        description: "Não foi possível gerar insights para a anotação da sessão.",
        variant: "destructive",
      });
    } finally {
      setAnalyzingNoteId(null);
    }
  };

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast({ title: "Anotação Vazia", description: "Não é possível salvar uma anotação vazia.", variant: "destructive" });
      return;
    }
    const newNote: SessionNote = {
      id: `n${sessionNotes.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      content: newNoteContent,
    };
    setSessionNotes([newNote, ...sessionNotes]);
    setNewNoteContent('');
    toast({ title: "Anotação Salva", description: "Nova anotação de sessão adicionada com sucesso.", className: "bg-primary text-primary-foreground" });
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock upload
      const newDoc: Document = {
        id: `d${documents.length + 1}`,
        name: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        url: '#', // In real app, use signed URL from GCS
      };
      setDocuments([newDoc, ...documents]);
      toast({ title: "Arquivo Carregado", description: `${file.name} foi adicionado. (Simulado)`, className: "bg-primary text-primary-foreground" });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person portrait"/>
            <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-3xl">{patient.initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-3xl">{patient.name}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">ID do Paciente: {patient.id}</CardDescription>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
              <span className="flex items-center"><Mail className="h-4 w-4 mr-1 text-primary" /> {patient.email}</span>
              <span className="flex items-center"><Phone className="h-4 w-4 mr-1 text-primary" /> {patient.phone}</span>
              <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1 text-primary" /> Entrou em: {new Date(patient.joinedDate).toLocaleDateString('pt-BR')}</span>
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
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Informações do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label htmlFor="name">Nome Completo</Label><Input id="name" value={patient.name} readOnly /></div>
                <div><Label htmlFor="dob">Data de Nascimento</Label><Input id="dob" value={new Date(patient.dob).toLocaleDateString('pt-BR')} readOnly /></div>
                <div><Label htmlFor="email">Endereço de E-mail</Label><Input id="email" type="email" value={patient.email} readOnly /></div>
                <div><Label htmlFor="phone">Número de Telefone</Label><Input id="phone" type="tel" value={patient.phone} readOnly /></div>
                <div className="md:col-span-2"><Label htmlFor="address">Endereço</Label><Textarea id="address" value={patient.address} readOnly className="h-24" /></div>
              </div>
              <Button variant="outline"><User className="mr-2 h-4 w-4" /> Editar Perfil (Espaço reservado)</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Anotações da Sessão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-note" className="text-lg">Adicionar Nova Anotação</Label>
                <Textarea
                  id="new-note"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder={`Registre anotações para a sessão de ${new Date().toLocaleDateString('pt-BR')}...`}
                  className="min-h-[120px]"
                />
                <Button onClick={handleAddNote}><Save className="mr-2 h-4 w-4"/>Salvar Anotação</Button>
              </div>
              <hr/>
              <h3 className="font-headline text-xl mt-4">Anotações Anteriores</h3>
              {sessionNotes.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                  {sessionNotes.map(note => (
                    <Card key={note.id} className="bg-background/70">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md font-semibold">Sessão: {new Date(note.date).toLocaleDateString('pt-BR')}</CardTitle>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAnalyzeNote(note)}
                            disabled={analyzingNoteId === note.id}
                          >
                            {analyzingNoteId === note.id ? <Wand2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                            {analyzingNoteId === note.id ? "Analisando..." : "Insights de IA"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                        {note.insights && (
                          <div className="mt-4 p-3 border rounded-md bg-secondary/30 space-y-2">
                            <h4 className="font-semibold text-sm text-primary">Insights Gerados por IA:</h4>
                            <div><strong>Palavras-chave:</strong> <span className="text-xs">{note.insights.keywords.join(', ')}</span></div>
                            <div><strong>Temas:</strong> <span className="text-xs">{note.insights.themes.join(', ')}</span></div>
                            <div><strong>Insights Potenciais:</strong>
                              <ul className="list-disc list-inside text-xs">
                                {note.insights.insights.map((insight, i) => <li key={i}>{insight}</li>)}
                              </ul>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground">Nenhuma anotação de sessão registrada ainda.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Documentos do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="file-upload" className="block text-lg mb-2">Carregar Novo Documento</Label>
                <div className="flex items-center space-x-2">
                  <Input id="file-upload" type="file" onChange={handleFileUpload} className="w-auto" />
                  {/* <Button><UploadCloud className="mr-2 h-4 w-4" /> Upload (Placeholder)</Button> */}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Tamanho máximo do arquivo: 5MB. Tipos permitidos: PDF, DOCX, JPG, PNG.</p>
              </div>
               <hr/>
              <h3 className="font-headline text-xl mt-4">Documentos Carregados</h3>
              {documents.length > 0 ? (
                <ul className="space-y-3">
                  {documents.map(doc => (
                    <li key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-secondary/20">
                      <div>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{doc.name}</a>
                        <p className="text-xs text-muted-foreground">Carregado em: {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} download={doc.name} target="_blank">Baixar</a>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                 <div className="text-center py-6">
                  <Image src="https://placehold.co/200x150.png" alt="Nenhum documento" width={150} height={100} className="mx-auto rounded-md mb-2" data-ai-hint="empty folder document" />
                  <p className="text-muted-foreground">Nenhum documento carregado para este paciente ainda.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
