import numpy as np
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Union
from dataclasses import dataclass

@dataclass
class SavingsInputs:
    """Data class to validate and store savings calculator inputs"""
    initial_amount: float
    monthly_deposit: float
    interest_rate: float
    years: int
    
    def __post_init__(self):
        """
        Data class to validate and store savings calculator inputs
        
        Attributes:
            initial_amount: The starting investment amount
            monthly_deposit: The monthly contribution amount
            interest_rate: The annual interest rate percentage
            years: The investment time in years
        """
        if self.initial_amount < 0:
            raise ValueError("Initial amount cannot be negative")
        if self.monthly_deposit < 0:
            raise ValueError("Monthly deposit cannot be negative")
        if self.interest_rate < 0:
            raise ValueError("Interest rate cannot be negative")
        if self.years <= 0:
            raise ValueError("Years must be greater than zero")


class SavingsCalculatorService:
    """Service for calculating compound interest projections"""
    
    @staticmethod
    def calculate_projection(inputs: SavingsInputs) -> List[Dict[str, Union[int, float]]]:
        """
        Calculate monthly compound interest projection
        
        Uses numpy for efficient calculations of compound interest growth
        over the entire projection period at once.
        
        Args:
            inputs: Validated input parameters containing initial amount,
                   monthly deposit, interest rate, and years
            
        Returns:
            List of monthly projections, where each item is a dictionary 
            containing the month number and calculated value
        """
        # Convert annual interest rate to monthly
        monthly_rate = inputs.interest_rate / 100 / 12
        
        # Total number of months for projection
        total_months = inputs.years * 12
        
        # Create month array (0 to total_months)
        months = np.arange(total_months + 1)
        
        # Calculate compound growth for initial investment
        initial_growth = inputs.initial_amount * (1 + monthly_rate) ** months
        
        # Calculate compound growth for monthly deposits
        # For months where monthly_rate is 0, we use simple multiplication
        if monthly_rate > 0:
            monthly_growth = inputs.monthly_deposit * ((1 + monthly_rate) ** months - 1) / monthly_rate
        else:
            monthly_growth = inputs.monthly_deposit * months
            
        # For month 0, monthly deposit hasn't happened yet
        monthly_growth[0] = 0
        
        # Total growth is the sum of initial and monthly growth
        total_growth = initial_growth + monthly_growth
        
        # Prepare the result as list of dictionaries
        result = [
            {"month": int(month), "value": float(Decimal(str(float(value))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))}
            for month, value in zip(months, total_growth)
        ]
        
        return result
    