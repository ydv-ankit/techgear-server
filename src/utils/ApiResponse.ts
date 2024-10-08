class ApiResponse {
  message: string | null;
  data: object | undefined | null;
  constructor(message: string | null, data?: object | null) {
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
