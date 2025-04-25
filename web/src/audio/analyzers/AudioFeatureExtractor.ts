/**
 * 音频特征提取器
 * @module AudioFeatureExtractor
 */

export class AudioFeatureExtractor {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private fftSize: number = 2048;
  private frequencyData: Uint8Array;
  private timeDomainData: Uint8Array;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  /**
   * 连接音频源
   * @param source 音频源节点
   */
  public connectSource(source: AudioNode): void {
    source.connect(this.analyser);
  }

  /**
   * 获取频率数据
   * @returns 频率数据数组
   */
  public getFrequencyData(): number[] {
    this.analyser.getByteFrequencyData(this.frequencyData);
    return Array.from(this.frequencyData);
  }

  /**
   * 计算音量
   * @returns 音量值 (0-1)
   */
  public getVolume(): number {
    this.analyser.getByteTimeDomainData(this.timeDomainData);
    let sum = 0;
    for (let i = 0; i < this.timeDomainData.length; i++) {
      const amplitude = (this.timeDomainData[i] - 128) / 128;
      sum += amplitude * amplitude;
    }
    return Math.sqrt(sum / this.timeDomainData.length);
  }

  /**
   * 估算BPM
   * @returns BPM值
   */
  public estimateBPM(): number {
    // 简单BPM检测实现
    const freqData = this.getFrequencyData();
    const bassEnergy = freqData.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
    // 这里使用一个简化的算法，实际项目中可以使用更复杂的BPM检测算法
    return Math.round(60 + bassEnergy / 2);
  }

  /**
   * 计算频谱能量
   * @returns 能量值 (0-1)
   */
  public getEnergy(): number {
    const freqData = this.getFrequencyData();
    const sum = freqData.reduce((a, b) => a + b, 0);
    return sum / (freqData.length * 255); // 归一化到0-1
  }

  /**
   * 计算音乐复杂度
   * @returns 复杂度值 (0-1)
   */
  public getComplexity(): number {
    const freqData = this.getFrequencyData();
    let changes = 0;
    for (let i = 1; i < freqData.length; i++) {
      if (Math.abs(freqData[i] - freqData[i - 1]) > 10) {
        changes++;
      }
    }
    return changes / freqData.length;
  }

  /**
   * 获取节奏强度
   * @returns 节奏强度值 (0-1)
   */
  public getRhythmStrength(): number {
    const freqData = this.getFrequencyData();
    // 主要关注低频部分（通常包含节奏信息）
    const bassRange = freqData.slice(0, 20);
    const bassEnergy = bassRange.reduce((a, b) => a + b, 0) / (20 * 255);
    return bassEnergy;
  }

  /**
   * 获取音色特征
   * @returns 音色特征向量
   */
  public getTimbreFeatures(): number[] {
    const freqData = this.getFrequencyData();
    // 将频谱分成多个频带，计算每个频带的能量
    const bands = [
      freqData.slice(0, 20),    // 低频
      freqData.slice(20, 50),   // 中低频
      freqData.slice(50, 100),  // 中频
      freqData.slice(100, 200), // 中高频
      freqData.slice(200)       // 高频
    ];
    
    return bands.map(band => 
      band.reduce((a, b) => a + b, 0) / (band.length * 255)
    );
  }

  /**
   * 分析情感特征
   * @returns 情感标签
   */
  public analyzeEmotion(): string {
    const energy = this.getEnergy();
    const complexity = this.getComplexity();
    const rhythm = this.getRhythmStrength();

    if (energy > 0.7 && rhythm > 0.6) return '兴奋';
    if (energy < 0.3 && complexity < 0.3) return '平静';
    if (complexity > 0.7) return '复杂';
    if (rhythm > 0.7 && energy > 0.5) return '欢快';
    return '中性';
  }
} 