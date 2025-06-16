'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Lock } from "lucide-react";
import { useRouter } from 'next/navigation'; // Corrected import

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Mock login logic
    // In a real app, this would involve OAuth flow with Google
    console.log("Attempting Google Login...");
    // For now, redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-primary" />
            <h1 className="font-headline text-4xl font-bold text-primary ml-2">AgendaWise</h1>
          </div>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to manage your appointments and patient notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
              <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Sign in with Google
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground flex items-center justify-center">
              <Lock className="h-4 w-4 mr-2" /> Secure Login via Google OAuth
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
