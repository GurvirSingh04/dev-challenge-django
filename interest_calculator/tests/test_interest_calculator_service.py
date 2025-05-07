import unittest
from ..services.interest_calculator_service import SavingsCalculatorService, SavingsInputs

class TestSavingsInputs(unittest.TestCase):
    """Tests for SavingsInputs data class validation"""
    
    def test_valid_inputs(self):
        """Valid inputs should initialize without errors"""
        inputs = SavingsInputs(initial_amount=1000, monthly_deposit=100, interest_rate=5, years=10)
        self.assertEqual(inputs.initial_amount, 1000)
        self.assertEqual(inputs.monthly_deposit, 100)
        self.assertEqual(inputs.interest_rate, 5)
        self.assertEqual(inputs.years, 10)
    
    def test_negative_initial_amount(self):
        """Should raise ValueError for negative initial amount"""
        with self.assertRaises(ValueError) as context:
            SavingsInputs(initial_amount=-100, monthly_deposit=100, interest_rate=5, years=10)
        self.assertIn("Initial amount cannot be negative", str(context.exception))
    
    def test_negative_monthly_deposit(self):
        """Should raise ValueError for negative monthly deposit"""
        with self.assertRaises(ValueError) as context:
            SavingsInputs(initial_amount=1000, monthly_deposit=-50, interest_rate=5, years=10)
        self.assertIn("Monthly deposit cannot be negative", str(context.exception))
    
    def test_negative_interest_rate(self):
        """Should raise ValueError for negative interest rate"""
        with self.assertRaises(ValueError) as context:
            SavingsInputs(initial_amount=1000, monthly_deposit=100, interest_rate=-2, years=10)
        self.assertIn("Interest rate cannot be negative", str(context.exception))
    
    def test_invalid_years(self):
        """Should raise ValueError for years <= 0"""
        with self.assertRaises(ValueError) as context:
            SavingsInputs(initial_amount=1000, monthly_deposit=100, interest_rate=5, years=0)
        self.assertIn("Years must be greater than zero", str(context.exception))


class TestSavingsCalculatorService(unittest.TestCase):
    """Tests for SavingsCalculatorService calculation logic"""
    
    def test_calculate_projection_with_zero_interest(self):
        """Test with 0% interest rate (should be linear growth)"""
        inputs = SavingsInputs(initial_amount=1000, monthly_deposit=100, interest_rate=0, years=1)
        result = SavingsCalculatorService.calculate_projection(inputs)
        
        # With zero interest, we expect:
        # Month 0: 1000 (initial only)
        # Month 1: 1000 + 100 = 1100
        # Month 2: 1100 + 100 = 1200
        # ...and so on
        
        self.assertEqual(len(result), 13)  # 0-12 months (inclusive)
        self.assertEqual(result[0]["month"], 0)
        self.assertEqual(result[0]["value"], 1000)
        self.assertEqual(result[6]["month"], 6)
        self.assertEqual(result[6]["value"], 1600)
        self.assertEqual(result[12]["month"], 12)
        self.assertEqual(result[12]["value"], 2200)
    
    def test_calculate_projection_with_interest(self):
        """Test with positive interest rate"""
        inputs = SavingsInputs(initial_amount=1000, monthly_deposit=100, interest_rate=12, years=1)
        result = SavingsCalculatorService.calculate_projection(inputs)
        
        # Checking a few key points
        self.assertEqual(result[0]["month"], 0)
        self.assertEqual(result[0]["value"], 1000)
        
        # Final value manually calculated:
        # 1000 * (1 + 0.01)^12 + 100 * [(1 + 0.01)^12 - 1] / 0.01 = approx 2260.48
        self.assertAlmostEqual(result[12]["value"], 2395.08, delta=0.1)
    
    def test_calculate_projection_no_initial_amount(self):
        """Test with zero initial amount"""
        inputs = SavingsInputs(initial_amount=0, monthly_deposit=100, interest_rate=6, years=1)
        result = SavingsCalculatorService.calculate_projection(inputs)
        
        self.assertEqual(result[0]["month"], 0)
        self.assertEqual(result[0]["value"], 0)
        
        # Final value should be just the monthly deposits with interest
        # 100 * [(1 + 0.005)^12 - 1] / 0.005 = approx 1233.56
        self.assertAlmostEqual(result[12]["value"], 1233.56, delta=0.1)
    
    def test_calculate_projection_no_monthly_deposit(self):
        """Test with zero monthly deposit"""
        inputs = SavingsInputs(initial_amount=1000, monthly_deposit=0, interest_rate=6, years=1)
        result = SavingsCalculatorService.calculate_projection(inputs)
        
        # Final value should be just the initial amount with interest
        # 1000 * (1 + 0.005)^12 = approx 1061.68
        self.assertAlmostEqual(result[12]["value"], 1061.68, delta=0.1)
    
    def test_calculate_projection_long_term(self):
        """Test a longer-term projection"""
        inputs = SavingsInputs(initial_amount=1000, monthly_deposit=100, interest_rate=7, years=30)
        result = SavingsCalculatorService.calculate_projection(inputs)
        
        self.assertEqual(len(result), 361)  # 0-360 months (inclusive)
        
        # Check some values, but the main point is that it should calculate for a long period
        self.assertEqual(result[0]["month"], 0)
        self.assertEqual(result[0]["value"], 1000)
        self.assertTrue(result[360]["value"] > 100000)  # Should be substantial growth over 30 years
    
    def test_rounding_behavior(self):
        """Test that values are rounded to 2 decimal places"""
        inputs = SavingsInputs(initial_amount=1000.555, monthly_deposit=100.555, interest_rate=6, years=1)
        result = SavingsCalculatorService.calculate_projection(inputs)
        
        # Check that initial value is rounded
        self.assertEqual(result[0]["value"], 1000.56)
        
        # Check that all values have maximum 2 decimal places
        for point in result:
            value_str = str(point["value"])
            if '.' in value_str:
                decimal_places = len(value_str.split('.')[1])
                self.assertLessEqual(decimal_places, 2)


if __name__ == '__main__':
    unittest.main()
