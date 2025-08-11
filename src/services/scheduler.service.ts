export interface SchedulerTask {
  id: string;
  name: string;
  interval: number; // 间隔时间（毫秒）
  handler: () => Promise<void> | void;
  enabled: boolean;
  lastRun?: number;
  nextRun?: number;
  runCount: number;
  errorCount: number;
  lastError?: string;
}

export interface SchedulerOptions {
  maxConcurrentTasks?: number;
  errorRetryDelay?: number;
  enableLogging?: boolean;
}

export class SchedulerService {
  private tasks = new Map<string, SchedulerTask>();
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private runningTasks = new Set<string>();
  private options: Required<SchedulerOptions>;

  constructor(options: SchedulerOptions = {}) {
    this.options = {
      maxConcurrentTasks: options.maxConcurrentTasks || 10,
      errorRetryDelay: options.errorRetryDelay || 30000, // 30秒
      enableLogging: options.enableLogging !== false
    };
  }

  private log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    if (this.options.enableLogging) {
      const timestamp = new Date().toISOString();
      console[level](`[Scheduler ${timestamp}] ${message}`);
    }
  }

  addTask(
    id: string,
    name: string,
    interval: number,
    handler: () => Promise<void> | void,
    autoStart = true
  ): void {
    if (this.tasks.has(id)) {
      throw new Error(`任务 ${id} 已存在`);
    }

    const task: SchedulerTask = {
      id,
      name,
      interval,
      handler,
      enabled: false,
      runCount: 0,
      errorCount: 0,
      nextRun: Date.now() + interval
    };

    this.tasks.set(id, task);
    this.log(`添加任务: ${name} (${id}), 间隔: ${interval}ms`);

    if (autoStart) {
      this.startTask(id);
    }
  }

  startTask(id: string): void {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`任务 ${id} 不存在`);
    }

    if (task.enabled) {
      this.log(`任务 ${task.name} 已经在运行中`, 'warn');
      return;
    }

    task.enabled = true;
    task.nextRun = Date.now() + task.interval;
    
    this.scheduleTask(task);
    this.log(`启动任务: ${task.name} (${id})`);
  }

  stopTask(id: string): void {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`任务 ${id} 不存在`);
    }

    task.enabled = false;
    
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.log(`停止任务: ${task.name} (${id})`);
  }

  removeTask(id: string): void {
    this.stopTask(id);
    this.tasks.delete(id);
    this.log(`删除任务: ${id}`);
  }

  private scheduleTask(task: SchedulerTask): void {
    if (!task.enabled) return;

    const delay = Math.max(0, task.nextRun! - Date.now());
    
    const timer = setTimeout(async () => {
      await this.executeTask(task);
    }, delay);

    this.timers.set(task.id, timer);
  }

  private async executeTask(task: SchedulerTask): Promise<void> {
    if (!task.enabled) return;

    // 检查并发限制
    if (this.runningTasks.size >= this.options.maxConcurrentTasks) {
      this.log(`达到最大并发限制，延迟执行任务: ${task.name}`, 'warn');
      task.nextRun = Date.now() + 5000; // 5秒后重试
      this.scheduleTask(task);
      return;
    }

    this.runningTasks.add(task.id);
    task.lastRun = Date.now();
    task.runCount++;

    this.log(`执行任务: ${task.name} (第${task.runCount}次)`);

    try {
      await Promise.resolve(task.handler());
      
      // 成功执行，计划下次运行
      task.nextRun = Date.now() + task.interval;
      this.log(`任务执行成功: ${task.name}`);
      
    } catch (error) {
      task.errorCount++;
      task.lastError = error instanceof Error ? error.message : String(error);
      
      this.log(`任务执行失败: ${task.name}, 错误: ${task.lastError}`, 'error');
      
      // 错误重试延迟
      task.nextRun = Date.now() + this.options.errorRetryDelay;
      
    } finally {
      this.runningTasks.delete(task.id);
      
      // 如果任务仍然启用，安排下次执行
      if (task.enabled) {
        this.scheduleTask(task);
      }
    }
  }

  getTaskStatus(id: string): SchedulerTask | null {
    return this.tasks.get(id) || null;
  }

  getAllTasks(): SchedulerTask[] {
    return Array.from(this.tasks.values());
  }

  getRunningTasks(): string[] {
    return Array.from(this.runningTasks);
  }

  getStats(): {
    totalTasks: number;
    enabledTasks: number;
    runningTasks: number;
    totalRuns: number;
    totalErrors: number;
  } {
    const tasks = Array.from(this.tasks.values());
    
    return {
      totalTasks: tasks.length,
      enabledTasks: tasks.filter(t => t.enabled).length,
      runningTasks: this.runningTasks.size,
      totalRuns: tasks.reduce((sum, t) => sum + t.runCount, 0),
      totalErrors: tasks.reduce((sum, t) => sum + t.errorCount, 0)
    };
  }

  startAll(): void {
    for (const task of this.tasks.values()) {
      if (!task.enabled) {
        this.startTask(task.id);
      }
    }
  }

  stopAll(): void {
    for (const task of this.tasks.values()) {
      if (task.enabled) {
        this.stopTask(task.id);
      }
    }
  }

  destroy(): void {
    this.stopAll();
    this.tasks.clear();
    this.timers.clear();
    this.runningTasks.clear();
    this.log('调度器已销毁');
  }
}

// 全局调度器实例
export const globalScheduler = new SchedulerService({
  maxConcurrentTasks: 5,
  errorRetryDelay: 30000,
  enableLogging: true
});