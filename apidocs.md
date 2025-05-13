# API Dokumentasi Tabel Tes

Dokumentasi ini menjelaskan cara menggunakan API endpoint untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada tabel tes.

## Endpoint Base

```
https://[PROJECT_REF].supabase.co/functions/v1/tes
```

## Autentikasi

Semua endpoint memerlukan autentikasi menggunakan token JWT. Token harus disertakan di header permintaan:

```
Authorization: Bearer [TOKEN]
```

## Struktur Data

Tabel `tes` memiliki struktur data sebagai berikut:

| Kolom       | Tipe     | Deskripsi                               |
| ----------- | -------- | --------------------------------------- |
| id          | UUID     | ID unik untuk setiap data (primary key) |
| name        | String   | Nama data (wajib diisi)                 |
| description | String   | Deskripsi data (opsional)               |
| created_at  | DateTime | Waktu pembuatan data                    |

## Endpoints

### 1. Get Data (READ)

Mendapatkan data dari tabel tes berdasarkan filter atau semua data jika tidak ada filter.

**Metode HTTP**: GET

**Parameter URL**:

- `id` (opsional): Filter berdasarkan ID
- `name` (opsional): Filter berdasarkan nama

**Contoh Request**:

```bash
# Mendapatkan semua data
curl -X GET 'https://[PROJECT_REF].supabase.co/functions/v1/tes' \
  -H 'Authorization: Bearer [TOKEN]'

# Mendapatkan data berdasarkan ID
curl -X GET 'https://[PROJECT_REF].supabase.co/functions/v1/tes?id=123e4567-e89b-12d3-a456-426614174000' \
  -H 'Authorization: Bearer [TOKEN]'

# Mendapatkan data berdasarkan nama
curl -X GET 'https://[PROJECT_REF].supabase.co/functions/v1/tes?name=contoh' \
  -H 'Authorization: Bearer [TOKEN]'
```

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "contoh",
      "description": "Ini adalah data contoh",
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Create Data (CREATE)

Membuat data baru di tabel tes.

**Metode HTTP**: POST

**Request Body**:

```json
{
  "name": "contoh", // wajib
  "description": "Ini adalah data contoh" // opsional
}
```

**Contoh Request**:

```bash
curl -X POST 'https://[PROJECT_REF].supabase.co/functions/v1/tes' \
  -H 'Authorization: Bearer [TOKEN]' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "contoh",
    "description": "Ini adalah data contoh"
  }'
```

**Response Sukses** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "contoh",
    "description": "Ini adalah data contoh",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### 3. Update Data (UPDATE)

Memperbarui data yang ada di tabel tes.

**Metode HTTP**: PATCH

**Parameter URL**:

- `id` (wajib): ID data yang akan diperbarui

**Request Body** (minimal satu field):

```json
{
  "name": "contoh baru",
  "description": "Ini adalah data contoh yang diperbarui"
}
```

**Contoh Request**:

```bash
curl -X PATCH 'https://[PROJECT_REF].supabase.co/functions/v1/tes?id=123e4567-e89b-12d3-a456-426614174000' \
  -H 'Authorization: Bearer [TOKEN]' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "contoh baru",
    "description": "Ini adalah data contoh yang diperbarui"
  }'
```

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "contoh baru",
    "description": "Ini adalah data contoh yang diperbarui",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### 4. Delete Data (DELETE)

Menghapus data yang ada di tabel tes.

**Metode HTTP**: DELETE

**Parameter URL**:

- `id` (wajib): ID data yang akan dihapus

**Contoh Request**:

```bash
curl -X DELETE 'https://[PROJECT_REF].supabase.co/functions/v1/tes?id=123e4567-e89b-12d3-a456-426614174000' \
  -H 'Authorization: Bearer [TOKEN]'
```

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Data berhasil dihapus",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "contoh baru",
    "description": "Ini adalah data contoh yang diperbarui",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Field 'name' harus diisi"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Data dengan ID tersebut tidak ditemukan"
}
```

### 405 Method Not Allowed

```json
{
  "success": false,
  "error": "Metode HTTP tidak didukung"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Pesan error internal"
}
```

## Pengujian Lokal

Untuk menguji API secara lokal:

1. Jalankan `supabase start` untuk memulai Supabase local development environment
2. Gunakan curl atau Postman untuk membuat request ke endpoint:
   ```
   http://127.0.0.1:54321/functions/v1/tes
   ```
3. Gunakan token JWT yang valid di header Authorization

## Contoh Penggunaan dengan JavaScript

```javascript
// Contoh menggunakan fetch API
async function fetchData() {
  const response = await fetch(
    "https://[PROJECT_REF].supabase.co/functions/v1/tes",
    {
      headers: {
        Authorization: "Bearer [TOKEN]",
      },
    }
  );
  const data = await response.json();
  console.log(data);
}

// Contoh membuat data baru
async function createData() {
  const response = await fetch(
    "https://[PROJECT_REF].supabase.co/functions/v1/tes",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer [TOKEN]",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Data Baru",
        description: "Deskripsi data baru",
      }),
    }
  );
  const data = await response.json();
  console.log(data);
}
```

# API Dokumentasi SiLogistik

Dokumentasi ini menjelaskan cara menggunakan API endpoint untuk SiLogistik.

## Endpoint Base

```
https://[PROJECT_REF].supabase.co/functions/v1
```

## Autentikasi

Sebagian besar endpoint memerlukan autentikasi menggunakan token JWT. Token harus disertakan di header permintaan:

```
Authorization: Bearer [TOKEN]
```

## Daftar API

- [Auth API](#auth-api) - Autentikasi dan registrasi pengguna
- [Tenant API](#tenant-api) - Registrasi dan manajemen tenant
- [Users API](#users-api) - Manajemen pengguna dalam tenant
- [Address API](#address-api) - Data wilayah Indonesia
- [Cities API](#cities-api) - Manajemen data kota
- [Shipment API](#shipment-api) - Manajemen pengiriman
- [Shipment Status API](#shipment-status-api) - Manajemen status pengiriman
- [Shipment Items API](#shipment-items-api) - Manajemen item pengiriman

## Auth API

API untuk autentikasi dan registrasi pengguna.

### 1. Login

Melakukan login dengan email dan password.

**Metode HTTP**: POST

**URL**: `/auth/login`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1...",
    "refresh_token": "aBcDeFgHiJkL...",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      ...
    },
    "tenant_info": {
      "id": "user-uuid",
      "tenant_id": 1,
      "role_id": 1,
      "name": "User Name"
    }
  }
}
```

### 2. Register

Mendaftarkan pengguna baru.

**Metode HTTP**: POST

**URL**: `/auth/register`

**Request Body**:

```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User",
  "phone": "081234567890"
}
```

**Response Sukses** (201 Created):

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1...",
    "refresh_token": "aBcDeFgHiJkL...",
    "user": {
      "id": "user-uuid",
      "email": "newuser@example.com",
      ...
    }
  }
}
```

Jika email konfirmasi dibutuhkan:

```json
{
  "success": true,
  "message": "Registrasi berhasil. Silakan periksa email Anda untuk konfirmasi.",
  "data": null
}
```

## Tenant API

API untuk registrasi dan manajemen tenant.

### 1. Registrasi Tenant

Mendaftarkan tenant baru dan menetapkan pengguna yang login sebagai super_admin.

**Metode HTTP**: POST

**URL**: `/tenant`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token dari user yang sudah login

**Request Body**:

```json
{
  "company_name": "PT Logistik Cepat",
  "subdomain": "logistikcepat",
  "email": "admin@logistikcepat.com",
  "name": "Admin Logistik",
  "phone": "08123456789",
  "address": "Jl. Contoh No. 123, Jakarta",
  "website": "https://logistikcepat.com",
  "logo": "https://example.com/logo.png"
}
```

**Response Sukses** (201 Created):

```json
{
  "success": true,
  "message": "Tenant berhasil dibuat dan user ditambahkan sebagai super_admin",
  "data": {
    "tenant": {
      "id": 1,
      "company_name": "PT Logistik Cepat",
      "subdomain": "logistikcepat",
      "email": "admin@logistikcepat.com",
      ...
    },
    "user": {
      "id": "auth-user-id",
      "tenant_id": 1,
      "role_id": 1,
      "name": "Admin Logistik",
      ...
    }
  }
}
```

## Users API

API untuk manajemen pengguna dalam tenant. Hanya dapat diakses oleh super_admin.

### 1. Get Data Pengguna

Mendapatkan data pengguna dalam tenant.

**Metode HTTP**: GET

**URL**: `/users` atau `/users?id=user-uuid`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "name": "John Doe",
      "phone": "081234567890",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "role": {
        "id": 1,
        "name": "super_admin"
      },
      "tenant_info": {
        "id": 1,
        "company_name": "PT Logistik Cepat"
      },
      "auth_user": {
        "email": "john@example.com",
        "created_at": "2023-01-01T00:00:00.000Z",
        "last_sign_in_at": "2023-01-01T00:00:00.000Z"
      }
    }
  ]
}
```

### 2. Buat Pengguna Baru

Membuat pengguna baru dalam tenant.

**Metode HTTP**: POST

**URL**: `/users`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin

**Request Body untuk Admin/Viewer**:

```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User",
  "phone": "081234567890",
  "role_id": 2
}
```

**Request Body untuk Kurir**:

```json
{
  "email": "courier@example.com",
  "password": "securepassword",
  "name": "Courier Name",
  "phone": "081234567890",
  "role_id": 3,
  "vehicle_plate": "B 1234 ABC"
}
```

**Request Body untuk Marketing**:

```json
{
  "email": "marketing@example.com",
  "password": "securepassword",
  "name": "Marketing Name",
  "phone": "081234567890",
  "role_id": 4,
  "address": "Jl. Contoh No. 123, Jakarta"
}
```

**Response Sukses** (201 Created):

```json
{
  "success": true,
  "message": "Pengguna berhasil dibuat",
  "data": {
    "id": "user-uuid",
    "name": "New User",
    "phone": "081234567890",
    "email": "newuser@example.com",
    ...
  }
}
```

### 3. Update Pengguna

Mengupdate data pengguna dalam tenant.

**Metode HTTP**: PATCH

**URL**: `/users?id=user-uuid`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin

**Request Body** (dapat berisi satu atau lebih field):

```json
{
  "name": "Updated Name",
  "phone": "089876543210",
  "is_active": false,
  "email": "newemail@example.com",
  "password": "newpassword",
  "role_id": 2
}
```

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Pengguna berhasil diupdate",
  "data": {
    "id": "user-uuid",
    ...
  }
}
```

### 4. Hapus Pengguna

Menghapus pengguna dari tenant.

**Metode HTTP**: DELETE

**URL**: `/users?id=user-uuid`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Pengguna berhasil dihapus",
  "data": {
    "id": "user-uuid",
    ...
  }
}
```

## Address API

API untuk mendapatkan data wilayah Indonesia (provinsi, kota, kecamatan).

### 1. Get Provinsi

Mendapatkan daftar semua provinsi di Indonesia.

**Metode HTTP**: GET

**URL**: `/address/provinces`

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "data": [
    "Aceh",
    "Sumatera Utara",
    "Sumatera Barat",
    ...
  ]
}
```

### 2. Get Kota berdasarkan Provinsi

Mendapatkan daftar kota/kabupaten berdasarkan provinsi.

**Metode HTTP**: GET

**URL**: `/address/cities?province=Jawa Barat`

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "data": [
    "Bandung",
    "Bekasi",
    "Bogor",
    ...
  ]
}
```

### 3. Get Kecamatan berdasarkan Kota

Mendapatkan daftar kecamatan berdasarkan kota/kabupaten.

**Metode HTTP**: GET

**URL**: `/address/districts?city=Bandung`

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "data": [
    "Antapani",
    "Arcamanik",
    "Astanaanyar",
    ...
  ]
}
```

## Cities API

API untuk manajemen data kota.

### 1. Get Data Kota

Mendapatkan data kota dengan paginasi dan pencarian.

**Metode HTTP**: GET

**URL**: `/cities` atau `/cities?id=1` atau `/cities?search=bandung&page=1&pageSize=20`

**Headers**:

- `Authorization: Bearer [TOKEN]`

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "data": {
    "cities": [
      {
        "id": 1,
        "name": "Bandung",
        ...
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 2. Tambah Kota Baru

Menambahkan kota baru.

**Metode HTTP**: POST

**URL**: `/cities`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin atau admin

**Request Body**:

```json
{
  "name": "Kota Baru"
}
```

**Response Sukses** (201 Created):

```json
{
  "success": true,
  "message": "Kota berhasil ditambahkan",
  "data": {
    "id": 101,
    "name": "Kota Baru"
  }
}
```

### 3. Update Kota

Mengupdate data kota.

**Metode HTTP**: PATCH

**URL**: `/cities?id=1`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin atau admin

**Request Body**:

```json
{
  "name": "Kota Updated"
}
```

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Kota berhasil diupdate",
  "data": {
    "id": 1,
    "name": "Kota Updated"
  }
}
```

### 4. Hapus Kota

Menghapus kota yang tidak digunakan dalam pengiriman atau tarif.

**Metode HTTP**: DELETE

**URL**: `/cities?id=1`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin atau admin

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Kota berhasil dihapus",
  "data": null
}
```

## Shipment API

API untuk manajemen pengiriman.

### 1. Get Data Pengiriman

Mendapatkan data pengiriman dengan paginasi dan filter.

**Metode HTTP**: GET

**URL**: `/shipment` atau `/shipment?id=1` atau `/shipment?page=1&pageSize=10&status=delivered&search=ABC123&start_date=2023-01-01&end_date=2023-01-31`

**Headers**:

- `Authorization: Bearer [TOKEN]`

**Response Sukses untuk Single Shipment** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "tracking_number": "SLG000001",
    "sender_name": "John Doe",
    "sender_phone": "081234567890",
    "sender_address": "Jl. Contoh No. 123",
    "sender_city": {
      "name": "Jakarta"
    },
    "recipient_name": "Jane Doe",
    "recipient_phone": "089876543210",
    "recipient_address": "Jl. Contoh No. 456",
    "recipient_city": {
      "name": "Bandung"
    },
    "shipment_type": "regular",
    "status": "delivered",
    "courier": {
      "user_id": "courier-uuid",
      "vehicle_plate": "B 1234 ABC",
      "users": {
        "name": "Courier Name",
        "phone": "081234567890"
      }
    },
    "total_chargeable_weight": 2.5,
    "base_shipping_cost": 50000,
    "discount": 5000,
    "final_shipping_cost": 45000,
    "payment_status": "paid",
    "created_at": "2023-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "name": "Paket 1",
        "actual_weight": 2,
        "quantity": 1,
        "length_cm": 20,
        "width_cm": 15,
        "height_cm": 10,
        "volume_weight": 0.5,
        "chargeable_weight": 2
      }
    ],
    "status_logs": [
      {
        "id": 1,
        "status": "delivered",
        "description": "Paket telah diterima",
        "created_at": "2023-01-02T00:00:00.000Z",
        "updated_by": {
          "name": "Courier Name"
        }
      },
      {
        "id": 2,
        "status": "in_transit",
        "description": "Paket dalam perjalanan",
        "created_at": "2023-01-01T12:00:00.000Z",
        "updated_by": {
          "name": "Courier Name"
        }
      }
    ]
  }
}
```

**Response Sukses untuk Multiple Shipments** (200 OK):

```json
{
  "success": true,
  "data": {
    "shipments": [
      {
        "id": 1,
        "tracking_number": "SLG000001",
        ...
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 2. Buat Pengiriman Baru

Membuat pengiriman baru.

**Metode HTTP**: POST

**URL**: `/shipment`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin atau admin

**Request Body**:

```json
{
  "sender_name": "John Doe",
  "sender_phone": "081234567890",
  "sender_address": "Jl. Contoh No. 123",
  "sender_city_id": 1,
  "recipient_name": "Jane Doe",
  "recipient_phone": "089876543210",
  "recipient_address": "Jl. Contoh No. 456",
  "recipient_city_id": 2,
  "shipment_type": "regular",
  "total_chargeable_weight": 2.5,
  "base_shipping_cost": 50000,
  "discount": 5000,
  "final_shipping_cost": 45000,
  "payment_status": "unpaid",
  "courier_id": "courier-uuid",
  "marketer_id": "marketer-uuid",
  "notes": "Harap berhati-hati, barang mudah pecah",
  "items": [
    {
      "name": "Paket 1",
      "actual_weight": 2,
      "quantity": 1,
      "length_cm": 20,
      "width_cm": 15,
      "height_cm": 10,
      "volume_weight": 0.5,
      "chargeable_weight": 2
    }
  ]
}
```

**Response Sukses** (201 Created):

```json
{
  "success": true,
  "message": "Pengiriman berhasil dibuat",
  "data": {
    "id": 1,
    "tracking_number": "SLG000001",
    ...
  }
}
```

### 3. Update Pengiriman

Mengupdate data pengiriman.

**Metode HTTP**: PATCH

**URL**: `/shipment?id=1`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin, admin, atau kurir (kurir hanya bisa update status)

**Request Body** (dapat berisi satu atau lebih field):

```json
{
  "status": "delivered",
  "recipient_name": "Jane Smith",
  "recipient_phone": "089876543210",
  "payment_status": "paid",
  "notes": "Paket diterima oleh satpam"
}
```

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Pengiriman berhasil diperbarui",
  "data": {
    "id": 1,
    "tracking_number": "SLG000001",
    ...
  }
}
```

### 4. Hapus Pengiriman

Menghapus pengiriman.

**Metode HTTP**: DELETE

**URL**: `/shipment?id=1`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin atau admin

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Pengiriman berhasil dihapus",
  "data": null
}
```

## Shipment Status API

API untuk manajemen status pengiriman.

### 1. Get Log Status

Mendapatkan log status pengiriman.

**Metode HTTP**: GET

**URL**: `/shipment_status?id=1` atau `/shipment_status?shipment_id=1`

**Headers**:

- `Authorization: Bearer [TOKEN]`

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shipment_id": 1,
      "status": "delivered",
      "description": "Paket telah diterima oleh penerima",
      "created_at": "2023-01-02T00:00:00.000Z",
      "updated_by": {
        "name": "Courier Name"
      }
    },
    {
      "id": 2,
      "shipment_id": 1,
      "status": "in_transit",
      "description": "Paket dalam perjalanan",
      "created_at": "2023-01-01T12:00:00.000Z",
      "updated_by": {
        "name": "Admin Name"
      }
    }
  ]
}
```

### 2. Tambah Log Status

Menambahkan log status baru untuk pengiriman.

**Metode HTTP**: POST

**URL**: `/shipment_status`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin, admin, atau kurir

**Request Body**:

```json
{
  "shipment_id": 1,
  "status": "delivered",
  "description": "Paket telah diterima oleh penerima"
}
```

**Response Sukses** (201 Created):

```json
{
  "success": true,
  "message": "Log status berhasil ditambahkan",
  "data": {
    "id": 3,
    "shipment_id": 1,
    "status": "delivered",
    "description": "Paket telah diterima oleh penerima",
    "created_at": "2023-01-03T00:00:00.000Z",
    "updated_by_user_id": "user-uuid"
  }
}
```

### 3. Hapus Log Status

Menghapus log status pengiriman.

**Metode HTTP**: DELETE

**URL**: `/shipment_status?id=1`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin atau admin

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Log status berhasil dihapus",
  "data": null
}
```

## Shipment Items API

API untuk manajemen item pengiriman.

### 1. Get Item Pengiriman

Mendapatkan data item pengiriman.

**Metode HTTP**: GET

**URL**: `/shipment_items?id=1` atau `/shipment_items?shipment_id=1`

**Headers**:

- `Authorization: Bearer [TOKEN]`

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shipment_id": 1,
      "name": "Paket 1",
      "actual_weight": 2,
      "quantity": 1,
      "length_cm": 20,
      "width_cm": 15,
      "height_cm": 10,
      "volume_weight": 0.5,
      "chargeable_weight": 2
    },
    ...
  ]
}
```

### 2. Tambah Item Pengiriman

Menambahkan item baru ke pengiriman.

**Metode HTTP**: POST

**URL**: `/shipment_items`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin atau admin

**Request Body**:

```json
{
  "shipment_id": 1,
  "name": "Paket Tambahan",
  "actual_weight": 1.5,
  "quantity": 1,
  "length_cm": 15,
  "width_cm": 10,
  "height_cm": 5,
  "volume_weight": 0.125,
  "chargeable_weight": 1.5
}
```

**Response Sukses** (201 Created):

```json
{
  "success": true,
  "message": "Item berhasil ditambahkan",
  "data": {
    "id": 2,
    "shipment_id": 1,
    "name": "Paket Tambahan",
    ...
  }
}
```

### 3. Update Item Pengiriman

Mengupdate data item pengiriman.

**Metode HTTP**: PATCH

**URL**: `/shipment_items?id=1`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin atau admin

**Request Body** (dapat berisi satu atau lebih field):

```json
{
  "name": "Paket Updated",
  "actual_weight": 2.5,
  "quantity": 2,
  "chargeable_weight": 2.5
}
```

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Item berhasil diupdate",
  "data": {
    "id": 1,
    "shipment_id": 1,
    "name": "Paket Updated",
    ...
  }
}
```

### 4. Hapus Item Pengiriman

Menghapus item pengiriman.

**Metode HTTP**: DELETE

**URL**: `/shipment_items?id=1`

**Headers**:

- `Authorization: Bearer [TOKEN]` - Token super_admin atau admin

**Response Sukses** (200 OK):

```json
{
  "success": true,
  "message": "Item berhasil dihapus",
  "data": null
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Field 'name' harus diisi"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized: Token tidak valid"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Forbidden: Anda tidak memiliki akses ke fitur ini"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Data dengan ID tersebut tidak ditemukan"
}
```

### 405 Method Not Allowed

```json
{
  "success": false,
  "error": "Metode HTTP tidak didukung"
}
```

### 409 Conflict

```json
{
  "success": false,
  "error": "Subdomain sudah digunakan, silakan pilih yang lain"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Terjadi kesalahan: [pesan error]"
}
```

## Pengujian Lokal

Untuk menguji API secara lokal:

1. Jalankan `supabase start` untuk memulai Supabase local development environment
2. Gunakan curl atau Postman untuk membuat request ke endpoint:
   ```
   http://127.0.0.1:54321/functions/v1/[endpoint]
   ```
3. Gunakan token JWT yang valid di header Authorization
