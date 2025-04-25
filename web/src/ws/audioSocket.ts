/**
 * WebSocket通信模块 - 用于向TouchDesigner发送音频分析数据
 * @module audioSocket
 */

interface AudioAnalysisData {
  frequency: number[];    // 频率数据
  volume: number;        // 音量
  bpm: number;          // 节拍信息
  energy: number;       // 能量值
  complexity: number;   // 音乐复杂度
  rhythm: number;       // 节奏强度
  timbre: number[];     // 音色特征
  emotion: string;      // 情感特征
}

class AudioSocket {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectTimer: number | null = null;
  private readonly reconnectInterval = 3000;
  private messageQueue: AudioAnalysisData[] = [];

  constructor(url = 'ws://localhost:7000') {
    this.url = url;
    this.connect();
    
    // 定期清理消息队列
    setInterval(() => {
      if (this.messageQueue.length > 100) {
        this.messageQueue = this.messageQueue.slice(-50);
      }
    }, 5000);
  }

  /**
   * 建立WebSocket连接
   */
  private connect(): void {
    try {
      console.log('正在连接到TouchDesigner...');
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('已成功连接到TouchDesigner');
        if (this.reconnectTimer) {
          clearInterval(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        
        // 连接成功后发送测试数据
        this.sendTestData();
      };

      this.ws.onclose = () => {
        console.log('与TouchDesigner断开连接，尝试重连...');
        if (!this.reconnectTimer) {
          this.reconnectTimer = window.setInterval(() => {
            this.connect();
          }, this.reconnectInterval);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
      };

      this.ws.onmessage = (event) => {
        console.log('收到TouchDesigner消息:', event.data);
      };

    } catch (error) {
      console.error('WebSocket连接失败:', error);
    }
  }

  /**
   * 发送测试数据
   */
  private sendTestData(): void {
    const testData: AudioAnalysisData = {
      frequency: Array(128).fill(0).map(() => Math.random()),
      volume: 0.5,
      bpm: 120,
      energy: 0.7,
      complexity: 0.3,
      rhythm: 0.6,
      timbre: [0.2, 0.3, 0.4, 0.5, 0.6],
      emotion: '平静'
    };
    
    this.sendAnalysisData(testData);
  }

  /**
   * 发送音频分析数据到TouchDesigner
   * @param data 音频分析数据
   */
  public sendAnalysisData(data: AudioAnalysisData): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
        this.messageQueue.push(data);
        console.log('发送数据到TouchDesigner:', data);
      } catch (error) {
        console.error('发送数据失败:', error);
      }
    } else {
      console.warn('WebSocket未连接，无法发送数据');
    }
  }

  /**
   * 关闭WebSocket连接
   */
  public close(): void {
    if (this.ws) {
      this.ws.close();
    }
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 获取连接状态
   */
  public getStatus(): string {
    if (!this.ws) return '未初始化';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return '正在连接';
      case WebSocket.OPEN: return '已连接';
      case WebSocket.CLOSING: return '正在关闭';
      case WebSocket.CLOSED: return '已关闭';
      default: return '未知状态';
    }
  }

  /**
   * 添加事件监听器
   */
  public addEventListener(event: string, callback: EventListener): void {
    if (this.ws) {
      this.ws.addEventListener(event, callback);
    }
  }

  /**
   * 移除事件监听器
   */
  public removeEventListener(event: string, callback: EventListener): void {
    if (this.ws) {
      this.ws.removeEventListener(event, callback);
    }
  }
}

// 导出单例实例
export const audioSocket = new AudioSocket(); 