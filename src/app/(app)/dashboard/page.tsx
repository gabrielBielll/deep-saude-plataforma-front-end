import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Users, FileText, Brain } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Welcome to AgendaWise!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your central hub for managing appointments, patients, and session insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Here you can quickly access your upcoming appointments, recent patient activity, and utilize AI-powered tools to enhance your practice.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-xl">Upcoming Appointments</CardTitle>
            <CalendarCheck className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              scheduled for this week
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/calendar">View Calendar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-xl">Active Patients</CardTitle>
            <Users className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              currently in your roster
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/patients">Manage Patients</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-xl">AI Note Insights</CardTitle>
            <Brain className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-2">
              Analyze session notes for keywords, themes, and insights.
            </p>
            <Button asChild variant="outline" className="mt-4">
               {/* This might link to a specific patient's notes or a general notes section */}
              <Link href="/patients">Go to Patient Notes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/calendar?action=new">
              <CalendarCheck className="mr-2 h-5 w-5" /> New Appointment
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/patients?action=new">
              <Users className="mr-2 h-5 w-5" /> Add New Patient
            </Link>
          </Button>
           <Button asChild variant="secondary" size="lg">
            <Link href="/patients">
              <FileText className="mr-2 h-5 w-5" /> View Session Notes
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <div className="mt-8 p-6 bg-secondary/30 rounded-lg shadow">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="Calm workspace" 
            width={300} 
            height={200} 
            className="rounded-lg shadow-md"
            data-ai-hint="workspace calm" 
          />
          <div>
            <h3 className="font-headline text-xl text-primary mb-2">Stay Organized, Stay Mindful</h3>
            <p className="text-muted-foreground">
              AgendaWise is designed to provide a calm and focused environment for your practice. 
              Leverage powerful tools while maintaining a sense of tranquility and control.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
