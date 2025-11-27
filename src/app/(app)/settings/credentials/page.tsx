"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { saveAiApiKeyAction } from "./actions";

export default function CredentialsPage() {
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [formData, setFormData] = useState({ name: "", apiKey: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await saveAiApiKeyAction(formData);
    
    if (result.success) {
      alert(result.message);
      setFormData({ name: "", apiKey: "" });
      setIsAddingKey(false);
    } else {
      alert(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Credentials</h1>
        <p className="text-muted-foreground">
          Manage your API keys and credentials for third-party integrations.
        </p>
      </div>

      {/* Add New Credential Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsAddingKey(!isAddingKey)}>
          {isAddingKey ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Add API Key
            </>
          )}
        </Button>
      </div>

      {/* Add Credential Form */}
      {isAddingKey && (
        <Card className="animate-in fade-in slide-in-from-top-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2 text-blue-500" />
              Add New API Key
            </CardTitle>
            <CardDescription>
              Store your API keys securely. They will be encrypted before saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Credential Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., OpenAI API Key"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showKey ? "text" : "password"}
                    placeholder="sk-..."
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Credential"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Credentials */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Credentials</CardTitle>
          <CardDescription>
            Your stored API keys and credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Placeholder for existing credentials */}
            <div className="text-center py-8 text-muted-foreground">
              <Key className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No credentials saved yet</p>
              <p className="text-sm">Add your first API key to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">Security Notice</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200">
          <ul className="list-disc pl-5 space-y-1">
            <li>All API keys are encrypted before being stored in the database</li>
            <li>Keys are only decrypted when needed for API calls</li>
            <li>Never share your API keys with anyone</li>
            <li>Rotate your keys regularly for enhanced security</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
