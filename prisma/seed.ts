import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create countries
  const india = await prisma.country.upsert({
    where: { code: 'IN' },
    update: {},
    create: {
      name: 'India',
      code: 'IN',
    },
  });

  const america = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: {
      name: 'America',
      code: 'US',
    },
  });

  console.log('Created countries:', { india, america });

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const nickFury = await prisma.user.upsert({
    where: { email: 'nick.fury@slooze.com' },
    update: {},
    create: {
      email: 'nick.fury@slooze.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const captainMarvel = await prisma.user.upsert({
    where: { email: 'captain.marvel@slooze.com' },
    update: {},
    create: {
      email: 'captain.marvel@slooze.com',
      password: hashedPassword,
      role: 'MANAGER',
      countryId: india.id,
    },
  });

  const captainAmerica = await prisma.user.upsert({
    where: { email: 'captain.america@slooze.com' },
    update: {},
    create: {
      email: 'captain.america@slooze.com',
      password: hashedPassword,
      role: 'MANAGER',
      countryId: america.id,
    },
  });

  const thanos = await prisma.user.upsert({
    where: { email: 'thanos@slooze.com' },
    update: {},
    create: {
      email: 'thanos@slooze.com',
      password: hashedPassword,
      role: 'MEMBER',
      countryId: india.id,
    },
  });

  const thor = await prisma.user.upsert({
    where: { email: 'thor@slooze.com' },
    update: {},
    create: {
      email: 'thor@slooze.com',
      password: hashedPassword,
      role: 'MEMBER',
      countryId: america.id,
    },
  });

  const travis = await prisma.user.upsert({
    where: { email: 'travis@slooze.com' },
    update: {},
    create: {
      email: 'travis@slooze.com',
      password: hashedPassword,
      role: 'MEMBER',
      countryId: america.id,
    },
  });

  console.log('Created users');

  // Create restaurants for India
  const indianRestaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Taj Mahal Restaurant',
      description: 'Authentic Indian cuisine with traditional flavors',
      countryId: india.id,
    },
  });

  const indianRestaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Spice Garden',
      description: 'Modern Indian fusion restaurant',
      countryId: india.id,
    },
  });

  // Create restaurants for America
  const americanRestaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Burger Palace',
      description: 'Classic American burgers and fries',
      countryId: america.id,
    },
  });

  const americanRestaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Pizza Corner',
      description: 'New York style pizza and Italian-American dishes',
      countryId: america.id,
    },
  });

  console.log('Created restaurants');

  // Create menu items for Indian restaurants
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: indianRestaurant1.id,
        name: 'Butter Chicken',
        description: 'Creamy tomato-based curry with tender chicken',
        price: 15.99,
      },
      {
        restaurantId: indianRestaurant1.id,
        name: 'Biryani',
        description: 'Fragrant basmati rice with spiced meat',
        price: 18.99,
      },
      {
        restaurantId: indianRestaurant1.id,
        name: 'Naan Bread',
        description: 'Fresh baked flatbread',
        price: 3.99,
      },
      {
        restaurantId: indianRestaurant2.id,
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese with spices',
        price: 12.99,
      },
      {
        restaurantId: indianRestaurant2.id,
        name: 'Dal Makhani',
        description: 'Creamy black lentils',
        price: 11.99,
      },
      {
        restaurantId: indianRestaurant2.id,
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in syrup',
        price: 5.99,
      },
    ],
  });

  // Create menu items for American restaurants
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: americanRestaurant1.id,
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and special sauce',
        price: 12.99,
      },
      {
        restaurantId: americanRestaurant1.id,
        name: 'Cheeseburger',
        description: 'Classic burger with cheese',
        price: 13.99,
      },
      {
        restaurantId: americanRestaurant1.id,
        name: 'French Fries',
        description: 'Crispy golden fries',
        price: 4.99,
      },
      {
        restaurantId: americanRestaurant2.id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato, mozzarella, and basil',
        price: 16.99,
      },
      {
        restaurantId: americanRestaurant2.id,
        name: 'Pepperoni Pizza',
        description: 'Pizza with pepperoni and cheese',
        price: 18.99,
      },
      {
        restaurantId: americanRestaurant2.id,
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing',
        price: 9.99,
      },
    ],
  });

  console.log('Created menu items');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

