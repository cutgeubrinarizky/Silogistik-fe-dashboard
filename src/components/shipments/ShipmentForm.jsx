import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Edit,
  Archive,
  ArrowLeft,
  Package,
  Loader2,
} from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Volume calculation constants
const DEFAULT_DIVISOR = 6000;

const API_BASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "http://localhost:54321";

// Import API service
const ShipmentService = {
  // Mendapatkan pengiriman berdasarkan ID
  getShipmentById: async (id) => {
    if (!id) return null;

    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipment?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil detail pengiriman");
    }

    return response.json();
  },

  // Membuat pengiriman baru
  createShipment: async (data) => {
    const response = await fetch(`${API_BASE_URL}/functions/v1/shipment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Gagal membuat pengiriman baru");
    }

    return response.json();
  },

  // Mengupdate data pengiriman
  updateShipment: async (id, data) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipment?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengupdate pengiriman");
    }

    return response.json();
  },

  // Mengarsipkan pengiriman
  archiveShipment: async (id, isArchived = true) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipment?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ is_archived: isArchived }),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengarsipkan pengiriman");
    }

    return response.json();
  },
};

// Service untuk data alamat
const AddressService = {
  // Mendapatkan daftar provinsi
  getProvinces: async () => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/address/provinces`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data provinsi");
    }

    return response.json();
  },

  // Mendapatkan daftar kota berdasarkan provinsi
  getCities: async (province) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/address/cities?province=${encodeURIComponent(
        province
      )}`,
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

  // Mendapatkan daftar kecamatan berdasarkan kota
  getDistricts: async (city) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/address/districts?city=${encodeURIComponent(
        city
      )}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data kecamatan");
    }

    return response.json();
  },
};

// Service untuk data Kota
const CityService = {
  // Mendapatkan daftar kota yang tersedia di sistem
  getCities: async (search = "", page = 1, pageSize = 514) => {
    const params = new URLSearchParams({
      search,
      page,
      pageSize,
    }).toString();

    const response = await fetch(
      `${API_BASE_URL}/functions/v1/cities?${params}`,
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

// Service untuk data Pengguna (Kurir & Marketing)
const UserService = {
  // Mendapatkan daftar pengguna berdasarkan role
  getUsersByRole: async (roleId) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/users?role_id=${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data pengguna");
    }

    return response.json();
  },
};

// Service untuk tarif pengiriman
const ShippingRateService = {
  // Mendapatkan semua tarif yang tersedia
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
};

// Role ID untuk Kurir dan Marketing
const COURIER_ROLE_ID = 3;
const MARKETING_ROLE_ID = 4;

// Data tarif pengiriman (contoh)
const shippingRates = [
  { id: 1, origin: "Jakarta", destination: "Surabaya", price: 15000 },
  { id: 2, origin: "Jakarta", destination: "Bandung", price: 12000 },
  { id: 3, origin: "Jakarta", destination: "Medan", price: 25000 },
  { id: 4, origin: "Surabaya", destination: "Jakarta", price: 15000 },
  { id: 5, origin: "Bandung", destination: "Jakarta", price: 12000 },
];

const ShipmentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const shipmentId = location.state?.shipment?.id;
  const shipmentData = location.state?.shipment;
  const isDuplicate = location.state?.duplicate;
  const isEdit = location.state?.isEdit;

  const defaultSender = {
    name: "",
    phone: "",
    address: { province: "", city: "", district: "", city_id: null },
  };
  const defaultRecipient = {
    name: "",
    phone: "",
    address: {
      province: "",
      city: "",
      district: "",
      street: "",
      city_id: null,
    },
  };

  // Inisialisasi state terlebih dahulu sebelum useQuery
  const [sender, setSender] = useState(
    shipmentData && shipmentData.sender
      ? {
          ...defaultSender,
          ...shipmentData.sender,
          address: {
            ...defaultSender.address,
            ...shipmentData.sender.address,
            city_id: shipmentData.sender.address.city_id || null,
          },
        }
      : defaultSender
  );
  const [recipient, setRecipient] = useState(
    shipmentData && shipmentData.recipient
      ? {
          ...defaultRecipient,
          ...shipmentData.recipient,
          address: {
            ...defaultRecipient.address,
            ...shipmentData.recipient.address,
            city_id: shipmentData.recipient.address.city_id || null,
          },
        }
      : defaultRecipient
  );
  const [items, setItems] = useState(
    shipmentData && Array.isArray(shipmentData.items) ? shipmentData.items : []
  );
  const [currentItem, setCurrentItem] = useState({
    name: "",
    weight: "",
    quantity: "1",
    length: "",
    width: "",
    height: "",
    volumeWeight: 0,
    totalWeight: 0,
  });
  const [shipmentType, setShipmentType] = useState(
    shipmentData
      ? shipmentData.shipment_type || shipmentData.shipmentType
      : "pickup"
  );
  const [courier, setCourier] = useState(
    shipmentData ? shipmentData.courier : ""
  );
  const [marketing, setMarketing] = useState(
    shipmentData ? shipmentData.marketing : ""
  );
  const [discount, setDiscount] = useState(
    shipmentData ? shipmentData.discount : 0
  );
  const [trackingNumber, setTrackingNumber] = useState(
    isDuplicate || !shipmentData?.tracking_number
      ? "CGO" + Math.floor(100000 + Math.random() * 900000)
      : shipmentData.tracking_number
  );
  const [addressDialogType, setAddressDialogType] = useState("sender");
  const [senderDialogOpen, setSenderDialogOpen] = useState(false);
  const [recipientDialogOpen, setRecipientDialogOpen] = useState(false);
  const [isArchived, setIsArchived] = useState(
    shipmentData ? shipmentData.is_archived : false
  );

  // State untuk biaya pengiriman
  const [shippingRate, setShippingRate] = useState({
    ratePerKg: 0,
    totalCost: 0,
    discount: 0,
    finalCost: 0,
    isManualRate: false,
  });

  // State untuk input manual tarif
  const [manualRatePerKg, setManualRatePerKg] = useState("");
  const [manualTotalCost, setManualTotalCost] = useState("");

  // Fetch shipment data if editing
  const {
    data: fetchedShipment,
    isLoading: isLoadingShipment,
    error: shipmentError,
  } = useQuery({
    queryKey: ["shipment", shipmentId],
    queryFn: () => ShipmentService.getShipmentById(shipmentId),
    enabled: !!shipmentId && isEdit,
    onSuccess: (data) => {
      if (data && !isDuplicate) {
        const shipment = data.data;
        if (shipment) {
          setSender({
            name: shipment.sender?.name || "",
            phone: shipment.sender?.phone || "",
            address: {
              province: shipment.sender?.address?.province || "",
              city: shipment.sender?.address?.city || "",
              district: shipment.sender?.address?.district || "",
              city_id: shipment.sender?.address?.city_id || null,
            },
          });
          setRecipient({
            name: shipment.recipient?.name || "",
            phone: shipment.recipient?.phone || "",
            address: {
              province: shipment.recipient?.address?.province || "",
              city: shipment.recipient?.address?.city || "",
              district: shipment.recipient?.address?.district || "",
              street: shipment.recipient?.address?.street || "",
              city_id: shipment.recipient?.address?.city_id || null,
            },
          });
          setShipmentType(shipment.shipment_type || "pickup");
          setCourier(shipment.courier || "");
          setMarketing(shipment.marketing || "");
          setDiscount(shipment.discount || 0);
          setTrackingNumber(shipment.tracking_number);

          // Process items with calculated weights
          if (Array.isArray(shipment.items)) {
            const itemsWithWeight = shipment.items.map((item) => ({
              ...item,
              volumeWeight: item.volumeWeight ?? calculateVolumeWeight(item),
              totalWeight: item.totalWeight ?? calculateTotalWeight(item),
            }));
            setItems(itemsWithWeight);
          }

          setIsArchived(shipment.is_archived || false);
        }
      }
    },
  });

  // Fetch data provinsi
  const { data: provinces, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => AddressService.getProvinces(),
  });

  // Fetch data kota berdasarkan provinsi pengirim
  const { data: senderCities, isLoading: isLoadingSenderCities } = useQuery({
    queryKey: ["cities", sender.address.province],
    queryFn: () => AddressService.getCities(sender.address.province),
    enabled: !!sender.address.province,
  });

  // Fetch data kecamatan berdasarkan kota pengirim
  const { data: senderDistricts, isLoading: isLoadingSenderDistricts } =
    useQuery({
      queryKey: ["districts", sender.address.city],
      queryFn: () => AddressService.getDistricts(sender.address.city),
      enabled: !!sender.address.city,
    });

  // Fetch data kota berdasarkan provinsi penerima
  const { data: recipientCities, isLoading: isLoadingRecipientCities } =
    useQuery({
      queryKey: ["cities", recipient.address.province],
      queryFn: () => AddressService.getCities(recipient.address.province),
      enabled: !!recipient.address.province,
    });

  // Fetch data kecamatan berdasarkan kota penerima
  const { data: recipientDistricts, isLoading: isLoadingRecipientDistricts } =
    useQuery({
      queryKey: ["districts", recipient.address.city],
      queryFn: () => AddressService.getDistricts(recipient.address.city),
      enabled: !!recipient.address.city,
    });

  // Fetch data kota dari API Cities (untuk referensi ke shipping rates)
  const { data: citiesData, isLoading: isLoadingCitiesData } = useQuery({
    queryKey: ["cities-data"],
    queryFn: () => CityService.getCities(),
  });

  // Fetch data kurir (role_id = 3)
  const { data: couriers, isLoading: isLoadingCouriers } = useQuery({
    queryKey: ["users", COURIER_ROLE_ID],
    queryFn: () => UserService.getUsersByRole(COURIER_ROLE_ID),
  });

  // Fetch data marketing (role_id = 4)
  const { data: marketers, isLoading: isLoadingMarketers } = useQuery({
    queryKey: ["users", MARKETING_ROLE_ID],
    queryFn: () => UserService.getUsersByRole(MARKETING_ROLE_ID),
  });

  const calculateVolumeWeight = (item) => {
    const length = parseFloat(item.length) || 0;
    const width = parseFloat(item.width) || 0;
    const height = parseFloat(item.height) || 0;
    return (length * width * height) / DEFAULT_DIVISOR;
  };

  const calculateTotalWeight = (item) => {
    const volumeWeight = calculateVolumeWeight(item);
    const actualWeight = parseFloat(item.weight) || 0;
    return Math.max(volumeWeight, actualWeight) * parseInt(item.quantity || 1);
  };

  // Menggunakan useMemo untuk menghitung total weight
  const totalWeight = useMemo(() => {
    return items.reduce((sum, item) => {
      const itemTotalWeight = item.totalWeight || calculateTotalWeight(item);
      return sum + itemTotalWeight;
    }, 0);
  }, [items]);

  // Gunakan useQuery untuk mengambil semua tarif SETELAH totalWeight diinisialisasi
  const { data: allShippingRates, isLoading: isLoadingAllRates } = useQuery({
    queryKey: ["all-shipping-rates"],
    queryFn: () => ShippingRateService.getAllRates(),
  });

  // Fungsi untuk mencari tarif berdasarkan city_id
  const findShippingRate = useCallback(
    (originCityId, destinationCityId) => {
      if (!allShippingRates?.data || !originCityId || !destinationCityId)
        return null;

      console.log("Finding shipping rate for:", {
        originCityId,
        destinationCityId,
        availableRates: allShippingRates.data,
      });

      return allShippingRates.data.find(
        (rate) =>
          rate.origin_city.id === originCityId &&
          rate.destination_city.id === destinationCityId
      );
    },
    [allShippingRates]
  );

  // Effect untuk menghitung ulang tarif ketika city_id berubah atau ketika data tarif tersedia
  useEffect(() => {
    if (
      !sender.address.city_id ||
      !recipient.address.city_id ||
      !allShippingRates?.data ||
      shippingRate.isManualRate
    ) {
      return;
    }

    const rate = findShippingRate(
      sender.address.city_id,
      recipient.address.city_id
    );
    console.log("Found shipping rate:", rate);

    if (rate) {
      const ratePerKg = rate.price_per_kg || 0;
      const totalCost = ratePerKg * totalWeight;
      const discountAmount = parseFloat(discount) || 0;
      const finalCost = Math.max(0, totalCost - discountAmount);

      setShippingRate({
        ratePerKg,
        totalCost,
        discount: discountAmount,
        finalCost,
        isManualRate: false,
      });
    } else {
      // Jika tidak ada tarif yang cocok, beralih ke mode input manual
      if (!shippingRate.isManualRate) {
        toast.error(
          "Tarif untuk rute ini belum tersedia. Silakan masukkan tarif secara manual."
        );
        setShippingRate({
          ...shippingRate,
          isManualRate: true,
        });
      }
    }
  }, [
    sender.address.city_id,
    recipient.address.city_id,
    allShippingRates,
    totalWeight,
    discount,
    findShippingRate,
    shippingRate,
  ]);

  // Tambahkan logging untuk dropdown kota untuk memeriksa apakah city_id ditetapkan dengan benar
  const handleSenderCityChange = (value) => {
    const cityData = citiesData?.data?.cities?.find((c) => c.name === value);
    console.log("Sender city selected:", value, "City data:", cityData);

    setSender((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: value,
        city_id: cityData?.id || null,
        district: "",
      },
    }));
  };

  const handleRecipientCityChange = (value) => {
    const cityData = citiesData?.data?.cities?.find((c) => c.name === value);
    console.log("Recipient city selected:", value, "City data:", cityData);

    setRecipient((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: value,
        city_id: cityData?.id || null,
        district: "",
      },
    }));
  };

  // Mutation for creating/updating shipment
  const createMutation = useMutation({
    mutationFn: (data) => ShipmentService.createShipment(data),
    onSuccess: () => {
      toast.success("Pengiriman berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      navigate("/shipments");
    },
    onError: (error) => {
      toast.error(`Gagal membuat pengiriman: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => ShipmentService.updateShipment(id, data),
    onSuccess: () => {
      toast.success("Pengiriman berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      navigate("/shipments");
    },
    onError: (error) => {
      toast.error(`Gagal memperbarui pengiriman: ${error.message}`);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id, isArchived }) =>
      ShipmentService.archiveShipment(id, isArchived),
    onSuccess: (_, variables) => {
      toast.success(
        variables.isArchived
          ? "Pengiriman berhasil diarsipkan"
          : "Pengiriman berhasil dibatalkan arsip"
      );
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      navigate("/shipments");
    },
    onError: (error) => {
      toast.error(`Gagal mengubah status arsip: ${error.message}`);
    },
  });

  // Jika shipmentData berubah (navigasi dari arsip), update state form
  useEffect(() => {
    if (shipmentData && !isLoadingShipment) {
      setSender(
        shipmentData.sender
          ? {
              ...defaultSender,
              ...shipmentData.sender,
              address: {
                ...defaultSender.address,
                ...shipmentData.sender.address,
                city_id: shipmentData.sender.address.city_id || null,
              },
            }
          : defaultSender
      );
      setRecipient(
        shipmentData.recipient
          ? {
              ...defaultRecipient,
              ...shipmentData.recipient,
              address: {
                ...defaultRecipient.address,
                ...shipmentData.recipient.address,
                city_id: shipmentData.recipient.address.city_id || null,
              },
            }
          : defaultRecipient
      );
      setShipmentType(
        shipmentData.shipment_type || shipmentData.shipmentType || "pickup"
      );
      setCourier(shipmentData.courier);
      setMarketing(shipmentData.marketing);
      setDiscount(shipmentData.discount);
      const itemsWithWeight = Array.isArray(shipmentData.items)
        ? shipmentData.items.map((item) => ({
            ...item,
            volumeWeight: item.volumeWeight ?? calculateVolumeWeight(item),
            totalWeight: item.totalWeight ?? calculateTotalWeight(item),
          }))
        : [];
      setItems(itemsWithWeight);
      if (isDuplicate) {
        setTrackingNumber("CGO" + Math.floor(100000 + Math.random() * 900000));
      } else {
        setTrackingNumber(
          shipmentData.tracking_number || shipmentData.trackingNumber
        );
      }
      setIsArchived(shipmentData.is_archived || false);

      // Set tarif jika ada
      if (shipmentData.rate_per_kg) {
        setShippingRate({
          ratePerKg: shipmentData.rate_per_kg || 0,
          totalCost: shipmentData.total_cost || 0,
          discount: shipmentData.discount || 0,
          finalCost: shipmentData.final_cost || 0,
          isManualRate: !!shipmentData.is_manual_rate,
        });

        if (shipmentData.is_manual_rate) {
          setManualRatePerKg(shipmentData.rate_per_kg || "");
          setManualTotalCost(shipmentData.total_cost || "");
        }
      }
    }
  }, [shipmentData, isDuplicate, isLoadingShipment]);

  // Effect untuk menghitung biaya pengiriman dari tarif manual
  useEffect(() => {
    if (shippingRate.isManualRate) {
      // Jika user mengisi rate per kg
      if (manualRatePerKg && totalWeight > 0) {
        const rate = parseFloat(manualRatePerKg);
        const totalCost = rate * totalWeight;
        const discountAmount = parseFloat(discount) || 0;
        const finalCost = Math.max(0, totalCost - discountAmount);

        setManualTotalCost(totalCost.toFixed(0));
        setShippingRate({
          ratePerKg: rate,
          totalCost,
          discount: discountAmount,
          finalCost,
          isManualRate: true,
        });
      }
      // Jika user mengisi total cost
      else if (manualTotalCost && totalWeight > 0) {
        const totalCost = parseFloat(manualTotalCost);
        const ratePerKg = totalCost / totalWeight;
        const discountAmount = parseFloat(discount) || 0;
        const finalCost = Math.max(0, totalCost - discountAmount);

        setManualRatePerKg(ratePerKg.toFixed(0));
        setShippingRate({
          ratePerKg,
          totalCost,
          discount: discountAmount,
          finalCost,
          isManualRate: true,
        });
      }
    }
  }, [
    manualRatePerKg,
    manualTotalCost,
    totalWeight,
    discount,
    shippingRate.isManualRate,
  ]);

  // Effect untuk menghitung ulang total biaya pengiriman ketika diskon berubah
  useEffect(() => {
    setShippingRate((prev) => ({
      ...prev,
      discount: parseFloat(discount) || 0,
      finalCost: Math.max(0, prev.totalCost - (parseFloat(discount) || 0)),
    }));
  }, [discount]);

  // Handler untuk switch ke mode input tarif manual
  const handleSwitchToManualRate = () => {
    setShippingRate({
      ...shippingRate,
      isManualRate: true,
    });

    // Inisialisasi nilai awal
    if (shippingRate.ratePerKg > 0) {
      setManualRatePerKg(shippingRate.ratePerKg.toString());
    }
    if (shippingRate.totalCost > 0) {
      setManualTotalCost(shippingRate.totalCost.toString());
    }
  };

  // Handler untuk kembali ke mode tarif otomatis
  const handleSwitchToAutoRate = () => {
    setShippingRate({
      ...shippingRate,
      isManualRate: false,
    });

    // Reset nilai input manual
    setManualRatePerKg("");
    setManualTotalCost("");

    // Refetch tarif
    refetchShippingRate();
  };

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.weight) {
      toast.error("Nama dan berat barang harus diisi");
      return;
    }

    const volumeWeight = calculateVolumeWeight(currentItem);
    const totalWeight = calculateTotalWeight(currentItem);

    const newItem = {
      ...currentItem,
      id: Date.now(),
      volumeWeight,
      totalWeight,
    };

    setItems([...items, newItem]);
    setCurrentItem({
      name: "",
      weight: "",
      quantity: "1",
      length: "",
      width: "",
      height: "",
      volumeWeight: 0,
      totalWeight: 0,
    });
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleEditItem = (item) => {
    setCurrentItem({
      ...item,
      volumeWeight: item.volumeWeight || 0,
      totalWeight: item.totalWeight || 0,
    });
    handleRemoveItem(item.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Minimal satu barang harus ditambahkan");
      return;
    }

    const formattedSenderAddress = [
      sender.address.province,
      sender.address.city,
      sender.address.district,
    ]
      .filter(Boolean)
      .join(", ");

    const formattedRecipientAddress = [
      recipient.address.province,
      recipient.address.city,
      recipient.address.district,
      recipient.address.street,
    ]
      .filter(Boolean)
      .join(", ");

    // Prepare items data
    const formattedItems = items.map((item) => ({
      name: item.name,
      actual_weight: parseFloat(item.weight) || 0,
      quantity: parseInt(item.quantity) || 1,
      length_cm: parseFloat(item.length) || 0,
      width_cm: parseFloat(item.width) || 0,
      height_cm: parseFloat(item.height) || 0,
      volume_weight: item.volumeWeight || calculateVolumeWeight(item),
      chargeable_weight: item.totalWeight || calculateTotalWeight(item),
    }));

    // Prepare data for API
    const shipmentData = {
      tracking_number: trackingNumber,
      sender_name: sender.name,
      sender_phone: sender.phone,
      sender_address: formattedSenderAddress,
      sender_city_id: sender.address.city_id,
      recipient_name: recipient.name,
      recipient_phone: recipient.phone,
      recipient_address: formattedRecipientAddress,
      recipient_city_id: recipient.address.city_id,
      shipment_type: shipmentType,
      courier_id: courier,
      marketer_id: marketing,
      rate_per_kg: shippingRate.ratePerKg,
      total_chargeable_weight: totalWeight,
      base_shipping_cost: shippingRate.totalCost,
      discount: parseFloat(discount) || 0,
      final_shipping_cost: shippingRate.finalCost,
      is_manual_rate: shippingRate.isManualRate,
      payment_status: "unpaid",
      status: "pickup",
      is_archived: isArchived,
      notes: "",
      items: formattedItems,
    };

    console.log(
      "Mengirim data pengiriman:",
      JSON.stringify(shipmentData, null, 2)
    );

    if (isEdit && shipmentId) {
      // Update existing shipment
      updateMutation.mutate({ id: shipmentId, data: shipmentData });
    } else {
      // Create new shipment
      createMutation.mutate(shipmentData);
    }
  };

  const formatAddress = (address) => {
    const parts = [address.province, address.city, address.district].filter(
      Boolean
    );
    return parts.join(", ") || "Klik untuk mengisi alamat";
  };

  const formatRecipientAddress = (address) => {
    const parts = [
      address.province,
      address.city,
      address.district,
      address.street,
    ].filter(Boolean);
    return parts.join(", ") || "Klik untuk mengisi alamat";
  };

  const handleArchive = () => {
    if (isEdit && shipmentId) {
      archiveMutation.mutate({ id: shipmentId, isArchived: true });
    } else {
      setIsArchived(true);
      toast.success("Pengiriman akan diarsipkan saat disimpan");
    }
  };

  const handleUnarchive = () => {
    if (isEdit && shipmentId) {
      archiveMutation.mutate({ id: shipmentId, isArchived: false });
    } else {
      setIsArchived(false);
      toast.success("Pengiriman tidak akan diarsipkan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
              <Package className="h-6 w-6 text-[#FF6B2C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0C4A6E]">
                {isEdit ? "Edit Pengiriman" : "Pengiriman Baru"}
              </h1>
              <p className="text-[#0C4A6E]/70 mt-1">
                {isEdit
                  ? "Edit data pengiriman yang sudah ada"
                  : "Isi formulir di bawah untuk membuat pengiriman baru"}
              </p>
            </div>
          </div>
          <Link to="/shipments">
            <Button
              variant="outline"
              className="text-[#0C4A6E] border-[#0C4A6E]/20 hover:bg-[#0C4A6E]/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </Link>
        </div>

        {isLoadingShipment ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#0C4A6E]" />
            <span className="ml-3 text-[#0C4A6E] text-lg">
              Memuat data pengiriman...
            </span>
          </div>
        ) : shipmentError ? (
          <div className="p-8 text-center">
            <p className="text-red-500 text-lg mb-4">
              Terjadi kesalahan: {shipmentError.message}
            </p>
            <Button
              onClick={() => navigate("/shipments")}
              className="bg-[#0C4A6E]"
            >
              Kembali ke Daftar Pengiriman
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informasi Barang */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 pt-6">
                <h3 className="text-lg font-semibold text-[#0C4A6E]">
                  Informasi Barang
                </h3>
                <p className="text-[#0C4A6E]/70 mt-1">
                  Detail barang yang akan dikirim
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form Input Barang */}
                  <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                    <div className="space-y-2">
                      <Label htmlFor="item-name">Nama/Isi Barang</Label>
                      <Input
                        id="item-name"
                        value={currentItem.name}
                        onChange={(e) =>
                          setCurrentItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Nama barang"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="item-weight">Berat (kg)</Label>
                      <Input
                        id="item-weight"
                        type="number"
                        value={currentItem.weight}
                        onChange={(e) =>
                          setCurrentItem((prev) => ({
                            ...prev,
                            weight: e.target.value,
                          }))
                        }
                        placeholder="Berat dalam kg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="item-quantity">Jumlah</Label>
                      <Input
                        id="item-quantity"
                        type="number"
                        value={currentItem.quantity}
                        onChange={(e) =>
                          setCurrentItem((prev) => ({
                            ...prev,
                            quantity: e.target.value,
                          }))
                        }
                        placeholder="Jumlah barang"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="item-length">Panjang (cm)</Label>
                        <Input
                          id="item-length"
                          type="number"
                          value={currentItem.length}
                          onChange={(e) =>
                            setCurrentItem((prev) => ({
                              ...prev,
                              length: e.target.value,
                            }))
                          }
                          placeholder="P"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="item-width">Lebar (cm)</Label>
                        <Input
                          id="item-width"
                          type="number"
                          value={currentItem.width}
                          onChange={(e) =>
                            setCurrentItem((prev) => ({
                              ...prev,
                              width: e.target.value,
                            }))
                          }
                          placeholder="L"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="item-height">Tinggi (cm)</Label>
                        <Input
                          id="item-height"
                          type="number"
                          value={currentItem.height}
                          onChange={(e) =>
                            setCurrentItem((prev) => ({
                              ...prev,
                              height: e.target.value,
                            }))
                          }
                          placeholder="T"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full bg-[#FF6B2C] hover:bg-[#FF6B2C]/90"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Tambah Barang
                    </Button>
                  </div>

                  {/* Tabel Barang */}
                  <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>Berat</TableHead>
                          <TableHead>Jumlah</TableHead>
                          <TableHead>Berat Volume</TableHead>
                          <TableHead>Berat Total</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.weight} kg</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {item.volumeWeight !== undefined
                                ? Number(item.volumeWeight).toFixed(2)
                                : "0.00"}{" "}
                              kg
                            </TableCell>
                            <TableCell>
                              {item.totalWeight !== undefined
                                ? Number(item.totalWeight).toFixed(2)
                                : "0.00"}{" "}
                              kg
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {items.length > 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-right font-bold"
                            >
                              Total Berat Keseluruhan:
                            </TableCell>
                            <TableCell colSpan={2} className="font-bold">
                              {Number(totalWeight).toFixed(2)} kg
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Pengiriman */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 pt-6">
                <h3 className="text-lg font-semibold text-[#0C4A6E]">
                  Informasi Pengiriman
                </h3>
                <p className="text-[#0C4A6E]/70 mt-1">
                  Data pengirim dan penerima
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form Pengirim */}
                  <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                    <h4 className="font-medium text-[#0C4A6E]">
                      Data Pengirim
                    </h4>
                    <div className="space-y-2">
                      <Label htmlFor="sender-name">Nama Pengirim</Label>
                      <Input
                        id="sender-name"
                        value={sender.name}
                        onChange={(e) =>
                          setSender((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Nama lengkap pengirim"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sender-phone">No. Telp Pengirim</Label>
                      <Input
                        id="sender-phone"
                        value={sender.phone}
                        onChange={(e) =>
                          setSender((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Format: 08xxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alamat Pengirim</Label>
                      <Dialog
                        open={senderDialogOpen}
                        onOpenChange={setSenderDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Input
                            value={formatAddress(sender.address)}
                            readOnly
                            className="bg-background cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader className="text-left">
                            <DialogTitle className="text-left">
                              Alamat Pengirim
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="sender-province">Provinsi</Label>
                              <Select
                                value={sender.address.province}
                                onValueChange={(value) =>
                                  setSender((prev) => ({
                                    ...prev,
                                    address: {
                                      ...prev.address,
                                      province: value,
                                      // Reset city when province changes
                                      city: "",
                                      district: "",
                                      city_id: null,
                                    },
                                  }))
                                }
                              >
                                <SelectTrigger className="bg-white border-gray-200">
                                  <SelectValue placeholder="Pilih provinsi" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isLoadingProvinces ? (
                                    <SelectItem value="_loading" disabled>
                                      Memuat data...
                                    </SelectItem>
                                  ) : provinces?.data ? (
                                    provinces.data.map((province) => (
                                      <SelectItem
                                        key={province}
                                        value={province}
                                      >
                                        {province}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="_no_data" disabled>
                                      Data tidak tersedia
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sender-city">Kota</Label>
                              <Select
                                value={sender.address.city}
                                onValueChange={handleSenderCityChange}
                                disabled={!sender.address.province}
                              >
                                <SelectTrigger className="bg-white border-gray-200">
                                  <SelectValue
                                    placeholder={
                                      sender.address.province
                                        ? "Pilih kota"
                                        : "Pilih provinsi dahulu"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {isLoadingSenderCities ? (
                                    <SelectItem value="_loading" disabled>
                                      Memuat data...
                                    </SelectItem>
                                  ) : senderCities?.data ? (
                                    senderCities.data
                                      .filter((city) => city !== "") // Filter out empty string
                                      .map((city) => {
                                        return (
                                          <SelectItem key={city} value={city}>
                                            {city}
                                          </SelectItem>
                                        );
                                      })
                                  ) : (
                                    <SelectItem value="_no_data" disabled>
                                      Data tidak tersedia
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sender-district">Kecamatan</Label>
                              <Select
                                value={sender.address.district}
                                onValueChange={(value) =>
                                  setSender((prev) => ({
                                    ...prev,
                                    address: {
                                      ...prev.address,
                                      district: value,
                                    },
                                  }))
                                }
                                disabled={!sender.address.city}
                              >
                                <SelectTrigger className="bg-white border-gray-200">
                                  <SelectValue
                                    placeholder={
                                      sender.address.city
                                        ? "Pilih kecamatan"
                                        : "Pilih kota dahulu"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {isLoadingSenderDistricts ? (
                                    <SelectItem value="_loading" disabled>
                                      Memuat data...
                                    </SelectItem>
                                  ) : senderDistricts?.data ? (
                                    senderDistricts.data.map((district) => (
                                      <SelectItem
                                        key={district}
                                        value={district}
                                      >
                                        {district}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="_no_data" disabled>
                                      Data tidak tersedia
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button
                              type="button"
                              onClick={() => setSenderDialogOpen(false)}
                            >
                              Simpan
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Form Penerima */}
                  <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                    <h4 className="font-medium text-[#0C4A6E]">
                      Data Penerima
                    </h4>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-name">Nama Penerima</Label>
                      <Input
                        id="recipient-name"
                        value={recipient.name}
                        onChange={(e) =>
                          setRecipient((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Nama lengkap penerima"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient-phone">No. Telp Penerima</Label>
                      <Input
                        id="recipient-phone"
                        value={recipient.phone}
                        onChange={(e) =>
                          setRecipient((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Format: 08xxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alamat Penerima</Label>
                      <Dialog
                        open={recipientDialogOpen}
                        onOpenChange={setRecipientDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Input
                            value={formatRecipientAddress(recipient.address)}
                            readOnly
                            className="bg-background cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader className="text-left">
                            <DialogTitle className="text-left">
                              Alamat Penerima
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipient-province">
                                Provinsi
                              </Label>
                              <Select
                                value={recipient.address.province}
                                onValueChange={(value) =>
                                  setRecipient((prev) => ({
                                    ...prev,
                                    address: {
                                      ...prev.address,
                                      province: value,
                                      // Reset city when province changes
                                      city: "",
                                      district: "",
                                      city_id: null,
                                    },
                                  }))
                                }
                              >
                                <SelectTrigger className="bg-white border-gray-200">
                                  <SelectValue placeholder="Pilih provinsi" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isLoadingProvinces ? (
                                    <SelectItem value="_loading" disabled>
                                      Memuat data...
                                    </SelectItem>
                                  ) : provinces?.data ? (
                                    provinces.data.map((province) => (
                                      <SelectItem
                                        key={province}
                                        value={province}
                                      >
                                        {province}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="_no_data" disabled>
                                      Data tidak tersedia
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipient-city">Kota</Label>
                              <Select
                                value={recipient.address.city}
                                onValueChange={handleRecipientCityChange}
                                disabled={!recipient.address.province}
                              >
                                <SelectTrigger className="bg-white border-gray-200">
                                  <SelectValue
                                    placeholder={
                                      recipient.address.province
                                        ? "Pilih kota"
                                        : "Pilih provinsi dahulu"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {isLoadingRecipientCities ? (
                                    <SelectItem value="_loading" disabled>
                                      Memuat data...
                                    </SelectItem>
                                  ) : recipientCities?.data ? (
                                    recipientCities.data
                                      .filter((city) => city !== "") // Filter out empty string
                                      .map((city) => {
                                        return (
                                          <SelectItem key={city} value={city}>
                                            {city}
                                          </SelectItem>
                                        );
                                      })
                                  ) : (
                                    <SelectItem value="_no_data" disabled>
                                      Data tidak tersedia
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipient-district">
                                Kecamatan
                              </Label>
                              <Select
                                value={recipient.address.district}
                                onValueChange={(value) =>
                                  setRecipient((prev) => ({
                                    ...prev,
                                    address: {
                                      ...prev.address,
                                      district: value,
                                    },
                                  }))
                                }
                                disabled={!recipient.address.city}
                              >
                                <SelectTrigger className="bg-white border-gray-200">
                                  <SelectValue
                                    placeholder={
                                      recipient.address.city
                                        ? "Pilih kecamatan"
                                        : "Pilih kota dahulu"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {isLoadingRecipientDistricts ? (
                                    <SelectItem value="_loading" disabled>
                                      Memuat data...
                                    </SelectItem>
                                  ) : recipientDistricts?.data ? (
                                    recipientDistricts.data.map((district) => (
                                      <SelectItem
                                        key={district}
                                        value={district}
                                      >
                                        {district}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="_no_data" disabled>
                                      Data tidak tersedia
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipient-street">
                                Nama Jalan
                              </Label>
                              <Input
                                id="recipient-street"
                                value={recipient.address.street}
                                onChange={(e) =>
                                  setRecipient((prev) => ({
                                    ...prev,
                                    address: {
                                      ...prev.address,
                                      street: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button
                              type="button"
                              onClick={() => setRecipientDialogOpen(false)}
                            >
                              Simpan
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Biaya */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 pt-6">
                <h3 className="text-lg font-semibold text-[#0C4A6E]">
                  Informasi Biaya
                </h3>
                <p className="text-[#0C4A6E]/70 mt-1">
                  Rincian biaya pengiriman
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-[#0C4A6E] font-medium">
                        Informasi Tarif
                      </Label>
                      {sender.address.city_id && recipient.address.city_id && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={
                            shippingRate.isManualRate
                              ? handleSwitchToAutoRate
                              : handleSwitchToManualRate
                          }
                          className="text-xs"
                        >
                          {shippingRate.isManualRate
                            ? "Gunakan Tarif Otomatis"
                            : "Input Tarif Manual"}
                        </Button>
                      )}
                    </div>

                    {shippingRate.isManualRate ? (
                      <>
                        <div className="space-y-2">
                          <Label
                            htmlFor="manual-rate-per-kg"
                            className="text-[#0C4A6E]"
                          >
                            Tarif per Kg (Rp)
                          </Label>
                          <Input
                            id="manual-rate-per-kg"
                            type="number"
                            value={manualRatePerKg}
                            onChange={(e) => setManualRatePerKg(e.target.value)}
                            placeholder="Masukkan tarif per kg"
                            className="bg-white border-gray-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="manual-total-cost"
                            className="text-[#0C4A6E]"
                          >
                            Total Biaya (Rp)
                          </Label>
                          <Input
                            id="manual-total-cost"
                            type="number"
                            value={manualTotalCost}
                            onChange={(e) => setManualTotalCost(e.target.value)}
                            placeholder="Masukkan total biaya"
                            className="bg-white border-gray-200"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label className="text-[#0C4A6E]">Tarif per Kg</Label>
                          <Input
                            value={`Rp ${shippingRate.ratePerKg.toLocaleString(
                              "id-ID"
                            )}`}
                            readOnly
                            className="bg-white border-gray-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#0C4A6E]">
                            Total Biaya Pengiriman
                          </Label>
                          <Input
                            value={`Rp ${shippingRate.totalCost.toLocaleString(
                              "id-ID"
                            )}`}
                            readOnly
                            className="bg-white border-gray-200 font-semibold text-[#0C4A6E]"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label className="text-[#0C4A6E]">Total Berat</Label>
                      <Input
                        value={`${Number(totalWeight).toFixed(2)} kg`}
                        readOnly
                        className="bg-white border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                    <div className="space-y-2">
                      <Label htmlFor="discount" className="text-[#0C4A6E]">
                        Diskon/Potongan (Rp)
                      </Label>
                      <Input
                        id="discount"
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="Jumlah diskon"
                        className="bg-white border-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#0C4A6E]">
                        Total Biaya Setelah Diskon
                      </Label>
                      <Input
                        value={`Rp ${shippingRate.finalCost.toLocaleString(
                          "id-ID"
                        )}`}
                        readOnly
                        className="bg-white border-gray-200 font-semibold text-[#FF6B2C]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Tambahan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 pt-6">
                <h3 className="text-lg font-semibold text-[#0C4A6E]">
                  Informasi Tambahan
                </h3>
                <p className="text-[#0C4A6E]/70 mt-1">
                  Data pendukung pengiriman
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                    <div className="space-y-2">
                      <Label htmlFor="shipment-type" className="text-[#0C4A6E]">
                        Jenis Kiriman
                      </Label>
                      <Select
                        value={shipmentType}
                        onValueChange={setShipmentType}
                      >
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Pilih jenis kiriman" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="drop-off">Drop-off</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="courier" className="text-[#0C4A6E]">
                        Kurir
                      </Label>
                      <Select value={courier} onValueChange={setCourier}>
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Pilih kurir" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCouriers ? (
                            <SelectItem value="_loading" disabled>
                              Memuat data...
                            </SelectItem>
                          ) : couriers?.data ? (
                            couriers.data.map((courierItem) => (
                              <SelectItem
                                key={courierItem.id}
                                value={
                                  courierItem.id ||
                                  `courier_${courierItem.name}`
                                }
                              >
                                {courierItem.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="_no_couriers" disabled>
                              Data tidak tersedia
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                    <div className="space-y-2">
                      <Label htmlFor="marketing" className="text-[#0C4A6E]">
                        Marketing
                      </Label>
                      <Select value={marketing} onValueChange={setMarketing}>
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Pilih marketing" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingMarketers ? (
                            <SelectItem value="_loading" disabled>
                              Memuat data...
                            </SelectItem>
                          ) : marketers?.data ? (
                            marketers.data.map((marketerItem) => (
                              <SelectItem
                                key={marketerItem.id}
                                value={
                                  marketerItem.id ||
                                  `marketer_${marketerItem.name}`
                                }
                              >
                                {marketerItem.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="_no_marketers" disabled>
                              Data tidak tersedia
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="tracking-number"
                        className="text-[#0C4A6E]"
                      >
                        Nomor Resi
                      </Label>
                      <Input
                        id="tracking-number"
                        value={trackingNumber}
                        readOnly
                        className="bg-white border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between">
              <Link to="/shipments">
                <Button
                  variant="outline"
                  type="button"
                  className="text-[#0C4A6E] border-[#0C4A6E]/20 hover:bg-[#0C4A6E]/5"
                >
                  Batal
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={isArchived ? "outline" : "secondary"}
                  onClick={isArchived ? handleUnarchive : handleArchive}
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending ||
                    archiveMutation.isPending
                  }
                  className="flex items-center gap-2 bg-[#0C4A6E]/10 text-[#0C4A6E] hover:bg-[#0C4A6E]/20"
                >
                  <Archive className="h-4 w-4" />
                  {isArchived ? "Batalkan Arsip" : "Arsipkan"}
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? "Menyimpan..." : "Membuat..."}
                    </>
                  ) : isEdit ? (
                    "Simpan Perubahan"
                  ) : (
                    "Buat Pengiriman"
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShipmentForm;
