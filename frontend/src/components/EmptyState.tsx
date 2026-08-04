import React from 'react';

interface EmptyStateProps {
  hasFilters: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters }) => {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">No notes</span>
      <h3>{hasFilters ? 'No notes found' : 'No notes yet'}</h3>
      <p>{hasFilters ? 'Try adjusting your search or filters.' : 'Create your first note to get started.'}</p>
    </div>
  );
};
