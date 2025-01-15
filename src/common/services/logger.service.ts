import { ConsoleLogger } from '@nestjs/common';

export class PlanzvitLogger extends ConsoleLogger {
  #appName: string;

  constructor(appName: string = 'NEST') {
    super();
    this.#appName = appName;
  }

  public setAppName(name: string): void {
    this.#appName = name;
  }

  override formatPid(pid: number): string {
    return `[${this.#appName}] ${pid}  - `;
  }
}
