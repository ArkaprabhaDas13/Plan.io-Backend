
// API Error Response Standardization 
// {
//     "success": false,
//     "statusCode": 400,
//     "message": "Validation failed",
//     "errors": [
//         {
//             "field": "description",
//             "message": "Description is required"
//         }
//     ]
// }

class ErrorResponse {
    constructor(statusCode, message, error = null){
        this.success = false;
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
    }
}

export default ErrorResponse;