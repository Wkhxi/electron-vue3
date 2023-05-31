import crypto from "crypto";

export class ModelBase {
  id: string;
  constructor() {
    // 继承
    // 通过密码学安全的随机数生成器 生成  UUID
    this.id = crypto.randomUUID();
  }
}
