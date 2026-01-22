# 🐍 Snake by AI - 贪吃蛇游戏 Web 版

[![GitHub](https://img.shields.io/badge/GitHub-snake__by__ai-blue?logo=github)](https://github.com/jeckun/snake_by_ai)
[![Python](https://img.shields.io/badge/Python-3.7+-blue?logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-green?logo=flask)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

一个由AI辅助开发的基于Flask的贪吃蛇游戏，包含完整的游戏界面、得分系统和排行榜功能。项目名称"snake_by_ai"代表这是一个由AI生成的贪吃蛇游戏。

## ✨ 功能特性

- 🎮 **经典玩法** - 原汁原味的贪吃蛇游戏体验
- 📊 **实时得分** - 游戏过程中实时显示当前得分
- 🏆 **排行榜系统** - 记录前10名玩家的成绩
- 🎨 **响应式设计** - 适配桌面和移动设备
- ⚡ **速度调节** - 可调节游戏速度（1-10级）
- 👤 **玩家自定义** - 支持自定义玩家名称，提供随机名称生成
- 🎯 **优化界面** - 经过精心优化的游戏结果页面

## 📁 项目结构

```
.
├── main.py                 # Flask 主应用
├── requirements.txt        # Python 依赖文件
├── README.md              # 项目说明文档
├── Dockerfile             # Docker 部署配置
├── docker-compose.yml     # Docker Compose 配置
├── Procfile              # Heroku 部署配置
├── deploy.sh             # 一键部署脚本
├── test_app.py           # 应用测试脚本
├── .gitignore            # Git 忽略配置
├── snake_config.json     # 游戏配置和排行榜数据
├── static/               # 静态资源
│   ├── snake.js          # 游戏逻辑 JavaScript
│   └── style.css         # 样式文件
├── templates/            # HTML 模板
│   ├── index.html        # 游戏主页面
│   └── results.html      # 游戏结果页面
├── Data/                 # 数据目录（空目录）
└── script/               # 脚本目录（无关文件已排除）
```

> **注意**: `script/` 目录中的无关文件已被排除，不包含在发布版本中。

## 🚀 快速开始

### 前提条件

- Python 3.7 或更高版本
- pip（Python 包管理器）

### 安装步骤

#### 方法一：从源码安装（推荐）

1. **克隆仓库**
   ```bash
   git clone https://github.com/jeckun/snake_by_ai.git
   cd snake_by_ai
   ```

2. **创建虚拟环境（可选但推荐）**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **安装依赖**
   ```bash
   pip install -r requirements.txt
   ```

4. **运行应用**
   ```bash
   python main.py
   ```

5. **访问游戏**
   打开浏览器访问 [http://127.0.0.1:5000](http://127.0.0.1:5000)

#### 方法二：使用部署脚本（Linux/macOS）

```bash
# 给脚本添加执行权限
chmod +x deploy.sh

# 本地部署
./deploy.sh --local

# 或使用 Docker 部署
./deploy.sh --docker

# 或使用 Docker Compose 部署
./deploy.sh --compose
```

#### 方法三：使用 Docker

```bash
# 构建 Docker 镜像
docker build -t snake-by-ai .

# 运行容器
docker run -p 5000:5000 snake-by-ai
```

#### 方法四：使用 Docker Compose

```bash
# 一键启动所有服务
docker-compose up

# 后台运行
docker-compose up -d
```

## 🌐 部署到互联网

### 部署到 GitHub

1. **初始化 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "初始提交: AI生成的贪吃蛇游戏"
   ```

2. **连接到 GitHub 仓库**
   ```bash
   git remote add origin https://github.com/jeckun/snake_by_ai.git
   git branch -M main
   git push -u origin main
   ```

### 部署到云平台

#### 选项一：PythonAnywhere（免费方案）

1. 注册 [PythonAnywhere](https://www.pythonanywhere.com/) 账号
2. 通过 Git 克隆仓库或上传文件
3. 在 Bash 控制台安装依赖：
   ```bash
   pip install --user flask
   ```
4. 配置 Web 应用，WSGI 文件指向 `main.py`
5. 重新加载应用

#### 选项二：Heroku（免费方案）

1. 安装 [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. 登录并创建应用：
   ```bash
   heroku login
   heroku create snake-by-ai
   ```
3. 部署应用：
   ```bash
   git push heroku main
   ```

#### 选项三：Railway.app（免费额度）

1. 注册 [Railway](https://railway.app/) 账号
2. 通过 GitHub 导入项目
3. 自动检测 Python 项目并部署

## ⚙️ 配置说明

### 游戏配置

游戏配置保存在 `snake_config.json` 文件中：
- `speed`: 游戏速度等级（1-10，默认5）
- `highscores`: 排行榜数据，自动保存前10名

### 自定义游戏

你可以通过修改以下文件来自定义游戏：

1. **修改游戏难度** - 编辑 `static/snake.js` 中的游戏参数
2. **更改界面样式** - 编辑 `static/style.css`
3. **调整页面布局** - 编辑 `templates/` 目录下的 HTML 文件
4. **修改颜色主题** - 更新 CSS 中的颜色变量

## 🎮 游戏控制

- **方向键** 或 **WASD**: 控制蛇的移动方向
- **空格键**: 暂停/继续游戏
- **速度滑块**: 游戏界面上的速度调节控件
- **回车键**: 在输入框聚焦时提交玩家名称

## 🛠️ 技术栈

- **后端框架**: Python Flask
- **前端技术**: HTML5, CSS3, JavaScript (ES6+)
- **UI 框架**: Bootstrap 5
- **图标库**: Font Awesome 6
- **部署方案**: Docker, Docker Compose, Heroku, PythonAnywhere
- **开发工具**: Git, GitHub

## 📝 测试应用

项目包含测试脚本，确保应用可以正常运行：

```bash
# 运行测试
python test_app.py
```

测试内容包括：
- ✅ 检查Python依赖
- ✅ 验证项目文件完整性
- ✅ 测试Flask应用启动和响应

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢 AI 辅助开发完成这个项目
- 感谢 Flask 和 Bootstrap 社区提供的优秀工具
- 感谢所有测试者和贡献者

---

**Happy Gaming!** 🐍🎮

> 项目名称: snake_by_ai  
> 仓库地址: https://github.com/jeckun/snake_by_ai
> 在线演示: [部署后添加链接]