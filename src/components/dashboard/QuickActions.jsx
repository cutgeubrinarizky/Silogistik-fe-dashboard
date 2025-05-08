import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Search, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#0C4A6E]">Akses Cepat</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button asChild variant="outline" className="h-16 justify-start border-[#0C4A6E] hover:bg-[#0C4A6E] hover:text-white transition-colors">
          <Link to="/shipments/new">
            <Package className="mr-2 h-5 w-5 text-[#FF6B2C]" /> Pengiriman Baru
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-16 justify-start border-[#0C4A6E] hover:bg-[#0C4A6E] hover:text-white transition-colors">
          <Link to="/shipments">
            <Search className="mr-2 h-5 w-5 text-[#FF6B2C]" /> Lacak Resi
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-16 justify-start border-[#0C4A6E] hover:bg-[#0C4A6E] hover:text-white transition-colors">
          <Link to="/labels">
            <Printer className="mr-2 h-5 w-5 text-[#FF6B2C]" /> Cetak Label
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
