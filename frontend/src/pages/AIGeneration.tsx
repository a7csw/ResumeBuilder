import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationHeader from "@/components/NavigationHeader";
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  Brain,
  Zap,
  Star
} from "lucide-react";

const AIGeneration = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, selectedPlan } = location.state || {};

  const steps = [
    {
      id: 1,
      title: "Analyzing Your Information",
      description: "Our AI is reviewing your experience and education to understand your background",
      icon: <Brain className="w-8 h-8" />,
      duration: 2000
    },
    {
      id: 2,
      title: "Optimizing Content",
      description: "Enhancing your descriptions with industry-specific keywords and power words",
      icon: <Zap className="w-8 h-8" />,
      duration: 3000
    },
    {
      id: 3,
      title: "Formatting Resume",
      description: "Applying professional formatting and ensuring ATS compatibility",
      icon: <FileText className="w-8 h-8" />,
      duration: 2500
    },
    {
      id: 4,
      title: "Final Optimization",
      description: "Adding finishing touches and validating the final result",
      icon: <Sparkles className="w-8 h-8" />,
      duration: 1500
    }
  ];

  useEffect(() => {
    if (!formData) {
      navigate("/form-selection", { replace: true });
      return;
    }

    let stepIndex = 0;
    const progressThroughSteps = () => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        
        setTimeout(() => {
          stepIndex++;
          if (stepIndex < steps.length) {
            progressThroughSteps();
          } else {
            // Last step completed - redirect immediately without showing completion state
            navigate("/resume-preview", { 
              state: { 
                resumeData: formData,
                selectedPlan: "free" 
              } 
            });
          }
        }, steps[stepIndex].duration);
      }
    };

    progressThroughSteps();
  }, [formData, navigate, steps]);

  // No longer needed - redirect happens immediately after last step

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader showBackButton={true} backTo="/plan-selection" />
      
      <section className="relative overflow-hidden py-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-slate-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-zinc-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">
                <Sparkles className="w-4 h-4" />
                AI Processing
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
                Building Your Perfect Resume
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Our AI is analyzing your information and creating a professional, ATS-optimized resume just for you.
              </p>
            </div>

            {/* AI Processing Steps */}
            <div className="space-y-8 mb-16">
                {steps.map((step, index) => {
                  const status = getStepStatus(index);
                  
                  return (
                    <div
                      key={step.id}
                      className={`
                        flex items-center gap-6 p-6 rounded-2xl transition-all duration-500 animate-fade-in-up
                        ${status === "current" 
                          ? "bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700" 
                          : status === "completed"
                          ? "bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700"
                          : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        }
                      `}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Step Icon */}
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                        ${status === "current" 
                          ? "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400" 
                          : status === "completed"
                          ? "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                        }
                      `}>
                        {status === "completed" ? (
                          <CheckCircle2 className="w-8 h-8" />
                        ) : status === "current" ? (
                          <div className="relative">
                            {step.icon}
                            <Loader2 className="w-4 h-4 absolute -top-1 -right-1 animate-spin" />
                          </div>
                        ) : (
                          step.icon
                        )}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1">
                        <h3 className={`
                          text-lg font-semibold mb-1 transition-colors duration-300
                          ${status === "current" || status === "completed" 
                            ? "text-slate-900 dark:text-white" 
                            : "text-slate-500 dark:text-slate-400"
                          }
                        `}>
                          {step.title}
                        </h3>
                        <p className={`
                          transition-colors duration-300
                          ${status === "current" || status === "completed"
                            ? "text-slate-600 dark:text-slate-300"
                            : "text-slate-400 dark:text-slate-500"
                          }
                        `}>
                          {step.description}
                        </p>
                      </div>

                      {/* Step Status */}
                      {status === "current" && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-sm font-medium">Processing...</span>
                        </div>
                      )}
                      
                      {status === "completed" && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Complete</span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIGeneration;
