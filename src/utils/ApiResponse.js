
// API Response Standardization 
// {
//     "success": true,
//     "message": "Task created successfully",
//     "data": { ... }
// }

class ApiResponse{
    constructor(responseCode, message, data = null){
        this.isSuccessful = true;
        this.responseCode = responseCode;
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse;