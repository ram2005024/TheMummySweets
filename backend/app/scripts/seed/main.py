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
from app.modules.order.models.coupen_model import CoupenModel
from app.modules.order.models.order_item_model import OrderItem
from app.modules.order.models.order_model import OrderModel, OrderStatus
from app.modules.order.models.payment_model import (
    PaymentMethod,
    PaymentModel,
    PaymentStatus,
)

fake = Faker()

# ─────────────────────────────────────────────
#  CONSTANTS
# ─────────────────────────────────────────────
USER_COUNT = 20
PRODUCT_COUNT = 120
COUPON_COUNT = 10
ORDER_COUNT_RANGE = (0, 5)  # orders per profile
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

COUPON_CODES = [
    "WELCOME10",
    "FIRSTORDER",
    "SAVE20",
    "MOMO50",
    "FESTIVE15",
    "BIGSAVE25",
    "NEWUSER",
    "FLAT100",
    "WEEKEND20",
    "LOYAL30",
]

# Extra demo images mixed into product side_images for visual variety
DEMO_PRODUCT_IMAGES = [
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
    "https://images.unsplash.com/photo-1606755962773-0cbbf3f8f8a6?w=800",
    "https://images.unsplash.com/photo-1548365328-8b6dbb3a3f3f?w=800",
    "https://images.unsplash.com/photo-1601924582971-b7f6f3f8f8a6?w=800",
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800",
    "https://images.unsplash.com/photo-1603133872878-684f3f8f8a6?w=800",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    "https://images.unsplash.com/photo-1604908177522-0f3f8f8f8a6?w=800",
    "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800",
    "https://images.unsplash.com/photo-1606788075761-0f3f8f8f8a6?w=800",
    "https://images.unsplash.com/photo-1601979034091-0f3f8f8f8a6?w=800",
    "https://images.unsplash.com/photo-1600891964599-0f3f8f8f8a6?w=800",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    "https://images.unsplash.com/photo-1511920170033-f3f8f8f8a6?w=800",
    "https://images.unsplash.com/photo-1600891964599-34f3f8f8f8a6?w=800",
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
#  IMAGE HELPERS
# ─────────────────────────────────────────────
def make_image_response(url: str) -> dict:
    """Build an ImageResponse-shaped dict ({thumbnail, original, medium})
    from a single source URL.

    Reuses the same base image at different sizes via the `w` query param
    so thumbnail/medium/original all resolve to valid, distinct URLs. This
    matches the frontend's `ImageResponse` interface and the JSONB shape
    now expected by `Product.main_image` / `Product.side_images`.
    """
    base = url.split("?")[0]
    return {
        "thumbnail": f"{base}?w=200",
        "medium": f"{base}?w=500",
        "original": f"{base}?w=1200",
    }


# ─────────────────────────────────────────────
#  SEEDER FUNCTIONS — MENU / USERS
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

        base_images = template["images"]
        extra_images = random.sample(
            DEMO_PRODUCT_IMAGES, k=min(2, len(DEMO_PRODUCT_IMAGES))
        )
        side_image_urls = list(dict.fromkeys(base_images[1:] + extra_images)) or [
            base_images[0]
        ]

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
            main_image=make_image_response(base_images[0]),
            side_images=[make_image_response(url) for url in side_image_urls],
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
#  SEEDER FUNCTIONS — COUPONS / ORDERS / PAYMENTS
# ─────────────────────────────────────────────
async def seed_coupens(session, count: int = COUPON_COUNT) -> list[CoupenModel]:
    coupens = []
    for i in range(count):
        code = COUPON_CODES[i] if i < len(COUPON_CODES) else f"PROMO{i + 1}"
        coupen = CoupenModel(
            code=code,
            expiry_date=datetime.now() + timedelta(days=random.randint(10, 120)),
            required_amount=random.choice([500, 1000, 1500, 2000]),
            discount_percentage=random.choice([10, 15, 20, 25, 30]),
            max_discount_amount=random.choice([100, 200, 300, 500]),
            max_use_count=random.randint(50, 500),
            used_count=0,
            is_active=random.choices([True, False], weights=[85, 15], k=1)[0],
        )
        session.add(coupen)
        coupens.append(coupen)
    await session.flush()
    print(f"✓ Created {len(coupens)} coupens")
    return coupens


async def assign_coupen_users(
    session, users: list[User], coupens: list[CoupenModel]
) -> None:
    """
    IMPORTANT: coupens here are already flushed/persistent objects, so their
    `coupen_valid_users` / `coupen_used_users` relationships have never been
    loaded into memory. Calling `.extend()` directly would trigger an
    implicit (unawaited) lazy-load in the async driver -> MissingGreenlet.
    We explicitly `await session.refresh(...)` those attributes first so
    SQLAlchemy loads them properly, then it's safe to mutate the in-memory
    collections.
    """
    for coupen in coupens:
        await session.refresh(
            coupen, attribute_names=["coupen_valid_users", "coupen_used_users"]
        )

        valid_pool_size = min(random.randint(5, 15), len(users))
        valid_users = random.sample(users, k=valid_pool_size)
        coupen.coupen_valid_users.extend(valid_users)

        used_count = random.randint(0, len(valid_users))
        used_users = random.sample(valid_users, k=used_count)
        coupen.coupen_used_users.extend(used_users)
        coupen.used_count = used_count

    await session.flush()
    print("✓ Linked coupens to users (valid + used)")


async def seed_orders_with_payments(
    session,
    profiles: list[Profile],
    products: list[Product],
    coupens: list[CoupenModel],
) -> tuple[list[PaymentModel], list[OrderModel], list[OrderItem]]:
    payments: list[PaymentModel] = []
    orders: list[OrderModel] = []
    order_items: list[OrderItem] = []

    order_status_population = [
        OrderStatus.PLACED,
        OrderStatus.PREPARING,
        OrderStatus.PENDING_PAYMENT,
        OrderStatus.SHIPPED,
        OrderStatus.ARRIVING,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELED,
    ]
    order_status_weights = [10, 15, 15, 10, 45, 5, 5]

    for profile in profiles:
        num_orders = random.randint(*ORDER_COUNT_RANGE)

        for _ in range(num_orders):
            order_products = random.sample(products, k=random.randint(1, 5))
            line_items = [
                {"product": p, "quantity": random.randint(1, 3)} for p in order_products
            ]
            subtotal = sum(li["product"].price * li["quantity"] for li in line_items)

            coupen = None
            discount = 0.0
            if coupens and random.random() < 0.3:
                candidate = random.choice(coupens)
                if candidate.is_active and subtotal >= candidate.required_amount:
                    coupen = candidate
                    discount = min(
                        subtotal * (candidate.discount_percentage / 100),
                        candidate.max_discount_amount,
                    )

            total_amount = round(max(subtotal - discount, 0), 2)

            # NOTE: assumes `payments.profile_id` FK exists to back
            # PaymentModel.payment_user <-> Profile.payments. Remove/adjust
            # this line if that column lives elsewhere in your PaymentModel.
            payment = PaymentModel(
                amount=total_amount,
                payment_reference=(
                    {"transaction_id": fake.uuid4()} if random.random() < 0.8 else None
                ),
                payment_status=random.choices(
                    population=[
                        PaymentStatus.PAID,
                        PaymentStatus.PENDING,
                        PaymentStatus.CANCELED,
                        PaymentStatus.FAILED,
                        PaymentStatus.REFUNDED,
                    ],
                    weights=[60, 20, 10, 5, 5],
                    k=1,
                )[0],
                payment_method=random.choices(
                    population=[
                        PaymentMethod.STRIPE,
                        PaymentMethod.ESEWA,
                        PaymentMethod.COD,
                    ],
                    weights=[35, 35, 30],
                    k=1,
                )[0],
                coupen_id=coupen.id if coupen else None,
                profile_id=profile.id,
            )
            session.add(payment)
            await session.flush()

            order = OrderModel(
                order_status=random.choices(
                    population=order_status_population,
                    weights=order_status_weights,
                    k=1,
                )[0],
                profile_id=profile.id,
                payment_id=payment.id,
            )
            session.add(order)
            await session.flush()

            for li in line_items:
                order_item = OrderItem(
                    product_id=li["product"].id,
                    quantity=li["quantity"],
                    price=li["product"].price,
                    order_id=order.id,
                )
                session.add(order_item)
                order_items.append(order_item)

            payments.append(payment)
            orders.append(order)

    await session.flush()
    print(f"✓ Created {len(payments)} payments")
    print(f"✓ Created {len(orders)} orders")
    print(f"✓ Created {len(order_items)} order items")
    return payments, orders, order_items


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

            coupens = await seed_coupens(session)
            await assign_coupen_users(session, users, coupens)

            profiles = [u.profile for u in users if u.profile is not None]
            payments, orders, order_items = await seed_orders_with_payments(
                session, profiles, products, coupens
            )

            await session.commit()

            print("\n" + "=" * 50)
            print("✅ SEED COMPLETED SUCCESSFULLY")
            print("=" * 50 + "\n")
            print(f"  Users        : {len(users)}")
            print(f"  Categories   : {len(categories)}")
            print(f"  Products     : {len(products)}")
            print(f"  Reviews      : {len(reviews)}")
            print(f"  Comments     : {len(comments)}")
            print(f"  Coupens      : {len(coupens)}")
            print(f"  Payments     : {len(payments)}")
            print(f"  Orders       : {len(orders)}")
            print(f"  Order Items  : {len(order_items)}")
            print(f"\n  Login → seed_user_1@example.com / {SEED_PASSWORD}\n")

        except Exception as exc:
            print(f"\n❌ SEED FAILED\nError: {exc}")
            await session.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(main())
