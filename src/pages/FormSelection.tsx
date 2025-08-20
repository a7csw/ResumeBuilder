import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import { 
  Star, 
  Briefcase, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight 
} from "lucide-react";

const FormSelection = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();

  const userTypes = [
    {
      id: "professional",
      title: "Professional",
      subtitle: "Experienced career professional",
      description: "Showcase your career progression, achievements, and leadership experience with executive-level templates.",
      icon: <Briefcase className="w-8 h-8" />,
      bgGradient: "from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20",
      iconBg: "bg-slate-100 dark:bg-slate-900/50",
      iconColor: "text-slate-600 dark:text-slate-400",
      tags: ["Career Growth", "Leadership", "Executive"]
    },
    {
      id: "freelancer",
      title: "Freelancer",
      subtitle: "Independent contractor or consultant",
      description: "Highlight your diverse projects, client testimonials, and specialized skills to attract premium clients.",
      icon: <Users className="w-8 h-8" />,
      bgGradient: "from-gray-50 to-zinc-50 dark:from-gray-900/20 dark:to-zinc-900/20",
      iconBg: "bg-gray-100 dark:bg-gray-900/50",
      iconColor: "text-gray-600 dark:text-gray-400",
      tags: ["Portfolio", "Clients", "Projects"]
    },
    {
      id: "student",
      title: "Student",
      subtitle: "Recent graduate or entry-level",
      description: "Emphasize your education, internships, and potential to land your first dream job or internship.",
      icon: <GraduationCap className="w-8 h-8" />,
      bgGradient: "from-zinc-50 to-slate-50 dark:from-zinc-900/20 dark:to-slate-900/20",
      iconBg: "bg-zinc-100 dark:bg-zinc-900/50",
      iconColor: "text-zinc-600 dark:text-zinc-400",
      tags: ["Education", "Internships", "Entry Level"]
    }
  ];

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (selectedType) {
      navigate(`/form/${selectedType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <NavigationHeader showBackButton={true} backTo="/" />
      
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-slate-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-full">
                <Star className="w-4 h-4" />
                Step 1 of 3
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 dark:from-slate-400 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent">
                What Describes You Best?
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Choose the option that best matches your career stage. We'll customize your resume form to highlight what matters most for your situation.
              </p>
            </div>

            {/* User Type Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {userTypes.map((type, index) => (
                <div
                  key={type.id}
                  onClick={() => handleSelectType(type.id)}
                  className={`
                    group relative p-8 bg-gradient-to-br ${type.bgGradient} rounded-3xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up
                    ${selectedType === type.id 
                      ? 'ring-4 ring-slate-500 dark:ring-slate-400 shadow-2xl scale-105' 
                      : 'hover:shadow-xl'
                    }
                  `}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Selection Indicator */}
                  {selectedType === type.id && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-slate-500 dark:bg-slate-400 rounded-full flex items-center justify-center animate-scale-in">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={`w-20 h-20 ${type.iconBg} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={type.iconColor}>
                      {type.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                      {type.title}
                    </h3>
                    <p className="text-sm font-medium mb-4 text-slate-600 dark:text-slate-400">
                      {type.subtitle}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {type.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="text-center animate-fade-in-up delay-800">
              <Button
                onClick={handleContinue}
                disabled={!selectedType}
                size="lg"
                className={`
                  px-12 py-6 text-lg transition-all duration-300 transform hover:scale-105
                  ${selectedType 
                    ? 'bg-gradient-to-r from-slate-700 via-gray-600 to-slate-600 hover:from-slate-800 hover:via-gray-700 hover:to-slate-700 shadow-xl hover:shadow-2xl' 
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }
                `}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Continue to Form
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              {!selectedType && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Please select a type to continue
                </p>
              )}
              
              {selectedType && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
                  Perfect! We'll customize your resume form for {userTypes.find(t => t.id === selectedType)?.title.toLowerCase()}s
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FormSelection;