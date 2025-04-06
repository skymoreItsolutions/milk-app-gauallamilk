import MilkImage from '../assets/images/honey-1.webp'; // You can replace with actual milk image
import GheeImage from '../assets/images/ghee1.webp';
import ButterImage from '../assets/images/Gaualla3.webp'; // Replace with actual butter image if available
import SplMilkImage from '../assets/images/Gaualla4.webp'; // Replace with actual spl milk image if needed


const ExclusiveItems = [
  {
    id: 1,
    name: "Fresh Milk",
    image: MilkImage,
    price: 60,
    review: 4.8,
    nutrients: ["Calcium", "Protein", "Vitamin D"],
    productDetails: "Farm fresh milk, perfect for daily consumption and strong bones.",
    size: "1L",
  },
  {
    id: 2,
    name: "Pure Desi Ghee",
    image: GheeImage,
    price: 320,
    review: 4.9,
    nutrients: ["Healthy Fats", "Vitamins A, D, E, K", "CLA"],
    productDetails: "Traditional desi ghee made from cow's milk, ideal for cooking and health.",
    size: "500ml",
  },
  {
    id: 3,
    name: "Homemade Butter",
    image: ButterImage,
    price: 150,
    review: 4.7,
    nutrients: ["Butterfat", "Vitamin A", "Omega-3"],
    productDetails: "Creamy and delicious butter, churned using traditional methods.",
    size: "250g",
  },
  {
    id: 4,
    name: "Special Cow Milk",
    image: SplMilkImage,
    price: 75,
    review: 4.6,
    nutrients: ["Calcium", "Protein", "Vitamin B12"],
    productDetails: "Premium cow milk with enhanced nutrients for kids and elders.",
    size: "1L",
  }
];
  
  export default ExclusiveItems;
  

  
  