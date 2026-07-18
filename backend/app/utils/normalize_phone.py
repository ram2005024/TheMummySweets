import re


def normalize_phone(number:str)->str:
    pure_number=re.sub(r"\D","",number)
    if pure_number.startswith("977"):
        pure_number=pure_number[3:]

    if len(pure_number) != 10:
        raise ValueError("Length of the number should be equal to 10")

    if not re.fullmatch(r"(98|97)\d{8}",pure_number):
        raise ValueError("Invalid mobile number")

    return f"+977{pure_number}"
