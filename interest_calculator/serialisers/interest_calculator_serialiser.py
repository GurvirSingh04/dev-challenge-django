from rest_framework import serializers


class SavingsCalculatorInputSerializer(serializers.Serializer):
    """
    Serializer for validating savings calculator input parameters
    
    Fields:
        initial_amount: The starting investment amount (must be ≥ 0)
        monthly_deposit: The monthly contribution amount (must be ≥ 0)
        interest_rate: The annual interest rate percentage (must be ≥ 0)
        years: The investment time in years (must be ≥ 1, defaults to 50)
    """
    initial_amount = serializers.FloatField(min_value=0)
    monthly_deposit = serializers.FloatField(min_value=0)
    interest_rate = serializers.FloatField(min_value=0)
    years = serializers.IntegerField(min_value=1, default=50)
    