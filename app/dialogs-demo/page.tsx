"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  WelcomeDialog,
  SignUpDialog,
  LoginDialog,
  EmailVerificationDialog,
  ForgotPasswordDialog,
  CreatePasswordDialog,
  PasswordSuccessDialog,
  SubmitEssayDialog,
  FinishDialog
} from "@/components/dialogs";

export default function DialogsDemo() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const dialogs = [
    { id: 'welcome', label: 'Welcome Dialog', component: WelcomeDialog },
    { id: 'signup', label: 'Sign Up Dialog', component: SignUpDialog },
    { id: 'login', label: 'Login Dialog', component: LoginDialog },
    { id: 'verification', label: 'Email Verification Dialog', component: EmailVerificationDialog },
    { id: 'forgot', label: 'Forgot Password Dialog', component: ForgotPasswordDialog },
    { id: 'createPassword', label: 'Create Password Dialog', component: CreatePasswordDialog },
    { id: 'passwordSuccess', label: 'Password Success Dialog', component: PasswordSuccessDialog },
    { id: 'submit1', label: 'Submit Essay 1 Dialog', component: SubmitEssayDialog },
    { id: 'submit2', label: 'Submit Essay 2 Dialog', component: SubmitEssayDialog },
    { id: 'finish', label: 'Finish Dialog', component: FinishDialog }
  ];

  const openDialog = (dialogId: string) => setActiveDialog(dialogId);
  const closeDialog = () => setActiveDialog(null);

  const handleAuthFlow = (from: string, to: string) => {
    setActiveDialog(to);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dialog Components Demo</h1>
          <p className="text-gray-600">Click any button below to preview the dialog components</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dialogs.map((dialog) => (
            <Button
              key={dialog.id}
              onClick={() => openDialog(dialog.id)}
              variant="outline"
              className="p-4 h-auto text-left justify-start"
            >
              <div>
                <div className="font-medium text-gray-900">{dialog.label}</div>
                <div className="text-sm text-gray-500 mt-1">Click to preview</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Dialog Components */}
        <WelcomeDialog
          open={activeDialog === 'welcome'}
          onOpenChange={(open) => !open && closeDialog()}
          userName="Demo User"
        />

        <SignUpDialog
          open={activeDialog === 'signup'}
          onOpenChange={(open) => !open && closeDialog()}
          onSwitchToLogin={() => handleAuthFlow('signup', 'login')}
        />

        <LoginDialog
          open={activeDialog === 'login'}
          onOpenChange={(open) => !open && closeDialog()}
          onSwitchToSignUp={() => handleAuthFlow('login', 'signup')}
          onForgotPassword={() => handleAuthFlow('login', 'forgot')}
        />

        <EmailVerificationDialog
          open={activeDialog === 'verification'}
          onOpenChange={(open) => !open && closeDialog()}
          email="demo@example.com"
        />

        <ForgotPasswordDialog
          open={activeDialog === 'forgot'}
          onOpenChange={(open) => !open && closeDialog()}
          onBackToLogin={() => handleAuthFlow('forgot', 'login')}
        />

        <SubmitEssayDialog
          open={activeDialog === 'submit1'}
          onOpenChange={(open) => !open && closeDialog()}
          essayNumber={1}
          wordCount={0}
          timeUsed="02:35:10"
        />

        <SubmitEssayDialog
          open={activeDialog === 'submit2'}
          onOpenChange={(open) => !open && closeDialog()}
          essayNumber={2}
          wordCount={0}
          timeUsed="02:35:10"
        />

        <CreatePasswordDialog
          open={activeDialog === 'createPassword'}
          onOpenChange={(open) => !open && closeDialog()}
        />

        <PasswordSuccessDialog
          open={activeDialog === 'passwordSuccess'}
          onOpenChange={(open) => !open && closeDialog()}
        />

        <FinishDialog
          open={activeDialog === 'finish'}
          onOpenChange={(open) => !open && closeDialog()}
        />

        <div className="mt-16 p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Examples</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Import dialogs:</h3>
              <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
{`import {
  WelcomeDialog,
  LoginDialog,
  SignUpDialog,
  // ... other dialogs
} from '@/components/dialogs';`}
              </pre>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Basic usage:</h3>
              <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
{`const [showLogin, setShowLogin] = useState(false);

<LoginDialog
  open={showLogin}
  onOpenChange={setShowLogin}
  onSwitchToSignUp={() => setShowSignUp(true)}
  onForgotPassword={() => setShowForgot(true)}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}