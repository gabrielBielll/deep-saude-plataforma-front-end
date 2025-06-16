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
  { id: 'n1', date: '2024-07-15', content: 'Patient reported feeling anxious about work presentation. Discussed coping mechanisms and breathing exercises. Showed improvement in mood by end of session.' },
  { id: 'n2', date: '2024-07-08', content: 'Follow-up on family stressors. Patient is implementing communication strategies discussed previously. Still some tension but progress is noted.' },
];

const mockDocuments: Document[] = [
  { id: 'd1', name: 'Intake Form.pdf', uploadDate: '2023-01-10', url: '#' },
  { id: 'd2', name: 'Referral Letter.docx', uploadDate: '2023-02-20', url: '#' },
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
        title: "Analysis Complete",
        description: "Session note insights generated successfully.",
        variant: "default",
        className: "bg-primary text-primary-foreground"
      });
    } catch (error) {
      console.error("Error analyzing note:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate insights for the session note.",
        variant: "destructive",
      });
    } finally {
      setAnalyzingNoteId(null);
    }
  };

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast({ title: "Empty Note", description: "Cannot save an empty note.", variant: "destructive" });
      return;
    }
    const newNote: SessionNote = {
      id: `n${sessionNotes.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      content: newNoteContent,
    };
    setSessionNotes([newNote, ...sessionNotes]);
    setNewNoteContent('');
    toast({ title: "Note Saved", description: "New session note added successfully.", className: "bg-primary text-primary-foreground" });
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
      toast({ title: "File Uploaded", description: `${file.name} has been added. (Mock)`, className: "bg-primary text-primary-foreground" });
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
            <CardDescription className="text-lg text-muted-foreground">Patient ID: {patient.id}</CardDescription>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
              <span className="flex items-center"><Mail className="h-4 w-4 mr-1 text-primary" /> {patient.email}</span>
              <span className="flex items-center"><Phone className="h-4 w-4 mr-1 text-primary" /> {patient.phone}</span>
              <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1 text-primary" /> Joined: {patient.joinedDate}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="py-3"><User className="mr-2 h-5 w-5" />Profile Details</TabsTrigger>
          <TabsTrigger value="notes" className="py-3"><FileText className="mr-2 h-5 w-5" />Session Notes</TabsTrigger>
          <TabsTrigger value="documents" className="py-3"><UploadCloud className="mr-2 h-5 w-5" />Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" value={patient.name} readOnly /></div>
                <div><Label htmlFor="dob">Date of Birth</Label><Input id="dob" value={patient.dob} readOnly /></div>
                <div><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={patient.email} readOnly /></div>
                <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" value={patient.phone} readOnly /></div>
                <div className="md:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" value={patient.address} readOnly className="h-24" /></div>
              </div>
              <Button variant="outline"><User className="mr-2 h-4 w-4" /> Edit Profile (Placeholder)</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Session Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-note" className="text-lg">Add New Note</Label>
                <Textarea
                  id="new-note"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder={`Record notes for session on ${new Date().toLocaleDateString()}...`}
                  className="min-h-[120px]"
                />
                <Button onClick={handleAddNote}><Save className="mr-2 h-4 w-4"/>Save Note</Button>
              </div>
              <hr/>
              <h3 className="font-headline text-xl mt-4">Previous Notes</h3>
              {sessionNotes.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                  {sessionNotes.map(note => (
                    <Card key={note.id} className="bg-background/70">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md font-semibold">Session: {note.date}</CardTitle>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAnalyzeNote(note)}
                            disabled={analyzingNoteId === note.id}
                          >
                            {analyzingNoteId === note.id ? <Wand2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                            {analyzingNoteId === note.id ? "Analyzing..." : "AI Insights"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                        {note.insights && (
                          <div className="mt-4 p-3 border rounded-md bg-secondary/30 space-y-2">
                            <h4 className="font-semibold text-sm text-primary">AI Generated Insights:</h4>
                            <div><strong>Keywords:</strong> <span className="text-xs">{note.insights.keywords.join(', ')}</span></div>
                            <div><strong>Themes:</strong> <span className="text-xs">{note.insights.themes.join(', ')}</span></div>
                            <div><strong>Potential Insights:</strong>
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
                <p className="text-muted-foreground">No session notes recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Patient Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="file-upload" className="block text-lg mb-2">Upload New Document</Label>
                <div className="flex items-center space-x-2">
                  <Input id="file-upload" type="file" onChange={handleFileUpload} className="w-auto" />
                  {/* <Button><UploadCloud className="mr-2 h-4 w-4" /> Upload (Placeholder)</Button> */}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB. Allowed types: PDF, DOCX, JPG, PNG.</p>
              </div>
               <hr/>
              <h3 className="font-headline text-xl mt-4">Uploaded Documents</h3>
              {documents.length > 0 ? (
                <ul className="space-y-3">
                  {documents.map(doc => (
                    <li key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-secondary/20">
                      <div>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{doc.name}</a>
                        <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadDate}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} download={doc.name} target="_blank">Download</a>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                 <div className="text-center py-6">
                  <Image src="https://placehold.co/200x150.png" alt="No documents" width={150} height={100} className="mx-auto rounded-md mb-2" data-ai-hint="empty folder document" />
                  <p className="text-muted-foreground">No documents uploaded for this patient yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
