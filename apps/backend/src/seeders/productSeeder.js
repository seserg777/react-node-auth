// Product seeder - generates 100 random products
const { Product } = require('../models');

const categories = ['Electronics', 'Accessories', 'Computers', 'Gaming', 'Office', 'Audio', 'Mobile', 'Cameras'];

const productNames = {
  Electronics: ['Smart TV', 'Tablet', 'E-Reader', 'Smart Watch', 'Fitness Tracker', 'Drone', 'VR Headset', 'Bluetooth Speaker'],
  Accessories: ['USB Cable', 'Phone Case', 'Screen Protector', 'Charging Dock', 'Mouse Pad', 'Cable Organizer', 'Laptop Stand', 'Webcam Cover'],
  Computers: ['Desktop PC', 'Laptop', 'Chromebook', 'Mini PC', 'All-in-One PC', 'Workstation', 'Gaming PC', 'Server'],
  Gaming: ['Gaming Console', 'Controller', 'Gaming Headset', 'Gaming Chair', 'Racing Wheel', 'VR Gaming Kit', 'Capture Card', 'Gaming Desk'],
  Office: ['Office Chair', 'Standing Desk', 'Monitor Arm', 'Desk Lamp', 'Paper Shredder', 'Label Maker', 'Calculator', 'Whiteboard'],
  Audio: ['Headphones', 'Earbuds', 'Microphone', 'Audio Interface', 'Studio Monitors', 'Mixer', 'Amplifier', 'Soundbar'],
  Mobile: ['Smartphone', 'Power Bank', 'Wireless Charger', 'Car Mount', 'Gimbal', 'Phone Lens Kit', 'Selfie Stick', 'Ring Light'],
  Cameras: ['DSLR Camera', 'Mirrorless Camera', 'Action Camera', 'Security Camera', 'Webcam', 'Camera Lens', 'Tripod', 'Camera Bag']
};

const descriptions = [
  'High-quality product with excellent features',
  'Professional grade equipment for serious users',
  'Perfect for everyday use and productivity',
  'Advanced technology with modern design',
  'Durable and reliable construction',
  'Compact and portable solution',
  'Premium quality with extended warranty',
  'Energy efficient and eco-friendly',
  'User-friendly interface and setup',
  'Compatible with all major platforms'
];

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const generateRandomPrice = () => {
  const basePrice = Math.random() * 1000 + 9.99; // 9.99 to 1009.99
  return Math.round(basePrice * 100) / 100;
};

const generateProducts = async () => {
  try {
    console.log('Starting product seeding...');
    
    // Check if products already exist
    const count = await Product.count();
    if (count > 0) {
      console.log(`Database already has ${count} products. Skipping seeding.`);
      console.log('To reseed, delete products first or modify this check.');
      return;
    }

    const products = [];
    
    for (let i = 1; i <= 100; i++) {
      const category = getRandomElement(categories);
      const nameOptions = productNames[category];
      const baseName = getRandomElement(nameOptions);
      const variant = ['Pro', 'Plus', 'Max', 'Ultra', 'Premium', 'Standard', 'Lite', 'Mini'];
      const name = `${baseName} ${getRandomElement(variant)} ${i}`;
      
      const product = {
        name,
        description: getRandomElement(descriptions),
        price: generateRandomPrice(),
        category,
        inStock: Math.random() > 0.1, // 90% in stock
        stockQuantity: Math.floor(Math.random() * 50) + 1,
        image: `https://via.placeholder.com/300x200/${Math.random().toString(16).substr(2, 6)}/ffffff?text=${encodeURIComponent(baseName)}`
      };
      
      products.push(product);
    }

    // Bulk insert products
    await Product.bulkCreate(products);
    
    console.log(`✅ Successfully seeded ${products.length} products!`);
    console.log('Categories:', categories.join(', '));
  } catch (error) {
    console.error('❌ Product seeding failed:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  const { testConnection, syncDatabase } = require('../models');
  
  (async () => {
    try {
      await testConnection();
      await syncDatabase();
      await generateProducts();
      process.exit(0);
    } catch (error) {
      console.error('Seeder error:', error);
      process.exit(1);
    }
  })();
}

module.exports = { generateProducts };

