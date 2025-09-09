// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendLog(logData: any) {
  console.log("Stub sendLog: ", logData);
  return { message: "Log sent (dummy)" };
}

export async function getLogs(userId: string) {
  return [
    { logId: "1", action: "download", status: "completed" },
    {
      logId: "2",
      action: "cut",
      status: "failed",
    },
  ];
}
