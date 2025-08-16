/**
 * 日志管理工具
 * 在开发环境中显示日志，在生产环境中静默
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: Date
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date()
    }

    // 添加到内存日志
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // 在开发环境中输出到控制台
    if (this.isDevelopment) {
      const timestamp = entry.timestamp.toLocaleTimeString()
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`
      
      switch (level) {
        case 'debug':
          console.debug(prefix, message, data || '')
          break
        case 'info':
          console.info(prefix, message, data || '')
          break
        case 'warn':
          console.warn(prefix, message, data || '')
          break
        case 'error':
          console.error(prefix, message, data || '')
          break
      }
    }
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data)
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data)
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data)
  }

  // 获取最近的日志
  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count)
  }

  // 清除日志
  clearLogs() {
    this.logs = []
  }

  // 导出日志（用于调试）
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// 创建全局日志实例
export const logger = new Logger()

// 为了向后兼容，提供简单的接口
export const log = {
  debug: (message: string, data?: unknown) => logger.debug(message, data),
  info: (message: string, data?: unknown) => logger.info(message, data),
  warn: (message: string, data?: unknown) => logger.warn(message, data),
  error: (message: string, data?: unknown) => logger.error(message, data)
}

// 在开发环境中将logger暴露到全局
if (import.meta.env.DEV) {
  (window as unknown & { logger: Logger }).logger = logger
}
