
import React from 'react';
import LabelGenerator from '@/components/labels/LabelGenerator';

const Labels = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-modern-primary to-modern-accent">Cetak Label & Invoice</h1>
      <LabelGenerator />
    </div>
  );
};

export default Labels;
