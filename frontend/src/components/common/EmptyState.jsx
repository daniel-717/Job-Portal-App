import { Frown } from 'lucide-react';

const EmptyState = ({ message = "No items found." }) => {
  return (
    <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
      <Frown className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No Results</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;