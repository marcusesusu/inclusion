// @/components/team/CertificateHeader.tsx
'use client';

import * as React from 'react';
import { getProviderByRegex, TabType } from '@/settings';

interface CertificateHeaderProps {
  verificationType?: string;
  message?: string;
  fallbackType?: TabType;
  status?: boolean;
}

export function CertificateHeader({
  verificationType,
  message,
  fallbackType,
  status,
}: CertificateHeaderProps) {
  const provider = React.useMemo(() => {
    return (
      getProviderByRegex(verificationType, fallbackType) ||
      getProviderByRegex(message, fallbackType)
    );
  }, [verificationType, message, fallbackType]);

  const displayType =
    verificationType?.replace(/_/g, ' ') || fallbackType?.replace(/_/g, ' ') || 'KYC Check';

  return (
    <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6 gap-4">
      {/* LEFT: Provider / Verification Logo */}
      <div className="flex items-center gap-3">
        {provider?.logo ? (
          <img
            src={provider.logo}
            alt={provider.label}
            className="h-10 w-auto max-w-[120px] object-contain"
            onError={(e) => {
              // Hide image if missing in /public/checker/
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
            KYC
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
            {displayType}
          </h3>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Verification System
          </p>
        </div>
      </div>

      {/* RIGHT: Platform Logo & Verification Status */}
      <div className="flex flex-col items-end gap-2 text-right">
        <img
          src="/inclusion_logo.png"
          alt="Platform Logo"
          className="h-8 w-auto object-contain max-w-[140px]"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span
          className={`inline-flex items-center px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full ${
            status
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-rose-100 text-rose-800 border border-rose-200'
          }`}
        >
          {status ? 'VERIFIED' : 'FAILED'}
        </span>
      </div>
    </div>
  );
}
