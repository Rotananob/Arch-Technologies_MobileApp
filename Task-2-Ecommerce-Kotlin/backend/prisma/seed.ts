import { PrismaClient, Role, ProductCondition, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ShopSphere database...');

  // Clean old records
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordSalt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash('Password123!', passwordSalt);

  // 1. Create Users
  const rotana = await prisma.user.create({
    data: {
      email: 'nobrothana180703@gmail.com',
      passwordHash: commonPasswordHash,
      fullName: 'Rotana NOB',
      phoneNumber: '+855 87 986 045',
      role: Role.SELLER,
      sellerProfile: {
        create: {
          storeName: 'Rotana Tech Hub',
          description: 'Official student electronics & accessories on campus.',
          rating: 4.9,
        },
      },
    },
  });

  const sellerDara = await prisma.user.create({
    data: {
      email: 'dara.sok@archtech.edu',
      passwordHash: commonPasswordHash,
      fullName: 'Dara Sok',
      phoneNumber: '+855 89 234 567',
      role: Role.SELLER,
      sellerProfile: {
        create: {
          storeName: 'Campus Bookstore & Gear',
          description: 'Verified textbooks, calculators, and study stationery.',
          rating: 4.8,
        },
      },
    },
  });

  const buyerBopha = await prisma.user.create({
    data: {
      email: 'bopha.chan@archtech.edu',
      passwordHash: commonPasswordHash,
      fullName: 'Bopha Chan',
      phoneNumber: '+855 77 889 900',
      role: Role.BUYER,
    },
  });

  // 2. Create Categories
  const catTech = await prisma.category.create({
    data: {
      id: 'cat_electronics',
      name: 'Electronics & Gadgets',
      nameKh: 'គ្រឿងអេឡិចត្រូនិច និងឧបករណ៍បច្ចេកវិទ្យា',
      slug: 'electronics',
      iconName: 'devices',
    },
  });

  const catBooks = await prisma.category.create({
    data: {
      id: 'cat_books',
      name: 'Books & Textbooks',
      nameKh: 'សៀវភៅ និងឯកសារសិក្សា',
      slug: 'books',
      iconName: 'menu_book',
    },
  });

  const catApparel = await prisma.category.create({
    data: {
      id: 'cat_apparel',
      name: 'Campus Fashion & Bags',
      nameKh: 'សម្លៀកបំពាក់ និងកាតាប',
      slug: 'apparel',
      iconName: 'checkroom',
    },
  });

  const catStationery = await prisma.category.create({
    data: {
      id: 'cat_stationery',
      name: 'Study Supplies',
      nameKh: 'សម្ភារៈសិក្សាទូទៅ',
      slug: 'stationery',
      iconName: 'edit_note',
    },
  });

  // 3. Create Products
  const products = [
    {
      title: 'Apple iPad Air M2 11-inch (128GB)',
      titleKh: 'ថេប្លេត iPad Air M2 ទំហំ ១១ អ៊ីញ (128GB)',
      description: 'Used for one semester in computer science class. Complete in box with Apple Pencil support.',
      descriptionKh: 'ប្រើប្រាស់បានមួយឆមាសក្នុងថ្នាក់វិទ្យាសាស្ត្រកុំព្យូទ័រ។ មានប្រអប់ និងគាំទ្រ Apple Pencil។',
      price: 520.0,
      originalPrice: 599.0,
      categoryId: catTech.id,
      sellerId: rotana.id,
      stockQuantity: 2,
      condition: ProductCondition.LIKE_NEW,
      isFeatured: true,
      isPromotion: true,
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
    },
    {
      title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      titleKh: 'កាសស្តាប់ត្រចៀកកាត់បន្ថយសម្លេងរំខាន Sony WH-1000XM5',
      description: 'Industry-leading noise cancellation. Perfect for quiet study in the university library.',
      descriptionKh: 'កាត់បន្ថយសម្លេងរំខានបានយ៉ាងល្អឥតខ្ចោះ ស័ក្តិសមបំផុតសម្រាប់ការអានសៀវភៅនៅបណ្ណាល័យ។',
      price: 285.0,
      originalPrice: 349.0,
      categoryId: catTech.id,
      sellerId: rotana.id,
      stockQuantity: 4,
      condition: ProductCondition.BRAND_NEW,
      isFeatured: true,
      isPromotion: false,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    },
    {
      title: 'Logitech MX Master 3S Wireless Mouse',
      titleKh: 'កណ្ដុរឥតខ្សែ Logitech MX Master 3S',
      description: 'Ergonomic mouse with silent clicks and hyperfast scrolling. Great for coding and design.',
      descriptionKh: 'កណ្ដុរឥតខ្សែមានផាសុកភាពខ្ពស់ ងាយស្រួលសរសេរកូដ និងរចនាប្លង់។',
      price: 78.0,
      originalPrice: 99.0,
      categoryId: catTech.id,
      sellerId: rotana.id,
      stockQuantity: 6,
      condition: ProductCondition.BRAND_NEW,
      isFeatured: false,
      isPromotion: true,
      images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'],
    },
    {
      title: 'Clean Code: Handbook of Agile Software Craftsmanship',
      titleKh: 'សៀវភៅ Clean Code សម្រាប់ការសរសេរកូដកម្រិតស្តង់ដារ',
      description: 'Robert C. Martin classic engineering textbook. Essential reading for software engineering interns.',
      descriptionKh: 'សៀវភៅមូលដ្ឋានគ្រឹះមិនអាចខ្វះបានសម្រាប់វិស្វករផ្នែកទន់។',
      price: 24.5,
      originalPrice: 35.0,
      categoryId: catBooks.id,
      sellerId: sellerDara.id,
      stockQuantity: 8,
      condition: ProductCondition.LIKE_NEW,
      isFeatured: true,
      isPromotion: false,
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'],
    },
    {
      title: 'Waterproof Laptop Backpack (15.6-inch)',
      titleKh: 'កាតាបស្ពាយការពារជ្រាបទឹកសម្រាប់កុំព្យូទ័រ (15.6 អ៊ីញ)',
      description: 'Durable weather-resistant backpack with padded laptop sleeve and USB charging pass-through.',
      descriptionKh: 'កាតាបស្ពាយរឹងមាំ ការពារទឹកភ្លៀង មានថតការពារកុំព្យូទ័រយ៉ាងក្រាស់។',
      price: 32.0,
      originalPrice: 45.0,
      categoryId: catApparel.id,
      sellerId: sellerDara.id,
      stockQuantity: 12,
      condition: ProductCondition.BRAND_NEW,
      isFeatured: false,
      isPromotion: true,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
    },
  ];

  for (const item of products) {
    const { images, ...prodData } = item;
    await prisma.product.create({
      data: {
        ...prodData,
        images: {
          create: images.map((url, idx) => ({
            imageUrl: url,
            isPrimary: idx === 0,
          })),
        },
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
