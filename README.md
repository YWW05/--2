# Music Visualizer Pro

基于Web Audio API的音频分析系统，结合TouchDesigner实现实时音乐可视化效果。支持在线访问使用。

## 项目概述

本项目是一个在线音乐可视化系统，通过Web端进行音频分析，将分析数据实时传输到服务端的TouchDesigner中进行视觉渲染。系统能够根据不同的音乐类型自动匹配相应的视觉效果模板，实现音乐与视觉的完美融合。用户可以通过浏览器访问使用，无需本地安装。

## 特别说明（中国区部署）

### 网络优化
- 使用国内CDN服务（如阿里云CDN、腾讯云CDN）
- 部署在国内服务器（推荐阿里云、腾讯云）
- 静态资源使用国内对象存储（如阿里云OSS、腾讯云COS）

### 依赖包镜像
- NPM：使用清华镜像源
- Docker：使用国内镜像源
- Python包：使用清华镜像源

### 第三方服务替代方案
- 视频推流：阿里云视频直播服务
- 对象存储：阿里云OSS
- 数据库：阿里云MongoDB/Redis
- 监控服务：阿里云ARMS

## 核心功能

### 1. 音频分析系统
- 实时音频输入处理（支持文件上传和麦克风输入）
- FFT频谱分析
- 音乐特征提取（节奏、音色、能量等）
- 音乐类型识别

### 2. 数据传输系统
- 基于WebSocket的实时数据传输
- 服务端OSC转发
- 数据平滑处理
- 网络延迟补偿

### 3. TouchDesigner集成
- 多个视觉效果模板
- 实时参数映射
- 场景自动切换
- 平滑过渡效果
- 视频流推送

### 4. 在线功能
- 用户账号系统（可选）
- 视觉效果收藏
- 历史记录
- 社区分享

## 技术架构

### 前端技术栈
- React.js（通过清华NPM镜像安装）
- Web Audio API
- WebSocket
- Web Workers
- 阿里云视频直播SDK（替代WebRTC）

### 后端技术栈
- Node.js/Express
- WebSocket Server
- 阿里云Redis
- 阿里云MongoDB

### 渲染服务
- TouchDesigner
- OSC协议
- 阿里云视频直播服务
- PM2（进程管理）

## 部署架构

```
[客户端浏览器] ←→ [阿里云CDN] ←→ [阿里云ECS集群] ←→ [渲染服务器集群]
                                      ↕               ↕
                              [阿里云数据库]    [阿里云视频直播]
```

## 音乐类型与视觉映射

### 支持的音乐类型
1. 电子音乐
   - 视觉特点：几何图形、粒子系统、霓虹效果
   - 参数映射：重低音→几何变形、节拍→闪光效果

2. 古典音乐
   - 视觉特点：流线、优雅曲线、自然元素
   - 参数映射：音乐织体→流场复杂度、力度→整体亮度

3. 流行音乐
   - 视觉特点：现代图形、色彩丰富
   - 参数映射：人声→中心图形、节奏→动画速度

4. 嘻哈音乐
   - 视觉特点：都市元素、强节奏视觉
   - 参数映射：节拍→几何冲击、低音→形变强度

## 数据流

```
[音频输入] → [Web音频分析] → [特征提取] → [类型识别] → [OSC传输] → [TouchDesigner] → [视觉输出]
```

## 参数映射系统

### 基础参数
- 频率分布 (20Hz-20kHz)
- 音量包络 (0-1)
- 节拍信息 (BPM, 节拍点)
- 频谱能量分布

### 高级参数
- 音乐复杂度
- 节奏强度
- 音色特征
- 情感特征

## 项目结构

```
music-visualizer-pro/
├── web/                    # Web端代码
│   ├── src/
│   │   ├── audio/         # 音频处理模块
│   │   ├── analysis/      # 特征分析模块
│   │   ├── network/       # 网络传输模块
│   │   ├── ui/           # 用户界面
│   │   └── store/        # 状态管理
│   └── public/
├── server/                # 服务端代码
│   ├── src/
│   │   ├── routes/       # API路由
│   │   ├── controllers/  # 业务逻辑
│   │   ├── models/       # 数据模型
│   │   ├── services/     # 服务层
│   │   └── utils/        # 工具函数
│   └── config/           # 配置文件
├── touchdesigner/         # TD工程文件
│   ├── templates/        # 视觉效果模板
│   ├── scripts/         # Python脚本
│   └── projects/        # 具体项目文件
├── deploy/               # 部署配置
│   ├── nginx/           # Nginx配置
│   ├── docker/          # Docker配置
│   └── scripts/         # 部署脚本
└── docs/                # 文档
```

## 部署要求

### 服务器要求（阿里云ECS推荐配置）
- CPU: 8核心以上
- 内存: 16GB以上
- 显卡: 支持CUDA的NVIDIA显卡（可选用GPU实例）
- 带宽: 100Mbps以上
- 系统: CentOS 7.9 或 Alibaba Cloud Linux 2

### 软件要求
- Node.js >= 14.0.0（通过nvm安装）
- TouchDesigner >= 2022.28260
- Docker >= 20.10（使用阿里云镜像加速）
- Nginx >= 1.18
- 阿里云MongoDB >= 4.4
- 阿里云Redis >= 6.0

## 部署步骤

### 1. 环境准备
```bash
# 配置npm清华镜像源
npm config set registry https://mirrors.tuna.tsinghua.edu.cn/npm/

# 配置Docker阿里云镜像加速
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker

# 安装Docker和Docker Compose
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
sudo curl -L "https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 配置文件
```bash
# 复制并修改环境配置
cp .env.example .env
# 修改配置文件中的相关参数（包括阿里云服务配置）
```

### 3. 阿里云服务配置
- 开通阿里云CDN服务
- 配置阿里云视频直播服务
- 设置阿里云MongoDB和Redis
- 配置阿里云OSS

### 4. 启动服务
```bash
# 使用Docker Compose启动所有服务
docker-compose up -d
```

### 5. SSL配置
```bash
# 使用阿里云SSL证书服务
# 下载并安装SSL证书到Nginx
```

## 监控与维护

### 监控指标（基于阿里云ARMS）
- 服务器资源使用率
- WebSocket连接状态
- 渲染性能
- 用户并发数
- 网络延迟

### 日志管理
- 使用阿里云日志服务SLS
- 错误报警（阿里云监控报警服务）
- 性能监控面板

## 开发环境配置

### 前端开发
```bash
# 设置npm清华镜像源
npm config set registry https://mirrors.tuna.tsinghua.edu.cn/npm/

# 安装依赖
npm install --registry=https://mirrors.tuna.tsinghua.edu.cn/npm/

# 如果使用yarn，也可以设置yarn的镜像源
yarn config set registry https://mirrors.tuna.tsinghua.edu.cn/npm/
```

### 后端开发
```bash
# Python包使用清华镜像源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

## 常见问题

### 网络相关
- 如何配置阿里云CDN
- 如何优化国内访问速度
- 如何处理跨域问题

### 部署相关
- 如何配置阿里云服务
- 如何处理视频流延迟问题
- 如何优化数据库性能

## 配置说明

### OSC配置
```javascript
{
  "host": "127.0.0.1",
  "port": 7000,
  "protocol": "udp"
}
```

### 音频分析配置
```javascript
{
  "fftSize": 2048,
  "smoothingTimeConstant": 0.8,
  "minDecibels": -100,
  "maxDecibels": -30
}
```

## 扩展性考虑

### 横向扩展
- 使用阿里云容器服务K8s版
- 多区域部署（华东、华北、华南）
- 阿里云CDN加速

### 容灾备份
- 阿里云数据库备份服务
- 跨区域容灾
- 故障转移方案

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- 项目维护者：[Your Name]
- 邮箱：[Your Email]
- 项目地址：[GitHub Repository URL] 