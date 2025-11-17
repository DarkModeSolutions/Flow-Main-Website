export const images = {
  lemonade: "/assets/images/Still Render Lemonade.png",
  mango: "/assets/images/Still Render Mango.png",
  original: "/assets/images/Still Render Original.png",
};

// Videos
export const videos = {
  lemonade: "/assets/videos/Lemonade Individual Sachet Animation.mp4",
  mango: "/assets/videos/Mango Individual Sachet Animation.mp4",
  original: "/assets/videos/Original Individual Sachet Animation.mp4",
};

export const tempProducts = [
  {
    id: "1",
    name: "Sample Product 1",
    description: "This is a sample product description 1.",
    price: 99.99,
    stock: 10,
    imageUrl: "lemon",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Sample Product 2",
    description: "This is a sample product description 2.",
    price: 99.99,
    stock: 10,
    imageUrl: "mango",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Sample Product 3",
    description: "This is a sample product description 3.",
    price: 99.99,
    stock: 10,
    imageUrl: "original",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const shadowfaxServiceParameters = {
  sellerPickup: {
    serviceParam: "seller_pickup",
    desc: "List all the pincodes where seller pickup is available.",
  },
  customerDelivery: {
    serviceParam: "customer_delivery",
    desc: "List all the pincodes where customer delivery is available.",
  },
  customerPickup: {
    serviceParam: "customer_pickup",
    desc: "List all the pincodes where customer pickup is available.",
  },
  sellerDelivery: {
    serviceParam: "seller_delivery",
    desc: "List all the pincodes where seller delivery is available.",
  },
  warehousePickup: {
    serviceParam: "warehouse_pickup",
    desc: "List all the pincodes where warehouse pickup is available.",
  },
  warehouseReturn: {
    serviceParam: "warehouse_return",
    desc: "List all the pincodes where warehouse return or rto is available.",
  },
};
