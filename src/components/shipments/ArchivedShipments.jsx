import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Archive, Eye, Undo2, Filter, RefreshCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const ArchivedShipments = ({
  shipments = [],
  isLoading,
  error,
  refetch,
  onUnarchive,
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    date: "all",
  });

  const navigate = useNavigate();

  const handleUnarchive = (id, e) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin membatalkan arsip pengiriman ini?")) {
      onUnarchive(id);
    }
  };

  const handleViewDetails = (shipment, e) => {
    e.stopPropagation();
    navigate("/shipments/new", { state: { shipment } });
  };

  // Helper function untuk menghitung total berat
  const calculateTotalWeight = (items) => {
    return items.reduce(
      (sum, item) => sum + Number(item.weight) * Number(item.quantity),
      0
    );
  };

  // Filter shipments berdasarkan search
  const filteredShipments = Array.isArray(shipments)
    ? shipments.filter(
        (s) =>
          search === "" ||
          (s.tracking_number || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (s.sender_name || s.sender?.name || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (s.recipient_name || s.recipient?.name || "")
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    : [];

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Terjadi kesalahan: {error.message}</p>
        <Button onClick={refetch} className="mt-4 bg-[#0C4A6E]">
          <RefreshCcw className="h-4 w-4 mr-2" /> Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* <div className="p-2 bg-[#FF6B2C]/10 rounded-lg">
            <Archive className="h-5 w-5 text-[#FF6B2C]" />
          </div> */}
          <CardTitle className="text-[#0C4A6E] text-xl font-semibold">
            Arsip Pengiriman
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-gray-50/80 rounded-lg p-1 gap-1.5">
            <Input
              placeholder="Cari pengiriman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56 border-0 bg-transparent focus:ring-0 placeholder:text-gray-400 text-sm"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-[#FF6B2C]"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={filter.date}
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, date: value }))
            }
          >
            <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
              <SelectValue placeholder="Tanggal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tanggal</SelectItem>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#0C4A6E]" />
            <span className="ml-3 text-[#0C4A6E]">Memuat data...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="text-[#0C4A6E]/70 font-medium">
                  Nomor Resi
                </TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">
                  Pengirim
                </TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">
                  Penerima
                </TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">
                  Kota Asal
                </TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">
                  Kota Tujuan
                </TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">
                  Berat
                </TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">
                  Kurir
                </TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">
                  Tanggal
                </TableHead>
                <TableHead className="text-right text-[#0C4A6E]/70 font-medium">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-10 text-gray-500"
                  >
                    Tidak ada data pengiriman yang diarsipkan
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow
                    key={shipment.id}
                    className="cursor-pointer hover:bg-gray-50/80 transition-all border-b border-gray-100"
                    onClick={() => navigate(`/shipments/${shipment.id}`)}
                  >
                    <TableCell className="font-medium text-[#0C4A6E]">
                      {shipment.tracking_number}
                    </TableCell>
                    <TableCell className="text-[#0C4A6E]/80">
                      {shipment.sender_name || shipment.sender?.name}
                    </TableCell>
                    <TableCell className="text-[#0C4A6E]/80">
                      {shipment.recipient_name || shipment.recipient?.name}
                    </TableCell>
                    <TableCell className="text-[#0C4A6E]/80">
                      {shipment.sender_city?.name ||
                        shipment.sender?.address?.city}
                    </TableCell>
                    <TableCell className="text-[#0C4A6E]/80">
                      {shipment.recipient_city?.name ||
                        shipment.recipient?.address?.city}
                    </TableCell>
                    <TableCell className="text-[#0C4A6E]/80">
                      {shipment.total_chargeable_weight ||
                        calculateTotalWeight(shipment.items || [])}{" "}
                      kg
                    </TableCell>
                    <TableCell className="text-[#0C4A6E]/80">
                      {shipment.courier?.users?.name || shipment.courier}
                    </TableCell>
                    <TableCell className="text-[#0C4A6E]/80">
                      {shipment.created_at
                        ? new Date(shipment.created_at).toLocaleDateString(
                            "id-ID"
                          )
                        : shipment.date
                        ? new Date(shipment.date).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#0C4A6E] hover:text-[#0C4A6E] hover:bg-[#0C4A6E]/10"
                          onClick={(e) => handleViewDetails(shipment, e)}
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                          onClick={(e) => handleUnarchive(shipment.id, e)}
                          title="Batalkan Arsip"
                        >
                          <Undo2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ArchivedShipments;
