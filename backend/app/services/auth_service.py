from app.repos.user_repo import UserRepo


class AuthService:
    def __init__(self, repo: UserRepo):
        self.repo = repo

        # Auth services
