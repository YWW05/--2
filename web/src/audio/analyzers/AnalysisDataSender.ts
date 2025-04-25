/**
 * 音频分析数据发送器
 * @module AnalysisDataSender
 */

import { audioSocket } from '../../ws/audioSocket';
import { AudioFeatureExtractor } from './AudioFeatureExtractor';

export class AnalysisDataSender {
  private featureExtractor: AudioFeatureExtractor;
  private intervalId: number | null = null;
  private readonly updateInterval: number = 50; // 20fps

  constructor(audioContext: AudioContext) {
    this.featureExtractor = new AudioFeatureExtractor(audioContext);
  }

  /**
   * 连接音频源
   * @param source 音频源节点
   */
  public connectSource(source: AudioNode): void {
    this.featureExtractor.connectSource(source);
  }

  /**
   * 开始发送分析数据
   */
  public startSending(): void {
    if (this.intervalId !== null) return;

    this.intervalId = window.setInterval(() => {
      const analysisData = {
        frequency: this.featureExtractor.getFrequencyData(),
        volume: this.featureExtractor.getVolume(),
        bpm: this.featureExtractor.estimateBPM(),
        energy: this.featureExtractor.getEnergy(),
        complexity: this.featureExtractor.getComplexity(),
        rhythm: this.featureExtractor.getRhythmStrength(),
        timbre: this.featureExtractor.getTimbreFeatures(),
        emotion: this.featureExtractor.analyzeEmotion()
      };

      audioSocket.sendAnalysisData(analysisData);
    }, this.updateInterval);
  }

  /**
   * 停止发送分析数据
   */
  public stopSending(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
} 