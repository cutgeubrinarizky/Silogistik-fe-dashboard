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
      <CardContent className="grid gap-4">
        <Button asChild variant="outline" className="h-16 justify-start">
          <Link to="/shipments/new">
            <Package className="mr-2 h-5 w-5" /> Pengiriman Baru
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-16 justify-start">
          <Link to="/shipments">
            <Search className="mr-2 h-5 w-5" /> Lacak Resi
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-16 justify-start">
          <Link to="/labels">
            <Printer className="mr-2 h-5 w-5" /> Cetak Label
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
