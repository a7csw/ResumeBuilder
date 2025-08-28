import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LockedNameFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  isLocked: boolean;
  className?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

const LockedNameField = ({ 
  id, 
  label, 
  value, 
  placeholder, 
  isLocked, 
  className,
  required = false,
  onChange
}: LockedNameFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-semibold">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {isLocked && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Lock className="h-4 w-4 text-amber-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This field is locked to protect the integrity of your account. Contact support if you believe this is an error.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="relative">
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          disabled={isLocked}
          readOnly={isLocked}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className={cn(
            "transition-all duration-200",
            isLocked 
              ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed" 
              : "focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          )}
        />
        {isLocked && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Lock className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </div>
      
      {isLocked && (
        <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            This field is locked to protect the integrity of your account. Contact support if you believe this is an error.
          </p>
        </div>
      )}
    </div>
  );
};

export default LockedNameField;
