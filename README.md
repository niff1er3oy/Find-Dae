# Find Dae — ตามหารูปมุมเผลอของคุณในงานอีเวนต์

> เว็บแอปค้นหารูปภาพด้วย AI จดจำใบหน้า ช่างภาพอัปโหลดรูปงาน ผู้เข้าร่วมค้นหาหน้าตัวเองในคลิกเดียว

---

## ภาพรวม

Find Dae แก้ปัญหา "ถ่ายรูปงานเยอะมาก แต่หาหน้าตัวเองไม่เจอ" ด้วยระบบ 2 บทบาท:

- **ตากล้อง (Photographer)** — สร้างอีเวนต์ อัปโหลดรูป เชิญช่างภาพคนอื่นร่วมงาน
- **ผู้เข้าร่วม (Attendee)** — ลงทะเบียนพร้อมรูปใบหน้า 3 รูป แล้วให้ AI ค้นหาตัวเองในงานที่สนใจ

---

## คุณสมบัติหลัก

### สำหรับตากล้อง
- สร้างและจัดการอีเวนต์พร้อมโปสเตอร์
- ตั้งรหัสผ่าน PIN เพื่อคุ้มครองความเป็นส่วนตัว
- อัปโหลดรูปภาพงานได้ครั้งละสูงสุด 500 รูป (ไม่เกิน 5 MB ต่อรูป)
- เชิญช่างภาพคนอื่นเป็นผู้ดูแลร่วม (Collaborator)
- ลบรูปภาพและดาวน์โหลดรูปทั้งหมดเป็นไฟล์ ZIP
- แดชบอร์ดแสดงสถิติรูปและงานทั้งหมด

### สำหรับผู้เข้าร่วม
- ลงทะเบียนพร้อมรูปใบหน้า 3 มุม (ใช้สำหรับ AI เปรียบเทียบ)
- ค้นหาหน้าตัวเองในงานอีเวนต์ที่ต้องการ
- ดูแกลเลอรีเฉพาะรูปที่มีตัวเองปรากฏอยู่
- แดชบอร์ดแสดงสถิติรูปที่เจอและงานที่เคยค้นหา

---

## Tech Stack

| หมวด | เทคโนโลยี |
|---|---|
| Frontend Framework | Next.js 16.2.1 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animation | anime.js v4 |
| Icons | Lucide React |
| Font | Nunito (Google Fonts) |
| Language | TypeScript 5 |
| Database | MySQL 8 via mysql2 |
| Authentication | JWT (jose) + bcryptjs |
| File Compression | 7-Zip (7zip-bin + node-7z) |
| AI Face Recognition | Python Server (รันแยก บน port 8055) |

---

## สถาปัตยกรรมระบบ

```
Browser
   │
   ▼
Next.js App (App Router)
   ├── Server Components  — ดึงข้อมูลจาก MySQL โดยตรง
   ├── Client Components  — UI Interactive, anime.js
   └── Server Actions     — ตรวจสิทธิ์, เขียนไฟล์, queries
         │
         ├── MySQL Database (find_dae)
         │
         └── AI Face Recognition Server  ← รันแยก (Python, port 8055)
                ├── POST /photographers  — วิเคราะห์รูปในงาน, บันทึก face IDs ลง DB
                └── POST /attendee       — ค้นหาใบหน้าของสมาชิกในงาน

File Storage (Local)
   └── D:\find_dae_photos\
         ├── member\      — รูปโปรไฟล์ + รูปใบหน้าสมาชิก
         └── events\
               ├── {id}_poster.jpg  — โปสเตอร์งาน
               └── {eventId}\       — รูปภาพในงานแต่ละงาน
```

---

## โครงสร้างโปรเจค

```
find-dae/
├── app/
│   ├── actions/             # Server Actions
│   │   ├── auth.ts          # register, login, logout, getUser
│   │   ├── event.ts         # CRUD อีเวนต์, collaborators, password
│   │   ├── photo.ts         # อัปโหลด, ลบ, ค้นหารูป, เรียก AI
│   │   ├── dashboard.ts     # สถิติแยกตาม role
│   │   └── profile.ts       # แก้ไขโปรไฟล์
│   ├── api/
│   │   ├── image/[filename]/                    # เสิร์ฟรูปสมาชิก
│   │   ├── event-image/[filename]/              # เสิร์ฟโปสเตอร์งาน
│   │   ├── event-photo/[eventId]/[filename]/    # เสิร์ฟรูปในงาน
│   │   └── download-event/[eventId]/            # ดาวน์โหลด ZIP
│   ├── dashboard/           # หน้า Dashboard (แยกตาม role อัตโนมัติ)
│   ├── events/
│   │   ├── page.tsx         # หน้ารายการอีเวนต์
│   │   ├── create/          # สร้างอีเวนต์ใหม่ (ตากล้องเท่านั้น)
│   │   └── [id]/            # หน้ารายละเอียดอีเวนต์ + แกลเลอรี
│   ├── login/               # หน้าเข้าสู่ระบบ
│   ├── signup/              # หน้าสมัครสมาชิก
│   ├── settings/            # หน้าตั้งค่าโปรไฟล์
│   ├── globals.css          # Design system tokens, animations
│   └── layout.tsx           # Root layout, Navbar, Nunito font
├── components/
│   └── Navbar.tsx
├── lib/
│   └── db.ts                # MySQL connection pool
├── public/
├── find_dae.sql             # Database schema + sample data
├── .env                     # Environment variables (ไม่ commit)
└── package.json
```

---

## ความต้องการเบื้องต้น

| รายการ | เวอร์ชัน |
|---|---|
| Node.js | 20 ขึ้นไป |
| npm | 9 ขึ้นไป |
| MySQL | 8.0 ขึ้นไป |
| AI Server (Python) | ดูเอกสารแยก |

> **Windows เท่านั้น (ปัจจุบัน):** path เก็บไฟล์ถูก hardcode เป็น `D:\find_dae_photos\` — ดูหัวข้อ [ตั้งค่า File Storage](#ตั้งค่า-file-storage)

---

## การติดตั้ง

### 1. Clone โปรเจค

```bash
git clone https://github.com/Niff1er/Find-Dae.git
cd Find-Dae
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจค:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=find_dae

# JWT (ใส่ random string ยาวอย่างน้อย 32 ตัวอักษร)
JWT_SECRET=your-super-secret-key-at-least-32-chars-long
```

### 4. ตั้งค่า File Storage

สร้างโฟลเดอร์สำหรับเก็บรูปภาพ:

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force "D:\find_dae_photos\member"
New-Item -ItemType Directory -Force "D:\find_dae_photos\events"
```

วาง `default-profile.png` ไว้ใน `member\` เพื่อให้รูปโปรไฟล์ default ใช้งานได้:
```
D:\find_dae_photos\member\default-profile.png
```

> **Linux / macOS:** path ถูก hardcode ในโค้ด ต้องแก้ด้วยมือในไฟล์ต่อไปนี้:
> `app/actions/auth.ts`, `app/actions/event.ts`, `app/actions/photo.ts`,
> `app/api/image/[filename]/route.ts`, `app/api/event-image/[filename]/route.ts`,
> `app/api/event-photo/[eventId]/[filename]/route.ts`

### 5. ตั้งค่าฐานข้อมูล

```bash
mysql -u root -p -e "CREATE DATABASE find_dae CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p find_dae < find_dae.sql
```

หรือนำเข้าผ่าน phpMyAdmin / MySQL Workbench โดย import ไฟล์ `find_dae.sql`

> ไฟล์ SQL มี sample data ให้ทดสอบได้ทันที

### 6. เริ่มต้น AI Server

**ต้องรัน AI Server ก่อนใช้งานฟีเจอร์ค้นหาใบหน้า** — server ต้องรันที่ `http://localhost:8055`

| Endpoint | Method | Body | คำอธิบาย |
|---|---|---|---|
| `/photographers` | POST | `{ event_id, folder_path }` | วิเคราะห์ใบหน้าในรูปทั้งหมดของงาน |
| `/attendee` | POST | `{ event_id, member_id }` | ค้นหาใบหน้าของสมาชิกในงาน |

ดูวิธีติดตั้งและรัน AI Server ใน repository แยกต่างหาก

### 7. รัน Development Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

---

## Environment Variables

| ตัวแปร | คำอธิบาย | ตัวอย่าง | จำเป็น |
|---|---|---|---|
| `DB_HOST` | MySQL host | `localhost` | ✅ |
| `DB_PORT` | MySQL port | `3306` | ✅ |
| `DB_USER` | MySQL username | `root` | ✅ |
| `DB_PASSWORD` | MySQL password | `secret` | ✅ |
| `DB_NAME` | ชื่อฐานข้อมูล | `find_dae` | ✅ |
| `JWT_SECRET` | Secret key สำหรับ sign JWT | random string ≥ 32 ตัวอักษร | ✅ |
| `NODE_ENV` | สภาพแวดล้อม | `development` / `production` | ⬜ |

> **คำเตือน:** ห้าม commit ไฟล์ `.env` ขึ้น version control เด็ดขาด

---

## Build สำหรับ Production

```bash
npm run build
npm run start
```

> ตรวจสอบว่า `NODE_ENV=production` และ MySQL พร้อมใช้งานก่อน build

---

## API Routes

| Method | Path | คำอธิบาย | Auth |
|---|---|---|---|
| `GET` | `/api/image/[filename]` | เสิร์ฟรูปโปรไฟล์และรูปใบหน้าสมาชิก | — |
| `GET` | `/api/event-image/[filename]` | เสิร์ฟโปสเตอร์งานอีเวนต์ | — |
| `GET` | `/api/event-photo/[eventId]/[filename]` | เสิร์ฟรูปภาพในงาน | — |
| `GET` | `/api/download-event/[eventId]` | ดาวน์โหลดรูปทั้งงานเป็นไฟล์ `.zip` | ตากล้อง |

> ฟีเจอร์ทั้งหมดนอกจาก API routes ดำเนินการผ่าน Next.js Server Actions

---

## Database Schema

```
member
├── id           INT AUTO_INCREMENT PK
├── name         TEXT
├── mail         TEXT  (unique ในโค้ด ไม่มี DB constraint)
├── password     TEXT  (bcrypt hash)
├── profile      TEXT  (ชื่อไฟล์รูปโปรไฟล์)
├── img_1        TEXT  (รูปใบหน้าที่ 1 — attendee เท่านั้น)
├── img_2        TEXT
├── img_3        TEXT
├── role         TEXT  ('photographer' | 'attendee')
└── created_at   TIMESTAMP

events
├── id             INT AUTO_INCREMENT PK
├── name           TEXT
├── detail         TEXT
├── poster         TEXT  (ชื่อไฟล์โปสเตอร์)
├── path           TEXT  (ชื่อโฟลเดอร์ย่อยใน events/)
├── photographer_id INT  FK → member.id
├── password       INT   (PIN 6 หลัก, NULL = ไม่มีรหัสผ่าน)
└── created_at     TIMESTAMP

photos
├── id              INT AUTO_INCREMENT PK
├── image_path      TEXT  (ชื่อไฟล์รูป)
├── event_id        INT   FK → events.id
├── photographer_id INT   FK → member.id
└── created_at      TIMESTAMP

face
├── id           INT AUTO_INCREMENT PK
├── photos_id    INT   FK → photos.id
├── face_id      TEXT  (UUID จาก AI Server)
├── attendee_id  INT   FK → member.id (NULL ถ้ายังไม่ถูก match)
└── created_at   TIMESTAMP

event_collaborators
├── id              INT AUTO_INCREMENT PK
├── event_id        INT FK → events.id
├── photographer_id INT FK → member.id
├── role            TEXT ('photographer' | 'owner')
└── joined_at       TIMESTAMP

event_access
├── id          INT AUTO_INCREMENT PK
├── event_id    INT FK → events.id
├── attendee_id INT FK → member.id
└── created_at  TIMESTAMP
```

---

## Screenshots

> *(เพิ่ม screenshots ที่นี่)*

| หน้าหลัก | หน้าอีเวนต์ | แกลเลอรี |
|---|---|---|
| ![Home](docs/screenshots/home.png) | ![Events](docs/screenshots/events.png) | ![Gallery](docs/screenshots/gallery.png) |

---

## License

โปรเจคนี้เผยแพร่ภายใต้ **MIT License** — ดูรายละเอียดในไฟล์ [LICENSE](LICENSE)

---

<p align="center">สร้างด้วย ❤️ โดย <a href="https://github.com/Niff1er">Niff1er</a></p>
