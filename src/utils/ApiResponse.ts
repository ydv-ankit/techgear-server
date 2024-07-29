class ApiResponse {
  message: string | null;
  data: object | undefined;
  constructor(message: string | null, data?: object) {
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
