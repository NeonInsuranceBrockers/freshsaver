"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState<{ [key: number]: boolean }>({});

  const apiKeys = [
    { id: 1, name: "Production API", key: "sk_live_1234567890abcdef", created: "2025-01-15", lastUsed: "2 hours ago" },
    { id: 2, name: "Development API", key: "sk_test_abcdef1234567890", created: "2025-01-10", lastUsed: "1 day ago" },
  ];

  const toggleKeyVisibility = (id: number) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + "•".repeat(16) + key.substring(key.length - 4);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for external integrations.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Key
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active API Keys</CardTitle>
          <CardDescription>Your API keys for accessing FreshSaver AI programmatically</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{apiKey.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Revoke
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Learn how to integrate with FreshSaver AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Authentication</p>
              <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Base URL</p>
              <code className="text-sm">https://api.freshsaverai.com/v1</code>
            </div>
            <Button variant="link" className="p-0">
              View Full Documentation →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
