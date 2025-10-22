#!/bin/bash
# Monitoring script for Bürger-App Schieder-Schwalenberg

echo "=== Bürger-App Status ==="
echo ""

# Check service status
echo "Service Status:"
sudo systemctl is-active buergerapp.service
echo ""

# Check if port is listening
echo "Port 3000 Status:"
if sudo netstat -tlnp | grep -q ":3000"; then
    echo "✓ Port 3000 is listening"
else
    echo "✗ Port 3000 is NOT listening"
fi
echo ""

# Check recent logs
echo "Recent Logs (last 10 lines):"
tail -10 /var/log/buergerapp/output.log
echo ""

# Check for errors
echo "Recent Errors:"
if [ -f /var/log/buergerapp/error.log ]; then
    tail -5 /var/log/buergerapp/error.log
else
    echo "No errors logged"
fi
echo ""

# Check MySQL
echo "MySQL Status:"
sudo systemctl is-active mysql
echo ""

# Memory usage
echo "Memory Usage:"
ps aux | grep "node.*dist/index.js" | grep -v grep | awk '{print "CPU: " $3 "%, Memory: " $4 "%"}'
echo ""

echo "=== End of Status Report ==="

