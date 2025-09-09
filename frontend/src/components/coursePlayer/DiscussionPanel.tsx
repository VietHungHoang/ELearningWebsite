// Placeholder discussion panel. Integrate with backend forum later.
import React from 'react';

const DiscussionPanel: React.FC = () => {
  return (
    <div className="space-y-3 text-sm text-gray-700">
      <p>Discussion forum will appear here. Students can post questions and replies.</p>
      <ul className="list-disc list-inside">
        <li>Keyboard accessible</li>
        <li>Threaded replies</li>
        <li>Moderation tools</li>
      </ul>
    </div>
  );
};

export default DiscussionPanel;


