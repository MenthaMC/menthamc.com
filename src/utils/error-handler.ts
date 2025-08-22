/**
 * 错误处理工具
 * 统一管理应用中的错误处理
 */

import { logger } from './logger'
import { ENV } from './env'

export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: Date
  stack?: string
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errors: AppError[] = []
  private maxErrors = 100

  private constructor() {
    // 监听全局错误
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError.bind(this))
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this))
    }
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // 处理全局错误
  private handleGlobalError(event: ErrorEvent) {
    this.captureError({
      code: 'GLOBAL_ERROR',
      message: event.message,
      details: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      },
      timestamp: new Date(),
      stack: event.error?.stack
    })
  }

  // 处理未捕获的Promise拒绝
  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    this.captureError({
      code: 'UNHANDLED_REJECTION',
      message: event.reason?.message || 'Unhandled promise rejection',
      details: event.reason,
      timestamp: new Date(),
      stack: event.reason?.stack
    })
  }

  // 捕获错误
  captureError(error: Partial<AppError> & { message: string }) {
    const appError: AppError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message,
      details: error.details,
      timestamp: error.timestamp || new Date(),
      stack: error.stack
    }

    // 添加到错误列表
    this.errors.push(appError)
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // 记录日志
    logger.error(`[${appError.code}] ${appError.message}`, {
      details: appError.details,
      stack: appError.stack
    })

    // 在生产环境中可以发送到错误监控服务
    if (ENV.isProduction && ENV.features.enableErrorReporting) {
      this.reportError(appError)
    }
  }

  // 报告错误到监控服务
  private async reportError(error: AppError) {
    try {
      // 这里可以集成第三方错误监控服务
      // 例如 Sentry, LogRocket 等
      logger.debug('报告错误到监控服务:', error)
    } catch (reportError) {
      logger.warn('错误报告失败', reportError)
    }
  }

  // 获取最近的错误
  getRecentErrors(count = 20): AppError[] {
    return this.errors.slice(-count)
  }

  // 清除错误
  clearErrors() {
    this.errors = []
  }

  // 创建API错误
  createApiError(message: string, status?: number, details?: unknown): AppError {
    return {
      code: `API_ERROR_${status || 'UNKNOWN'}`,
      message,
      details: { status, ...details as Record<string, unknown> },
      timestamp: new Date()
    }
  }

  // 创建网络错误
  createNetworkError(message: string, details?: unknown): AppError {
    return {
      code: 'NETWORK_ERROR',
      message,
      details,
      timestamp: new Date()
    }
  }

  // 创建验证错误
  createValidationError(message: string, field?: string, details?: unknown): AppError {
    return {
      code: 'VALIDATION_ERROR',
      message,
      details: { field, ...details as Record<string, unknown> },
      timestamp: new Date()
    }
  }
}

// 创建全局错误处理器实例
export const errorHandler = ErrorHandler.getInstance()

// 便捷函数
export const captureError = (error: Partial<AppError> & { message: string }) => {
  errorHandler.captureError(error)
}

export const captureException = (error: Error, code?: string, details?: unknown) => {
  errorHandler.captureError({
    code: code || 'EXCEPTION',
    message: error.message,
    details,
    stack: error.stack,
    timestamp: new Date()
  })
}