import axios from "axios";
import axiosRetry from "axios-retry";

const axiosInstance = axios.create({
	baseURL: `http://${window.location.hostname}:5000/api/v1`,
	timeout: 10000,
});

axiosRetry(axiosInstance, {
	retries: 3,
	retryDelay: (retryCount) => retryCount * 1000,
	shouldResetTimeout: true,
});

export default axiosInstance;
