'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bell, CalendarCog, UserCog, Palette, ShieldCheck, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [isCalendarSynced, setIsCalendarSynced] = useState(false); // Mock state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();

  const handleGoogleCalendarSync = () => {
    // Placeholder for OAuth flow
    setIsCalendarSynced(!isCalendarSynced);
    toast({
      title: `Google Calendar ${!isCalendarSynced ? 'Sync Enabled' : 'Sync Disabled'} (Mock)`,
      description: `Your calendar integration status has been updated.`,
      className: "bg-primary text-primary-foreground"
    });
  };

  const handleSaveChanges = () => {
    // Placeholder for saving settings
    toast({
      title: "Settings Saved (Mock)",
      description: "Your preferences have been updated successfully.",
      className: "bg-primary text-primary-foreground"
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Application Settings</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Customize your AgendaWise experience.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><CalendarCog className="mr-2 h-6 w-6 text-primary" />Calendar Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="google-calendar-sync" className="text-base font-medium">Google Calendar Sync</Label>
              <p className="text-sm text-muted-foreground">
                {isCalendarSynced ? "Your calendar is currently synced." : "Connect your Google Calendar to manage appointments."}
              </p>
            </div>
            <Button onClick={handleGoogleCalendarSync} variant={isCalendarSynced ? "outline" : "default"}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {isCalendarSynced ? 'Disconnect Google Calendar' : 'Connect Google Calendar'}
            </Button>
          </div>
          {isCalendarSynced && (
            <Card className="bg-secondary/30 p-4">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-md">Sync Options</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="two-way-sync" defaultChecked />
                  <Label htmlFor="two-way-sync">Enable two-way sync</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="private-events" />
                  <Label htmlFor="private-events">Sync private events as "Busy"</Label>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><UserCog className="mr-2 h-6 w-6 text-primary" />Account Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profileName">Display Name</Label>
            <Input id="profileName" defaultValue="AgendaWise User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileEmail">Email Address</Label>
            <Input id="profileEmail" type="email" defaultValue="user@agendawise.com" />
          </div>
           <div className="flex items-center space-x-2">
            <Switch
              id="notifications-enabled"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
            <Label htmlFor="notifications-enabled" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" /> Enable Email Notifications
            </Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Palette className="mr-2 h-6 w-6 text-primary" />Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
                <Switch id="dark-mode" disabled /> {/* Dark mode toggle could be implemented here */}
                <Label htmlFor="dark-mode">Enable Dark Mode (Coming Soon)</Label>
            </div>
            <p className="text-sm text-muted-foreground">Customize the look and feel of the application.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-primary" />Security & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button variant="outline">Change Password (Placeholder)</Button>
            <Button variant="outline">Export My Data (Placeholder)</Button>
            <p className="text-sm text-muted-foreground">Manage your account security and data privacy settings.</p>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={handleSaveChanges}>Save All Settings</Button>
      </div>
    </div>
  );
}
