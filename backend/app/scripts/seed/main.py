import asyncio
import random
from datetime import datetime, timedelta

from faker import Faker

from app.core.config import settings
from app.core.db import AsyncSessionHandler
from app.core.security import Auth
from app.modules.auth.models.user import Profile, User, UserRole
from app.modules.menu.models.category_model import Category
from app.modules.menu.models.product_model import Product, QuantizedUnit
from app.modules.menu.models.review_model import Comment, Review
from app.modules.menu.models.wishlist_model import WishList  # noqa

fake = Faker()

# ─────────────────────────────────────────────
#  CONSTANTS
# ─────────────────────────────────────────────
USER_COUNT = 20
PRODUCT_COUNT = 120
SEED_PASSWORD = "Password123"

CATEGORY_NAMES = [
    "Momo",
    "Pizza",
    "Burger",
    "Chowmein",
    "Thukpa",
    "Snacks",
    "Drinks",
    "Desserts",
    "Sweets",
    "Main Course",
]

REVIEW_TITLES = [
    "Ekdam mito thiyo!",
    "Sasto ra mito!",
    "Feri auchu pakkai!",
    "Dherai ramro thiyo!",
    "Best food in town!",
    "Highly recommended!",
    "Worth every paisa!",
    "Fresh ra tasty!",
    "Superb taste!",
    "Khana ekdam ramro!",
    "Mast experience thiyo!",
    "Dherai maan paryo!",
]

REVIEW_COMMENTS = [
    "Ekdam mito thiyo, feri order garchu!",
    "Dherai ramro khana, sab lai recommend garchu.",
    "Taste ekdam unique thiyo, maan paryo!",
    "Fresh ingredients use gareko thaha huncha.",
    "Packaging pani ramro thiyo, time ma aayo.",
    "Paise vasul thiyo, dherai khushi bhaye.",
    "Aaja samma khako ma sabai bhanda mito!",
    "Portion size pani ramro thiyo.",
    "Sabai item try gareko, sab mito.",
    "Ghar ko khana jastai lagyo, heart touching!",
    "Quality ekdam ramro, continue garnus!",
    "Next time family lai pani lyauchu.",
    "Dherai dinpachi yo khana khaera khushi bhaye.",
    "Service pani ramro, khana pani mito!",
    "Swad ma koi compromise chhaina!",
]

# ─────────────────────────────────────────────
#  PRODUCT TEMPLATES
# ─────────────────────────────────────────────
PRODUCT_TEMPLATES = [
    # ── MOMO ──────────────────────────────────
    {
        "name": "Veg Momo",
        "category": "Momo",
        "ingredients": ["Cabbage", "Carrot", "Onion", "Flour", "Garlic", "Ginger"],
        "price": (120, 250),
        "prep_time": (15, 25),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8, 10, 12],
        "images": [
            "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
            "https://images.unsplash.com/photo-1694923450868-b432a8ee52aa?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ],
    },
    {
        "name": "Paneer Momo",
        "category": "Momo",
        "ingredients": ["Paneer", "Flour", "Onion", "Garlic", "Ginger", "Coriander"],
        "price": (160, 300),
        "prep_time": (15, 30),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8, 10, 12],
        "images": [
            "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
        ],
    },
    {
        "name": "Mushroom Momo",
        "category": "Momo",
        "ingredients": ["Mushroom", "Flour", "Onion", "Garlic", "Ginger", "Capsicum"],
        "price": (150, 280),
        "prep_time": (15, 25),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8, 10, 12],
        "images": [
            "https://images.unsplash.com/photo-1738608084602-f9543952188e?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ],
    },
    {
        "name": "Cheese Momo",
        "category": "Momo",
        "ingredients": ["Cheese", "Flour", "Onion", "Garlic", "Ginger", "Coriander"],
        "price": (170, 320),
        "prep_time": (15, 30),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8, 10, 12],
        "images": [
            "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
        ],
    },
    {
        "name": "Fried Momo",
        "category": "Momo",
        "ingredients": ["Cabbage", "Carrot", "Flour", "Onion", "Oil", "Garlic"],
        "price": (140, 270),
        "prep_time": (20, 30),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8, 10],
        "images": [
            "https://images.unsplash.com/photo-1534422298391-e4f8517d9b99?w=800",
            "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
        ],
    },
    {
        "name": "C-Momo",
        "category": "Momo",
        "ingredients": ["Cabbage", "Flour", "Tomato Sauce", "Onion", "Chili", "Garlic"],
        "price": (160, 300),
        "prep_time": (20, 35),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8, 10],
        "images": [
            "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
        ],
    },
    # ── PIZZA ─────────────────────────────────
    {
        "name": "Margherita Pizza",
        "category": "Pizza",
        "ingredients": ["Cheese", "Flour", "Tomato", "Basil", "Olive Oil"],
        "price": (450, 900),
        "prep_time": (20, 40),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8],
        "images": [
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
        ],
    },
    {
        "name": "Paneer Tikka Pizza",
        "category": "Pizza",
        "ingredients": ["Paneer", "Cheese", "Flour", "Tomato", "Capsicum", "Onion"],
        "price": (550, 1050),
        "prep_time": (25, 45),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8],
        "images": [
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
        ],
    },
    {
        "name": "Farm Fresh Veggie Pizza",
        "category": "Pizza",
        "ingredients": ["Capsicum", "Onion", "Tomato", "Mushroom", "Cheese", "Flour"],
        "price": (500, 950),
        "prep_time": (20, 40),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8],
        "images": [
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
        ],
    },
    {
        "name": "BBQ Mushroom Pizza",
        "category": "Pizza",
        "ingredients": [
            "Mushroom",
            "BBQ Sauce",
            "Cheese",
            "Onion",
            "Capsicum",
            "Flour",
        ],
        "price": (520, 980),
        "prep_time": (20, 40),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8],
        "images": [
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
        ],
    },
    # ── BURGER ────────────────────────────────
    {
        "name": "Veg Burger",
        "category": "Burger",
        "ingredients": ["Potato Patty", "Bun", "Lettuce", "Tomato", "Cheese", "Mayo"],
        "price": (200, 450),
        "prep_time": (15, 25),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [1, 2],
        "images": [
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
        ],
    },
    {
        "name": "Paneer Burger",
        "category": "Burger",
        "ingredients": ["Paneer Patty", "Bun", "Lettuce", "Tomato", "Cheese", "Onion"],
        "price": (250, 500),
        "prep_time": (15, 30),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [1, 2],
        "images": [
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        ],
    },
    {
        "name": "Mushroom Swiss Burger",
        "category": "Burger",
        "ingredients": ["Mushroom Patty", "Bun", "Swiss Cheese", "Lettuce", "Onion"],
        "price": (280, 550),
        "prep_time": (15, 30),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [1, 2],
        "images": [
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        ],
    },
    {
        "name": "Double Cheese Burger",
        "category": "Burger",
        "ingredients": [
            "Potato Patty",
            "Double Cheese",
            "Bun",
            "Lettuce",
            "Tomato",
            "Mustard",
        ],
        "price": (320, 600),
        "prep_time": (15, 30),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [1, 2],
        "images": [
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
        ],
    },
    # ── CHOWMEIN ──────────────────────────────
    {
        "name": "Veg Chowmein",
        "category": "Chowmein",
        "ingredients": ["Noodles", "Cabbage", "Carrot", "Capsicum", "Soy Sauce"],
        "price": (150, 300),
        "prep_time": (15, 25),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
        ],
    },
    {
        "name": "Paneer Chowmein",
        "category": "Chowmein",
        "ingredients": ["Noodles", "Paneer", "Cabbage", "Carrot", "Soy Sauce", "Onion"],
        "price": (200, 380),
        "prep_time": (15, 30),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
        ],
    },
    {
        "name": "Schezwan Chowmein",
        "category": "Chowmein",
        "ingredients": [
            "Noodles",
            "Schezwan Sauce",
            "Capsicum",
            "Onion",
            "Garlic",
            "Cabbage",
        ],
        "price": (170, 340),
        "prep_time": (15, 25),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
        ],
    },
    # ── THUKPA ────────────────────────────────
    {
        "name": "Veg Thukpa",
        "category": "Thukpa",
        "ingredients": ["Noodles", "Carrot", "Cabbage", "Mushroom", "Garlic", "Ginger"],
        "price": (180, 350),
        "prep_time": (20, 30),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
        ],
    },
    {
        "name": "Tofu Thukpa",
        "category": "Thukpa",
        "ingredients": ["Noodles", "Tofu", "Spinach", "Carrot", "Garlic", "Ginger"],
        "price": (200, 380),
        "prep_time": (20, 35),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
        ],
    },
    {
        "name": "Spicy Thukpa",
        "category": "Thukpa",
        "ingredients": ["Noodles", "Chili", "Garlic", "Mushroom", "Carrot", "Onion"],
        "price": (190, 360),
        "prep_time": (20, 30),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
        ],
    },
    # ── SNACKS ────────────────────────────────
    {
        "name": "French Fries",
        "category": "Snacks",
        "ingredients": ["Potato", "Salt", "Oil"],
        "price": (120, 250),
        "prep_time": (10, 20),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
            "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800",
        ],
    },
    {
        "name": "Peri Peri Fries",
        "category": "Snacks",
        "ingredients": ["Potato", "Peri Peri Spice", "Salt", "Oil"],
        "price": (150, 280),
        "prep_time": (10, 20),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800",
        ],
    },
    {
        "name": "Spring Rolls",
        "category": "Snacks",
        "ingredients": [
            "Cabbage",
            "Carrot",
            "Spring Roll Sheet",
            "Noodles",
            "Soy Sauce",
        ],
        "price": (150, 300),
        "prep_time": (15, 25),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [4, 6, 8],
        "images": [
            "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
        ],
    },
    {
        "name": "Paneer Tikka",
        "category": "Snacks",
        "ingredients": ["Paneer", "Yogurt", "Capsicum", "Onion", "Spices", "Lemon"],
        "price": (280, 550),
        "prep_time": (20, 35),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [4, 6, 8],
        "images": [
            "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
        ],
    },
    {
        "name": "Corn Cheese Balls",
        "category": "Snacks",
        "ingredients": ["Corn", "Cheese", "Potato", "Breadcrumbs", "Spices"],
        "price": (180, 350),
        "prep_time": (15, 25),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [4, 6, 8],
        "images": [
            "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
        ],
    },
    {
        "name": "Veg Samosa",
        "category": "Snacks",
        "ingredients": [
            "Potato",
            "Peas",
            "Pastry Sheet",
            "Cumin",
            "Coriander",
            "Chili",
        ],
        "price": (60, 150),
        "prep_time": (10, 20),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [2, 4, 6],
        "images": [
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
            "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
        ],
    },
    {
        "name": "Garlic Bread",
        "category": "Snacks",
        "ingredients": ["Bread", "Butter", "Garlic", "Parsley", "Cheese"],
        "price": (150, 280),
        "prep_time": (10, 15),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [4, 6],
        "images": [
            "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800",
        ],
    },
    # ── DRINKS ────────────────────────────────
    {
        "name": "Coke",
        "category": "Drinks",
        "ingredients": ["Carbonated Water", "Sugar"],
        "price": (80, 150),
        "prep_time": (1, 5),
        "grouped_unit": QuantizedUnit.ML,
        "grouped_quantity_choices": [250, 330, 500],
        "images": [
            "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800",
            "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800",
        ],
    },
    {
        "name": "Fresh Lemonade",
        "category": "Drinks",
        "ingredients": ["Lemon", "Water", "Sugar", "Ice"],
        "price": (100, 200),
        "prep_time": (3, 8),
        "grouped_unit": QuantizedUnit.ML,
        "grouped_quantity_choices": [250, 500],
        "images": [
            "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800",
        ],
    },
    {
        "name": "Mango Lassi",
        "category": "Drinks",
        "ingredients": ["Mango", "Yogurt", "Sugar", "Milk", "Cardamom"],
        "price": (150, 280),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.ML,
        "grouped_quantity_choices": [250, 500],
        "images": [
            "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800",
        ],
    },
    {
        "name": "Masala Chai",
        "category": "Drinks",
        "ingredients": ["Tea", "Milk", "Ginger", "Cardamom", "Cinnamon", "Sugar"],
        "price": (60, 120),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.ML,
        "grouped_quantity_choices": [150, 250],
        "images": [
            "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800",
        ],
    },
    {
        "name": "Cold Coffee",
        "category": "Drinks",
        "ingredients": ["Coffee", "Milk", "Sugar", "Ice Cream", "Ice"],
        "price": (150, 300),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.ML,
        "grouped_quantity_choices": [250, 500],
        "images": [
            "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
        ],
    },
    {
        "name": "Strawberry Milkshake",
        "category": "Drinks",
        "ingredients": ["Strawberry", "Milk", "Ice Cream", "Sugar"],
        "price": (180, 320),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.ML,
        "grouped_quantity_choices": [250, 500],
        "images": [
            "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800",
        ],
    },
    {
        "name": "Fresh Orange Juice",
        "category": "Drinks",
        "ingredients": ["Orange", "Sugar", "Ice"],
        "price": (120, 220),
        "prep_time": (3, 8),
        "grouped_unit": QuantizedUnit.ML,
        "grouped_quantity_choices": [250, 500],
        "images": [
            "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800",
        ],
    },
    # ── DESSERTS ──────────────────────────────
    {
        "name": "Chocolate Cake",
        "category": "Desserts",
        "ingredients": ["Flour", "Cocoa", "Sugar", "Milk", "Chocolate", "Butter"],
        "price": (250, 500),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8],
        "images": [
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
            "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800",
        ],
    },
    {
        "name": "Red Velvet Cake",
        "category": "Desserts",
        "ingredients": ["Flour", "Sugar", "Milk", "Cream Cheese", "Cocoa", "Butter"],
        "price": (300, 600),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [6, 8],
        "images": [
            "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800",
        ],
    },
    {
        "name": "Gulab Jamun",
        "category": "Desserts",
        "ingredients": ["Milk Powder", "Flour", "Sugar", "Cardamom", "Rose Water"],
        "price": (120, 250),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [2, 4, 6],
        "images": [
            "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ],
    },
    {
        "name": "Kheer",
        "category": "Desserts",
        "ingredients": ["Rice", "Milk", "Sugar", "Cardamom", "Cashew", "Raisin"],
        "price": (150, 280),
        "prep_time": (10, 15),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        ],
    },
    {
        "name": "Brownie with Ice Cream",
        "category": "Desserts",
        "ingredients": ["Chocolate Brownie", "Vanilla Ice Cream", "Chocolate Sauce"],
        "price": (250, 450),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [1, 2],
        "images": [
            "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800",
        ],
    },
    {
        "name": "Mango Kulfi",
        "category": "Desserts",
        "ingredients": ["Mango", "Milk", "Sugar", "Cardamom", "Cream"],
        "price": (120, 220),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [1, 2],
        "images": [
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        ],
    },
    # ── SWEETS ────────────────────────────────
    {
        "name": "Rasgulla",
        "category": "Sweets",
        "ingredients": ["Chhena", "Sugar", "Rose Water", "Cardamom"],
        "price": (100, 220),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [2, 4, 6],
        "images": [
            "https://images.unsplash.com/photo-1601303516534-bf4b22de4f1f?w=800",
        ],
    },
    {
        "name": "Barfi",
        "category": "Sweets",
        "ingredients": ["Milk Powder", "Sugar", "Ghee", "Cardamom", "Pistachio"],
        "price": (150, 350),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [4, 6, 8],
        "images": [
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        ],
    },
    {
        "name": "Jalebi",
        "category": "Sweets",
        "ingredients": ["Flour", "Sugar Syrup", "Saffron", "Cardamom", "Oil"],
        "price": (100, 200),
        "prep_time": (10, 20),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1601303516534-bf4b22de4f1f?w=800",
        ],
    },
    {
        "name": "Halwa",
        "category": "Sweets",
        "ingredients": ["Semolina", "Sugar", "Ghee", "Cardamom", "Cashew", "Raisin"],
        "price": (120, 250),
        "prep_time": (10, 20),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        ],
    },
    {
        "name": "Laddoo",
        "category": "Sweets",
        "ingredients": ["Chickpea Flour", "Sugar", "Ghee", "Cardamom", "Cashew"],
        "price": (120, 280),
        "prep_time": (5, 10),
        "grouped_unit": QuantizedUnit.PCS,
        "grouped_quantity_choices": [2, 4, 6],
        "images": [
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        ],
    },
    # ── MAIN COURSE ───────────────────────────
    {
        "name": "Dal Bhat Tarkari",
        "category": "Main Course",
        "ingredients": ["Rice", "Lentils", "Seasonal Vegetables", "Spices", "Ghee"],
        "price": (200, 400),
        "prep_time": (20, 40),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        ],
    },
    {
        "name": "Veg Biryani",
        "category": "Main Course",
        "ingredients": ["Rice", "Carrot", "Peas", "Potato", "Onion", "Spices"],
        "price": (250, 500),
        "prep_time": (25, 45),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
        ],
    },
    {
        "name": "Paneer Butter Masala",
        "category": "Main Course",
        "ingredients": ["Paneer", "Tomato", "Butter", "Cream", "Onion", "Spices"],
        "price": (300, 600),
        "prep_time": (20, 35),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        ],
    },
    {
        "name": "Mushroom Curry",
        "category": "Main Course",
        "ingredients": ["Mushroom", "Tomato", "Onion", "Cream", "Spices", "Garlic"],
        "price": (250, 500),
        "prep_time": (20, 35),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
        ],
    },
    {
        "name": "Chana Masala",
        "category": "Main Course",
        "ingredients": ["Chickpeas", "Tomato", "Onion", "Spices", "Garlic", "Ginger"],
        "price": (200, 400),
        "prep_time": (20, 35),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
        ],
    },
    {
        "name": "Veg Fried Rice",
        "category": "Main Course",
        "ingredients": ["Rice", "Carrot", "Peas", "Capsicum", "Soy Sauce", "Onion"],
        "price": (180, 350),
        "prep_time": (15, 30),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
        ],
    },
    {
        "name": "Palak Paneer",
        "category": "Main Course",
        "ingredients": ["Spinach", "Paneer", "Onion", "Garlic", "Cream", "Spices"],
        "price": (280, 550),
        "prep_time": (20, 35),
        "grouped_unit": QuantizedUnit.NA,
        "grouped_quantity_choices": [0],
        "images": [
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        ],
    },
]


# ─────────────────────────────────────────────
#  SEEDER FUNCTIONS
# ─────────────────────────────────────────────
async def seed_categories(session) -> list[Category]:
    categories = [Category(category_name=name) for name in CATEGORY_NAMES]
    for category in categories:
        session.add(category)
    await session.flush()
    print(f"✓ Created {len(categories)} categories")
    return categories


async def seed_users(session, count: int = USER_COUNT) -> list[User]:
    users = []
    password_hash = Auth().hash_content(SEED_PASSWORD)

    for index in range(count):
        first_name = fake.first_name()
        last_name = fake.last_name()
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=f"seed_user_{index + 1}@example.com",
            password=password_hash,
            phone_no=f"98{10000000 + index}",
            role=random.choices(
                population=[UserRole.MEMBER, UserRole.RIDER, UserRole.ADMIN],
                weights=[85, 10, 5],
                k=1,
            )[0],
            is_active=True,
            is_authenticated=False,
            login_attempts=0,
            last_login_at=datetime.now() - timedelta(days=random.randint(0, 30)),
            provider="",
            provider_id=None,
        )
        user.profile = Profile(
            full_name=f"{first_name} {last_name}",
            image=None,
            total_orders=random.randint(0, 50),
            total_whishlists=random.randint(0, 20),
            total_cart_items=random.randint(0, 10),
            loyality_points=random.randint(0, 12000),
        )
        session.add(user)
        users.append(user)

    await session.flush()
    print(f"✓ Created {len(users)} users")
    print(f"  Default password: {SEED_PASSWORD}")
    return users


async def seed_products(
    session, categories: list[Category], count: int = PRODUCT_COUNT
) -> list[Product]:
    category_map = {c.category_name: c for c in categories}
    products = []

    for index in range(count):
        template = random.choice(PRODUCT_TEMPLATES)
        category = category_map[template["category"]]
        product = Product(
            product_name=f"{template['name']} #{index + 1}",
            product_description=(
                f"Freshly prepared {template['name'].lower()} made with "
                "100% vegetarian ingredients for an authentic taste."
            ),
            category_label=template["category"],
            is_available=random.choices([True, False], weights=[90, 10], k=1)[0],
            is_best_seller=random.choices([True, False], weights=[70, 30], k=1)[0],
            price=random.randint(*template["price"]),
            discount_percentage=random.choice([0, 5, 10, 15, 20, 25]),
            average_preparation_time=random.randint(*template["prep_time"]),
            grouped_unit=template["grouped_unit"],
            grouped_quantity=random.choice(template["grouped_quantity_choices"]),
            ingredients=random.sample(
                template["ingredients"],
                k=random.randint(2, len(template["ingredients"])),
            ),
            stock_quantity=random.randint(0, 100),
            main_image=template["images"][0],
            side_images=(
                template["images"][1:]
                if len(template["images"]) > 1
                else [template["images"][0]]
            ),
        )
        product.categories.append(category)
        session.add(product)
        products.append(product)

    await session.flush()
    print(f"✓ Created {len(products)} products")
    return products


async def seed_reviews(
    session, users: list[User], products: list[Product]
) -> list[Review]:
    reviews = []
    for product in products:
        reviewers = random.sample(users, k=min(random.randint(0, 5), len(users)))
        for user in reviewers:
            review = Review(
                user_id=user.id,
                product_id=product.id,
                review_title=random.choice(REVIEW_TITLES),
                review_description=fake.sentence() if random.random() < 0.5 else None,
                rating=random.choice([1, 2, 3, 4, 5]),
                like_count=random.randint(0, 100),
            )
            session.add(review)
            reviews.append(review)
    await session.flush()
    print(f"✓ Created {len(reviews)} reviews")
    return reviews


async def seed_comments(
    session, users: list[User], reviews: list[Review]
) -> list[Comment]:
    comments = []
    for review in reviews:
        num_comments = random.choices(
            population=[0, 1, 2, 3],
            weights=[30, 40, 20, 10],
            k=1,
        )[0]
        commenter_pool = random.sample(users, k=min(num_comments, len(users)))
        for user in commenter_pool:
            comment = Comment(
                user_id=user.id,
                review_id=review.id,
                comment=random.choice(REVIEW_COMMENTS),
            )
            session.add(comment)
            comments.append(comment)
    await session.flush()
    print(f"✓ Created {len(comments)} comments")
    return comments


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────
async def main():
    print("\n" + "=" * 50)
    print("🌱 STARTING DATABASE SEED")
    print("=" * 50 + "\n")

    async with AsyncSessionHandler() as session:
        try:
            print("ASYNC DATABASE URL:")
            print(settings.ASYNC_DATABASE_URL)

            users = await seed_users(session)
            categories = await seed_categories(session)
            products = await seed_products(session, categories)
            reviews = await seed_reviews(session, users, products)
            comments = await seed_comments(session, users, reviews)

            await session.commit()

            print("\n" + "=" * 50)
            print("✅ SEED COMPLETED SUCCESSFULLY")
            print("=" * 50 + "\n")
            print(f"  Users      : {len(users)}")
            print(f"  Categories : {len(categories)}")
            print(f"  Products   : {len(products)}")
            print(f"  Reviews    : {len(reviews)}")
            print(f"  Comments   : {len(comments)}")
            print(f"\n  Login → seed_user_1@example.com / {SEED_PASSWORD}\n")

        except Exception as exc:
            print(f"\n❌ SEED FAILED\nError: {exc}")
            await session.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(main())
