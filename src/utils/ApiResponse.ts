class ApiResponse {
  status: string;
  message: string | null;
  data: object | null;
  constructor(status: string, message: string | null, data: object | null) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
