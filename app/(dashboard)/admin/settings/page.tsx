"use client";

import { useState } from "react";
import {
  Settings,
  Globe,
  Mail,
  Shield,
  Zap,
  Save,
  AlertTriangle,
  Layout,
  Clock,
  CheckCircle2,
} from "lucide-react";
// 1. IMPORT TOAST AND TOASTER FROM SONNER
import { toast, Toaster } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Settings State Interface ---
interface GlobalSettings {
  general: {
    siteName: string;
    tagline: string;
    defaultLanguage: string;
  };
  email: {
    senderName: string;
    senderEmail: string;
    contactFormRecipient: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
  performance: {
    cacheEnabled: boolean;
    autoUpdateCheck: boolean;
  };
  ui: {
    defaultTheme: "light" | "dark" | "system";
    showWelcomeBanner: boolean;
  };
}

// --- Mock Data ---
const initialSettings: GlobalSettings = {
  general: {
    siteName: "Admin Dashboard Pro",
    tagline: "The ultimate platform management solution.",
    defaultLanguage: "en-US",
  },
  email: {
    senderName: "System Administrator",
    senderEmail: "no-reply@admindashboard.com",
    contactFormRecipient: "support@admindashboard.com",
  },
  security: {
    twoFactorEnabled: true,
    sessionTimeout: 60, // minutes
  },
  performance: {
    cacheEnabled: true,
    autoUpdateCheck: true,
  },
  ui: {
    defaultTheme: "light",
    showWelcomeBanner: true,
  },
};

// --- Main Component ---
export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings>(initialSettings);
  // Default to 'general' as requested
  const [activeSection, setActiveSection] =
    useState<keyof GlobalSettings>("general");
  const [isSaving, setIsSaving] = useState(false);

  // Helper to update nested state
  const handleInputChange = (
    section: keyof GlobalSettings,
    key: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);

    // Use toast.promise for asynchronous operations and clear feedback
    const savePromise = new Promise((resolve) => {
      setTimeout(() => {
        console.log("Saving settings:", settings);
        resolve("Settings saved successfully!"); // Resolve the promise
      }, 1500);
    });

    toast.promise(savePromise, {
      loading: "Saving configuration...",
      success: (data) => {
        setIsSaving(false);
        return `${data}`; // "Settings saved successfully!"
      },
      error: "Failed to save settings. Please try again.",
      duration: 3000,
      className: "border-slate-200",
    });
  };

  // Example of a secondary action toast
  const handleClearCache = () => {
    // Use a standard success toast for immediate actions
    toast.success("Application cache cleared!", {
      description: "The system is running on the latest data.",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      duration: 4000,
    });
  };

  // --- Navigation Items ---
  const navItems: {
    id: keyof GlobalSettings;
    name: string;
    icon: React.FC<any>;
  }[] = [
    { id: "general", name: "General", icon: Globe },
    { id: "email", name: "Email & Notifications", icon: Mail },
    { id: "security", name: "Security", icon: Shield },
    { id: "performance", name: "Performance & Caching", icon: Zap },
    { id: "ui", name: "User Interface", icon: Layout },
  ];

  // --- Settings Form Renderer (No changes to the content of cards) ---
  const renderSettingsSection = (section: keyof GlobalSettings) => {
    switch (section) {
      case "general":
        return (
          <Card id="general" className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">
                General Settings
              </CardTitle>
              <CardDescription>
                Configure the basic identity and language of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-slate-700">
                  Site Name
                </Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) =>
                    handleInputChange("general", "siteName", e.target.value)
                  }
                  className="focus-visible:ring-teal-500 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-slate-700">
                  Tagline
                </Label>
                <Input
                  id="tagline"
                  value={settings.general.tagline}
                  onChange={(e) =>
                    handleInputChange("general", "tagline", e.target.value)
                  }
                  className="focus-visible:ring-teal-500 border-slate-200"
                />
                <p className="text-xs text-slate-500 mt-1">
                  A short description displayed on the login page or footer.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="text-slate-700">
                  Default Language
                </Label>
                <Select
                  value={settings.general.defaultLanguage}
                  onValueChange={(val) =>
                    handleInputChange("general", "defaultLanguage", val)
                  }
                >
                  <SelectTrigger className="w-[200px] focus:ring-teal-500 border-slate-200">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent className="bg-card-white-bg border-slate-200">
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
                    <SelectItem value="fr-FR">French (France)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case "email":
        return (
          <Card id="email" className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">
                Email & Notifications
              </CardTitle>
              <CardDescription>
                Configure system email identity and routing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="senderName" className="text-slate-700">
                  System Sender Name
                </Label>
                <Input
                  id="senderName"
                  value={settings.email.senderName}
                  onChange={(e) =>
                    handleInputChange("email", "senderName", e.target.value)
                  }
                  className="focus-visible:ring-teal-500 border-slate-200"
                />
                <p className="text-xs text-slate-500 mt-1">
                  The name that appears in the "From" field of system emails.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderEmail" className="text-slate-700">
                  No-Reply Email Address
                </Label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={settings.email.senderEmail}
                  onChange={(e) =>
                    handleInputChange("email", "senderEmail", e.target.value)
                  }
                  className="focus-visible:ring-teal-500 border-slate-200"
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="contactRecipient" className="text-slate-700">
                  Contact Form Recipient
                </Label>
                <Textarea
                  id="contactRecipient"
                  value={settings.email.contactFormRecipient}
                  onChange={(e) =>
                    handleInputChange(
                      "email",
                      "contactFormRecipient",
                      e.target.value
                    )
                  }
                  className="focus-visible:ring-teal-500 border-slate-200"
                  rows={2}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Emails separated by a comma (e.g., `info@, support@`).
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "security":
        return (
          <Card id="security" className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">
                Security & Authentication
              </CardTitle>
              <CardDescription>
                Manage global security policies for all users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="twoFactorEnabled"
                    className="text-slate-700 flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4 text-teal-600" />
                    Two-Factor Authentication (2FA)
                  </Label>
                  <p className="text-sm text-slate-500">
                    Enforce 2FA for all administrative logins.
                  </p>
                </div>
                <Switch
                  id="twoFactorEnabled"
                  checked={settings.security.twoFactorEnabled}
                  onCheckedChange={(val) =>
                    handleInputChange("security", "twoFactorEnabled", val)
                  }
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sessionTimeout"
                  className="text-slate-700 flex items-center gap-2"
                >
                  <Clock className="h-4 w-4 text-slate-500" />
                  Session Timeout (Minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min={10}
                  max={120}
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    handleInputChange(
                      "security",
                      "sessionTimeout",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-[150px] focus-visible:ring-teal-500 border-slate-200"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Users will be logged out after this period of inactivity.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "performance":
        return (
          <Card id="performance" className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">
                Performance & Caching
              </CardTitle>
              <CardDescription>
                Optimize application speed and resource usage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="cacheEnabled"
                    className="text-slate-700 flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4 text-teal-600" />
                    Enable Data Caching
                  </Label>
                  <p className="text-sm text-slate-500">
                    Caches common API requests to improve page load speed.
                  </p>
                </div>
                <Switch
                  id="cacheEnabled"
                  checked={settings.performance.cacheEnabled}
                  onCheckedChange={(val) =>
                    handleInputChange("performance", "cacheEnabled", val)
                  }
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>

              <div className="flex items-center justify-between space-x-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <Label htmlFor="autoUpdateCheck" className="text-slate-700">
                    Auto Update Check
                  </Label>
                  <p className="text-sm text-slate-500">
                    Automatically check for new application versions on startup.
                  </p>
                </div>
                <Switch
                  id="autoUpdateCheck"
                  checked={settings.performance.autoUpdateCheck}
                  onCheckedChange={(val) =>
                    handleInputChange("performance", "autoUpdateCheck", val)
                  }
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>

              <Separator />

              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-slate-700 font-medium">
                  Clear Application Cache
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearCache}
                  className="text-amber-600 border-amber-300 hover:bg-amber-50"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "ui":
        return (
          <Card id="ui" className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">
                User Interface & Theming
              </CardTitle>
              <CardDescription>
                Set default appearance and informational banners.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultTheme" className="text-slate-700">
                  Default Theme
                </Label>
                <Select
                  value={settings.ui.defaultTheme}
                  onValueChange={(val) =>
                    handleInputChange("ui", "defaultTheme", val)
                  }
                >
                  <SelectTrigger className="w-[200px] focus:ring-teal-500 border-slate-200">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-card-white-bg border-slate-200">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  The default theme for new users.
                </p>
              </div>

              <div className="flex items-center justify-between space-x-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <Label htmlFor="showWelcomeBanner" className="text-slate-700">
                    Show Welcome Banner
                  </Label>
                  <p className="text-sm text-slate-500">
                    Display the admin welcome banner on the dashboard for all
                    users.
                  </p>
                </div>
                <Switch
                  id="showWelcomeBanner"
                  checked={settings.ui.showWelcomeBanner}
                  onCheckedChange={(val) =>
                    handleInputChange("ui", "showWelcomeBanner", val)
                  }
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    // Base layout matching the dashboard aesthetic
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      <Toaster position="bottom-right" richColors theme="light" />

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Settings className="h-7 w-7 text-teal-600" />
            Global Settings
          </h1>
          <p className="text-slate-500 mt-1">
            Manage application-wide configurations for security, email, and
            performance.
          </p>
        </div>
      </div>

      {/* 2. Main Content Area (Two Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Left Column: Tab Navigation */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-xs font-semibold uppercase text-slate-500 mb-3">
            Sections
          </h3>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                // Use a standard button for the tab click
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-teal-50 border border-teal-200 text-teal-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                } justify-start`} // Ensure content aligns left
              >
                <item.icon
                  className={`h-4 w-4 mr-3 ${isActive ? "text-teal-600" : "text-slate-400"}`}
                />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Settings Form and Save Button */}
        <div className="md:col-span-3 lg:col-span-4 space-y-8">
          {/* RENDER ONLY THE ACTIVE SECTION */}
          {renderSettingsSection(activeSection)}

          {/* SAVE BUTTON (CONTEXTUAL PLACEMENT) */}
          <div className="flex justify-end pt-4 pb-8">
            {" "}
            {/* Added padding for separation */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-teal-600 hover:bg-teal-700 text-white shadow-md w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
