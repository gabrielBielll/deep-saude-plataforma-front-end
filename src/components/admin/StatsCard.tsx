import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon | React.ElementType; // Aceita ícones do Lucide ou qualquer componente React como ícone
  description?: string;
  footerText?: string; // Texto adicional para o rodapé, ex: "+20% from last month"
  footerIcon?: LucideIcon | React.ElementType; // Ícone para o rodapé
  colorVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'default'; // Para estilização condicional
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

  // Mapeamento de variantes de cor para classes Tailwind (exemplo)
  // Você pode expandir isso ou usar CSS variables se preferir
  const colorClasses = {
    primary: 'text-admin-primary', // Usando as cores definidas no tailwind.config.ts
    success: 'text-admin-success',
    warning: 'text-admin-warning',
    danger: 'text-admin-danger',
    default: 'text-muted-foreground',
  };

  const iconColorClass = colorClasses[colorVariant] || colorClasses.default;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconColorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
      {footerText && (
        <CardFooter className="text-xs text-muted-foreground">
          {FooterIcon && <FooterIcon className={`h-4 w-4 mr-1 ${iconColorClass}`} />}
          {footerText}
        </CardFooter>
      )}
    </Card>
  );
}
