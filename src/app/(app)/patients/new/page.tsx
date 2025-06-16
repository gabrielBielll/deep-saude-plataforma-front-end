'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function NewPatientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    console.log("New patient data:", formData);
    toast({
      title: "Patient Added (Mock)",
      description: `${formData.name} has been successfully added to your directory.`,
      className: "bg-primary text-primary-foreground",
    });
    // Redirect to patients list or the new patient's detail page
    router.push('/patients'); 
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-start mb-6">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/patients">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-headline text-3xl">Add New Patient</h1>
          <p className="text-muted-foreground">Enter the details for the new patient profile.</p>
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <UserPlus className="mr-3 h-7 w-7 text-primary" /> Patient Details
          </CardTitle>
          <CardDescription>
            Please fill in all required fields accurately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="e.g., John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={formData.dob} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g., john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="e.g., +1-555-123-4567" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={formData.address} onChange={handleChange} placeholder="e.g., 123 Wellness St, Tranquility City, CA 90210" className="min-h-[100px]" />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg">
                <Save className="mr-2 h-5 w-5" /> Save Patient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
