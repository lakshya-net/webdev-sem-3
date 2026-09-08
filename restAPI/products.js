const productNames = [
  "Wireless Mouse", "Mechanical Keyboard", "USB-C Hub", "Laptop Stand", "Webcam",
  "Bluetooth Speaker", "Noise Cancelling Headphones", "Smart Watch", "Fitness Tracker", "Power Bank",
  "Desk Lamp", "External SSD", "HDMI Cable", "Wireless Charger", "Portable Monitor",
  "Gaming Controller", "Microphone", "Tablet", "E-Reader", "Smartphone",
  "Office Chair", "Standing Desk", "Notebook", "Ballpoint Pen Set", "Backpack",
  "Water Bottle", "Travel Mug", "Desk Organizer", "Whiteboard", "Calendar",
  "Running Shoes", "Yoga Mat", "Dumbbell Set", "Resistance Bands", "Cycling Helmet",
  "Tennis Racket", "Camping Tent", "Sleeping Bag", "Hiking Backpack", "Flashlight",
  "Coffee Maker", "Electric Kettle", "Blender", "Toaster", "Air Fryer",
  "Frying Pan", "Knife Set", "Food Container Set", "Kitchen Scale", "Lunch Box",
  "Cotton T-Shirt", "Denim Jeans", "Hooded Sweatshirt", "Formal Shirt", "Winter Jacket",
  "Sneakers", "Leather Belt", "Sunglasses", "Wrist Watch", "Canvas Shoes",
  "Face Wash", "Moisturizer", "Shampoo", "Sunscreen", "Hand Cream",
  "Perfume", "Lip Balm", "Hair Dryer", "Electric Trimmer", "Makeup Kit",
  "Plant Pot", "Indoor Plant", "Wall Clock", "Cushion Set", "Table Runner",
  "Photo Frame", "Storage Basket", "Floor Rug", "Scented Candle", "Curtain Set",
  "Board Game", "Puzzle Set", "Playing Cards", "Remote Car", "Building Blocks",
  "Stuffed Toy", "Art Kit", "Story Book", "Musical Keyboard", "Science Kit",
  "Dog Leash", "Cat Bed", "Pet Bowl", "Bird Feeder", "Aquarium Filter",
  "Pet Shampoo", "Grooming Brush", "Pet Toy", "Animal Carrier", "Pet Food"
];

const categories = [
  "Electronics", "Office", "Sports", "Home & Kitchen", "Clothing",
  "Beauty", "Home Decor", "Toys & Books", "Pet Supplies", "Travel"
];

export const products = productNames.map((name, index) => ({
  id: index + 1,
  name,
  category: categories[Math.floor(index / 10)],
  price: Number((19.99 + index * 7.5).toFixed(2)),
  stock: 10 + ((index * 13) % 91),
  description: `${name} - quality ${categories[Math.floor(index / 10)].toLowerCase()} product`
}));
