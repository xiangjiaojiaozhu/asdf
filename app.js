// 应用主逻辑
document.addEventListener('DOMContentLoaded', function() {
    const startTime = Date.now();
    
    // 获取用户IP和位置信息
    async function getUserLocation() {
        try {
            const response = await fetch('/api/weather');
            const data = await response.json();
            
            // 更新页面信息
            document.getElementById('country').textContent = data.country || '未知';
            document.getElementById('city').textContent = data.city || '未知';
            document.getElementById('ip').textContent = data.ip || '未知';
            document.getElementById('timezone').textContent = data.timezone || 'UTC';
            
            // 更新天气信息
            if (data.weather) {
                updateWeatherDisplay(data.weather);
            }
            
            // 计算延迟
            const latency = Date.now() - startTime;
            document.getElementById('latency').textContent = latency;
            
            // 更新缓存状态
            document.getElementById('cache-status').innerHTML = 
                `<i class="fas fa-database"></i> 缓存状态: ${data.cached ? '✅ 命中边缘缓存' : '🔄 实时数据'}`;
            
            // 启动本地时钟
            startLocalClock(data.timezone);
            
        } catch (error) {
            console.error('获取数据失败:', error);
            document.getElementById('city').textContent = '获取失败';
            document.getElementById('weather-desc').textContent = '数据加载失败，请刷新重试';
        }
    }
    
    // 更新天气显示
    function updateWeatherDisplay(weather) {
        document.getElementById('temp').textContent = Math.round(weather.temp);
        document.getElementById('feels-like').textContent = Math.round(weather.feels_like);
        document.getElementById('humidity').textContent = weather.humidity;
        document.getElementById('wind-speed').textContent = weather.wind_speed;
        document.getElementById('weather-desc').textContent = weather.description;
        
        // 根据天气条件设置图标
        const iconMap = {
            'Clear': 'fas fa-sun',
            'Clouds': 'fas fa-cloud',
            'Rain': 'fas fa-cloud-rain',
            'Snow': 'fas fa-snowflake',
            'Thunderstorm': 'fas fa-bolt',
            'Drizzle': 'fas fa-cloud-rain',
            'Mist': 'fas fa-smog'
        };
        
        const iconClass = iconMap[weather.main] || 'fas fa-cloud';
        document.getElementById('weather-icon').className = iconClass;
    }
    
    // 启动本地时钟
    function startLocalClock(timezone) {
        function updateClock() {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('zh-CN', {
                timeZone: timezone,
                hour12: false,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const parts = formatter.formatToParts(now);
            const timeStr = `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value}:${parts.find(p => p.type === 'second').value}`;
            const dateStr = `${parts.find(p => p.type === 'year').value}年${parts.find(p => p.type === 'month').value}${parts.find(p => p.type === 'day').value}日 ${parts.find(p => p.type === 'weekday').value}`;
            
            document.getElementById('local-time').textContent = timeStr;
            document.getElementById('local-date').textContent = dateStr;
        }
        
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    // 初始化应用
    getUserLocation();
});