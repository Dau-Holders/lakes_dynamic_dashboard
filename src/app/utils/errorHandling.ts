/**
 * Standardized API Error Response Interface
 * Matches the backend's standardized error format
 */
export interface APIError {
  success: false;
  error: string;
  message: string;
  errors: Record<string, string[]>;
  status_code: number;
}

/**
 * Format API error responses for display in PrimeReact Messages
 * 
 * @param error - The error object from axios catch block
 * @returns Formatted error message string
 */
export function formatAPIError(error: any): string {
  // Check if this is an axios error with response data
  if (error.response?.data) {
    const errorData: APIError = error.response.data;
    
    // For validation errors with field-specific errors
    if (errorData.errors && Object.keys(errorData.errors).length > 0) {
      return formatFieldErrors(errorData.errors);
    }
    
    // For general errors with a message
    if (errorData.message) {
      return errorData.message;
    }
  }
  
  // Fallback for unexpected error formats
  return "An unexpected error occurred. Please try again.";
}

/**
 * Format field-specific validation errors
 * 
 * @param errors - Record of field names to error message arrays
 * @returns Formatted error string with field names and messages
 */
function formatFieldErrors(errors: Record<string, string[]>): string {
  return Object.entries(errors)
    .map(([field, messages]) => {
      // Format field name: replace underscores with spaces and capitalize
      const fieldName = field.replace(/_/g, ' ');
      // Join multiple messages for the same field
      return `${fieldName}: ${messages.join(', ')}`;
    })
    .join('\n');
}
