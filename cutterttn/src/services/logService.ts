import axios from "axios";

const BASE_URL = "http://localhost:8000";

interface Log {
  logId: string;
  userId: string;
  action: string;
  status: string;
}

export async function sendLog(logData: Log) {
  try {
    const response = await axios.post(`${BASE_URL}/api/logs`, logData);
    return response.data;
  } catch (e) {
    console.error("Error sending log:", e);
    throw e;
  }
}

export async function getLogs(userId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/logs?userId=${userId}`);
    return response.data;
  } catch (e) {
    console.error("Error fetching log:", e);
    throw e;
  }
}
