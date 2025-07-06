import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon | React.ElementType;
  description?: string;
  footerText?: string;
  footerIcon?: LucideIcon | React.ElementType;
  colorVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  footerText,
  footerIcon: FooterIcon,
  colorVariant = 'default',
}: StatsCardProps) {

  // Mapeamento de variantes de cor para classes Tailwind
  const colorClasses = {
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    default: 'text-muted-foreground',
  };

  const backgroundClasses = {
    primary: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    danger: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    default: '',
  };

  const iconColorClass = colorClasses[colorVariant] || colorClasses.default;
  const cardBackgroundClass = backgroundClasses[colorVariant] || backgroundClasses.default;

  return (
    <Card className={cardBackgroundClass}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconColorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {(footerText || FooterIcon) && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            {FooterIcon && <FooterIcon className={`h-3 w-3 mr-1 ${iconColorClass}`} />}
            {footerText && <span>{footerText}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
