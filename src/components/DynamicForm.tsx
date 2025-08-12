import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TemplateConfig, TemplateField, TemplateSection } from "@/lib/templateConfigs";

interface DynamicFormProps {
  config: TemplateConfig;
  resumeData: any;
  setResumeData: (data: any | ((prev: any) => any)) => void;
  userType: 'student' | 'professional' | 'freelancer';
  canUseAI: boolean;
  isViewMode?: boolean;
}

const DynamicForm = ({ 
  config, 
  resumeData, 
  setResumeData, 
  userType, 
  canUseAI, 
  isViewMode = false 
}: DynamicFormProps) => {
  const [newSkill, setNewSkill] = useState("");

  // Filter sections based on user type
  const getFilteredSections = (): TemplateSection[] => {
    return config.sections
      .filter(section => 
        !section.showForUserType || 
        section.showForUserType.includes(userType)
      )
      .sort((a, b) => a.priority - b.priority);
  };

  const updateFieldValue = (sectionId: string, fieldId: string, value: any) => {
    setResumeData((prev: any) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value
      }
    }));
  };

  const updateArrayValue = (sectionId: string, index: number, fieldId: string, value: any) => {
    setResumeData((prev: any) => {
      const array = prev[sectionId] || [];
      const newArray = [...array];
      newArray[index] = {
        ...newArray[index],
        [fieldId]: value
      };
      return {
        ...prev,
        [sectionId]: newArray
      };
    });
  };

  const addArrayItem = (sectionId: string, template: any) => {
    setResumeData((prev: any) => ({
      ...prev,
      [sectionId]: [
        ...(prev[sectionId] || []),
        { ...template, id: Date.now().toString() }
      ]
    }));
  };

  const removeArrayItem = (sectionId: string, index: number) => {
    setResumeData((prev: any) => {
      const array = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: array.filter((_: any, i: number) => i !== index)
      };
    });
  };

  const addSkill = (sectionId: string) => {
    if (newSkill.trim()) {
      setResumeData((prev: any) => ({
        ...prev,
        [sectionId]: [...(prev[sectionId] || []), newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (sectionId: string, skill: string) => {
    setResumeData((prev: any) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).filter((s: string) => s !== skill)
    }));
  };

  const renderField = (field: TemplateField, sectionId: string, value: any, onChange: (value: any) => void) => {
    const fieldProps = {
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
      disabled: isViewMode,
      className: "transition-smooth focus:ring-2 focus:ring-primary/20 focus:border-primary"
    };

    switch (field.type) {
      case 'text':
        return (
          <Input
            {...fieldProps}
            type={field.id === 'email' ? 'email' : 'text'}
            placeholder={field.placeholder}
          />
        );
      case 'textarea':
        return (
          <Textarea
            {...fieldProps}
            placeholder={field.placeholder}
            rows={3}
          />
        );
      case 'date':
        return (
          <Input
            {...fieldProps}
            type="date"
          />
        );
      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange} disabled={isViewMode}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const renderArrayField = (field: TemplateField, sectionId: string) => {
    const arrayData = resumeData[sectionId] || [];

    if (field.arrayType === 'simple' && sectionId === 'skills') {
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {arrayData.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
                {!isViewMode && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 h-auto p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeSkill(sectionId, skill)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
          {!isViewMode && (
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === 'Enter' && addSkill(sectionId)}
              />
              <Button onClick={() => addSkill(sectionId)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (field.arrayType === 'object' && field.fields) {
      const getDefaultObject = () => {
        const obj: any = { id: Date.now().toString() };
        field.fields?.forEach(f => {
          obj[f.id] = '';
        });
        return obj;
      };

      return (
        <div className="space-y-4">
          {arrayData.map((item: any, index: number) => (
            <div key={item.id || index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  {field.fields?.map(subField => (
                    <div key={subField.id} className="space-y-2">
                      <Label className="text-sm font-semibold">
                        {subField.label}
                        {subField.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {renderField(
                        subField,
                        sectionId,
                        item[subField.id],
                        (value) => updateArrayValue(sectionId, index, subField.id, value)
                      )}
                    </div>
                  ))}
                </div>
                {!isViewMode && (
                  <Button
                    onClick={() => removeArrayItem(sectionId, index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!isViewMode && (
            <Button
              onClick={() => addArrayItem(sectionId, getDefaultObject())}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {field.label.slice(0, -1)} {/* Remove 's' from plural */}
            </Button>
          )}
        </div>
      );
    }

    return null;
  };

  const renderSection = (section: TemplateSection) => {
    return (
      <Card key={section.id} className="hover-lift animate-fade-in-up">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {section.name}
            </CardTitle>
            {section.showForUserType && (
              <Badge variant="outline" className="text-xs">
                {section.showForUserType.includes('student') ? 'Student' : 
                 section.showForUserType.includes('professional') ? 'Professional' : 'Freelancer'} Focus
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {section.fields.map(field => {
            if (field.type === 'array') {
              return (
                <div key={field.id} className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    {field.label}
                    {canUseAI && !isViewMode && (
                      <Button size="sm" variant="ghost" className="text-primary">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Enhance
                      </Button>
                    )}
                  </Label>
                  {renderArrayField(field, section.id)}
                </div>
              );
            } else {
              return (
                <div key={field.id} className="space-y-2">
                  <Label className="text-sm font-semibold">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderField(
                    field,
                    section.id,
                    resumeData[section.id]?.[field.id],
                    (value) => updateFieldValue(section.id, field.id, value)
                  )}
                </div>
              );
            }
          })}
        </CardContent>
      </Card>
    );
  };

  const filteredSections = getFilteredSections();

  return (
    <div className="space-y-6">
      {/* Template Info */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {config.name}
            </span>
            <Badge variant="outline">
              <Sparkles className="w-3 h-3 mr-1" />
              {config.category}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </CardHeader>
      </Card>

      {/* Dynamic Sections */}
      {filteredSections.map(renderSection)}
    </div>
  );
};

export default DynamicForm;