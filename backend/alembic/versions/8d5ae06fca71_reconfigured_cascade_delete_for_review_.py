import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "8d5ae06fca71"
down_revision = "f00e14676a01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create the enum type first
    quantized_unit_enum = postgresql.ENUM(
        "LTR", "ML", "PCS", "NA", name="quantizedunit"
    )
    quantized_unit_enum.create(op.get_bind(), checkfirst=True)

    # Then add the column using that enum
    op.add_column(
        "products",
        sa.Column("grouped_unit", quantized_unit_enum, nullable=False),
    )

    # rest of your upgrade code...
    op.alter_column(
        "products", "is_best_seller", existing_type=sa.BOOLEAN(), nullable=False
    )
    op.drop_constraint(op.f("reviews_user_id_fkey"), "reviews", type_="foreignkey")
    op.create_foreign_key(
        None, "reviews", "users", ["user_id"], ["id"], ondelete="CASCADE"
    )


def downgrade() -> None:
    # Drop the column first
    op.drop_column("products", "grouped_unit")

    # Drop the enum type too
    quantized_unit_enum = postgresql.ENUM(
        "LTR", "ML", "PCS", "NA", name="quantizedunit"
    )
    quantized_unit_enum.drop(op.get_bind(), checkfirst=True)

    # rest of your downgrade code...
    op.drop_constraint(None, "reviews", type_="foreignkey")
    op.create_foreign_key(
        op.f("reviews_user_id_fkey"), "reviews", "users", ["user_id"], ["id"]
    )
    op.alter_column(
        "products", "is_best_seller", existing_type=sa.BOOLEAN(), nullable=True
    )
