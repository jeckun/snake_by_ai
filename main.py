try:
    from flask import Flask, render_template, request, jsonify
    import json
    import os 
    import time
    from datetime import datetime
    
    app = Flask(__name__)
except ImportError as e:
    print("错误: 缺少必要的依赖")
    print("请先安装Flask: pip install flask")
    print("或者创建一个虚拟环境并安装依赖:")
    print("python -m venv .venv")
    print(".venv\\Scripts\\activate")
    print("pip install flask")
    exit(1)

# 原始代码继续...

# Game configuration
import random

GAME_CONFIG = {
    'speed': 5,  # Default speed level (1-10)
    'highscores': []  # List of dicts: {'score': x, 'timestamp': y, 'name': z}
}

def generate_random_name():
    names = ['玩家1', '游戏达人', '蛇王', '匿名玩家', '高手']
    return random.choice(names)

# Config file path
CONFIG_FILE = 'snake_config.json'

def load_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    return GAME_CONFIG

def save_config(config):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f)

@app.route('/')
def index():
    config = load_config()
    # Format timestamps for display
    highscores = [{
        'score': score['score'],
        'timestamp': datetime.fromtimestamp(score['timestamp']).strftime('%Y-%m-%d %H:%M'),
        'name': score['name']
    } for score in config['highscores'][:10]]
    
    return render_template('index.html', speed=config['speed'], highscores=highscores)

@app.route('/results')
def results():
    score = request.args.get('score', 0)
    config = load_config()
    # Format timestamps for display
    formatted_highscores = [{
        'score': score['score'],
        'timestamp': datetime.fromtimestamp(score['timestamp']).strftime('%Y-%m-%d %H:%M'),
        'name': score['name']
    } for score in config['highscores'][:10]]
    return render_template('results.html', score=score, highscores=formatted_highscores)

@app.route('/update_score', methods=['POST'])
def update_score():
    config = load_config()
    score = request.json.get('score')
    name = request.json.get('name', generate_random_name())
    
    if score is not None:
        config['highscores'].append({
            'score': score,
            'timestamp': int(time.time()),
            'name': name
        })
        # Keep only top 10 scores
        config['highscores'].sort(key=lambda x: x['score'], reverse=True)
        config['highscores'] = config['highscores'][:10]
        save_config(config)
    
    return jsonify({
        'success': True,
        'highscores': config['highscores']
    })

@app.route('/update_speed', methods=['POST'])
def update_speed():
    config = load_config()
    speed = request.json.get('speed')
    
    if speed and 1 <= speed <= 10:
        config['speed'] = speed
        save_config(config)
        
    return jsonify(success=True)

if __name__ == '__main__':
    # For production, use host='0.0.0.0' and debug=False
    # For development, you can use debug=True
    app.run(host='0.0.0.0', port=5000, debug=False)
