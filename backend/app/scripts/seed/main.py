import asyncio
import random
from datetime import datetime, timedelta

from faker import Faker

from app.core.config import settings
from app.core.db import AsyncSessionHandler
from app.core.security import Auth
from app.modules.auth.models.user import Profile, User, UserRole
from app.modules.menu.models.category_model import Category
from app.modules.menu.models.product_model import Product
from app.modules.menu.models.review_model import Comment, Review

fake = Faker()

USER_COUNT = 20
PRODUCT_COUNT = 100
SEED_PASSWORD = "Password123"

CATEGORY_NAMES = [
    "Momo",
    "Pizza",
    "Burger",
    "Biryani",
    "Chowmein",
    "Thukpa",
    "Snacks",
    "Drinks",
    "Desserts",
    "Main Course",
]

REVIEW_COMMENTS = [
    "Really tasty!",
    "Loved it.",
    "Would definitely order again.",
    "Very delicious.",
    "Good portion size.",
    "The taste was amazing.",
    "Pretty good for the price.",
    "Fresh and tasty.",
    "Could be a little better.",
    "Not bad.",
    "Excellent food!",
    "One of my favorites.",
    "Really enjoyed this.",
    "The preparation was great.",
    "Highly recommended.",
]

PRODUCT_TEMPLATES = [
    {
        "name": "Chicken Momo",
        "category": "Momo",
        "ingredients": ["Chicken", "Flour", "Onion", "Garlic", "Ginger", "Coriander"],
        "price": (180, 350),
        "prep_time": (15, 30),
    },
    {
        "name": "Buff Momo",
        "category": "Momo",
        "ingredients": ["Buff", "Flour", "Onion", "Garlic", "Ginger", "Coriander"],
        "price": (150, 300),
        "prep_time": (15, 30),
    },
    {
        "name": "Veg Momo",
        "category": "Momo",
        "ingredients": ["Cabbage", "Carrot", "Onion", "Flour", "Garlic", "Ginger"],
        "price": (120, 250),
        "prep_time": (15, 25),
    },
    {
        "name": "Chicken Pizza",
        "category": "Pizza",
        "ingredients": ["Chicken", "Cheese", "Flour", "Tomato", "Capsicum", "Onion"],
        "price": (500, 1000),
        "prep_time": (25, 45),
    },
    {
        "name": "Margherita Pizza",
        "category": "Pizza",
        "ingredients": ["Cheese", "Flour", "Tomato", "Basil", "Olive Oil"],
        "price": (450, 900),
        "prep_time": (20, 40),
    },
    {
        "name": "Pepperoni Pizza",
        "category": "Pizza",
        "ingredients": ["Pepperoni", "Cheese", "Flour", "Tomato", "Olives"],
        "price": (600, 1100),
        "prep_time": (25, 45),
    },
    {
        "name": "Chicken Burger",
        "category": "Burger",
        "ingredients": ["Chicken", "Bun", "Cheese", "Lettuce", "Tomato", "Mayonnaise"],
        "price": (300, 600),
        "prep_time": (15, 30),
    },
    {
        "name": "Cheese Burger",
        "category": "Burger",
        "ingredients": ["Beef", "Bun", "Cheese", "Lettuce", "Tomato", "Onion"],
        "price": (350, 650),
        "prep_time": (15, 30),
    },
    {
        "name": "Veg Burger",
        "category": "Burger",
        "ingredients": ["Potato", "Bun", "Lettuce", "Tomato", "Cheese"],
        "price": (250, 500),
        "prep_time": (15, 25),
    },
    {
        "name": "Chicken Biryani",
        "category": "Biryani",
        "ingredients": [
            "Chicken",
            "Rice",
            "Onion",
            "Yogurt",
            "Spices",
            "Ginger",
            "Garlic",
        ],
        "price": (300, 600),
        "prep_time": (30, 50),
    },
    {
        "name": "Mutton Biryani",
        "category": "Biryani",
        "ingredients": [
            "Mutton",
            "Rice",
            "Onion",
            "Yogurt",
            "Spices",
            "Ginger",
            "Garlic",
        ],
        "price": (450, 800),
        "prep_time": (35, 55),
    },
    {
        "name": "Veg Biryani",
        "category": "Biryani",
        "ingredients": ["Rice", "Carrot", "Peas", "Potato", "Onion", "Spices"],
        "price": (250, 500),
        "prep_time": (25, 45),
    },
    {
        "name": "Chicken Chowmein",
        "category": "Chowmein",
        "ingredients": [
            "Noodles",
            "Chicken",
            "Cabbage",
            "Carrot",
            "Soy Sauce",
            "Onion",
        ],
        "price": (180, 350),
        "prep_time": (15, 30),
    },
    {
        "name": "Veg Chowmein",
        "category": "Chowmein",
        "ingredients": ["Noodles", "Cabbage", "Carrot", "Capsicum", "Soy Sauce"],
        "price": (150, 300),
        "prep_time": (15, 25),
    },
    {
        "name": "Chicken Thukpa",
        "category": "Thukpa",
        "ingredients": ["Noodles", "Chicken", "Carrot", "Cabbage", "Garlic", "Ginger"],
        "price": (200, 400),
        "prep_time": (20, 35),
    },
    {
        "name": "Veg Thukpa",
        "category": "Thukpa",
        "ingredients": ["Noodles", "Carrot", "Cabbage", "Mushroom", "Garlic", "Ginger"],
        "price": (180, 350),
        "prep_time": (20, 30),
    },
    {
        "name": "French Fries",
        "category": "Snacks",
        "ingredients": ["Potato", "Salt", "Oil"],
        "price": (120, 250),
        "prep_time": (10, 20),
    },
    {
        "name": "Chicken Sekuwa",
        "category": "Main Course",
        "ingredients": ["Chicken", "Onion", "Garlic", "Ginger", "Spices", "Lemon"],
        "price": (350, 700),
        "prep_time": (30, 50),
    },
    {
        "name": "Mutton Sekuwa",
        "category": "Main Course",
        "ingredients": ["Mutton", "Onion", "Garlic", "Ginger", "Spices", "Lemon"],
        "price": (450, 900),
        "prep_time": (35, 55),
    },
    {
        "name": "Chocolate Cake",
        "category": "Desserts",
        "ingredients": ["Flour", "Cocoa", "Sugar", "Milk", "Chocolate"],
        "price": (250, 500),
        "prep_time": (5, 10),
    },
    {
        "name": "Red Velvet Cake",
        "category": "Desserts",
        "ingredients": ["Flour", "Sugar", "Milk", "Cream Cheese", "Cocoa"],
        "price": (300, 600),
        "prep_time": (5, 10),
    },
    {
        "name": "Coke",
        "category": "Drinks",
        "ingredients": ["Carbonated Water", "Sugar"],
        "price": (80, 150),
        "prep_time": (1, 5),
    },
    {
        "name": "Fresh Lemonade",
        "category": "Drinks",
        "ingredients": ["Lemon", "Water", "Sugar", "Ice"],
        "price": (100, 200),
        "prep_time": (3, 8),
    },
]

PRODUCT_IMAGES = {
    "Momo": ["https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9"],
    "Pizza": ["https://images.unsplash.com/photo-1574071318508-1cdbab80d002"],
    "Burger": ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd"],
    "Biryani": ["https://images.unsplash.com/photo-1589302168068-964664d93dc0"],
    "Chowmein": ["https://images.unsplash.com/photo-1585032226651-759b368d7246"],
    "Thukpa": ["https://images.unsplash.com/photo-1547592180-85f173990554"],
    "Snacks": ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877"],
    "Desserts": ["https://images.unsplash.com/photo-1578985545062-69928b1d9587"],
    "Drinks": ["https://images.unsplash.com/photo-1544145945-f90425340c7e"],
    "Main Course": ["https://images.unsplash.com/photo-1547592180-85f173990554"],
}


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
        category_name = template["category"]
        category = category_map[category_name]
        images = PRODUCT_IMAGES[category_name]
        is_best_seller = random.choices([True, False], weights=[70, 30], k=1)[0]
        product = Product(
            product_name=f"{template['name']} #{index + 1}",
            product_description=f"Delicious {template['name'].lower()} prepared with fresh and quality ingredients.",
            category_label=category_name,
            is_available=random.choices([True, False], weights=[90, 10], k=1)[0],
            is_best_seller=is_best_seller,
            price=random.randint(*template["price"]),
            discount_percentage=random.choice([0, 0.05, 0.10, 0.15, 0.20, 0.25]),
            average_preparation_time=random.randint(*template["prep_time"]),
            grouped_quantity=random.randint(1, 10),
            ingredients=random.sample(
                template["ingredients"],
                k=random.randint(2, len(template["ingredients"])),
            ),
            stock_quantity=random.randint(0, 100),
            main_image=random.choice(images),
            side_images=[random.choice(images) for _ in range(random.randint(1, 3))],
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
                rating=random.choice([1.0, 2.0, 3.0, 3.5, 4.0, 4.5, 5.0]),
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
        if random.random() < 0.7:
            user = random.choice(users)
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
            print("🌱 SEED COMPLETED SUCCESSFULLY")
            print("=" * 50 + "\n")
            print(f"Users      : {len(users)}")
            print(f"Categories : {len(categories)}")
            print(f"Products   : {len(products)}")
            print(f"Reviews    : {len(reviews)}")
            print(f"Comments   : {len(comments)}")
            print(f"\nLogin → seed_user_1@example.com / {SEED_PASSWORD}\n")

        except Exception as exc:
            print(f"\n❌ SEED FAILED\nError: {exc}")
            await session.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(main())
