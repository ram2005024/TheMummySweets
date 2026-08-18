from fastapi import Query

from app.schemas.pagination_schema import Meta


class Pagination:
    def __init__(
        self,
        page: int = Query(default=1, ge=1, description="page_no"),
        limit: int = Query(default=10, ge=1, le=100, description="page_limit"),
    ) -> None:
        self.page = page
        self.limit = limit

    def pagination(self, total: int, filtered_total: int):
        total_page = (filtered_total + (self.limit - 1)) // self.limit
        has_next = self.page < total_page
        has_previous = self.page > 1

        return Meta(
            filtered_total=filtered_total,
            has_next=has_next,
            has_previous=has_previous,
            limit=self.limit,
            page_no=self.page,
            page_size=total_page,
            total=total,
        )
