module.exports = {
  apps: [{
    name: 'daeu-api',
    script: '/root/hp-repo/server.cjs',
    cwd: '/root/hp-repo',
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    watch: false,
    max_restarts: 10,
    restart_delay: 5000,
    min_uptime: '10s',
    env: { NODE_ENV: 'production', PORT: 3001 }
  }]
};
