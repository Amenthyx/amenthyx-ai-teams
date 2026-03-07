export interface ProfileData {
  uptime: number;
  memory: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  cpu: { user: number; system: number };
  pid: number;
  platform: string;
  nodeVersion: string;
}

export function getProfile(): ProfileData {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();

  return {
    uptime: process.uptime(),
    memory: {
      rss: mem.rss,
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
    },
    cpu: {
      user: cpu.user / 1000, // microseconds to ms
      system: cpu.system / 1000,
    },
    pid: process.pid,
    platform: process.platform,
    nodeVersion: process.version,
  };
}
