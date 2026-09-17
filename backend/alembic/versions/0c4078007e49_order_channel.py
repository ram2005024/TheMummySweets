import sqlalchemy as sa

from alembic import op

# revision identifiers
revision = "0c4078007e49"
down_revision = "942110ad16f0"
branch_labels = None
depends_on = None

# define enum
order_channel_enum = sa.Enum("app", "phone", "walk_in", name="order_channel")


def upgrade() -> None:
    # create enum type first
    order_channel_enum.create(op.get_bind(), checkfirst=True)

    # then add column using that enum
    op.add_column(
        "orders",
        sa.Column(
            "order_channel",
            order_channel_enum,
            nullable=False,
            server_default="app",
        ),
    )


def downgrade() -> None:
    # drop column first
    op.drop_column("orders", "order_channel")

    # then drop enum type
    order_channel_enum.drop(op.get_bind(), checkfirst=True)
