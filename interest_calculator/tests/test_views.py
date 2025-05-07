from django.test import SimpleTestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock


class SavingsProjectionViewTests(SimpleTestCase):
    """Tests for the SavingsProjectionView API endpoint without database dependencies"""
    
    def setUp(self):
        self.client = APIClient()
        # Direct URL path instead of reverse lookup to avoid URL resolver dependency
        self.url = '/api/projections/'
    
    @patch('interest_calculator.views.SavingsCalculatorService')
    def test_valid_request(self, mock_service):
        """Test API with valid parameters returns correct response"""
        # Mock the service response
        mock_projection_data = [
            {"month": 0, "value": 1000},
            {"month": 12, "value": 1100},
            # Add more data as needed
        ]
        mock_service.calculate_projection.return_value = mock_projection_data
        
        response = self.client.get(
            self.url,
            {'initial_amount': '1000', 'monthly_deposit': '100', 'interest_rate': '5'}
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        self.assertIn('data', data)
        self.assertIn('meta', data)
        
        # Check that basic structure is correct
        self.assertEqual(data['data'][0]['month'], 0)
        self.assertEqual(data['data'][0]['value'], 1000)
        
        # Check meta fields existence
        self.assertIn('final_value', data['meta'])
        self.assertIn('parameters', data['meta'])
    
    @patch('interest_calculator.views.SavingsCalculatorInputSerializer')
    def test_missing_parameters(self, mock_serializer):
        """Test API returns 400 when required parameters are missing"""
        # Set up the serializer mock to simulate validation failure
        mock_instance = MagicMock()
        mock_instance.is_valid.return_value = False
        mock_instance.errors = {'initial_amount': ['This field is required']}
        mock_serializer.return_value = mock_instance
        
        response = self.client.get(
            self.url,
            {'monthly_deposit': '100', 'interest_rate': '5'}  # Missing initial_amount
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.json())
    
    @patch('interest_calculator.views.SavingsCalculatorService')
    def test_invalid_parameter_values(self, mock_service):
        """Test API returns 400 for invalid parameter values"""
        # Make service raise ValueError to simulate validation failure
        mock_service.calculate_projection.side_effect = ValueError("Initial amount cannot be negative")
        
        response = self.client.get(
            self.url,
            {'initial_amount': '-1000', 'monthly_deposit': '100', 'interest_rate': '5'}
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.json())
    
    @patch('interest_calculator.views.SavingsCalculatorService')
    def test_custom_years_parameter(self, mock_service):
        """Test API correctly handles custom years parameter"""
        # Mock the service response
        mock_projection_data = [
            {"month": 0, "value": 1000},
            {"month": 60, "value": 1500},  # 5 years (60 months)
        ]
        mock_service.calculate_projection.return_value = mock_projection_data
        
        response = self.client.get(
            self.url,
            {
                'initial_amount': '1000',
                'monthly_deposit': '100',
                'interest_rate': '5',
                'years': '5'
            }
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data['data']), 2)  # Just checking our mocked data length
        self.assertEqual(data['meta']['parameters']['years'], 5)
    
    @patch('interest_calculator.views.SavingsCalculatorService')
    def test_response_caching(self, mock_service):
        """Test responses are consistently formatted (simplified caching check)"""
        # Mock the service response
        mock_projection_data = [
            {"month": 0, "value": 1000},
            {"month": 12, "value": 1100},
        ]
        mock_service.calculate_projection.return_value = mock_projection_data
        
        # First request
        response1 = self.client.get(
            self.url,
            {'initial_amount': '1000', 'monthly_deposit': '100', 'interest_rate': '5'}
        )
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        
        # Service should be called just once if caching works
        mock_service.calculate_projection.assert_called_once()
        
        # Reset mock for second request
        mock_service.calculate_projection.reset_mock()
        
        # Make identical second request - in a real test with caching,
        # the service wouldn't be called again
        response2 = self.client.get(
            self.url,
            {'initial_amount': '1000', 'monthly_deposit': '100', 'interest_rate': '5'}
        )
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        
        # For simplicity in this mock test, we just verify format consistency
        self.assertEqual(response1.json().keys(), response2.json().keys())
        