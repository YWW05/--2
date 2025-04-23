/**
 * 音频分析器类
 * 用于处理音频文件的加载、播放和频率分析
 */
export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode;
  private audioBuffer: AudioBuffer | null = null;
  private isPlaying: boolean = false;
  private startTime: number = 0;
  private pausedTime: number = 0;
  private offset: number = 0;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.gainNode = this.audioContext.createGain();
    
    // 设置分析器参数
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    
    // 连接节点
    this.analyser.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  /**
   * 加载音频文件
   * @param file 音频文件
   */
  async loadAudio(file: File): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('加载音频文件失败:', error);
      throw error;
    }
  }

  /**
   * 播放音频
   */
  play(): void {
    if (!this.audioBuffer) return;

    // 如果正在播放，先停止
    if (this.isPlaying) {
      this.stop();
    }

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.analyser);
    
    // 从暂停的位置继续播放
    this.startTime = this.audioContext.currentTime - this.offset;
    this.source.start(0, this.offset);
    
    this.isPlaying = true;
  }

  /**
   * 暂停播放
   */
  pause(): void {
    if (this.source && this.isPlaying) {
      this.offset = this.getCurrentTime();
      this.source.stop();
      this.source.disconnect();
      this.source = null;
      this.isPlaying = false;
    }
  }

  /**
   * 停止播放
   */
  stop(): void {
    if (this.source) {
      this.source.stop();
      this.source.disconnect();
      this.source = null;
    }
    this.isPlaying = false;
    this.offset = 0;
    this.startTime = 0;
  }

  /**
   * 设置音量
   * @param value 音量值 (0-1)
   */
  setVolume(value: number): void {
    this.gainNode.gain.value = Math.max(0, Math.min(1, value));
  }

  /**
   * 获取当前播放时间
   * @returns 当前播放时间（秒）
   */
  getCurrentTime(): number {
    if (!this.isPlaying) {
      return this.offset;
    }
    return this.audioContext.currentTime - this.startTime;
  }

  /**
   * 设置当前播放时间
   * @param time 目标时间（秒）
   */
  setCurrentTime(time: number): void {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.pause();
    }
    this.offset = Math.max(0, Math.min(time, this.getDuration()));
    if (wasPlaying) {
      this.play();
    }
  }

  /**
   * 获取音频总时长
   * @returns 音频总时长（秒）
   */
  getDuration(): number {
    return this.audioBuffer ? this.audioBuffer.duration : 0;
  }

  /**
   * 获取频率数据
   * @returns Uint8Array 频率数据
   */
  getFrequencyData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * 获取不同频段的能量值
   * @returns 低、中、高频段的能量值
   */
  getFrequencyBands(): { low: number; mid: number; high: number } {
    const frequencies = this.getFrequencyData();
    const bands = {
      low: 0,
      mid: 0,
      high: 0
    };

    // 计算每个频段的平均能量
    for (let i = 0; i < frequencies.length; i++) {
      if (i < frequencies.length / 3) {
        bands.low += frequencies[i];
      } else if (i < (frequencies.length * 2) / 3) {
        bands.mid += frequencies[i];
      } else {
        bands.high += frequencies[i];
      }
    }

    // 归一化
    const normalize = (value: number) => value / (frequencies.length / 3) / 256;
    return {
      low: normalize(bands.low),
      mid: normalize(bands.mid),
      high: normalize(bands.high)
    };
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stop();
    this.audioContext.close();
  }
} 