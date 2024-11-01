import React from 'react';
import { Sprint } from '../../types';
import { ThumbsUp, AlertTriangle, Target } from 'lucide-react';

interface SprintMetricsProps {
  sprint: Sprint;
}

export const SprintMetrics: React.FC<SprintMetricsProps> = ({ sprint }) => {
  if (!sprint.retrospectiva) return null;

  const { bueno, mejorar, acciones } = sprint.retrospectiva;

  const renderList = (items: string[], icon: React.ReactNode, title: string) => (
    <div className="mb-4">
      <h5 className="text-sm font-medium text-gray-900 flex items-center mb-2">
        {icon}
        <span className="ml-2">{title}</span>
      </h5>
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-600">{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="text-md font-medium text-gray-900 mb-4">Retrospectiva</h4>
      
      {renderList(bueno, <ThumbsUp className="h-4 w-4 text-green-500" />, 'Lo que salió bien')}
      {renderList(mejorar, <AlertTriangle className="h-4 w-4 text-yellow-500" />, 'Puntos a mejorar')}
      {renderList(acciones, <Target className="h-4 w-4 text-blue-500" />, 'Acciones a tomar')}
    </div>
  );
};