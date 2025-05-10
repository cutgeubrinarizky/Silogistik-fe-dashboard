import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const UpdatePaymentModal = ({ shipment, onClose, onUpdate }) => {
  const [paymentType, setPaymentType] = useState("full"); // full atau installment
  const [amount, setAmount] = useState(shipment?.final_shipping_cost || 0);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [installmentCount, setInstallmentCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [notes, setNotes] = useState("");

  const handleUpdate = () => {
    if (paymentType === "installment" && installmentAmount <= 0) {
      toast.error("Jumlah cicilan harus lebih dari 0");
      return;
    }

    const updateData = {
      paymentType,
      amount: paymentType === "full" ? amount : installmentAmount,
      installmentCount: paymentType === "installment" ? installmentCount : 1,
      paymentMethod,
      notes,
      status: paymentType === "full" ? "paid" : "partial",
    };

    onUpdate(shipment.id, updateData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] p-0">
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-[#0C4A6E]">
              Update Pembayaran
            </h2>
          </div>

          {/* Nomor Resi */}
          <div className="mb-5">
            <div className="text-sm text-gray-500 mb-1.5">Nomor Resi</div>
            <div className="p-2.5 bg-gray-50 rounded-lg text-[#0C4A6E] font-medium text-sm">
              {shipment?.tracking_number}
            </div>
          </div>

          {/* Total Tagihan */}
          <div className="mb-5">
            <div className="text-sm text-gray-500 mb-1.5">Total Tagihan</div>
            <div className="p-2.5 bg-gray-50 rounded-lg text-[#0C4A6E] font-medium text-sm">
              Rp {shipment?.final_shipping_cost?.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="space-y-4">
            {/* Tipe Pembayaran */}
            <div>
              <div className="text-sm text-gray-500 mb-1.5">Tipe Pembayaran</div>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger className="w-full bg-white border-gray-200 h-10 text-sm">
                  <SelectValue placeholder="Pilih tipe pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Lunas</SelectItem>
                  <SelectItem value="installment">Cicilan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jumlah Pembayaran */}
            {paymentType === "full" ? (
              <div>
                <div className="text-sm text-gray-500 mb-1.5">Jumlah Pembayaran</div>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="bg-white border-gray-200 h-10 text-sm"
                  disabled
                />
              </div>
            ) : (
              <>
                <div>
                  <div className="text-sm text-gray-500 mb-1.5">Jumlah Cicilan</div>
                  <Input
                    type="number"
                    value={installmentAmount}
                    onChange={(e) => setInstallmentAmount(Number(e.target.value))}
                    className="bg-white border-gray-200 h-10 text-sm"
                    placeholder="Masukkan jumlah cicilan"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1.5">Jumlah Angsuran</div>
                  <Input
                    type="number"
                    value={installmentCount}
                    onChange={(e) => setInstallmentCount(Number(e.target.value))}
                    className="bg-white border-gray-200 h-10 text-sm"
                    placeholder="Masukkan jumlah angsuran"
                  />
                </div>
              </>
            )}

            {/* Metode Pembayaran */}
            <div>
              <div className="text-sm text-gray-500 mb-1.5">Metode Pembayaran</div>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full bg-white border-gray-200 h-10 text-sm">
                  <SelectValue placeholder="Pilih metode pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Tunai</SelectItem>
                  <SelectItem value="transfer">Transfer Bank</SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Keterangan */}
            <div>
              <div className="text-sm text-gray-500 mb-1.5">Keterangan</div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Masukkan keterangan (opsional)"
                className="min-h-[100px] bg-white border-gray-200 text-sm resize-none focus:ring-1 focus:ring-[#0C4A6E]"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-9 px-4 text-sm font-medium hover:bg-gray-50"
              >
                Batal
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-[#0C4A6E] hover:bg-[#0C4A6E]/90 text-white h-9 px-4 text-sm font-medium"
              >
                Update Pembayaran
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentModal; 