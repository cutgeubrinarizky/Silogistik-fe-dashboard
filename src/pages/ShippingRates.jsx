import React, { useState, useEffect } from "react";
import {
  Package,
  Pencil,
  Trash2,
  RefreshCcw,
  Loader2,
  Check,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { VITE_SUPABASE_URL } from "../utils/apiConfig";
// Definisi API service
const API_BASE_URL = VITE_SUPABASE_URL || "http://localhost:54321";

// API service untuk cities
const CitiesService = {
  getAllCities: async () => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/cities?pageSize=514`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data kota");
    }

    return response.json();
  },
};

// API service untuk shipping rates
const ShippingRatesService = {
  // Mendapatkan semua data tarif pengiriman
  getAllRates: async () => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipping_rates`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data tarif pengiriman");
    }

    return response.json();
  },

  // Mencari tarif pengiriman
  searchRates: async (search, originCityId, destinationCityId) => {
    let url = `${API_BASE_URL}/functions/v1/shipping_rates?`;

    if (search) url += `search=${search}&`;
    if (originCityId) url += `origin_city_id=${originCityId}&`;
    if (destinationCityId) url += `destination_city_id=${destinationCityId}&`;

    const response = await fetch(url.slice(0, -1), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mencari data tarif pengiriman");
    }

    return response.json();
  },

  // Mendapatkan tarif pengiriman berdasarkan ID
  getRateById: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipping_rates/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data tarif pengiriman");
    }

    return response.json();
  },

  // Memeriksa tarif pengiriman
  checkRate: async (originCityId, destinationCityId) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipping_rates/check?origin_city_id=${originCityId}&destination_city_id=${destinationCityId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal memeriksa tarif pengiriman");
    }

    return response.json();
  },

  // Membuat tarif pengiriman baru
  createRate: async (data) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipping_rates`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal menambahkan tarif pengiriman");
    }

    return response.json();
  },

  // Memperbarui tarif pengiriman
  updateRate: async (id, data) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipping_rates/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal memperbarui tarif pengiriman");
    }

    return response.json();
  },

  // Menghapus tarif pengiriman
  deleteRate: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipping_rates/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal menghapus tarif pengiriman");
    }

    return response.json();
  },
};

// Komponen utama
const ShippingRates = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newRate, setNewRate] = useState({
    id: null,
    origin_city_id: null,
    destination_city_id: null,
    price_per_kg: null,
  });
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  // Fetch kota-kota
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const result = await CitiesService.getAllCities();
        setCities(result.data.cities || []);
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Fetch data tarif pengiriman
  const {
    data: ratesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["shipping-rates"],
    queryFn: ShippingRatesService.getAllRates,
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      navigate("/login");
    },
  });

  // Mutation untuk menambah/update rate
  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEditing) {
        return ShippingRatesService.updateRate(data.id, {
          origin_city_id: data.origin_city_id,
          destination_city_id: data.destination_city_id,
          price_per_kg: Number(data.price_per_kg),
        });
      } else {
        return ShippingRatesService.createRate({
          origin_city_id: data.origin_city_id,
          destination_city_id: data.destination_city_id,
          price_per_kg: Number(data.price_per_kg),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["shipping-rates"]);

      toast.success(
        isEditing
          ? "Tarif pengiriman berhasil diperbarui"
          : "Tarif pengiriman berhasil ditambahkan"
      );

      // Reset form
      setIsEditing(false);
      setNewRate({
        id: null,
        origin_city_id: null,
        destination_city_id: null,
        price_per_kg: null,
      });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  // Mutation untuk menghapus rate
  const deleteMutation = useMutation({
    mutationFn: (id) => ShippingRatesService.deleteRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["shipping-rates"]);
      toast.success("Tarif pengiriman berhasil dihapus");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleAddOrUpdateRate = () => {
    if (
      !newRate.origin_city_id ||
      !newRate.destination_city_id ||
      !newRate.price_per_kg
    ) {
      toast.error("Semua field harus diisi");
      return;
    }

    mutation.mutate(newRate, {
      onSuccess: () => {
        // Reset form secara manual
        setIsEditing(false);
        setNewRate({
          id: null,
          origin_city_id: null,
          destination_city_id: null,
          price_per_kg: null,
        });

        // Reset pencarian dan tutup dropdown
        setOriginSearch("");
        setDestinationSearch("");
        setShowOriginDropdown(false);
        setShowDestinationDropdown(false);
      },
    });
  };

  const handleEditRate = (rate) => {
    // Dalam beberapa kasus, origin_city_id mungkin adalah undefined
    // dan data sebenarnya ada di objek origin_city
    const originCityId = rate.origin_city?.id;
    const destinationCityId = rate.destination_city?.id;

    setNewRate({
      id: rate.id,
      origin_city_id: originCityId,
      destination_city_id: destinationCityId,
      price_per_kg: rate.price_per_kg?.toString() || "",
    });

    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewRate({
      id: null,
      origin_city_id: null,
      destination_city_id: null,
      price_per_kg: null,
    });
  };

  const handleDeleteRate = (id) => {
    deleteMutation.mutate(id);
  };

  // Konversi data API ke format yang sesuai dengan UI
  const rates = ratesData?.data || [];

  // Filter data berdasarkan pencarian
  const filteredRates = rates.filter(
    (rate) =>
      rate.origin_city?.name?.toLowerCase().includes(search.toLowerCase()) ||
      rate.destination_city?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Filter cities berdasarkan pencarian
  const filteredOriginCities = cities.filter((city) =>
    city.name.toLowerCase().includes(originSearch.toLowerCase())
  );

  const filteredDestinationCities = cities.filter((city) =>
    city.name.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  // Function untuk mendapatkan nama kota berdasarkan ID
  const getCityNameById = (cityId) => {
    if (!cityId) return "";
    const city = cities.find((c) => c.id === cityId);
    return city ? city.name : "";
  };

  // Handler untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOriginDropdown || showDestinationDropdown) {
        if (!event.target.closest(".dropdown-container")) {
          setShowOriginDropdown(false);
          setShowDestinationDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOriginDropdown, showDestinationDropdown]);

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
            <Package className="h-6 w-6 text-[#FF6B2C]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0C4A6E]">
              Manajemen Ongkir
            </h1>
            <p className="text-[#0C4A6E]/70 mt-1">
              Tetapkan tarif pengiriman antara kota asal dan tujuan
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah/Edit Ongkir */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-100 form-container">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="dropdown-container">
                <label className="text-sm font-medium text-[#0C4A6E] block mb-1.5">
                  Kota Asal
                </label>
                <div className="relative">
                  <div
                    className={`flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ${
                      mutation.isPending || isLoadingCities
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!mutation.isPending && !isLoadingCities) {
                        setShowOriginDropdown(!showOriginDropdown);
                        setShowDestinationDropdown(false);
                      }
                    }}
                  >
                    <div>
                      {getCityNameById(newRate.origin_city_id) ||
                        "Pilih kota asal"}
                    </div>
                    <div className="opacity-50">▼</div>
                  </div>

                  {showOriginDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 opacity-50" />
                        <Input
                          placeholder="Cari kota..."
                          value={originSearch}
                          onChange={(e) => setOriginSearch(e.target.value)}
                          className="border-0 p-0 focus-visible:ring-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-[200px] overflow-auto py-1">
                        {isLoadingCities ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Memuat data kota...</span>
                          </div>
                        ) : filteredOriginCities.length === 0 ? (
                          <div className="px-3 py-2 text-center text-sm text-gray-500">
                            Kota tidak ditemukan
                          </div>
                        ) : (
                          filteredOriginCities.map((city) => (
                            <div
                              key={city.id}
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                                newRate.origin_city_id === city.id
                                  ? "bg-gray-100"
                                  : ""
                              }`}
                              onClick={() => {
                                setNewRate({
                                  ...newRate,
                                  origin_city_id: city.id,
                                });
                                setShowOriginDropdown(false);
                                setOriginSearch("");
                              }}
                            >
                              {city.name}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="dropdown-container">
                <label className="text-sm font-medium text-[#0C4A6E] block mb-1.5">
                  Kota Tujuan
                </label>
                <div className="relative">
                  <div
                    className={`flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ${
                      mutation.isPending || isLoadingCities
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!mutation.isPending && !isLoadingCities) {
                        setShowDestinationDropdown(!showDestinationDropdown);
                        setShowOriginDropdown(false);
                      }
                    }}
                  >
                    <div>
                      {getCityNameById(newRate.destination_city_id) ||
                        "Pilih kota tujuan"}
                    </div>
                    <div className="opacity-50">▼</div>
                  </div>

                  {showDestinationDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 opacity-50" />
                        <Input
                          placeholder="Cari kota..."
                          value={destinationSearch}
                          onChange={(e) => setDestinationSearch(e.target.value)}
                          className="border-0 p-0 focus-visible:ring-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-[200px] overflow-auto py-1">
                        {isLoadingCities ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Memuat data kota...</span>
                          </div>
                        ) : filteredDestinationCities.length === 0 ? (
                          <div className="px-3 py-2 text-center text-sm text-gray-500">
                            Kota tidak ditemukan
                          </div>
                        ) : (
                          filteredDestinationCities.map((city) => (
                            <div
                              key={city.id}
                              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                                newRate.destination_city_id === city.id
                                  ? "bg-gray-100"
                                  : ""
                              }`}
                              onClick={() => {
                                setNewRate({
                                  ...newRate,
                                  destination_city_id: city.id,
                                });
                                setShowDestinationDropdown(false);
                                setDestinationSearch("");
                              }}
                            >
                              {city.name}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#0C4A6E] block mb-1.5">
                  Harga per Kg (Rp)
                </label>
                <Input
                  type="number"
                  placeholder="Masukkan harga per kg"
                  value={
                    newRate.price_per_kg === null ? "" : newRate.price_per_kg
                  }
                  onChange={(e) =>
                    setNewRate({
                      ...newRate,
                      price_per_kg:
                        e.target.value === "" ? null : e.target.value,
                    })
                  }
                  className="bg-white border-gray-200"
                  disabled={mutation.isPending}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
                  onClick={handleAddOrUpdateRate}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Memperbarui..." : "Menambahkan..."}
                    </>
                  ) : isEditing ? (
                    "Update Ongkir"
                  ) : (
                    "Tambah Ongkir"
                  )}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancelEdit}
                    disabled={mutation.isPending}
                  >
                    Batal
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabel Ongkir */}
        <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <div className="max-w-sm w-full">
                <Input
                  placeholder="Cari kota..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-50/80 border-0"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                <span className="ml-2">Refresh</span>
              </Button>
            </div>

            <div className="rounded-lg border border-gray-100">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#FF6B2C]" />
                  <span className="ml-2 text-[#0C4A6E]">Memuat data...</span>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center p-8 text-red-500">
                  <p>Terjadi kesalahan: {error.message}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-[#0C4A6E]/70 font-medium">
                        Kota Asal
                      </TableHead>
                      <TableHead className="text-[#0C4A6E]/70 font-medium">
                        Kota Tujuan
                      </TableHead>
                      <TableHead className="text-[#0C4A6E]/70 font-medium">
                        Harga per Kg (Rp)
                      </TableHead>
                      <TableHead className="text-right text-[#0C4A6E]/70 font-medium">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRates.length > 0 ? (
                      filteredRates.map((rate) => {
                        // Ekstrak data dengan cara yang lebih aman
                        const originCityId =
                          typeof rate.origin_city_id === "object"
                            ? rate.origin_city_id?.id
                            : rate.origin_city_id;

                        const destinationCityId =
                          typeof rate.destination_city_id === "object"
                            ? rate.destination_city_id?.id
                            : rate.destination_city_id;

                        const originCityName =
                          rate.origin_city?.name ||
                          (typeof rate.origin_city === "string"
                            ? rate.origin_city
                            : "-");

                        const destinationCityName =
                          rate.destination_city?.name ||
                          (typeof rate.destination_city === "string"
                            ? rate.destination_city
                            : "-");

                        return (
                          <TableRow key={rate.id}>
                            <TableCell className="font-medium text-[#0C4A6E]">
                              {originCityName}
                            </TableCell>
                            <TableCell className="text-[#0C4A6E]/80">
                              {destinationCityName}
                            </TableCell>
                            <TableCell className="text-[#0C4A6E]/80">
                              {rate.price_per_kg?.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-[#0C4A6E]/70 hover:text-[#0C4A6E] hover:bg-gray-100"
                                  onClick={() => {
                                    // Pastikan data yang dikirim ke handleEditRate memiliki format yang benar
                                    const rateToEdit = {
                                      ...rate,
                                      origin_city_id: originCityId,
                                      destination_city_id: destinationCityId,
                                    };
                                    handleEditRate(rateToEdit);
                                  }}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600/70 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteRate(rate.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending &&
                                  deleteMutation.variables === rate.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-6 text-[#0C4A6E]/70"
                        >
                          {search
                            ? "Tidak ada data yang cocok dengan pencarian"
                            : "Belum ada data tarif pengiriman"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingRates;
