import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  count: number;
  changeText: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  iconBgColor: string;
  iconColor: string;
  periodText: string;
}

export function SummaryCard({
  title,
  count,
  changeText,
  changeType,
  icon,
  iconBgColor,
  iconColor,
  periodText
}: SummaryCardProps) {
  const changeColor = 
    changeType === 'positive' ? 'text-green-600' : 
    changeType === 'negative' ? 'text-red-600' : 
    'text-neutral-500';

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-600 text-sm">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{count.toLocaleString()}</h3>
          </div>
          <div className={cn("rounded-full p-2", iconBgColor)}>
            <Icon name={icon} className={iconColor} />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className={cn("flex items-center", changeColor)}>
            <Icon name={changeType === 'positive' ? 'arrow_upward' : 'arrow_downward'} className="mr-1 h-4 w-4" />
            {changeText}
          </span>
          <span className="text-neutral-500 ml-2">{periodText}</span>
        </div>
      </CardContent>
    </Card>
  );
}
