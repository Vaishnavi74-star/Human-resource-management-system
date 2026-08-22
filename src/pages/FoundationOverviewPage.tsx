import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  FolderTree,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export const FoundationOverviewPage: React.FC = () => {
  const folders = [
    { name: 'src/components/', desc: '12+ atomic & molecular UI components (Button, Modal, Toast, Card, etc.)' },
    { name: 'src/layouts/', desc: 'Application shell with responsive Sidebar, Topbar with Search & Profile' },
    { name: 'src/pages/', desc: 'View orchestration layer (Dashboard, Showcase, Architecture overview)' },
    { name: 'src/routes/', desc: 'React Router v7 client routing declarations and route guards' },
    { name: 'src/services/', desc: 'REST API client abstractions with clean separation from UI logic' },
    { name: 'src/hooks/', desc: 'Custom hooks (useToast, useDisclosure, useDebounce)' },
    { name: 'src/contexts/', desc: 'Global state contexts for Authentication (Role switching) and Toasts' },
    { name: 'src/types/', desc: 'Strict TypeScript interfaces for User, Navigation, Status, and Props' },
    { name: 'src/data/', desc: 'Mock datasets, navigation structure, and notification feeds' },
    { name: 'src/utils/', desc: 'Utility helpers: cn(), date & currency formatters, app constants' },
    { name: 'src/assets/', desc: 'Original DAYFLOW dynamic vector logo and brand assets' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            DAYFLOW Architecture & Foundation
          </h1>
          <Badge variant="primary" size="sm">
            Production Quality
          </Badge>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          "Every workday, perfectly aligned." — Modern SaaS HRMS Architectural Specification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Principles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Production Directory Layout</CardTitle>
                <CardDescription>Modular separation of presentation, data, and business logic</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {folders.map((f) => (
                <div
                  key={f.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors"
                >
                  <span className="font-mono text-xs font-semibold text-indigo-700">{f.name}</span>
                  <span className="text-xs text-slate-600 sm:text-right mt-1 sm:mt-0">{f.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack Specs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Technology Stack</CardTitle>
                  <CardDescription>Modern frontend toolchain</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-medium text-slate-600">Framework</span>
                <span className="font-semibold text-slate-900">React 19 + TypeScript</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-medium text-slate-600">Build Tool</span>
                <span className="font-semibold text-slate-900">Vite 8.2 (Lightning HMR)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-medium text-slate-600">Styling Engine</span>
                <span className="font-semibold text-slate-900">Tailwind CSS + PostCSS</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-medium text-slate-600">Routing</span>
                <span className="font-semibold text-slate-900">React Router v7</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-medium text-slate-600">Data Visualization</span>
                <span className="font-semibold text-slate-900">Recharts Ready</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="font-medium text-slate-600">Icons</span>
                <span className="font-semibold text-slate-900">Lucide + Heroicons</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Role-Based Security</CardTitle>
                  <CardDescription>Employee & Admin/HR views</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                The foundation includes dynamic role toggling between <strong>ADMIN</strong> and{' '}
                <strong>EMPLOYEE</strong>. Navigation items like <em>Payroll & Benefits</em> dynamically adjust
                visibility based on the active role context.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
