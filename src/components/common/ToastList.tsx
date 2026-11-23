import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckIcon, CloseIcon, InfoIcon } from './Icons';

export const ToastList: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-md bg-[#161B26] border border-[#2C3549] text-white shadow-elevated animate-pop"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center justify-center w-6 h-6 rounded ${
                  isSuccess
                    ? 'bg-[#10B981] text-black'
                    : isError
                    ? 'bg-[#E50914] text-white'
                    : 'bg-[#2563EB] text-white'
                }`}
              >
                {isSuccess && <CheckIcon size={14} />}
                {isError && <CloseIcon size={14} />}
                {!isSuccess && !isError && <InfoIcon size={14} />}
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-100">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1D2332] transition-colors focus:outline-none"
              aria-label="Close notification"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
