# 音频可视化系统

## 系统架构

本系统由两部分组成：
1. Web端音频分析系统
2. TouchDesigner可视化系统

## 启动步骤

### 1. TouchDesigner端

1. 打开TouchDesigner
2. 加载 `public/MusicVisualizer.toe` 项目文件
3. 确保WebSocket服务器已启动（端口7000）

### 2. Web端

1. 安装依赖：
```bash
cd web
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问：http://localhost:3000

## 数据流

Web端分析的音频数据将通过WebSocket实时发送到TouchDesigner，包括：

- 频率数据 (frequency)
- 音量 (volume)
- BPM
- 能量值 (energy)
- 复杂度 (complexity)
- 节奏强度 (rhythm)
- 音色特征 (timbre)
- 情感特征 (emotion)

## 注意事项

1. 确保TouchDesigner先启动，再启动Web应用
2. 默认WebSocket连接地址为：ws://localhost:7000
3. 如需修改连接地址，请修改 `src/ws/audioSocket.ts` 中的配置 