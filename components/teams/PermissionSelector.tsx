// @/components/team/PermissionSelector.tsx
'use client';

import * as React from 'react';
import { VERIFICATION_PROVIDERS, TabType } from '@/settings';

interface PermissionSelectorProps {
  selectedPermissions: TabType[];
  onChange: (permissions: TabType[]) => void;
}

export function PermissionSelector({
  selectedPermissions,
  onChange,
}: PermissionSelectorProps) {
  const togglePermission = (key: TabType) => {
    if (selectedPermissions.includes(key)) {
      onChange(selectedPermissions.filter((p) => p !== key));
    } else {
      onChange([...selectedPermissions, key]);
    }
  };

  const toggleAll = () => {
    if (selectedPermissions.length === VERIFICATION_PROVIDERS.length) {
      onChange([]);
    } else {
      onChange(VERIFICATION_PROVIDERS.map((p) => p.key));
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground">
          Allowed Verification Checkers
        </label>
        <button
          type="button"
          onClick={toggleAll}
          className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
        >
          {selectedPermissions.length === VERIFICATION_PROVIDERS.length
            ? 'Deselect All'
            : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-border rounded-xl bg-accent/30">
        {VERIFICATION_PROVIDERS.map((provider) => {
          const isChecked = selectedPermissions.includes(provider.key);
          return (
            <label
              key={provider.key}
              className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                isChecked
                  ? 'border-primary/50 bg-primary/5 text-foreground font-semibold'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => togglePermission(provider.key)}
                className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
              />
              <img
                src={provider.logo}
                alt=""
                className="h-4 w-4 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="truncate">{provider.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
