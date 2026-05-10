// prisma/seed.js
// Run via: npx prisma db seed

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Biohna database...')

  // Categories
  const categories = [
    { name: 'Alimentation', slug: 'alimentation' },
    { name: 'Huiles',       slug: 'huiles' },
    { name: 'Cosmétiques',  slug: 'cosmetiques' },
    { name: 'Épices',       slug: 'epices' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categories seeded')

  // Vendors + their products
  const vendors = [
    {
      storeName:    'Lalla Fatima',
      storeAddress: 'Meknès',
      products: [
        { name: 'Yassir Milk',             price: 45,  category: 'alimentation', stock: 50, bio: false },
        { name: "9er3a dyal L3ssel Beldi", price: 500, category: 'alimentation', stock: 12, bio: false },
        { name: 'Miel de Thym Sauvage',    price: 280, category: 'alimentation', stock: 15, bio: true  },
        { name: "Miel d'Euphorbe",         price: 420, category: 'alimentation', stock: 8,  bio: false },
      ],
    },
    {
      storeName:    'Coopérative Aït Baha',
      storeAddress: 'Tiznit',
      products: [
        { name: "Huile d'Argan Pure",       price: 320, category: 'huiles',      stock: 24, bio: false },
        { name: "Huile d'Argan Cosmétique", price: 280, category: 'huiles',      stock: 18, bio: false },
        { name: "Savon à l'Huile d'Argan",  price: 95,  category: 'cosmetiques', stock: 30, bio: true  },
      ],
    },
    {
      storeName:    'Khadija — Essaouira',
      storeAddress: 'Essaouira',
      products: [
        { name: 'Savon Beldi Eucalyptus', price: 85,  category: 'cosmetiques', stock: 40, bio: false },
        { name: 'Savon Beldi Argan',      price: 90,  category: 'cosmetiques', stock: 35, bio: false },
        { name: 'Gommage Kessa & Beldi',  price: 120, category: 'cosmetiques', stock: 20, bio: false },
      ],
    },
    {
      storeName:    'Épices du Souk',
      storeAddress: 'Marrakech',
      products: [
        { name: 'Ras el Hanout Premium', price: 65,  category: 'epices', stock: 60, bio: false },
        { name: 'Cumin Bio du Maroc',    price: 40,  category: 'epices', stock: 45, bio: true  },
        { name: 'Safran de Taliouine',   price: 350, category: 'epices', stock: 10, bio: false },
      ],
    },
  ]

  for (const v of vendors) {
    // Find by storeName to stay idempotent — create only if not yet present
    let vendor = await prisma.vendor.findFirst({ where: { storeName: v.storeName } })
    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: { storeName: v.storeName, storeAddress: v.storeAddress },
      })
    }

    for (const p of v.products) {
      const cat = await prisma.category.findUnique({ where: { slug: p.category } })

      const exists = await prisma.product.findFirst({
        where: { vendorId: vendor.id, name: p.name },
      })
      if (!exists) {
        await prisma.product.create({
          data: {
            vendorId:      vendor.id,
            categoryId:    cat?.id,
            name:          p.name,
            price:         p.price,
            stockQuantity: p.stock,
            bioCertified:  p.bio,
            status:        'ACTIVE',
          },
        })
      }
    }
  }

  console.log('✅ Vendors + products seeded')
  console.log('🎉 Done!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
