from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from .serialisers import SavingsCalculatorInputSerializer
from .services import SavingsCalculatorService, SavingsInputs

import logging


class SavingsProjectionView(APIView):
    """
    API endpoint for calculating savings projections
    """
    
    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    def get(self, request):
        """
        Calculate savings projection based on query parameters
        
        Validates input parameters, performs calculation using the
        SavingsCalculatorService, and returns the projection data.
        
        Query Parameters:
            initial_amount: Starting investment amount
            monthly_deposit: Monthly contribution amount
            interest_rate: Annual interest rate percentage
            years: (Optional) Investment time horizon in years (default: 50)
        """
        serializer = SavingsCalculatorInputSerializer(data=request.query_params)

        logger = logging.getLogger(__name__)
        
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid input parameters", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            inputs = SavingsInputs(**serializer.validated_data)
            projection = SavingsCalculatorService.calculate_projection(inputs)
            
            return Response({
                "data": projection,
                "meta": {
                    "total_months": len(projection) - 1,
                    "final_value": projection[-1]["value"],
                    "parameters": serializer.validated_data
                }
            })
            
        except ValueError as e:
            detail_message = str(e)
            if "initial_amount" in detail_message.lower():
                message = "Please provide a valid initial investment amount"
            elif "monthly_deposit" in detail_message.lower():
                message = "Please provide a valid monthly deposit amount"
            elif "interest_rate" in detail_message.lower():
                message = "Please provide a valid interest rate"
            else:
                message = detail_message
                
            return Response(
                {"error": message},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        except Exception as e:
            logger.error(f"Unexpected error in SavingsProjectionView: {str(e)}", exc_info=True)
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        