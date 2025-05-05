
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Sample prefix data
const initialPrefixes = [
  { id: 1, prefix: 'CGO', startNumber: '00001', active: true },
  { id: 2, prefix: 'JKT', startNumber: '10000', active: false },
];

const TrackingNumberSettings = () => {
  const [prefixes, setPrefixes] = useState(initialPrefixes);
  const [newPrefix, setNewPrefix] = useState('');
  const [newStartNumber, setNewStartNumber] = useState('00001');

  const handleAddPrefix = () => {
    if (newPrefix.trim() === '') {
      toast.error('Prefix tidak boleh kosong');
      return;
    }

    const newId = prefixes.length > 0 ? Math.max(...prefixes.map(p => p.id)) + 1 : 1;
    
    setPrefixes([
      ...prefixes,
      {
        id: newId,
        prefix: newPrefix.toUpperCase(),
        startNumber: newStartNumber,
        active: false
      }
    ]);
    
    setNewPrefix('');
    setNewStartNumber('00001');
    
    toast.success('Prefix baru berhasil ditambahkan');
  };

  const handleDeletePrefix = (id: number) => {
    setPrefixes(prefixes.filter(prefix => prefix.id !== id));
    toast.success('Prefix berhasil dihapus');
  };

  const handleToggleActive = (id: number) => {
    setPrefixes(prefixes.map(prefix => 
      prefix.id === id ? { ...prefix, active: !prefix.active } : prefix
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Format Nomor Resi</CardTitle>
        <CardDescription>
          Atur format nomor resi otomatis untuk pengiriman
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Daftar Prefix</h3>
            </div>
            
            <div className="space-y-3">
              {prefixes.map((prefix) => (
                <div key={prefix.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="font-medium">{prefix.prefix}</div>
                      <div className="text-sm text-muted-foreground">+ {prefix.startNumber}</div>
                    </div>
                    <div className="text-xs mt-1 text-gray-500">
                      Contoh: {prefix.prefix}{prefix.startNumber}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={prefix.active} 
                        onCheckedChange={() => handleToggleActive(prefix.id)}
                        id={`active-${prefix.id}`}
                      />
                      <Label htmlFor={`active-${prefix.id}`} className="text-sm">
                        {prefix.active ? 'Aktif' : 'Nonaktif'}
                      </Label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeletePrefix(prefix.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-3">Tambah Prefix Baru</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prefix">Prefix</Label>
                <Input 
                  id="prefix" 
                  value={newPrefix} 
                  onChange={e => setNewPrefix(e.target.value)} 
                  placeholder="Contoh: CGO, JKT" 
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="start-number">Nomor Awal</Label>
                <Input 
                  id="start-number" 
                  value={newStartNumber} 
                  onChange={e => setNewStartNumber(e.target.value)} 
                  placeholder="Contoh: 00001" 
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddPrefix} className="w-full">
                  <Plus size={16} className="mr-2" /> Tambah Prefix
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingNumberSettings;
