
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Search, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Akses Cepat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full justify-start" variant="default">
          <Link to="/shipments/new">
            <Package size={18} className="mr-2" /> Pengiriman Baru
          </Link>
        </Button>
        
        <Button asChild className="w-full justify-start" variant="outline">
          <Link to="/track">
            <Search size={18} className="mr-2" /> Lacak Resi
          </Link>
        </Button>
        
        <Button asChild className="w-full justify-start" variant="outline">
          <Link to="/labels">
            <Printer size={18} className="mr-2" /> Cetak Label
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
