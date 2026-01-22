#!/bin/bash

# 贪吃蛇游戏部署脚本
# 使用方法: ./deploy.sh [选项]
# 选项:
#   -h, --help      显示帮助信息
#   -l, --local     本地部署
#   -d, --docker    Docker部署
#   -c, --compose   Docker Compose部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 显示帮助信息
show_help() {
    echo "贪吃蛇游戏部署脚本"
    echo ""
    echo "使用方法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help      显示帮助信息"
    echo "  -l, --local     本地部署"
    echo "  -d, --docker    Docker部署"
    echo "  -c, --compose   Docker Compose部署"
    echo ""
    echo "示例:"
    echo "  $0 --local      # 本地部署"
    echo "  $0 --docker     # 使用Docker部署"
    echo "  $0 --compose    # 使用Docker Compose部署"
}

# 本地部署
local_deploy() {
    echo -e "${GREEN}开始本地部署...${NC}"
    
    # 检查Python是否安装
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}错误: Python3未安装${NC}"
        exit 1
    fi
    
    # 检查pip是否安装
    if ! command -v pip3 &> /dev/null; then
        echo -e "${RED}错误: pip3未安装${NC}"
        exit 1
    fi
    
    # 安装依赖
    echo -e "${YELLOW}安装Python依赖...${NC}"
    pip3 install -r requirements.txt
    
    # 启动应用
    echo -e "${GREEN}启动应用...${NC}"
    echo -e "${YELLOW}应用将在 http://127.0.0.1:5000 启动${NC}"
    echo -e "${YELLOW}按 Ctrl+C 停止应用${NC}"
    python3 main.py
}

# Docker部署
docker_deploy() {
    echo -e "${GREEN}开始Docker部署...${NC}"
    
    # 检查Docker是否安装
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}错误: Docker未安装${NC}"
        echo "请访问 https://docs.docker.com/get-docker/ 安装Docker"
        exit 1
    fi
    
    # 构建Docker镜像
    echo -e "${YELLOW}构建Docker镜像...${NC}"
    docker build -t snake-game .
    
    # 运行Docker容器
    echo -e "${GREEN}启动Docker容器...${NC}"
    echo -e "${YELLOW}应用将在 http://127.0.0.1:5000 启动${NC}"
    docker run -p 5000:5000 snake-game
}

# Docker Compose部署
compose_deploy() {
    echo -e "${GREEN}开始Docker Compose部署...${NC}"
    
    # 检查Docker Compose是否安装
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}错误: Docker Compose未安装${NC}"
        echo "请访问 https://docs.docker.com/compose/install/ 安装Docker Compose"
        exit 1
    fi
    
    # 启动服务
    echo -e "${GREEN}启动服务...${NC}"
    echo -e "${YELLOW}应用将在 http://127.0.0.1:5000 启动${NC}"
    docker-compose up
}

# 主函数
main() {
    # 如果没有参数，显示帮助信息
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi
    
    # 解析参数
    case "$1" in
        -h|--help)
            show_help
            ;;
        -l|--local)
            local_deploy
            ;;
        -d|--docker)
            docker_deploy
            ;;
        -c|--compose)
            compose_deploy
            ;;
        *)
            echo -e "${RED}错误: 未知选项 '$1'${NC}"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"