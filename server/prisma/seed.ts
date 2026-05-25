import 'dotenv/config'
import { PrismaClient, Role, AdStatus, Condition } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DIRECT_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const CATEGORIES = [
  { name: 'Vehicles', icon: 'Car', slug: 'vehicles' },
  { name: 'Property', icon: 'Home', slug: 'property' },
  { name: 'Mobile Phones', icon: 'Smartphone', slug: 'mobile-phones' },
  { name: 'Electronics', icon: 'Laptop', slug: 'electronics' },
  { name: 'Jobs', icon: 'Briefcase', slug: 'jobs' },
  { name: 'Pets', icon: 'PawPrint', slug: 'pets' },
  { name: 'Furniture', icon: 'Armchair', slug: 'furniture' },
  { name: 'Fashion', icon: 'Shirt', slug: 'fashion' },
  { name: 'Services', icon: 'Wrench', slug: 'services' },
  { name: 'Education', icon: 'GraduationCap', slug: 'education' },
  { name: 'Sports', icon: 'Dumbbell', slug: 'sports' },
  { name: 'Books', icon: 'BookOpen', slug: 'books' },
]

const CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

const UNSPLASH_IMAGES: Record<string, string[]> = {
  vehicles: [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
  ],
  property: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
    'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800',
  ],
  phones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800',
  ],
  furniture: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
  ],
  sports: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800',
  ],
  default: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  ],
}

function getImages(slug: string): string[] {
  const map: Record<string, string[]> = {
    vehicles: UNSPLASH_IMAGES.vehicles,
    property: UNSPLASH_IMAGES.property,
    electronics: UNSPLASH_IMAGES.electronics,
    'mobile-phones': UNSPLASH_IMAGES.phones,
    furniture: UNSPLASH_IMAGES.furniture,
    fashion: UNSPLASH_IMAGES.fashion,
    sports: UNSPLASH_IMAGES.sports,
  }
  const imgs = map[slug] ?? UNSPLASH_IMAGES.default
  return faker.helpers.arrayElements(imgs, { min: 1, max: Math.min(3, imgs.length) })
}

async function main() {
  console.log('Seeding database...')

  await prisma.report.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversationParticipant.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.ad.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const categories = await Promise.all(
    CATEGORIES.map(cat => prisma.category.create({ data: cat }))
  )
  console.log(`Created ${categories.length} categories`)

  const adminPassword = await bcrypt.hash('Admin@123', 12)
  await prisma.user.create({
    data: {
      email: 'admin@go.com',
      name: 'GO Admin',
      password: adminPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      city: 'Dubai',
      bio: 'GO Marketplace administrator',
    },
  })

  const userPassword = await bcrypt.hash('User@1234', 12)
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          password: userPassword,
          phone: faker.phone.number(),
          city: faker.helpers.arrayElement(CITIES),
          bio: faker.person.bio(),
          isVerified: true,
          avatar: faker.image.avatar(),
        },
      })
    )
  )
  console.log(`Created ${users.length + 1} users`)

  const conditions: Condition[] = ['NEW', 'USED', 'REFURBISHED']
  const statuses: AdStatus[] = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'SOLD', 'DEACTIVATED']

  const ads = await Promise.all(
    Array.from({ length: 50 }).map((_, i) => {
      const category = faker.helpers.arrayElement(categories)
      const user = faker.helpers.arrayElement(users)
      const isFeatured = i < 8

      return prisma.ad.create({
        data: {
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription() + ' ' + faker.lorem.paragraph(),
          price: faker.commerce.price({ min: 10, max: 50000, dec: 0 }),
          negotiable: faker.datatype.boolean(),
          condition: faker.helpers.arrayElement(conditions),
          status: faker.helpers.arrayElement(statuses),
          isFeatured,
          images: getImages(category.slug),
          city: faker.helpers.arrayElement(CITIES),
          categoryId: category.id,
          userId: user.id,
        },
      })
    })
  )
  console.log(`Created ${ads.length} ads`)

  const activeAds = ads.filter(a => a.status === 'ACTIVE')

  for (let i = 0; i < 15; i++) {
    const user = faker.helpers.arrayElement(users)
    const ad = faker.helpers.arrayElement(activeAds)
    if (ad.userId === user.id) continue
    await prisma.favorite.upsert({
      where: { userId_adId: { userId: user.id, adId: ad.id } },
      create: { userId: user.id, adId: ad.id },
      update: {},
    })
  }
  console.log('Created favorites')

  const convPairs: Array<{ u1: string; u2: string; adId: string }> = []
  for (let i = 0; i < 8; i++) {
    const u1 = faker.helpers.arrayElement(users)
    const u2 = faker.helpers.arrayElement(users.filter(u => u.id !== u1.id))
    const ad = faker.helpers.arrayElement(activeAds.filter(a => a.userId === u2.id))
    if (!ad) continue
    convPairs.push({ u1: u1.id, u2: u2.id, adId: ad.id })
  }

  for (const pair of convPairs) {
    const conv = await prisma.conversation.create({
      data: {
        adId: pair.adId,
        participants: {
          create: [{ userId: pair.u1 }, { userId: pair.u2 }],
        },
      },
    })

    const msgCount = faker.number.int({ min: 2, max: 8 })
    for (let m = 0; m < msgCount; m++) {
      const senderId = m % 2 === 0 ? pair.u1 : pair.u2
      const recipientId = m % 2 === 0 ? pair.u2 : pair.u1
      await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId,
          recipientId,
          content: faker.lorem.sentence(),
          isRead: m < msgCount - 1,
        },
      })
    }
  }
  console.log('Created conversations and messages')

  for (const user of users.slice(0, 5)) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'FAVORITE',
        title: 'Someone saved your listing',
        body: 'A buyer saved one of your ads.',
        metadata: {},
      },
    })
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'MESSAGE',
        title: 'New message',
        body: 'You have a new message from a buyer.',
        metadata: {},
      },
    })
  }
  console.log('Created notifications')

  const reportReasons = ['SPAM', 'FRAUD', 'FAKE_LISTING'] as const
  for (let i = 0; i < 5; i++) {
    const reporter = faker.helpers.arrayElement(users)
    const ad = faker.helpers.arrayElement(activeAds.filter(a => a.userId !== reporter.id))
    if (!ad) continue
    await prisma.report.create({
      data: {
        reportedById: reporter.id,
        adId: ad.id,
        reason: faker.helpers.arrayElement(reportReasons),
        description: faker.lorem.sentence(),
      },
    })
  }
  console.log('Created reports')

  console.log('\nSeed complete!')
  console.log('Admin:  admin@go.com / Admin@123')
  console.log('Users:  [any user email] / User@1234')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async err => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
