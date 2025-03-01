def convert_sqft_to_acres(sqft):
    """Converts square feet to acres rounded to 2 decimal places."""
    return round(sqft / 43560, 2) if sqft else None

