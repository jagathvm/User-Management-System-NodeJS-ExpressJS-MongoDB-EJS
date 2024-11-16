class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async httpRequest(endpoint, method = "GET", data = null) {
    try {
      const fullUrl = `${this.baseUrl}${endpoint}`;
      const config = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (method !== "GET" && data) {
        config.body = JSON.stringify(data);
      }

      const result = await fetch(fullUrl, config);
      const response = await result.json();

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const apiClient = new HttpRequest("/api");
