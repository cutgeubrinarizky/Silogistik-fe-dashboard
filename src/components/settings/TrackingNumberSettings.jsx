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

  const handleDeletePrefix = (id) => {
    setPrefixes(prefixes.filter(prefix => prefix.id !== id));
    toast.success('Prefix berhasil dihapus');
  };

  const handleToggleActive = (id) => {
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
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Daftar Prefix</h3>
          </div>
          <div className="space-y-4">
            {prefixes.map((prefix) => (
              <div key={prefix.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="font-medium">
                    {prefix.prefix}
                    + {prefix.startNumber}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Contoh: {prefix.prefix}{prefix.startNumber}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={prefix.active} 
                      onCheckedChange={() => handleToggleActive(prefix.id)}
                      id={`active-${prefix.id}`}
                    />
                    <Label htmlFor={`active-${prefix.id}`}>
                      {prefix.active ? 'Aktif' : 'Nonaktif'}
                    </Label>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeletePrefix(prefix.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Tambah Prefix Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input 
                id="prefix"
                value={newPrefix} 
                onChange={(e) => setNewPrefix(e.target.value)} 
                placeholder="Contoh, JKT" 
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startNumber">Nomor Awal</Label>
              <Input 
                id="startNumber"
                value={newStartNumber} 
                onChange={(e) => setNewStartNumber(e.target.value)} 
                placeholder="Contoh: 00001" 
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddPrefix}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Prefix
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingNumberSettings;
