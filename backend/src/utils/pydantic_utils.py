from typing import Any 

def none_to_empty_list(value: Any) -> list:
    if value is None:
        return []
    return value